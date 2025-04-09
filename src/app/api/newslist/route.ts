import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

//Fetch from WordPress first, fallback to local JSON otherwise
export async function GET() {
	try {
		//Attempt to fetch from WordPress
		if (process.env.WORDPRESS_NEWSLIST_ENDPOINT) {
			try {
				const wordpressResponse = await fetch(
					process.env.WORDPRESS_NEWSLIST_ENDPOINT
				);

				if (wordpressResponse.ok) {
					const data = await wordpressResponse.json();
					return NextResponse.json(data);
				}
			} catch (error) {
				console.error("WordPress API failed:", error);
			}
		}

		//Fallback to local JSON file
		const jsonPath = path.join(process.cwd(), "data/newslist.json");
		const fileContents = await fs.readFile(jsonPath, "utf8");
		const data = JSON.parse(fileContents);

		return NextResponse.json(data);
	} catch (error) {
		console.error("Failed to load news data:", error);
		return NextResponse.json(
			{ error: "Failed to load news data" },
			{ status: 500 }
		);
	}
}
