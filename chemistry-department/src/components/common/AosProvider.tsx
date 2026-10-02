"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // AOS এর স্টাইল গ্লোবালি যুক্ত করা হলো

export default function AosProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    AOS.init({
      duration: 800,     // অ্যানিমেশন কত মিলি-সেকেন্ড চলবে
      once: true,        // স্ক্রল করে নিচে নামলে অ্যানিমেশন শুধু একবারই হবে
      easing: "ease-out-cubic", // স্মুথ মোশনের জন্য টাইমিং ফাংশন
      offset: 50,        // স্ক্রিন থেকে কতটা দূরত্বে অ্যানিমেশন ট্রিগার হবে
    });
  }, []);

  return <>{children}</>;
}
