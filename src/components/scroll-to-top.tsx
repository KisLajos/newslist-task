import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "./ui/button";

export function ScrollToTop() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const toggleVisibility = () => {
			if (window.scrollY > 500) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		window.addEventListener("scroll", toggleVisibility);
		return () => window.removeEventListener("scroll", toggleVisibility);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<Button
			variant="outline"
			size="icon"
			className={`fixed bottom-8 right-8 rounded-full opacity-0 transition-opacity duration-300 z-50 ${
				isVisible ? "opacity-70 hover:opacity-100" : ""
			}`}
			onClick={scrollToTop}
			title="Scroll to the top"
		>
			<ArrowUp className="h-5 w-5" />
		</Button>
	);
}
