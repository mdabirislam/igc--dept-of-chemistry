import { UserRound } from "lucide-react";

/** Default profile picture for people without a photo. */
export default function DefaultAvatar({
  size = 30,
}: {
  size?: number;
}) {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400"
      aria-hidden="true"
    >
      <UserRound size={size} strokeWidth={1.6} />
    </div>
  );
}
