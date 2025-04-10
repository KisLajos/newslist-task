//Date formatting functions
export function formatDate(
	dateString: string,
	formatStyle: "short" | "medium" | "long" = "long"
): string {
	const date = new Date(dateString);

	if (formatStyle === "long") {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}).format(date);
	} else if (formatStyle === "medium") {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	} else {
		return new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		}).format(date);
	}
}

//Calculate days difference between dates
export function getDaysDifference(
	dateString: string,
	referenceDate?: Date | string
): number {
	const date = new Date(dateString);
	const reference = referenceDate ? new Date(referenceDate) : new Date();

	//Reset time part for accuracy
	const dateWithoutTime = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate()
	);

	const referenceWithoutTime = new Date(
		reference.getFullYear(),
		reference.getMonth(),
		reference.getDate()
	);

	//Calculate in milliseconds and convert to days
	const diffTime = referenceWithoutTime.getTime() - dateWithoutTime.getTime();
	return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}
