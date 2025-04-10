import { Separator } from "./ui/separator";

interface NewsFooterProps {
	visibleCount: number;
	totalCount: number;
}

export function NewsFooter({ visibleCount, totalCount }: NewsFooterProps) {
	return (
		<>
			<Separator />
			<div className="text-center text-sm text-muted-foreground">
				<p>
					Showing {visibleCount} of {totalCount}{" "}
					{totalCount === 1 ? "article" : "articles"}
				</p>
			</div>
		</>
	);
}
