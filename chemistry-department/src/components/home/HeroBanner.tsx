"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const bannerImages = [
  "/images/banners/batch-21-22.jpeg",
    "/images/banners/teachers.jpeg",
  "/images/banners/campus-01.jpg",
  
  // "/images/background/bg-1.jpg",
  // "/images/background/bg-2.jpg",
  // "/images/background/bg-3.jpg",
  // "/images/background/bg-4.jpg"
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000); // প্রতি ৫ সেকেন্ড পর পর ছবি পরিবর্তন হবে
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[550px] w-full overflow-hidden bg-slate-900">
      {/* মডার্ন সিনেমাটিক ব্যাকগ্রাউন্ড স্লাইডার */}
      {bannerImages.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
            index === currentSlide ? "opacity-40 scale-100" : "opacity-0 scale-110"
          }`}
        >
          <Image
            src={src}
            alt="Chemistry Department Banner"
            fill
            priority={index === 0}
            className="object-cover"
          />
        </div>
      ))}

      {/* গ্রেডিয়েন্ট ওভারলে */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

      {/* ব্যানার টেক্সট কনটেন্ট (খাঁটি বাংলা) */}
      <div className="container mx-auto h-full px-6 flex flex-col justify-center items-center text-center relative z-10 text-white">
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight animate-fade-in-up bg-clip-text text-transparent bg-gradient-to-r from-white via-teal-100 to-teal-400">
          রসায়ন বিভাগ
        </h1>
        
        <p className="text-base md:text-xl mb-10 max-w-2xl mx-auto text-slate-200 font-medium animate-fade-in-up [animation-delay:200ms] leading-relaxed">
          আণবিক বিজ্ঞান ও গবেষণার দিগন্ত উন্মোচন, নতুন উদ্ভাবনের প্রেরণা এবং আগামী দিনের বিজ্ঞানী গড়ার প্রত্যয়।
        </p>

        <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up [animation-delay:400ms]">
          <button className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-[0_0_30px_rgba(20,184,166,0.4)] hover:scale-105 active:scale-95 transition-all duration-300">
            বিভাগ সম্পর্কে জানুন
            {/* <span>➜</span> */}
          </button>
        </div>
      </div>
    </section>
  );
}
