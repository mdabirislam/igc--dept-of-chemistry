"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // AOS এর স্টাইল গ্লোবালি যুক্ত করা হলো

import { SITE_READY_EVENT } from "@/lib/loadingGate";

export default function AosProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({
      duration: 800,     // অ্যানিমেশন কত মিলি-সেকেন্ড চলবে
      once: true,        // স্ক্রল করে নিচে নামলে অ্যানিমেশন শুধু একবারই হবে
      easing: "ease-out-cubic", // স্মুথ মোশনের জন্য টাইমিং ফাংশন
      offset: 50,        // স্ক্রিন থেকে কতটা দূরত্বে অ্যানিমেশন ট্রিগার হবে
      // Animations wait for the splash screen so they are not played
      // behind it. SiteLoader fires this event when it is finished.
      startEvent: SITE_READY_EVENT,
    });

    // Safety net: if the event never arrives, do not leave the page hidden.
    const fallback = setTimeout(() => {
      document.dispatchEvent(new Event(SITE_READY_EVENT));
    }, 12000);

    return () => clearTimeout(fallback);
  }, []);

  return <>{children}</>;
}
