"use client";

import { fetchNewsData } from "@/utils/api";
import { useEffect, useState, useCallback } from "react";
import { Button } from "./ui/button";
import { AlertCircle, ChevronDown, Filter, RefreshCcw } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import NewsListSkeleton from "./skeleton";

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

//Date formatting functions
function formatDate(
	dateString: string,
	formatStyle: "short" | "medium" | "long" = "long"
): string {
	const date = new Date(dateString);

	if (formatStyle === "long") {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(date);
	} else if (formatStyle === "medium") {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	} else {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		}).format(date);
	}
}

//Calculate days difference between dates
function getDaysDifference(
	dateString: string,
	referenceDate?: Date | string
): number {
	const date = new Date(dateString);
	const reference = referenceDate ? new Date(referenceDate) : new Date();

	//Reset time part for accuracy
	const dateWithoutTime = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate()
	);

	const referenceWithoutTime = new Date(
		reference.getFullYear(),
		reference.getMonth(),
		reference.getDate()
	);

	//Calculate in milliseconds and convert to days
	const diffTime = referenceWithoutTime.getTime() - dateWithoutTime.getTime();
	return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export default function NewsListComponent() {
	//State for storing the news articles
	const [news, setNews] = useState<NewsItem[]>([]);

	//State to track initial loading state
	const [isLoading, setIsLoading] = useState(true);

	//State to track refresh operations
	const [isRefreshing, setIsRefreshing] = useState(false);

	//State to store any error messages
	const [error, setError] = useState<string | null>(null);

	//States to manage selected categories for filterdropdown & filtering
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [allCategories, setAllCategories] = useState<string[]>([]);
	const [isFilterOpen, setIsFilterOpen] = useState(false);

	//State to track the last updated time
	const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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
				setAllCategories(Array.from(categories).sort());
				setLastUpdated(new Date());
				//Reset visible count on data change
				setVisibleCount(ARTICLES_PER_PAGE);
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
		loadData({ forceRefresh: true });
	};

	const toggleCategory = (category: string) => {
		setSelectedCategories((prev) =>
			prev.includes(category)
				? prev.filter((c) => c !== category)
				: [...prev, category]
		);
		// Reset visible count when filters change
		setVisibleCount(ARTICLES_PER_PAGE);
	};

	const toggleFilter = () => {
		setIsFilterOpen(!isFilterOpen);
	};

	const resetFilters = () => {
		setSelectedCategories([]);
		// Reset visible count when filters are cleared
		setVisibleCount(ARTICLES_PER_PAGE);
	};

	// Function to load more articles
	const loadMore = () => {
		setVisibleCount((prev) => prev + ARTICLES_PER_PAGE);
	};

	const filteredNews = news.filter(
		(item) =>
			selectedCategories.length === 0 ||
			item.categories.some((category) =>
				selectedCategories.includes(category)
			)
	);

	// Get only the visible articles based on current page
	const visibleNews = filteredNews.slice(0, visibleCount);

	// Check if there are more articles to load
	const hasMoreArticles = visibleCount < filteredNews.length;

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
		return (
			<div className="my-8 rounded-lg border border-destructive p-4 text-destructive">
				<div className="flex items-center gap-2 font-medium">
					<AlertCircle className="h-5 w-5" />
					Error
				</div>
				<div className="mt-2 flex flex-col gap-4">
					<p>{error}</p>
					<Button
						onClick={() => loadData()}
						variant="outline"
						className="w-fit flex items-center gap-2"
					>
						<RefreshCcw className="h-4 w-4" />
						Try Again
					</Button>
				</div>
			</div>
		);
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
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{visibleNews.map((item) => (
							<Card
								key={item.id}
								className="overflow-hidden transition-all duration-300 hover:shadow-lg group"
							>
								<div className="relative h-48 overflow-hidden">
									<Image
										src={item.image || "/placeholder.svg"}
										alt={item.headline}
										fill
										className="object-cover transition-transform duration-500 group-hover:scale-105"
									/>
									{isNewArticle(item.date) && (
										<div className="absolute top-2 right-2">
											<Badge variant="destructive">
												New
											</Badge>
										</div>
									)}
								</div>
								<CardContent className="p-4 space-y-3 flex-1 flex flex-col">
									<div className="flex flex-wrap gap-2 mb-2">
										{item.categories.map((category) => (
											<Badge
												key={category}
												variant="secondary"
												className="text-xs"
											>
												{category}
											</Badge>
										))}
									</div>
									<h2 className="text-xl font-bold line-clamp-2 min-h-[3.5rem]">
										{item.headline}
									</h2>
									<p className="text-muted-foreground text-sm">
										{formatDate(item.date)}
									</p>
									<p className="line-clamp-3 flex-1">
										{item.shortDescription}
									</p>
								</CardContent>
							</Card>
						))}
					</div>

					{hasMoreArticles && (
						<div className="flex justify-center mt-8">
							<Button
								onClick={loadMore}
								variant="outline"
								className="flex items-center gap-2"
							>
								Load More <ChevronDown className="h-4 w-4" />
							</Button>
						</div>
					)}
				</>
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
