"""
Run this from: H:\\ABIR\\igc web dev   (the folder that contains chemistry-department)

    python apply_public_pages.py

What it fixes vs the old script:
  1. Baseline commit is taken BEFORE any file edits (old script committed
     AFTER editing, so `git diff --cached HEAD` had nothing to compare ->
     empty/invalid diff -> "No valid patches in input").
  2. Project root is `chemistry-department` directly, not the nested
     `igc--dept-of-chemistry-main/chemistry-department` path that doesn't
     exist on your machine.
  3. Diff is written in binary mode ("wb") so nothing gets corrupted by
     text-mode newline translation on Windows.

After running this, chemistry-department ALREADY CONTAINS the changes
(the script edits real files on disk). public-pages.diff is just a
backup/record of exactly what changed, in case you want to apply the
same change to another clean copy of the baseline.
"""

import os
import subprocess

ROOT = os.getcwd()                              # run this from H:\ABIR\igc web dev
PROJ = os.path.join(ROOT, "chemistry-department")  # <-- real path, no extra nesting

if not os.path.isdir(PROJ):
    raise SystemExit(f"chemistry-department not found under {ROOT}. "
                      f"Run this script from H:\\ABIR\\igc web dev.")


def run_git(args, cwd=PROJ, **kw):
    return subprocess.run(["git", *args], cwd=cwd, capture_output=True, text=True, **kw)


# ---------------------------------------------------------------------------
# 1) BASELINE FIRST — commit whatever is currently on disk, before editing
# ---------------------------------------------------------------------------
if not os.path.isdir(os.path.join(PROJ, ".git")):
    run_git(["init"])
    run_git(["add", "."])
    r = run_git(["commit", "-m", "baseline before public-pages changes"])
    print("baseline commit:", r.returncode, r.stderr.strip())
else:
    status = run_git(["status", "--porcelain"])
    if status.stdout.strip():
        run_git(["add", "."])
        r = run_git(["commit", "-m", "baseline before public-pages changes"])
        print("baseline commit:", r.returncode, r.stderr.strip())
    else:
        print("repo already clean, using existing HEAD as baseline")

# ---------------------------------------------------------------------------
# 2) NOW apply the actual page changes (same content as before)
# ---------------------------------------------------------------------------
pages = {
"src/app/notices/page.tsx": r''' "use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bell, ChevronLeft, Download, FileText } from "lucide-react";

import { apiFetch } from "@/lib/api";
import type { Notice } from "@/types/api";

const categoryLabels: Record<string, string> = {
  academic: "একাডেমিক",
  exam: "পরীক্ষা",
  admission: "ভর্তি",
  general: "সাধারণ",
  event: "ইভেন্ট",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadNotices() {
      try {
        const data = await apiFetch<Notice[]>("/notices/");
        setNotices(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "নোটিশ লোড করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    loadNotices();
  }, []);

  const filteredNotices = useMemo(
    () =>
      category === "all"
        ? notices
        : notices.filter((notice) => notice.category === category),
    [category, notices]
  );

  return (
    <main className="min-h-screen bg-[#f7f9fb]">
      <section className="bg-[#1a3a5c] text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-10 lg:px-6">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-1 text-sm text-white/75 hover:text-white"
          >
            <ChevronLeft size={16} />
            হোমে ফিরে যান
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
              <Bell size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">নোটিশ বোর্ড</h1>
              <p className="mt-1 text-sm text-white/75">
                রসায়ন বিভাগের সর্বশেষ বিজ্ঞপ্তি ও গুরুত্বপূর্ণ ঘোষণা
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-7 lg:px-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-500">
            {loading ? "নোটিশ লোড হচ্ছে..." : `${filteredNotices.length} টি নোটিশ`}
          </p>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:border-[#1b5e20]"
            aria-label="নোটিশের ক্যাটাগরি"
          >
            <option value="all">সব ক্যাটাগরি</option>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="rounded-xl border bg-white px-5 py-16 text-center text-sm text-gray-500">
            নোটিশ লোড হচ্ছে...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-12 text-center text-sm text-red-600">
            {error}
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="rounded-xl border bg-white px-5 py-16 text-center text-sm text-gray-500">
            এই ক্যাটাগরিতে কোনো নোটিশ পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="divide-y">
              {filteredNotices.map((notice) => (
                <article
                  key={notice.id}
                  className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-gray-800">
                        {notice.title}
                      </h2>
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-[#1b5e20]">
                        {categoryLabels[notice.category] ?? notice.category}
                      </span>
                    </div>

                    {notice.details && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                        {notice.details}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-gray-400">
                      প্রকাশিত: {formatDate(notice.created_at)}
                    </p>
                  </div>

                  {notice.pdf_url && (
                    <a
                      href={notice.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-[#1b5e20] hover:text-[#1b5e20]"
                    >
                      <Download size={16} />
                      PDF দেখুন
                    </a>
                  )}
                </article>
              ))}
            </div>

            <div className="border-t bg-gray-50 px-5 py-3 text-xs text-gray-500">
              <span className="inline-flex items-center gap-2">
                <FileText size={14} />
                বিভাগীয় নোটিশ
              </span>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
''',
"src/app/faculty/page.tsx": r''' "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, GraduationCap, UserRound } from "lucide-react";

import { apiFetch } from "@/lib/api";
import type { Faculty } from "@/types/api";

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadFaculty() {
      try {
        const data = await apiFetch<Faculty[]>("/faculty/");
        setFaculty(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "শিক্ষক তালিকা লোড করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    loadFaculty();
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f9fb]">
      <section className="bg-[#1a3a5c] text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-10 lg:px-6">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-1 text-sm text-white/75 hover:text-white"
          >
            <ChevronLeft size={16} />
            হোমে ফিরে যান
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
              <GraduationCap size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">শিক্ষকবৃন্দ</h1>
              <p className="mt-1 text-sm text-white/75">
                রসায়ন বিভাগের শিক্ষক ও কর্মকর্তাবৃন্দ
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-7 lg:px-6">
        {loading ? (
          <div className="rounded-xl border bg-white px-5 py-16 text-center text-sm text-gray-500">
            শিক্ষক তালিকা লোড হচ্ছে...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-12 text-center text-sm text-red-600">
            {error}
          </div>
        ) : faculty.length === 0 ? (
          <div className="rounded-xl border bg-white px-5 py-16 text-center text-sm text-gray-500">
            বর্তমানে কোনো শিক্ষক তথ্য নেই।
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {faculty.map((person) => (
              <article
                key={person.id}
                className="rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-gray-100">
                    {person.image_url ? (
                      <img
                        src={person.image_url}
                        alt={person.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <UserRound size={30} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-bold text-gray-800">{person.name}</h2>
                    <p className="mt-1 text-sm font-medium text-[#1b5e20]">
                      {person.designation}
                    </p>
                  </div>
                </div>

                {person.qualification && (
                  <div className="mt-5 border-t pt-4">
                    <p className="text-xs font-semibold text-gray-400">
                      শিক্ষাগত যোগ্যতা
                    </p>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {person.qualification}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
''',
"src/app/resources/page.tsx": r''' "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDownToLine,
  BookOpen,
  ChevronLeft,
  FileText,
  FlaskConical,
  NotebookPen,
} from "lucide-react";

import { apiFetch } from "@/lib/api";
import type { Resource } from "@/types/api";

const typeLabels: Record<string, string> = {
  note: "নোট",
  "question-paper": "প্রশ্নপত্র",
  "lab-manual": "ল্যাব ম্যানুয়াল",
  download: "ডাউনলোড",
};

function getIcon(type: string) {
  switch (type) {
    case "question-paper":
      return FileText;
    case "lab-manual":
      return FlaskConical;
    case "download":
      return ArrowDownToLine;
    default:
      return NotebookPen;
  }
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResources() {
      try {
        const data = await apiFetch<Resource[]>("/resources/");
        setResources(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "রিসোর্স লোড করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    loadResources();
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f9fb]">
      <section className="bg-[#1a3a5c] text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-10 lg:px-6">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-1 text-sm text-white/75 hover:text-white"
          >
            <ChevronLeft size={16} />
            হোমে ফিরে যান
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">শিক্ষাসামগ্রী ও রিসোর্স</h1>
              <p className="mt-1 text-sm text-white/75">
                শিক্ষার্থীদের জন্য প্রয়োজনীয় নোট, প্রশ্নপত্র ও ল্যাব ম্যানুয়াল
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-7 lg:px-6">
        {loading ? (
          <div className="rounded-xl border bg-white px-5 py-16 text-center text-sm text-gray-500">
            রিসোর্স লোড হচ্ছে...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-12 text-center text-sm text-red-600">
            {error}
          </div>
        ) : resources.length === 0 ? (
          <div className="rounded-xl border bg-white px-5 py-16 text-center text-sm text-gray-500">
            বর্তমানে কোনো রিসোর্স নেই।
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => {
              const Icon = getIcon(resource.type);

              return (
                <article
                  key={resource.id}
                  className="rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-green-50 text-[#1b5e20]">
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="font-semibold text-gray-800">
                        {resource.title}
                      </h2>
                      <p className="mt-1 text-xs text-gray-500">
                        {typeLabels[resource.type] ?? resource.type}
                      </p>
                    </div>
                  </div>

                  {resource.file_url ? (
                    <a
                      href={resource.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1b5e20] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#145218]"
                    >
                      <ArrowDownToLine size={16} />
                      ফাইল দেখুন / ডাউনলোড
                    </a>
                  ) : (
                    <p className="mt-5 rounded-lg bg-gray-50 px-3 py-2.5 text-center text-xs text-gray-400">
                      ফাইল এখনো সংযুক্ত করা হয়নি
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
''',
"src/app/events/page.tsx": r''' "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronLeft, MapPin } from "lucide-react";

import { apiFetch } from "@/lib/api";
import type { Event } from "@/types/api";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await apiFetch<Event[]>("/events/");
        setEvents(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "ইভেন্ট লোড করা যায়নি।"
        );
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f9fb]">
      <section className="bg-[#1a3a5c] text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-10 lg:px-6">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-1 text-sm text-white/75 hover:text-white"
          >
            <ChevronLeft size={16} />
            হোমে ফিরে যান
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
              <CalendarDays size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">ইভেন্ট</h1>
              <p className="mt-1 text-sm text-white/75">
                রসায়ন বিভাগের অনুষ্ঠান ও গুরুত্বপূর্ণ কার্যক্রম
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1000px] px-4 py-7 lg:px-6">
        {loading ? (
          <div className="rounded-xl border bg-white px-5 py-16 text-center text-sm text-gray-500">
            ইভেন্ট লোড হচ্ছে...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-12 text-center text-sm text-red-600">
            {error}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-xl border bg-white px-5 py-16 text-center text-sm text-gray-500">
            বর্তমানে কোনো ইভেন্ট নেই।
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <article
                key={event.id}
                className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#1b5e20]">
                    <CalendarDays size={21} />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-gray-800">
                      {event.title}
                    </h2>

                    <p className="mt-2 text-sm font-medium text-[#1b5e20]">
                      {formatDate(event.date)}
                    </p>

                    {event.location && (
                      <p className="mt-2 flex items-center gap-1.5 text-sm text-gray-500">
                        <MapPin size={15} />
                        {event.location}
                      </p>
                    )}

                    {event.details && (
                      <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-600">
                        {event.details}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
''',
}

for rel, data in pages.items():
    path = os.path.join(PROJ, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    # newline="\n" forces LF even on Windows, keeps the diff/patch clean
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(data)

# --- QuickAccess.tsx: swap in the 4 valid public links -----------------
qpath = os.path.join(PROJ, "src/components/home/QuickAccess.tsx")
q = open(qpath, encoding="utf-8").read()
start = q.index("const quickLinks = [")
end = q.index("];", start) + 2
newlinks = '''const quickLinks = [
  {
    title: "নোটিশ বোর্ড",
    subtitle: "সর্বশেষ বিজ্ঞপ্তি",
    href: "/notices",
    icon: Bell,
    iconClass: "bg-blue-50 text-blue-700",
  },
  {
    title: "শিক্ষকবৃন্দ",
    subtitle: "শিক্ষক ও কর্মকর্তা",
    href: "/faculty",
    icon: GraduationCap,
    iconClass: "bg-purple-50 text-purple-700",
  },
  {
    title: "শিক্ষাসামগ্রী",
    subtitle: "নোট ও উপকরণ",
    href: "/resources",
    icon: FolderOpen,
    iconClass: "bg-orange-50 text-orange-600",
  },
  {
    title: "ইভেন্ট",
    subtitle: "বিভাগীয় অনুষ্ঠান",
    href: "/events",
    icon: CalendarDays,
    iconClass: "bg-green-50 text-green-700",
  },
];'''
q = q[:start] + newlinks + q[end:]
q = (q.replace("  Layers3,\n", "")
       .replace("  FileQuestion,\n", "")
       .replace("  FlaskConical,\n", "")
       .replace("  ClipboardCheck,\n", ""))
q = q.replace("  CalendarDays,\n  BookOpen,", "  CalendarDays,\n  BookOpen,\n  GraduationCap,")
with open(qpath, "w", encoding="utf-8", newline="\n") as f:
    f.write(q)

# --- Navbar.tsx: only keep links to pages that actually exist ----------
npath = os.path.join(PROJ, "src/components/layout/Navbar.tsx")
n = open(npath, encoding="utf-8").read()
s = n.index("const navigationItems = [")
e = n.index("];", s) + 2
nav = '''const navigationItems = [
  { label: "হোম", href: "/" },
  { label: "শিক্ষকবৃন্দ", href: "/faculty" },
  { label: "শিক্ষাসামগ্রী", href: "/resources" },
  { label: "ইভেন্ট", href: "/events" },
  { label: "নোটিশ", href: "/notices" },
];'''
n = n[:s] + nav + n[e:]
n = n.replace(
    '''              {item.dropdown && <span className="dropdown-arrow">⌄</span>}''',
    ''
)
with open(npath, "w", encoding="utf-8", newline="\n") as f:
    f.write(n)

# --- Footer.tsx: fix logo extension --------------------------------------
fpath = os.path.join(PROJ, "src/components/layout/Footer.tsx")
f_content = open(fpath, encoding="utf-8").read().replace(
    "/images/branding/igc-logo.png", "/images/branding/igc-logo.jpg"
)
with open(fpath, "w", encoding="utf-8", newline="\n") as f:
    f.write(f_content)

print("Files updated on disk under:", PROJ)

# ---------------------------------------------------------------------------
# 3) Diff AFTER the edits, comparing working tree to the baseline HEAD
#    (binary-safe write mode: "wb", not "w")
# ---------------------------------------------------------------------------
diff_path = os.path.join(ROOT, "public-pages.diff")
with open(diff_path, "wb") as out:
    subprocess.run(["git", "diff", "--binary", "HEAD"], cwd=PROJ, stdout=out)

size = os.path.getsize(diff_path)
print("Diff written:", diff_path, size, "bytes")
if size == 0:
    print("NOTE: 0 bytes means nothing actually changed vs baseline "
          "(files may already have matched this content).")
