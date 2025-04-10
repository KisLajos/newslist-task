import { useState } from "react";
import { NewsItem } from "@/components/news-list";

export interface UseNewsFiltersReturn {
	selectedCategories: string[];
	allCategories: string[];
	isFilterOpen: boolean;
	setAllCategories: (categories: string[]) => void;
	toggleCategory: (category: string) => void;
	toggleFilter: () => void;
	resetFilters: () => void;
	filteredNews: NewsItem[];
	visibleNews: NewsItem[];
	hasMoreArticles: boolean;
}

export function useNewsFilters(
	news: NewsItem[],
	visibleCount: number,
	setVisibleCount: (count: number) => void,
	articlesPerPage: number
): UseNewsFiltersReturn {
	//States to manage selected categories for filterdropdown & filtering
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [allCategories, setAllCategories] = useState<string[]>([]);
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	const toggleCategory = (category: string) => {
		setSelectedCategories((prev) =>
			prev.includes(category)
				? prev.filter((c) => c !== category)
				: [...prev, category]
		);
		//Reset visible count when filters change
		setVisibleCount(articlesPerPage);
	};

	const toggleFilter = () => {
		setIsFilterOpen(!isFilterOpen);
	};

	const resetFilters = () => {
		setSelectedCategories([]);
		//Reset visible count when filters are cleared
		setVisibleCount(articlesPerPage);
	};

	const filteredNews = news.filter(
		(item) =>
			selectedCategories.length === 0 ||
			item.categories.some((category) =>
				selectedCategories.includes(category)
			)
	);

	//Get only the visible articles based on current page
	const visibleNews = filteredNews.slice(0, visibleCount);

	//Check if there are more articles to load
	const hasMoreArticles = visibleCount < filteredNews.length;

	return {
		selectedCategories,
		allCategories,
		isFilterOpen,
		setAllCategories,
		toggleCategory,
		toggleFilter,
		resetFilters,
		filteredNews,
		visibleNews,
		hasMoreArticles,
	};
}
