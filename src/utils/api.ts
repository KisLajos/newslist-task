import { NewsItem } from "@/components/news-list";

export async function fetchNewsData(options?: {
	forceRefresh?: boolean;
}): Promise<NewsItem[]> {
	try {
		//Add cache control for refreshing
		const fetchOptions = options?.forceRefresh
			? { cache: "no-store" as RequestCache }
			: { next: { revalidate: 300 } }; // Cache for 5 minutes by default

		const response = await fetch("/api/newslist", fetchOptions);

		if (!response.ok) {
			throw new Error(`API error: ${response.status}`);
		}

		const data = await response.json();

		return data;
	} catch (error) {
		console.error("Failed to fetch news data:", error);
		throw error;
	}
}
