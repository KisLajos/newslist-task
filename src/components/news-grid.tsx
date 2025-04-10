import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { NewsCard } from "./news-card";
import { NewsItem } from "./news-list";

interface NewsGridProps {
	news: NewsItem[];
	isNewArticle: (date: string) => boolean;
	hasMoreArticles: boolean;
	onLoadMore: () => void;
}

export function NewsGrid({
	news,
	isNewArticle,
	hasMoreArticles,
	onLoadMore,
}: NewsGridProps) {
	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{news.map((item) => (
					<NewsCard
						key={item.id}
						item={item}
						isNewArticle={isNewArticle}
					/>
				))}
			</div>

			{hasMoreArticles && (
				<div className="flex justify-center mt-8">
					<Button
						onClick={onLoadMore}
						variant="outline"
						className="flex items-center gap-2"
					>
						Load More <ChevronDown className="h-4 w-4" />
					</Button>
				</div>
			)}
		</>
	);
}
