"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  PhoneCall,
  Users,
} from "lucide-react";

import PublicSiteLayout from "@/components/layout/PublicSiteLayout";
import {
  phoneHref,
  useSiteSettings,
} from "@/hooks/useSiteSettings";

// Used until the details are filled in from the admin panel.
const DEFAULT_ADDRESS =
  "ঈশ্বরদী সরকারি কলেজ, মশুরিয়া পাড়া, ঈশ্বরদী-৬৬২০, পাবনা";

const DEFAULT_FACEBOOK_PAGE =
  "https://www.facebook.com/IGC.Chemistry";

interface ContactCard {
  key: string;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  icon: React.ReactNode;
}

export default function ContactContent() {
  const { settings, loading } = useSiteSettings();

  const address = settings?.address || DEFAULT_ADDRESS;
  const phone = settings?.phone || "";
  const email = settings?.email || "";
  const pageUrl =
    settings?.facebook_page_url || DEFAULT_FACEBOOK_PAGE;
  const groupUrl = settings?.facebook_group_url || "";

  const cards: ContactCard[] = [
    {
      key: "address",
      label: "ঠিকানা",
      value: address,
      icon: <MapPin size={22} />,
    },
  ];

  if (phone) {
    cards.push({
      key: "phone",
      label: "মোবাইল",
      value: phone,
      href: phoneHref(phone),
      icon: <Phone size={22} />,
    });
  }

  if (email) {
    cards.push({
      key: "email",
      label: "Email",
      value: email,
      href: `mailto:${email}`,
      icon: <Mail size={22} />,
    });
  }

  cards.push({
    key: "page",
    label: "Facebook Page",
    value: pageUrl,
    href: pageUrl,
    external: true,
    icon: <ExternalLink size={22} />,
  });

  if (groupUrl) {
    cards.push({
      key: "group",
      label: "Facebook Group",
      value: groupUrl,
      href: groupUrl,
      external: true,
      icon: <Users size={22} />,
    });
  }

  return (
    <PublicSiteLayout>
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
                <PhoneCall size={24} />
              </div>

              <div>
                <h1 className="text-3xl font-bold">যোগাযোগ</h1>
                <p className="mt-1 text-sm text-white/75">
                  রসায়ন বিভাগ, ঈশ্বরদী সরকারি কলেজ
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1000px] px-4 py-7 lg:px-6">
          {loading ? (
            <div className="rounded-xl border bg-white px-5 py-16 text-center text-sm text-gray-500">
              লোড হচ্ছে...
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {cards.map((card) => {
                const body = (
                  <>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#1b5e20]">
                      {card.icon}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-400">
                        {card.label}
                      </p>

                      <p className="mt-1 break-words text-sm font-medium leading-6 text-gray-800 [overflow-wrap:anywhere]">
                        {card.value}
                      </p>
                    </div>
                  </>
                );

                const cardClass =
                  "flex gap-4 rounded-xl border bg-white p-5 shadow-sm";

                return card.href ? (
                  <a
                    key={card.key}
                    href={card.href}
                    target={card.external ? "_blank" : undefined}
                    rel={
                      card.external
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className={`${cardClass} transition hover:-translate-y-0.5 hover:shadow-md`}
                  >
                    {body}
                  </a>
                ) : (
                  <div
                    key={card.key}
                    className={`${cardClass} sm:col-span-2`}
                  >
                    {body}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </PublicSiteLayout>
  );
}
