import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";

interface NewsErrorProps {
	message: string;
	onRetry: () => void;
}

export function NewsError({ message, onRetry }: NewsErrorProps) {
	return (
		<div className="my-8 rounded-lg border border-destructive p-4 text-destructive">
			<div className="flex items-center gap-2 font-medium">
				<AlertCircle className="h-5 w-5" />
				Error
			</div>
			<div className="mt-2 flex flex-col gap-4">
				<p>{message}</p>
				<Button
					onClick={onRetry}
					variant="outline"
					className="w-fit flex items-center gap-2"
				>
					<RefreshCcw className="h-4 w-4" />
					Try Again
				</Button>
			</div>
		</div>
	);
}
