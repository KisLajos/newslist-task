"use client";

import { fetchNewsData } from "@/utils/api";
import { useEffect, useState, useCallback } from "react";

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

	return (
    <div className="space-y-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 shadow-md">
              <img src={item.image} alt={item.headline} className="w-full h-48 object-cover rounded-md mb-4" />
              <h2 className="text-lg font-bold mb-2">{item.headline}</h2>
              <p className="text-sm text-gray-600 mb-2">{item.shortDescription}</p>
              <div className="text-xs text-gray-500 mb-2">
                {item.categories.join(", ")} | {new Date(item.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
  );
}
