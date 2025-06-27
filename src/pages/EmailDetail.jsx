import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  ExternalLink, 
  Calendar, 
  User, 
  Building,
  Briefcase,
  XCircle,
  CheckCircle,
  Mail
} from 'lucide-react'
import { format } from 'date-fns'

const EmailDetail = ({ user }) => {
  const { emailId } = useParams()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:8001/emails/${emailId}?user_id=${user.id}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch email')
        }
        
        const data = await response.json()
        setEmail(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEmail()
  }, [emailId, user.id])

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'applications_sent':
        return <Briefcase className="h-5 w-5 text-blue-600" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'interview_scheduled':
        return <Calendar className="h-5 w-5 text-yellow-600" />
      case 'offer_received':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      default:
        return <Mail className="h-5 w-5 text-gray-600" />
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'applications_sent':
        return 'bg-blue-100 text-blue-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'interview_scheduled':
        return 'bg-yellow-100 text-yellow-800'
      case 'offer_received':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryName = (category) => {
    switch (category) {
      case 'applications_sent':
        return 'Application Sent'
      case 'rejected':
        return 'Rejected'
      case 'interview_scheduled':
        return 'Interview Scheduled'
      case 'offer_received':
        return 'Offer Received'
      default:
        return category
    }
  }

  const formatEmailBody = (body) => {
    if (!body) return ''
    
    // Convert line breaks to HTML
    return body
      .replace(/\n/g, '<br>')
      .replace(/\r\n/g, '<br>')
      .replace(/\r/g, '<br>')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-red-400">
          <XCircle className="h-12 w-12" />
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading email</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
        <div className="mt-6">
          <Link
            to="/dashboard"
            className="btn-primary"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!email) {
    return (
      <div className="text-center py-12">
        <Mail className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Email not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The email you're looking for doesn't exist or you don't have access to it.
        </p>
        <div className="mt-6">
          <Link
            to="/dashboard"
            className="btn-primary"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard"
            className="text-gray-400 hover:text-gray-600"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Email Details</h1>
            <p className="text-gray-600">Viewing email from {email.from_email}</p>
          </div>
        </div>
        <a
          href={email.gmail_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary flex items-center space-x-2"
        >
          <ExternalLink className="h-4 w-4" />
          <span>Open in Gmail</span>
        </a>
      </div>

      {/* Email Metadata */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {getCategoryIcon(email.category)}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(email.category)}`}>
                {getCategoryName(email.category)}
              </span>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {email.subject}
              </h2>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>From: {email.from_email}</span>
              </div>
              
              {email.company && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Building className="h-4 w-4" />
                  <span>Company: {email.company}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  Date: {email.date ? format(new Date(email.date), 'PPP') : 'Unknown date'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full btn-primary text-sm">
                  Mark as Read
                </button>
                <button className="w-full btn-secondary text-sm">
                  Add to Favorites
                </button>
                <button className="w-full btn-secondary text-sm">
                  Add Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Content */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Content</h3>
        
        {email.body ? (
          <div className="prose max-w-none">
            <div 
              className="text-gray-700 leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: formatEmailBody(email.body) }}
            />
          </div>
        ) : (
          <div className="text-center py-8">
            <Mail className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No content available</h3>
            <p className="mt-1 text-sm text-gray-500">
              The email content couldn't be loaded. Try opening it in Gmail for the full content.
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/dashboard"
          className="btn-secondary"
        >
          Back to Dashboard
        </Link>
        
        <div className="flex space-x-2">
          <button className="btn-secondary">
            Previous Email
          </button>
          <button className="btn-secondary">
            Next Email
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmailDetail 