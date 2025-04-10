"use client";

import { useEffect } from "react";
import NewsListSkeleton from "./skeleton";
import { getDaysDifference } from "@/utils/date-helpers";
import { useNewsData } from "@/hooks/use-news-data";
import { useNewsFilters } from "@/hooks/use-news-filters";
import { NewsError } from "./news-error";
import { NewsGrid } from "./news-grid";
import { NewsHeader } from "./news-header";
import { CategoryFilter } from "./category-filter";
import { NoMatchingNews, NoNewsAvailable } from "./empty-states";
import { NewsFooter } from "./news-footer";
import LastUpdated from "./last-updated";

export type NewsItem = {
	id: number;
	image: string;
	headline: string;
	shortDescription: string;
	categories: string[];
	date: string;
};

//Number of articles to show per page
const ARTICLES_PER_PAGE = 3;

export default function NewsListComponent() {
	//Use the extracted hook for data fetching
	const {
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
	} = useNewsData();

	//Use extracted hook for filters
	const {
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
	} = useNewsFilters(news, visibleCount, setVisibleCount, ARTICLES_PER_PAGE);

	//Initial data load
	useEffect(() => {
		loadData().then(({ allCategories: categories }) => {
			setAllCategories(categories);
		});
	}, [loadData, setAllCategories]);

	//Check if an article is published within the last 3 days
	//Consider articles "new" if they're within 3 days of the most recent article
	const isNewArticle = (dateString: string) => {
		//For demo purposes with future dates
		if (news.length > 0) {
			//First article is the most recent due to sorting
			const mostRecentDate = news[0].date;

			//Use the refactored function to calculate days difference
			const diffDays = getDaysDifference(dateString, mostRecentDate);

			return diffDays < 3;
		}
		return false;
	};

	if (isLoading) {
		return <NewsListSkeleton />;
	}

	if (error) {
		return <NewsError message={error} onRetry={() => loadData()} />;
	}

	return (
		<div className="space-y-6">
			<NewsHeader
				onToggleFilter={toggleFilter}
				onResetFilters={resetFilters}
				onRefresh={handleRefresh}
				isFilterOpen={isFilterOpen}
				hasSelectedFilters={selectedCategories.length > 0}
				selectedCategories={selectedCategories}
				isRefreshing={isRefreshing}
			/>

			{lastUpdated ? <LastUpdated date={lastUpdated} /> : null}

			{isFilterOpen ? (
				<CategoryFilter
					categories={allCategories}
					selectedCategories={selectedCategories}
					onToggleCategory={toggleCategory}
				/>
			) : null}

			{filteredNews.length === 0 ? (
				<NoMatchingNews onResetFilters={resetFilters} />
			) : (
				<NewsGrid
					news={visibleNews}
					isNewArticle={isNewArticle}
					hasMoreArticles={hasMoreArticles}
					onLoadMore={loadMore}
				/>
			)}

			{!isLoading && !error && news.length === 0 ? (
				<NoNewsAvailable onRefresh={handleRefresh} />
			) : null}

			<NewsFooter
				visibleCount={visibleNews.length}
				totalCount={filteredNews.length}
			/>
		</div>
	);
}
