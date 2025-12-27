import NewsClient from '../../components/NewsClient'

export default async function NewsPage() {
  // Fetch initial news data from public API (Global category)
  const response = await fetch(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`,
    {
      next: { revalidate: 3600 }, // Revalidate every hour
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch news')
  }

  const data = await response.json()
  const articles = data.articles || []

  return <NewsClient initialArticles={articles} />
}