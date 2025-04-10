import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const roboto = Roboto({
	variable: "--font-roboto",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "News List Application",
	description: "Browse and filter the latest news articles",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${roboto.variable} antialiased`}
			>
				 {/* Enables dark/light mode switching */}
				<ThemeProvider
					attribute="class" //applies theme via CSS classes
					defaultTheme="system" //uses OS preference initially
					enableSystem //continues to respond to OS preference changes
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
