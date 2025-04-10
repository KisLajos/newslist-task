import { Button } from "./ui/button";
import { AlertCircle, Trash2, RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";

interface NoMatchingNewsProps {
	onResetFilters: () => void;
}

export function NoMatchingNews({ onResetFilters }: NoMatchingNewsProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className="text-center py-12"
		>
			<p className="text-muted-foreground">
				No news articles match your selected filters.
			</p>
			<Button variant="link" onClick={onResetFilters}>
				<Trash2 className="text-destructive md:text-foreground h-4 w-4" />
				<span className="hidden md:block">Clear filters</span>
			</Button>
		</motion.div>
	);
}

interface NoNewsAvailableProps {
	onRefresh: () => void;
}

export function NoNewsAvailable({ onRefresh }: NoNewsAvailableProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex flex-col items-center justify-center py-12 text-center"
		>
			<AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
			<h3 className="text-lg font-medium">No news articles available</h3>
			<p className="text-muted-foreground mt-2">
				There are currently no news articles to display.
			</p>
			<Button
				onClick={onRefresh}
				variant="outline"
				className="mt-4 flex items-center gap-2"
			>
				<RefreshCcw className="h-4 w-4" />
				Refresh
			</Button>
		</motion.div>
	);
}
