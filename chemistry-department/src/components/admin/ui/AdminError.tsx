import { AlertCircle, RefreshCcw } from "lucide-react";

export default function AdminError({
  message = "তথ্য লোড করতে সমস্যা হয়েছে।",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      <div className="flex items-start gap-3">
        <AlertCircle
          size={22}
          className="mt-0.5 shrink-0 text-red-600"
        />

        <div>
          <h3 className="font-semibold text-red-800">
            কিছু একটা সমস্যা হয়েছে
          </h3>

          <p className="mt-1 text-sm text-red-700">
            {message}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              <RefreshCcw size={15} />
              আবার চেষ্টা করুন
            </button>
          )}
        </div>
      </div>
    </div>
  );
}