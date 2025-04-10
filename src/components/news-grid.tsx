"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { NewsCard } from "./news-card";
import type { NewsItem } from "./news-list";

interface NewsGridProps {
	news: NewsItem[];
	isNewArticle: (date: string) => boolean;
	hasMoreArticles: boolean;
	onLoadMore: () => void;
}

const isMobileDevice = () => {
	return window.innerWidth < 768; //Using common breakpoint for mobile devices
};

export function NewsGrid({
	news,
	isNewArticle,
	hasMoreArticles,
	onLoadMore,
}: NewsGridProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [prevNewsLength, setPrevNewsLength] = useState(news.length);
	const [isMobile, setIsMobile] = useState(false);
	const [isLoadMoreAction, setIsLoadMoreAction] = useState(false);

	const gridEndRef = useRef<HTMLDivElement>(null);

	//Check device type on mount and window resize
	useEffect(() => {
		const checkMobile = () => setIsMobile(isMobileDevice());

		//Initial check
		checkMobile();

		//Update on resize
		window.addEventListener("resize", checkMobile);

		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	//Handle auto-scrolling behavior when new content is loaded
	useEffect(() => {
		//Skip scrolling on mobile devices entirely
		if (!isMobile && isLoadMoreAction && news.length > prevNewsLength) {
			//Small delay to ensure DOM is updated
			setTimeout(() => {
				//Scroll to the grid end
				if (gridEndRef.current) {
					gridEndRef.current.scrollIntoView({
						behavior: "smooth",
						block: "start",
					});
				}
			}, 100);

			//Reset the flag
			setIsLoadMoreAction(false);
		}

		//Update the previous length tracker
		setPrevNewsLength(news.length);
	}, [news, isMobile, isLoadMoreAction]);

	//Update handleLoadMore to set the flag
	const handleLoadMore = async () => {
		setIsLoading(true);
		setIsLoadMoreAction(true); //Set flag to indicate this is a load more action
		await onLoadMore();
		setIsLoading(false);
	};

	//Container variants for staggered children animations
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.1,
			},
		},
	};

	//Item variants for individual card animations - consolidate all transitions here
	const itemVariants = {
		hidden: { opacity: 0, y: 20, scale: 0.9 },
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				type: "spring",
				stiffness: 300,
				damping: 24,
			},
		},
		exit: {
			opacity: 0,
			scale: 0.9,
		},
	};

	return (
		<>
			{/* Animated grid container with staggered children animations */}
			<motion.div
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				{/* AnimatePresence handles animations when items are added/removed */}
				<AnimatePresence mode="popLayout">
					{news.map((item, index) => (
						<motion.div
							key={item.id}
							variants={itemVariants}
							layout
							initial="hidden"
							animate="visible"
							exit="exit"
							className="flex h-full"
							data-index={index}
						>
							<div className="flex-1 flex flex-col w-full">
								<NewsCard
									item={item}
									isNewArticle={isNewArticle}
								/>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</motion.div>

			{/* Reference div at the end of the grid */}
			<div ref={gridEndRef} className="h-0 w-full" />

			{/* Conditional "Load More" button with loading states */}
			{hasMoreArticles ? (
				<motion.div
					className="flex justify-center mt-8 py-4"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						initial={false}
					>
						<Button
							onClick={handleLoadMore}
							variant="outline"
							className="flex items-center gap-2 min-w-[120px] relative overflow-hidden"
							disabled={isLoading}
						>
							{/* Toggle between loading spinner and load more text */}
							<AnimatePresence mode="wait">
								{isLoading ? (
									<motion.div
										key="loading"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className="flex items-center gap-2"
									>
										<Loader2 className="h-4 w-4 animate-spin" />
										<span>Loading</span>
									</motion.div>
								) : (
									<motion.div
										key="load-more"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										className="flex items-center gap-2"
									>
										<span>Load More</span>
										{/* Animated bouncing arrow */}
										<motion.div
											animate={{ y: [0, 3, 0] }}
											transition={{
												repeat: Number.POSITIVE_INFINITY,
												duration: 1.5,
												repeatType: "loop",
											}}
										>
											<ChevronDown className="h-4 w-4" />
										</motion.div>
									</motion.div>
								)}
							</AnimatePresence>

							{/* Loading progress indicator */}
							{isLoading && (
								<motion.div
									className="absolute bottom-0 left-0 h-[2px] bg-primary"
									initial={{ width: 0 }}
									animate={{ width: "100%" }}
									transition={{ duration: 2 }}
								/>
							)}
						</Button>
					</motion.div>
				</motion.div>
			) : null}
		</>
	);
}
