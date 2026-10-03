"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const bannerImages = [
  "/images/banners/batch-21-22.jpeg",
  "/images/banners/teachers.jpeg",
  "/images/banners/campus-01.jpg",
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
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

      {/* ব্যানার টেক্সট কনটেন্ট */}
      <div className="container mx-auto h-full px-6 flex flex-col justify-center items-center text-center relative z-10 text-white">
        
        {/* ফিক্সড হেডার: py-2, overflow-visible এবং leading-relaxed দিয়ে ই-কারের মাথা কাটা সমস্যা দূর করা হয়েছে */}
        <h1 className="text-4xl md:text-6xl font-black mb-4 py-2 overflow-visible leading-relaxed md:leading-normal animate-fade-in-up bg-clip-text text-transparent bg-gradient-to-r from-white via-teal-100 to-teal-400">
          রসায়ন বিভাগ
        </h1>
        
        <p className="text-base md:text-xl mb-10 max-w-2xl mx-auto text-slate-200 font-medium animate-fade-in-up [animation-delay:200ms] leading-relaxed">
          সুশৃঙ্খল একাডেমিক পরিবেশ এবং শিক্ষকদের আন্তরিক সহায়তায় রসায়ন বিভাগের শিক্ষার্থীদের একটি সুন্দর ও উজ্জ্বল ভবিষ্যৎ গড়ার অগ্রযাত্রা।
        </p>
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up [animation-delay:400ms]">
          <button 
            type="button"
            className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3.5 rounded-xl border border-white/20 hover:border-white/40 shadow-sm backdrop-blur-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <a href="/about/overview">বিভাগ সম্পর্কে জানুন</a>
          </button>
        </div>

      </div>
    </section>
  );
}
