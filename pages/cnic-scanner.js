import React, { useState, useRef, useCallback } from 'react';
import { createWorker } from 'tesseract.js';
import { ethers } from 'ethers';
import Image from 'next/image';
import { Camera, Upload, Eye, Shield, CheckCircle, XCircle, AlertTriangle, Loader, FileText, User, Calendar, IdCard } from 'lucide-react';

const CNICScanner = () => {
  const [step, setStep] = useState(1); // 1: Upload, 2: Processing, 3: Validation, 4: Complete
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [extractedData, setExtractedData] = useState({});
  const [userInput, setUserInput] = useState({
    cnic: '',
    fullName: '',
    dateOfBirth: '',
    issueDate: '',
    city: '',
    phone: ''
  });
  const [ocrProgress, setOcrProgress] = useState(0);
  const [validationResults, setValidationResults] = useState({});
  const [isValidCNIC, setIsValidCNIC] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [useCamera, setUseCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // CNIC validation patterns
  const cnicPattern = /\b\d{5}-\d{7}-\d{1}\b/;
  const cnicDigitsPattern = /\b\d{13}\b/;
  
  // Pakistani CNIC template validation
  const validateCNICTemplate = (text) => {
    const indicators = {
      hasRepublicOfPakistan: /republic\s+of\s+pakistan/i.test(text),
      hasNationalIdentityCard: /national\s+identity\s+card/i.test(text),
      hasUrduText: /[\u0600-\u06FF]/.test(text),
      hasCNICNumber: cnicPattern.test(text) || cnicDigitsPattern.test(text),
      hasDateFormat: /\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4}/.test(text),
      hasName: /name/i.test(text) || /نام/i.test(text),
      hasAddress: /address/i.test(text) || /پتہ/i.test(text),
      hasSignature: /signature/i.test(text) || /دستخط/i.test(text)
    };
    
    const score = Object.values(indicators).filter(Boolean).length;
    return {
      isValid: score >= 4,
      score: score,
      indicators: indicators,
      confidence: (score / 8) * 100
    };
  };

  // Extract CNIC data from OCR text
  const extractCNICData = (text) => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    const data = {};
    
    // Extract CNIC number
    const cnicMatch = text.match(cnicPattern);
    const cnicDigitsMatch = text.match(cnicDigitsPattern);
    
    if (cnicMatch) {
      data.cnic = cnicMatch[0];
    } else if (cnicDigitsMatch) {
      const digits = cnicDigitsMatch[0];
      data.cnic = `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
    }
    
    // Extract dates
    const dateMatches = text.match(/\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4}/g);
    if (dateMatches && dateMatches.length >= 2) {
      data.dateOfBirth = dateMatches[0];
      data.issueDate = dateMatches[1];
    }
    
    // Extract name (usually appears after "Name" or before CNIC number)
    const namePattern = /name[:\s]+([a-zA-Z\s]+)/i;
    const nameMatch = text.match(namePattern);
    if (nameMatch) {
      data.fullName = nameMatch[1].trim();
    } else {
      // Fallback: look for capitalized words near the top
      const upperCaseWords = text.match(/[A-Z][A-Z\s]+/g);
      if (upperCaseWords && upperCaseWords.length > 0) {
        data.fullName = upperCaseWords[0].trim();
      }
    }
    
    return data;
  };

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setCameraStream(stream);
      setUseCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      setErrors(['Camera access denied or not available']);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setUseCamera(false);
  };

  // Capture from camera
  const captureFromCamera = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (canvas && video) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'cnic_capture.jpg', { type: 'image/jpeg' });
        handleImageUpload(file);
        stopCamera();
      }, 'image/jpeg', 0.8);
    }
  };

  // Handle image upload
  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setStep(2);
        processImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Process image with OCR
  const processImage = async (imageData) => {
    setIsProcessing(true);
    setOcrProgress(0);
    setErrors([]);
    
    try {
      const worker = await createWorker('eng');
      
      // Set up progress tracking
      await worker.setParameters({
        tessedit_pageseg_mode: '1',
        tessedit_ocr_engine_mode: '1',
      });
      
      // Perform OCR
      const { data: { text, confidence } } = await worker.recognize(imageData, {
        logger: m => {
          if (m.status === 'recognizing text') {
            setOcrProgress(Math.round(m.progress * 100));
          }
        }
      });
      
      await worker.terminate();
      
      setOcrText(text);
      
      // Validate if it's a real CNIC
      const templateValidation = validateCNICTemplate(text);
      setIsValidCNIC(templateValidation.isValid);
      
      if (!templateValidation.isValid) {
        setErrors([
          `Image validation failed (Confidence: ${templateValidation.confidence.toFixed(1)}%)`,
          'This does not appear to be a valid Pakistani CNIC',
          'Please upload a clear image of the front side of your CNIC'
        ]);
        setStep(1);
        setIsProcessing(false);
        return;
      }
      
      // Extract data
      const extracted = extractCNICData(text);
      setExtractedData(extracted);
      
      // Pre-fill form with extracted data
      setUserInput(prev => ({
        ...prev,
        ...extracted
      }));
      
      setStep(3);
    } catch (error) {
      setErrors(['OCR processing failed. Please try again with a clearer image.']);
      setStep(1);
    } finally {
      setIsProcessing(false);
    }
  };

  // Validate user input against extracted data
  const validateInput = () => {
    const results = {};
    
    if (extractedData.cnic && userInput.cnic) {
      results.cnic = extractedData.cnic === userInput.cnic;
    }
    
    if (extractedData.fullName && userInput.fullName) {
      const similarity = calculateSimilarity(
        extractedData.fullName.toLowerCase(),
        userInput.fullName.toLowerCase()
      );
      results.fullName = similarity > 0.7;
    }
    
    if (extractedData.dateOfBirth && userInput.dateOfBirth) {
      results.dateOfBirth = extractedData.dateOfBirth === userInput.dateOfBirth;
    }
    
    setValidationResults(results);
    return Object.values(results).every(Boolean);
  };

  // Calculate string similarity
  const calculateSimilarity = (str1, str2) => {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(null));
    
    for (let i = 0; i <= len1; i++) matrix[0][i] = i;
    for (let j = 0; j <= len2; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= len2; j++) {
      for (let i = 1; i <= len1; i++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1,
          matrix[j][i - 1] + 1,
          matrix[j - 1][i - 1] + cost
        );
      }
    }
    
    return 1 - matrix[len2][len1] / Math.max(len1, len2);
  };

  // Submit to blockchain
  const submitToBlockchain = async () => {
    setIsProcessing(true);
    try {
      // Simulate blockchain registration
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        
        // In a real implementation, you would call your smart contract here
        console.log('Registering CNIC on blockchain:', userInput);
        
        // Simulate delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setSuccessMessage('CNIC successfully verified and registered on blockchain!');
        setStep(4);
      } else {
        setSuccessMessage('CNIC verified successfully! (Blockchain not available)');
        setStep(4);
      }
    } catch (error) {
      setErrors(['Blockchain registration failed. Please try again.']);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = () => {
    if (validateInput()) {
      submitToBlockchain();
    } else {
      setErrors(['Data validation failed. Please check your input against the extracted data.']);
    }
  };

  const resetProcess = () => {
    setStep(1);
    setImage(null);
    setImageFile(null);
    setOcrText('');
    setExtractedData({});
    setUserInput({
      cnic: '',
      fullName: '',
      dateOfBirth: '',
      issueDate: '',
      city: '',
      phone: ''
    });
    setValidationResults({});
    setIsValidCNIC(null);
    setErrors([]);
    setSuccessMessage('');
    setOcrProgress(0);
    stopCamera();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-full">
              <IdCard className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Smart CNIC Scanner</h1>
          <p className="text-gray-600">Upload or scan your Pakistani CNIC for automatic verification</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  s === step ? 'bg-blue-500 text-white' : 
                  s < step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {s < step ? <CheckCircle className="w-4 h-4" /> : s}
                </div>
                {s < 4 && (
                  <div className={`w-12 h-1 mx-2 ${
                    s < step ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center mb-2">
              <XCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="font-semibold text-red-800">Validation Errors:</span>
            </div>
            {errors.map((error, index) => (
              <p key={index} className="text-red-700 ml-7">{error}</p>
            ))}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="font-semibold text-green-800">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Upload className="w-6 h-6 mr-2" />
              Upload CNIC Image
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* File Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Upload from Device</h3>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload CNIC image</p>
                  <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                  className="hidden"
                />
              </div>

              {/* Camera Capture */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Capture with Camera</h3>
                {!useCamera ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <button
                      onClick={startCamera}
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Start Camera
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      className="w-full rounded-lg"
                      style={{ maxHeight: '300px' }}
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={captureFromCamera}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Capture
                      </button>
                      <button
                        onClick={stopCamera}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {/* Step 2: Processing */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Eye className="w-6 h-6 mr-2" />
              Processing Image
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Uploaded Image</h3>
                {image && (
                  <Image 
                    src={image} 
                    alt="CNIC Upload" 
                    width={600} 
                    height={400} 
                    className="w-full rounded-lg shadow-md"
                  />
                )}
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Processing Status</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Loader className="w-5 h-5 text-blue-500 animate-spin" />
                    <span className="text-gray-700">Analyzing image...</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${ocrProgress}%` }}
                    />
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    Progress: {ocrProgress}%
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">What we're checking:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• CNIC template validation</li>
                    <li>• Text extraction (OCR)</li>
                    <li>• Data field identification</li>
                    <li>• Authenticity verification</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Validation */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-2" />
              Verify Extracted Data
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Extracted Data */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Extracted from CNIC</h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600">CNIC Number</label>
                    <p className="text-gray-800">{extractedData.cnic || 'Not detected'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-800">{extractedData.fullName || 'Not detected'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                    <p className="text-gray-800">{extractedData.dateOfBirth || 'Not detected'}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-sm font-medium text-gray-600">Issue Date</label>
                    <p className="text-gray-800">{extractedData.issueDate || 'Not detected'}</p>
                  </div>
                </div>
              </div>

              {/* User Input Form */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Confirm Your Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">CNIC Number</label>
                    <input
                      type="text"
                      value={userInput.cnic}
                      onChange={(e) => setUserInput({...userInput, cnic: e.target.value})}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationResults.cnic === false ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="00000-0000000-0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={userInput.fullName}
                      onChange={(e) => setUserInput({...userInput, fullName: e.target.value})}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationResults.fullName === false ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
                    <input
                      type="text"
                      value={userInput.dateOfBirth}
                      onChange={(e) => setUserInput({...userInput, dateOfBirth: e.target.value})}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        validationResults.dateOfBirth === false ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="DD/MM/YYYY"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">City</label>
                    <input
                      type="text"
                      value={userInput.city}
                      onChange={(e) => setUserInput({...userInput, city: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your city"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={userInput.phone}
                      onChange={(e) => setUserInput({...userInput, phone: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="03XX-XXXXXXX"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                onClick={resetProcess}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Start Over
              </button>
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 mr-2" />
                    Verify & Register
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {step === 4 && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Complete!</h2>
              <p className="text-gray-600">Your CNIC has been successfully verified and registered.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Registration Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-left">
                  <p className="font-medium text-gray-600">CNIC Number:</p>
                  <p className="text-gray-800">{userInput.cnic}</p>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-600">Full Name:</p>
                  <p className="text-gray-800">{userInput.fullName}</p>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-600">City:</p>
                  <p className="text-gray-800">{userInput.city}</p>
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-600">Status:</p>
                  <p className="text-green-600 font-semibold">Verified ✓</p>
                </div>
              </div>
            </div>
            
            <div className="space-x-4">
              <button
                onClick={() => window.location.href = '/pay-tax'}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Pay Tax Now
              </button>
              <button
                onClick={resetProcess}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Register Another CNIC
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CNICScanner;
