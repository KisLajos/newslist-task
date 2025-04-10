import { useState, useCallback } from "react";
import { fetchNewsData } from "@/utils/api";
import { NewsItem } from "@/components/news-list";

//Number of articles to show per page
export const ARTICLES_PER_PAGE = 3;

export function useNewsData() {
	//State for storing the news articles
	const [news, setNews] = useState<NewsItem[]>([]);

	//State to track loading states
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);

	//State to store any error messages
	const [error, setError] = useState<string | null>(null);

	//State to track the last updated time
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

	//State for pagination
	const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE);

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

				//Update related states
				setLastUpdated(new Date());
				setVisibleCount(ARTICLES_PER_PAGE);

				return {
					sortedNews,
					allCategories: Array.from(categories).sort(),
				};
			} catch (err) {
				//Handling errors
				setError("Failed to load news data. Please try again later.");
				console.error(err);
				return { sortedNews: [], allCategories: [] };
			} finally {
				//Reset loading states
				setIsLoading(false);
				setIsRefreshing(false);
			}
		},
		[]
	);

	//Refresh handler
	const handleRefresh = () => {
		return loadData({ forceRefresh: true });
	};

	//Load more articles
	const loadMore = () => {
		setVisibleCount((prev) => prev + ARTICLES_PER_PAGE);
	};

	return {
		news,
		isLoading,
		isRefreshing,
		error,
		lastUpdated,
		visibleCount,
		loadData,
		handleRefresh,
		loadMore,
		setVisibleCount,
	};
}
