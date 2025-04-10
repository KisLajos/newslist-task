import { Badge } from "./ui/badge";

interface CategoryFilterProps {
	categories: string[];
	selectedCategories: string[];
	onToggleCategory: (category: string) => void;
}

export function CategoryFilter({
	categories,
	selectedCategories,
	onToggleCategory,
}: CategoryFilterProps) {
	return (
		<div className="flex flex-wrap gap-2 p-4 bg-muted rounded-lg justify-evenly">
			{categories.map((category) => (
				<Badge
					key={category}
					variant={
						selectedCategories.includes(category)
							? "default"
							: "outline"
					}
					className="animate-in fade-in duration-300 cursor-pointer"
					onClick={() => onToggleCategory(category)}
				>
					{category}
				</Badge>
			))}
		</div>
	);
}
