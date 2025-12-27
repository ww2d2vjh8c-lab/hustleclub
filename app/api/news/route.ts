import { NextRequest, NextResponse } from 'next/server'

const categories = {
  global: 'top-headlines?country=us',
  business: 'top-headlines?country=us&category=business',
  tech: 'everything?q=technology&sortBy=publishedAt',
  creator: 'everything?q=creator+OR+content+creator+OR+social+media&sortBy=publishedAt',
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'global'

    const apiEndpoint = categories[category as keyof typeof categories] || categories.global

    const response = await fetch(
      `https://newsapi.org/v2/${apiEndpoint}&apiKey=${process.env.NEWS_API_KEY}`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch news')
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('News API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}