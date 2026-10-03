export const inputClass =
  "w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-[#1b5e20] focus:ring-1 focus:ring-[#1b5e20]";

export default function Field({
  label,
  hint,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label}
      </label>

      {children}

      {hint && (
        <p className="mt-1 text-xs text-gray-400">{hint}</p>
      )}
    </div>
  );
}
