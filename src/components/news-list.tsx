"use client"

import { useState } from "react"

export type NewsItem = {
    id: number
    image: string
    headline: string
    shortDescription: string
    categories: string[]
    date: string
  }

export default function NewsListComponent() {
  const [news, setNews] = useState<NewsItem[]>([])

  return (
    <div className="space-y-6">
      {/* news grid here */}
    </div>
  )
}
