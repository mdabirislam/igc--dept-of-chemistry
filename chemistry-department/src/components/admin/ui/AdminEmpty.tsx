import { Inbox } from "lucide-react";

export default function AdminEmpty({
  title = "কোনো তথ্য পাওয়া যায়নি",
  description = "এখানে এখনো কোনো তথ্য যোগ করা হয়নি।",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed bg-white px-6 text-center">
      <div className="mb-3 rounded-full bg-gray-100 p-3">
        <Inbox className="text-gray-400" size={24} />
      </div>

      <h3 className="font-semibold text-gray-700">{title}</h3>

      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}