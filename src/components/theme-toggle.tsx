"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// useEffect only runs on the client, so now we can safely show the UI
	useEffect(() => {
		setMounted(true);
	}, []);

	// Render a placeholder during initial client render until theme data is available
	// to prevent UI flicker or layout shift
	if (!mounted) {
		return (
			<Button
				variant="outline"
				size="icon"
				disabled
				aria-label="Loading theme toggle"
			>
				<div className="h-[1.2rem] w-[1.2rem]" />
			</Button>
		);
	}

	function toggleTheme() {
		setTheme(theme === "dark" ? "light" : "dark");
	}

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={toggleTheme}
			aria-label="Toggle theme"
		>
			{theme === "dark" ? (
				<Sun className="h-[1.2rem] w-[1.2rem]" />
			) : (
				<Moon className="h-[1.2rem] w-[1.2rem]" />
			)}
		</Button>
	);
}
