import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { 
  Briefcase, 
  XCircle, 
  Calendar, 
  CheckCircle, 
  Mail, 
  ExternalLink,
  RefreshCw,
  Filter
} from 'lucide-react'
import { format } from 'date-fns'

const Dashboard = ({ user }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [emails, setEmails] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [company, setCompany] = useState(searchParams.get('company') || '')

  const category = searchParams.get('category')

  const fetchEmails = async () => {
    setLoading(true)
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001'
      const params = new URLSearchParams({
        user_id: user.id,
        ...(category && { category }),
        ...(company && { company }),
        max_results: '100'
      })
      const response = await fetch(`${apiUrl}/emails?${params}`)
      const data = await response.json()
      setEmails(data.emails || [])
    } catch (error) {
      console.error('Error fetching emails:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001'
      const response = await fetch(`${apiUrl}/dashboard/stats?user_id=${user.id}`)
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await Promise.all([fetchEmails(), fetchStats()])
    setRefreshing(false)
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchEmails(), fetchStats()])
      setLoading(false)
    }
    loadData()
  }, [user.id, category, company])

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

  const filteredEmails = emails.filter(email => {
    const matchesSearch = searchTerm === '' || 
      email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.snippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (email.company && email.company.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === '' || email.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const statsCards = [
    {
      title: 'Total Applications',
      value: stats?.total_applications || 0,
      icon: Briefcase,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Applications Sent',
      value: stats?.applications_sent || 0,
      icon: Briefcase,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Rejected',
      value: stats?.rejected || 0,
      icon: XCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      title: 'Interviews',
      value: stats?.interview_scheduled || 0,
      icon: Calendar,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Offers',
      value: stats?.offer_received || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    }
  ]

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Loading your job applications...</h3>
          <p className="text-sm text-gray-600 mt-2">
            Fetching and categorizing emails from Gmail. This may take a moment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {category ? getCategoryName(category) : 'Dashboard'}
          </h1>
          <p className="text-gray-600">
            {category ? `Viewing ${getCategoryName(category).toLowerCase()} emails` : 'Track your job application progress'}
          </p>
        </div>
        <button
          onClick={refreshData}
          disabled={refreshing}
          className="btn-secondary flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      {!category && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {statsCards.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by company, subject, or content..."
              className="input"
            />
          </div>
          <div className="sm:w-48">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input"
            >
              <option value="">All Categories</option>
              <option value="applications_sent">Applications Sent</option>
              <option value="rejected">Rejected</option>
              <option value="interview_scheduled">Interview Scheduled</option>
              <option value="offer_received">Offer Received</option>
            </select>
          </div>
          <div className="sm:w-48">
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Search by company..."
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            {filteredEmails.length} Email{filteredEmails.length !== 1 ? 's' : ''}
          </h2>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Filter className="h-4 w-4" />
            <span>Filtered results</span>
          </div>
        </div>

        {filteredEmails.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No emails found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedCategory 
                ? 'Try adjusting your search or filter criteria.'
                : 'No job-related emails found in your Gmail account.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEmails.map((email) => (
              <div key={email.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      {getCategoryIcon(email.category)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(email.category)}`}>
                        {getCategoryName(email.category)}
                      </span>
                      {email.company && (
                        <span className="text-sm text-gray-500">• {email.company}</span>
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      <Link to={`/email/${email.id}?user_id=${user.id}`} className="hover:text-primary-600">
                        {email.subject}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                      {email.snippet}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-gray-500">
                        From: {email.from_email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {email.date ? format(new Date(email.date), 'MMM d, yyyy') : 'Unknown date'}
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <a
                      href={email.gmail_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard 