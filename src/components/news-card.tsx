import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { formatDate } from "@/utils/date-helpers";
import { NewsItem } from "./news-list";

interface NewsCardProps {
	item: NewsItem;
	isNewArticle: (date: string) => boolean;
}

export function NewsCard({ item, isNewArticle }: NewsCardProps) {
	return (
		<Card className="py-0 min-h-[27rem] overflow-hidden group flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
			<div className="relative h-48 overflow-hidden">
				<Image
					src={item.image || "/placeholder.svg"}
					alt={item.headline}
					fill
					className="object-cover"
				/>
				{isNewArticle(item.date) ? (
					<div className="absolute top-2 right-2">
						<Badge variant="destructive">New</Badge>
					</div>
				) : null}
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
				<p className="line-clamp-3 flex-1">{item.shortDescription}</p>
			</CardContent>
		</Card>
	);
}
