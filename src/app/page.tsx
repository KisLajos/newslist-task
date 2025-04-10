import NewsListComponent from "@/components/news-list";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Latest News | News Reader App",
	description:
		"Browse and filter the latest news articles from around the world",
};

export default function Home() {
	return (
		<main className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-4 text-center">Latest News</h1>
			<p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
				Stay informed with our curated collection of news articles.
			</p>
			<NewsListComponent />
		</main>
	);
}
