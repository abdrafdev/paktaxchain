import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageCircle, 
  Shield, 
  Users, 
  Building,
  Github,
  Twitter,
  Linkedin,
  CheckCircle
} from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success('Message sent successfully! We\'ll get back to you within 24 hours.')
    setFormData({
      name: '',
      email: '',
      category: '',
      subject: '',
      message: ''
    })
    setIsSubmitting(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Support',
      content: 'support@paktaxchain.com',
      description: 'Get help with technical issues, account problems, or general questions'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      content: '+92 21 1234 5678',
      description: 'Available Monday-Friday, 9 AM - 6 PM (PKT)'
    },
    {
      icon: MapPin,
      title: 'Office Location',
      content: 'Karachi, Pakistan',
      description: 'Visit our office for in-person support and consultations'
    }
  ]

  const categories = [
    { value: 'technical', label: 'Technical Support' },
    { value: 'payment', label: 'Payment Issues' },
    { value: 'cnic', label: 'CNIC Verification' },
    { value: 'blockchain', label: 'Blockchain Questions' },
    { value: 'media', label: 'Media Inquiries' },
    { value: 'ngo', label: 'NGO Partnership' },
    { value: 'government', label: 'Government Relations' },
    { value: 'feedback', label: 'General Feedback' }
  ]

  const forWho = [
    {
      icon: Users,
      title: 'Citizens',
      description: 'Help with registration, tax calculations, payments, and blockchain receipts',
      contact: 'citizen-support@paktaxchain.com'
    },
    {
      icon: MessageCircle,
      title: 'Media & Journalists',
      description: 'Data access, transparency reports, and interview requests',
      contact: 'media@paktaxchain.com'
    },
    {
      icon: Shield,
      title: 'NGOs & Researchers',
      description: 'Partnership opportunities and data subscriptions',
      contact: 'partnerships@paktaxchain.com'
    },
    {
      icon: Building,
      title: 'Government',
      description: 'Integration support and enterprise solutions',
      contact: 'government@paktaxchain.com'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-pakistan-green via-pakistan-dark to-emerald-800 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-5 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pakistan-light opacity-10 rounded-full animate-bounce"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center text-white"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Contact{' '}
              <span className="bg-gradient-to-r from-pakistan-light via-yellow-300 to-emerald-300 bg-clip-text text-transparent">
                PakTaxChain
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto font-light leading-relaxed">
              We're here to help you with any questions about Pakistan's transparent tax system.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pakistan-green to-emerald-600 bg-clip-text text-transparent mb-6">
              How Can We Help You?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the right contact method based on your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {forWho.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-2xl hover:shadow-lg transition-shadow duration-300 text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-pakistan-green to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{item.description}</p>
                <a 
                  href={`mailto:${item.contact}`}
                  className="text-pakistan-green font-semibold hover:underline text-sm"
                >
                  {item.contact}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                Send Us a Message
              </h2>
              <p className="text-xl text-gray-600">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-8">Get in Touch</h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-pakistan-green to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-1">{info.title}</h4>
                        <p className="text-pakistan-green font-semibold mb-2">{info.content}</p>
                        <p className="text-gray-600 text-sm">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Social Links */}
                <div className="mt-12">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Follow Us</h4>
                  <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 bg-pakistan-green rounded-lg flex items-center justify-center hover:bg-pakistan-dark transition-colors">
                      <Twitter className="w-5 h-5 text-white" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-pakistan-green rounded-lg flex items-center justify-center hover:bg-pakistan-dark transition-colors">
                      <Github className="w-5 h-5 text-white" />
                    </a>
                    <a href="#" className="w-10 h-10 bg-pakistan-green rounded-lg flex items-center justify-center hover:bg-pakistan-dark transition-colors">
                      <Linkedin className="w-5 h-5 text-white" />
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakistan-green focus:border-transparent transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakistan-green focus:border-transparent transition-colors"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakistan-green focus:border-transparent transition-colors"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat, index) => (
                        <option key={index} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakistan-green focus:border-transparent transition-colors"
                      placeholder="Brief description of your inquiry"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pakistan-green focus:border-transparent transition-colors resize-none"
                      placeholder="Please provide detailed information about your inquiry..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-pakistan-green to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Response Time */}
      <section className="py-16 bg-pakistan-green text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            We Value Your Time
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Our commitment to Pakistani citizens includes prompt, helpful responses to all inquiries.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24hrs</div>
              <div className="text-sm opacity-90">Email Response</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">2hrs</div>
              <div className="text-sm opacity-90">Technical Issues</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">1hr</div>
              <div className="text-sm opacity-90">Payment Problems</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
