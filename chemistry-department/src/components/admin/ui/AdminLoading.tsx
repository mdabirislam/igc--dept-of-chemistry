export default function AdminLoading({
  text = "লোড হচ্ছে...",
}: {
  text?: string;
}) {
  return (
    <div className="flex min-h-[180px] items-center justify-center">
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-green-600" />
        {text}
      </div>
    </div>
  );
}