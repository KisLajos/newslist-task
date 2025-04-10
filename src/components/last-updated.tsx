import { formatDate } from "@/utils/date-helpers";

function LastUpdated({ date }: { date: Date }) {
	return (
		<div className="text-xs text-muted-foreground text-right">
			Last updated: {formatDate(date.toISOString(), "medium")}
		</div>
	);
}

export default LastUpdated;
