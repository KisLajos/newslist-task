import { Button } from "./ui/button";
import { Filter, ChevronDown, RefreshCcw } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

interface NewsHeaderProps {
	onToggleFilter: () => void;
	onResetFilters: () => void;
	onRefresh: () => void;
	isFilterOpen: boolean;
	hasSelectedFilters: boolean;
	selectedCategories: string[];
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
					{isFilterOpen ? (
						<ChevronDown className="h-4 w-4 rotate-180 transition-transform" />
					) : (
						<ChevronDown className="h-4 w-4 transition-transform" />
					)}
				</Button>
				{hasSelectedFilters ? (
					<Button variant="ghost" onClick={onResetFilters} size="sm">
						Clear filters
					</Button>
				) : null}
			</div>
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="icon"
					onClick={onRefresh}
					disabled={isRefreshing}
					className=""
					title="Refresh news"
				>
					<RefreshCcw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
					<span className="sr-only">Refresh</span>
				</Button>
				<ThemeToggle />
			</div>
		</div>
	);
}
