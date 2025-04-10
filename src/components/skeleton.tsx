import { Skeleton } from "./ui/skeleton";
import { Card, CardContent } from "./ui/card";

// Number of articles to show per page in skeleton
const ARTICLES_PER_PAGE = 3;

function NewsListSkeleton() {
	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<Skeleton className="h-10 w-40" />
				<div className="flex items-center gap-2">
					<Skeleton className="h-10 w-10 rounded-md" />
					<Skeleton className="h-10 w-10 rounded-md" />
				</div>
			</div>

			<div className="flex justify-end">
				<Skeleton className="h-4 w-24" />
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{Array.from({ length: ARTICLES_PER_PAGE }).map((_, index) => (
					<Card key={index} className="overflow-hidden">
						<Skeleton className="h-48 w-full" />
						<CardContent className="p-4 space-y-3">
							<div className="flex gap-2">
								<Skeleton className="h-6 w-16 rounded-full" />
								<Skeleton className="h-6 w-20 rounded-full" />
							</div>
							<Skeleton className="h-8 w-full" />
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-4 w-full" />
							<Skeleton className="h-4 w-full" />
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}

export default NewsListSkeleton;
