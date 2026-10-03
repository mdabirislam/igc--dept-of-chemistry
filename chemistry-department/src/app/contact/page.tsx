import type { Metadata } from "next";

import ContactContent from "@/components/contact/ContactContent";

export const metadata: Metadata = {
  title: "যোগাযোগ | রসায়ন বিভাগ",
};

export default function Page() {
  return <ContactContent />;
}
