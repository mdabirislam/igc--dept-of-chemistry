import {
  MapPin,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";

const importantLinks = [
  {
    label: "ঈশ্বরদী সরকারি কলেজ",
    href: "https://igc.edu.bd/",
  },
  {
    label: "জাতীয় বিশ্ববিদ্যালয়",
    href: "https://www.nu.ac.bd/",
  },
  {
    label: "শিক্ষা মন্ত্রণালয়",
    href: "https://moedu.gov.bd/",
  },
  {
    label: "UGC বাংলাদেশ",
    href: "https://ugc.gov.bd/",
  },
];

const quickLinks = [
  {
    label: "নোটিশ বোর্ড",
    href: "/notices",
  },
  {
    label: "ক্লাস রুটিন",
    href: "/academics/routine",
  },
  {
    label: "পাঠ্যসূচি",
    href: "/academics/syllabus",
  },
  {
    label: "শিক্ষকবৃন্দ",
    href: "/faculty",
  },
  {
    label: "শিক্ষাসামগ্রী",
    href: "/resources",
  },
  {
    label: "যোগাযোগ",
    href: "/contact",
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#1a3a5c] text-white">

      {/* Main Footer */}
      <div className="mx-auto max-w-[1500px] px-4 py-10 lg:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1.25fr]">

          {/* Department */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white p-1.5">
                <img
                  src="/images/branding/igc-logo.png"
                  alt="Ishwardi Government College"
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  রসায়ন বিভাগ
                </h2>

                <p className="text-sm text-white/70">
                  ঈশ্বরদী সরকারি কলেজ
                </p>
              </div>
            </div>

            <p className="max-w-md text-sm leading-7 text-white/75">
              ঈশ্বরদী সরকারি কলেজের রসায়ন বিভাগের একাডেমিক কার্যক্রম,
              শিক্ষকবৃন্দ, নোটিশ, পাঠ্যসূচি, শিক্ষাসামগ্রী, গবেষণা ও
              বিভাগীয় বিভিন্ন তথ্যের একটি সমন্বিত তথ্যকেন্দ্র।
            </p>

            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <span className="text-base font-bold" aria-hidden="true">
                  f
                </span>
              </a>
            </div>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="mb-4 border-l-4 border-[#4caf50] pl-3 text-base font-bold">
              গুরুত্বপূর্ণ লিংক
            </h3>

            <ul className="space-y-2.5">
              {importantLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-sm text-white/75 transition hover:text-white"
                  >
                    <ExternalLink
                      size={13}
                      className="text-[#81c784]"
                    />

                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 border-l-4 border-[#4caf50] pl-3 text-base font-bold">
              দ্রুত লিংক
            </h3>

            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/75 transition hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 border-l-4 border-[#4caf50] pl-3 text-base font-bold">
              যোগাযোগ
            </h3>

            <div className="space-y-4 text-sm text-white/75">

              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-[#81c784]"
                />

                <p className="leading-6">
                  ঈশ্বরদী সরকারি কলেজ
                  <br />
                  ঈশ্বরদী, পাবনা, বাংলাদেশ
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  size={17}
                  className="shrink-0 text-[#81c784]"
                />

                <span>
                  কলেজ অফিসের যোগাযোগ নম্বর
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Mail
                  size={17}
                  className="shrink-0 text-[#81c784]"
                />

                <span className="break-all">
                  বিভাগীয় ই-মেইল
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-[#152f4a]">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-2 px-4 py-4 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between lg:px-6">

          <p>
            © {new Date().getFullYear()} রসায়ন বিভাগ,
            ঈশ্বরদী সরকারি কলেজ। সর্বস্বত্ব সংরক্ষিত।
          </p>

          <p>
            বিভাগীয় তথ্য ও শিক্ষার্থীদের সহায়তার জন্য নির্মিত
          </p>

        </div>
      </div>

    </footer>
  );
}