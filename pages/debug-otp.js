import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function DebugOTP() {
  const [phone, setPhone] = useState('03001234567');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);

  const addTestResult = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [...prev, { timestamp, message, type }]);
  };

  const sendOTP = async () => {
    setIsLoading(true);
    addTestResult('Sending OTP...', 'info');
    
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        addTestResult(`OTP sent successfully: ${data.message}`, 'success');
        if (data.otp) {
          setGeneratedOtp(data.otp);
          addTestResult(`Generated OTP: ${data.otp}`, 'success');
          toast.success(`OTP sent! Generated OTP: ${data.otp}`);
        } else {
          addTestResult('OTP not returned in response (production mode)', 'warning');
          toast.success('OTP sent! Check console for OTP in development mode.');
        }
      } else {
        addTestResult(`Error: ${data.message}`, 'error');
        toast.error(data.message);
      }
    } catch (error) {
      addTestResult(`Network error: ${error.message}`, 'error');
      toast.error('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp) {
      toast.error('Please enter OTP');
      return;
    }
    
    setIsLoading(true);
    addTestResult('Verifying OTP...', 'info');
    
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, otp })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        addTestResult(`OTP verified successfully: ${data.message}`, 'success');
        toast.success('OTP verified successfully!');
      } else {
        addTestResult(`Verification failed: ${data.message}`, 'error');
        toast.error(data.message);
      }
    } catch (error) {
      addTestResult(`Network error: ${error.message}`, 'error');
      toast.error('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
    setGeneratedOtp('');
    setOtp('');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">OTP Debug Tool</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Test Controls */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">Test Controls</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="03001234567"
                />
              </div>
              
              <button
                onClick={sendOTP}
                disabled={isLoading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </button>
              
              {generatedOtp && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                  <strong>Generated OTP:</strong> {generatedOtp}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-wider"
                  placeholder="123456"
                />
              </div>
              
              <button
                onClick={verifyOTP}
                disabled={isLoading || !otp}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
              
              <button
                onClick={clearResults}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Clear Results
              </button>
            </div>
            
            {/* Test Results */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">Test Results</h2>
              
              <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
                {testResults.length === 0 ? (
                  <p className="text-gray-500 text-center">No test results yet</p>
                ) : (
                  <div className="space-y-2">
                    {testResults.map((result, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-md text-sm ${
                          result.type === 'success' ? 'bg-green-100 text-green-800' :
                          result.type === 'error' ? 'bg-red-100 text-red-800' :
                          result.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}
                      >
                        <div className="font-medium">{result.timestamp}</div>
                        <div>{result.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Environment Info */}
          <div className="mt-8 bg-gray-50 rounded-md p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Environment Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Node ENV:</strong> {process.env.NODE_ENV}
              </div>
              <div>
                <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Not configured'}
              </div>
              <div>
                <strong>Supabase Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configured' : 'Not configured'}
              </div>
            </div>
          </div>
          
          {/* Instructions */}
          <div className="mt-8 bg-blue-50 rounded-md p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Instructions</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>1. Enter your phone number in Pakistani format (e.g., 03001234567)</li>
              <li>2. Click "Send OTP" to generate and send OTP</li>
              <li>3. In development mode, the OTP will be displayed here</li>
              <li>4. Enter the OTP and click "Verify OTP"</li>
              <li>5. Check the test results for detailed logs</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
