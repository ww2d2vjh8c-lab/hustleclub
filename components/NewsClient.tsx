'use client'

import { useState, useEffect } from 'react'

interface Article {
  title: string
  description: string
  url: string
  source: { name: string }
  publishedAt: string
}

interface NewsData {
  articles: Article[]
}

const categories = [
  { id: 'global', name: 'Global', query: 'top-headlines?country=us' },
  { id: 'business', name: 'Business', query: 'top-headlines?country=us&category=business' },
  { id: 'tech', name: 'Tech', query: 'everything?q=technology&sortBy=publishedAt' },
  { id: 'creator', name: 'Creator', query: 'everything?q=creator+OR+content+creator+OR+social+media&sortBy=publishedAt' },
]

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {[...Array(5)].map((_, i) => (
        <article key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded-full w-24 animate-pulse"></div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </article>
      ))}
    </div>
  )
}

function formatTimeAgo(dateString: string): string {
  const now = new Date()
  const published = new Date(dateString)
  const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`

  const diffInWeeks = Math.floor(diffInDays / 7)
  return `${diffInWeeks}w ago`
}

export default function NewsClient({ initialArticles }: { initialArticles: Article[] }) {
  const [activeCategory, setActiveCategory] = useState('global')
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchNews = async (categoryId: string, showRefreshLoader = false) => {
    if (showRefreshLoader) {
      setIsRefreshing(true)
    } else {
      setIsLoading(true)
    }

    try {
      const category = categories.find(cat => cat.id === categoryId)
      if (!category) return

      const response = await fetch(`/api/news?category=${categoryId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch news')
      }

      const data: NewsData = await response.json()
      setArticles(data.articles || [])
    } catch (error) {
      console.error('Error fetching news:', error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
    fetchNews(categoryId)
  }

  const handleRefresh = () => {
    fetchNews(activeCategory, true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Global News
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Stay updated with the latest headlines from around the world
          </p>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  disabled={isLoading}
                  className={`py-2 px-1 text-sm font-medium whitespace-nowrap ${
                    activeCategory === category.id
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {category.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* News Content */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : !articles || articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No news articles available at the moment.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {articles.map((article: Article, index: number) => (
              <article
                key={`${article.url}-${index}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 line-clamp-2 mb-2 flex-1 mr-4">
                    {article.title}
                  </h2>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full flex-shrink-0">
                    {article.source?.name || 'Unknown Source'}
                  </span>
                </div>

                {article.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.description}
                  </p>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {formatTimeAgo(article.publishedAt)}
                  </span>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Read more
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}