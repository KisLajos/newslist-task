import { Button } from "./ui/button";
import { Filter, ChevronDown, RefreshCcw, Trash2 } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

interface NewsHeaderProps {
	onToggleFilter: () => void;
	onResetFilters: () => void;
	onRefresh: () => void;
	isFilterOpen: boolean;
	hasSelectedFilters: boolean;
	isRefreshing: boolean;
}

export function NewsHeader({
	onToggleFilter,
	onResetFilters,
	onRefresh,
	isFilterOpen,
	hasSelectedFilters,
	isRefreshing,
}: NewsHeaderProps) {
	return (
		<div className="flex flex-row justify-between items-start sm:items-center gap-4">
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					onClick={onToggleFilter}
					className="flex items-center gap-2"
				>
					<Filter className="h-4 w-4" />
					Filter by Category
					<ChevronDown
						className={`h-4 w-4 transition-transform ${
							isFilterOpen ? "rotate-180" : ""
						}`}
					/>
				</Button>
				{hasSelectedFilters ? (
					<Button variant="ghost" onClick={onResetFilters} size="sm">
						<Trash2 className="text-destructive md:text-foreground h-4 w-4" />
						<span className="hidden md:block">Clear filters</span>
					</Button>
				) : null}
			</div>
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="icon"
					onClick={onRefresh}
					disabled={isRefreshing}
					title="Refresh news"
				>
					<RefreshCcw
						className={`h-4 w-4 ${
							isRefreshing ? "animate-spin" : ""
						}`}
					/>
					<span className="sr-only">Refresh</span>
				</Button>
				<ThemeToggle />
			</div>
		</div>
	);
}
