import { useState, useEffect } from 'react'
import { Mail, Briefcase, BarChart3, CheckCircle } from 'lucide-react'

const Login = ({ setUser }) => {
  const [loading, setLoading] = useState(true)
  const [checkingSession, setCheckingSession] = useState(true)

  // Check for existing session on component mount
  useEffect(() => {
    checkExistingSession()
  }, [])

  const checkExistingSession = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8001'
      const response = await fetch(`${apiUrl}/auth/session`, {
        credentials: 'include' // Include cookies
      })
      const data = await response.json()
      
      if (data.authenticated) {
        // User is already logged in, redirect to dashboard
        setUser({
          id: data.user_id,
          email: data.email
        })
        window.location.href = '/dashboard'
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error('Session check error:', error)
      setLoading(false)
    } finally {
      setCheckingSession(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    
    // Debug logging - testing environment variables
    console.log('Environment check:')
    console.log('VITE_API_URL:', import.meta.env.VITE_API_URL)
    console.log('All env vars:', import.meta.env)
    
    try {
      // Temporarily hardcode for testing
      const apiUrl = 'https://job-tracker-backend-pij9.onrender.com'
      console.log('Using API URL:', apiUrl)
      const response = await fetch(`${apiUrl}/auth/login`)
      const data = await response.json()
      
      if (data.authorization_url) {
        window.location.href = data.authorization_url
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoading(false)
    }
  }

  const features = [
    {
      icon: Mail,
      title: 'Gmail Integration',
      description: 'Automatically fetch and categorize job-related emails from your Gmail account.'
    },
    {
      icon: Briefcase,
      title: 'Smart Categorization',
      description: 'Intelligently categorize emails as applications, interviews, offers, or rejections.'
    },
    {
      icon: BarChart3,
      title: 'Dashboard Analytics',
      description: 'Track your job search progress with detailed statistics and visualizations.'
    },
    {
      icon: CheckCircle,
      title: 'Application Tracking',
      description: 'Keep track of all your job applications in one organized dashboard.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <div className="flex min-h-screen">
        {/* Left side - Features */}
        <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:px-8 lg:py-12">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Smart Job Application Tracker
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Transform your job search with intelligent email tracking and analytics. 
                Connect your Gmail and let AI categorize your job-related emails automatically.
              </p>
            </div>

            <div className="mt-10 space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                      <feature.icon className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{feature.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Login */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 lg:hidden">
                Smart Job Application Tracker
              </h2>
              <p className="mt-2 text-sm text-gray-600 lg:hidden">
                Connect your Gmail to start tracking your job applications
              </p>
            </div>

            <div className="mt-8">
              <div className="space-y-6">
                <div>
                  <button
                    onClick={handleGoogleLogin}
                    disabled={loading || checkingSession}
                    className="group relative flex w-full justify-center rounded-lg border border-transparent bg-primary-600 px-4 py-3 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {checkingSession ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Checking session...
                      </div>
                    ) : loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Connecting to Gmail...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Sign in with Google
                      </div>
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    By signing in, you agree to our{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-500">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-primary-600 hover:text-primary-500">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-8">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-900">How it works</h3>
                  <div className="mt-4 space-y-3 text-sm text-gray-600">
                    <p>1. Connect your Gmail account securely</p>
                    <p>2. We scan for job-related emails automatically</p>
                    <p>3. View categorized applications in your dashboard</p>
                    <p>4. Track your job search progress with analytics</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login 