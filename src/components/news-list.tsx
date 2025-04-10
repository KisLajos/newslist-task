"use client";

import { useEffect } from "react";
import { Button } from "./ui/button";
import { AlertCircle, ChevronDown, Filter, RefreshCcw } from "lucide-react";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ThemeToggle } from "./theme-toggle";
import NewsListSkeleton from "./skeleton";
import { formatDate, getDaysDifference } from "@/utils/date-helpers";
import { useNewsData } from "@/hooks/use-news-data";
import { useNewsFilters } from "@/hooks/use-news-filters";
import { NewsError } from "./news-error";
import { NewsGrid } from "./news-grid";

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
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={toggleFilter}
						className="flex items-center gap-2"
					>
						<Filter className="h-4 w-4" />
						Filter by Category
						{isFilterOpen ? (
							<ChevronDown className="h-4 w-4 rotate-180 transition-transform" />
						) : (
							<ChevronDown className="h-4 w-4 transition-transform" />
						)}
					</Button>
					{selectedCategories.length > 0 && (
						<Button
							variant="ghost"
							onClick={resetFilters}
							size="sm"
						>
							Clear filters
						</Button>
					)}
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="icon"
						onClick={handleRefresh}
						disabled={isRefreshing}
						className={isRefreshing ? "animate-spin" : ""}
						title="Refresh news"
					>
						<RefreshCcw className="h-4 w-4" />
						<span className="sr-only">Refresh</span>
					</Button>
					<ThemeToggle />
				</div>
			</div>

			{lastUpdated && (
				<div className="text-xs text-muted-foreground text-right">
					Last updated:{" "}
					{formatDate(lastUpdated.toISOString(), "medium")}
				</div>
			)}

			{isFilterOpen && (
				<div className="flex flex-wrap gap-2 p-4 bg-muted rounded-lg">
					{allCategories.map((category) => (
						<Badge
							key={category}
							variant={
								selectedCategories.includes(category)
									? "default"
									: "outline"
							}
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
					<p className="text-muted-foreground">
						No news articles match your selected filters.
					</p>
					<Button variant="link" onClick={resetFilters}>
						Clear filters
					</Button>
				</div>
			) : (
				<NewsGrid
					news={visibleNews}
					isNewArticle={isNewArticle}
					hasMoreArticles={hasMoreArticles}
					onLoadMore={loadMore}
				/>
			)}

			{!isLoading && !error && news.length === 0 && (
				<div className="flex flex-col items-center justify-center py-12 text-center">
					<AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
					<h3 className="text-lg font-medium">
						No news articles available
					</h3>
					<p className="text-muted-foreground mt-2">
						There are currently no news articles to display.
					</p>
					<Button
						onClick={handleRefresh}
						variant="outline"
						className="mt-4"
					>
						Refresh
					</Button>
				</div>
			)}

			<Separator />

			<div className="text-center text-sm text-muted-foreground">
				<p>
					Showing {visibleNews.length} of {news.length} articles
				</p>
			</div>
		</div>
	);
}
