"use client";

import { fetchNewsData } from "@/utils/api";
import { useEffect, useState, useCallback } from "react";
import { Button } from "./ui/button";
import { ChevronUp, ChevronDown, Filter, RefreshCcw } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";

export type NewsItem = {
	id: number;
	image: string;
	headline: string;
	shortDescription: string;
	categories: string[];
	date: string;
};

export default function NewsListComponent() {
	//State for storing the news articles
	const [news, setNews] = useState<NewsItem[]>([]);

	//State to track initial loading state
	const [isLoading, setIsLoading] = useState(true);

	//State to track refresh operations
	const [isRefreshing, setIsRefreshing] = useState(false);

	//State to store any error messages
	const [error, setError] = useState<string | null>(null);

	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [allCategories, setAllCategories] = useState<string[]>([]);
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	//Function to fetch news data
	//Using useCallback to memoize the function and prevent unnecessary re-renders
	const loadData = useCallback(
		async (options?: { forceRefresh?: boolean }) => {
			try {
				//Update loading states
				if (options?.forceRefresh) {
					setIsRefreshing(true);
				} else if (!news.length) {
					setIsLoading(true);
				}

				//Clear any previous errors when attempting to load data
				setError(null);

				//Fetch news data from API
				const data = await fetchNewsData(options);

				//Sort news by date
				const sortedNews = [...data].sort(
					(a, b) =>
						new Date(b.date).getTime() - new Date(a.date).getTime()
				);
				setNews(sortedNews);

				//Extract all unique categories
				const categories = new Set<string>();
				sortedNews.forEach((item) => {
					item.categories.forEach((category) =>
						categories.add(category)
					);
				});
				setAllCategories(Array.from(categories).sort());
			} catch (err) {
				//Handling errors
				setError("Failed to load news data. Please try again later.");
				console.error(err);
			} finally {
				//Reset loading states
				setIsLoading(false);
				setIsRefreshing(false);
			}
		},
		[news.length]
	);

	//Initial data load
	useEffect(() => {
		loadData();
	}, [loadData]);

   //Add a refresh handler
   const handleRefresh = () => {
    loadData({ forceRefresh: true })
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  const resetFilters = () => {
    setSelectedCategories([])
  }

  const filteredNews = news.filter(
    (item) =>
      selectedCategories.length === 0 || item.categories.some((category) => selectedCategories.includes(category)),
  )

	return (
		<div className="space-y-6">
					<ThemeToggle />

      {isFilterOpen && (
        <div className="flex flex-wrap gap-2 p-4 bg-muted rounded-lg">
          {allCategories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategories.includes(category) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      )}

      {filteredNews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No news articles match your selected filters.</p>
          <Button variant="link" onClick={resetFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <Card key={item.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.headline}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
              </div>
              <CardContent className="p-4 space-y-3">
                <div className="flex flex-wrap gap-2 mb-2">
                  {item.categories.map((category) => (
                    <Badge key={category} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
                <h2 className="text-xl font-bold line-clamp-2">{item.headline}</h2>
                <p className="text-muted-foreground text-sm">{item.date}</p>
                <p className="line-clamp-3">{item.shortDescription}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Showing {filteredNews.length} of {news.length} articles
        </p>
      </div>
    </div>
	);
}
