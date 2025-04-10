import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "framer-motion";

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
	// No categories to display
	if (categories.length === 0) {
		return null;
	}

	// Animation variants for container and items
	const containerVariants = {
		hidden: { opacity: 0, height: 0 },
		visible: {
			opacity: 1,
			height: "auto",
			transition: {
				when: "beforeChildren",
				staggerChildren: 0.05,
			},
		},
		exit: {
			opacity: 0,
			height: 0,
			transition: {
				when: "afterChildren",
				staggerChildren: 0.05,
				staggerDirection: -1,
			},
		},
	};

	const badgeVariants = {
		hidden: { opacity: 0, scale: 0.8 },
		visible: {
			opacity: 1,
			scale: 1,
			transition: {
				type: "spring",
				stiffness: 500,
				damping: 20,
			},
		},
		exit: {
			opacity: 0,
			scale: 0.8,
			transition: {
				duration: 0.2,
			},
		},
	};

	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			exit="exit"
			className="flex flex-wrap gap-2 p-4 bg-muted rounded-lg justify-evenly overflow-hidden"
		>
			<AnimatePresence>
				{categories.map((category, index) => (
					<motion.div
						key={category}
						variants={badgeVariants}
						custom={index}
						layout
					>
						<Badge
							variant={
								selectedCategories.includes(category)
									? "default"
									: "outline"
							}
							className="cursor-pointer"
							onClick={() => onToggleCategory(category)}
						>
							{category}
						</Badge>
					</motion.div>
				))}
			</AnimatePresence>
		</motion.div>
	);
}
