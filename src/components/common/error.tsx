import { MessageCircleWarningIcon } from "lucide-react";

interface ErrorProps {
  message: string;
}

export const Error = ({ message }: ErrorProps) => {
  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-2 text-sm text-destructive">
      <MessageCircleWarningIcon className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
};
