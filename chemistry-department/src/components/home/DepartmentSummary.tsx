"use client";

import React from 'react';
import CountUp from '../common/CountUp';

export default function DepartmentSummary() {
  const stats = [
    { id: 1, end: 45, label: "অনুষদ সদস্য", delay: "100" },
    { id: 2, end: 1200, label: "নিয়মিত শিক্ষার্থী", delay: "200" },
    { id: 3, end: 85, label: "গবেষণা প্রবন্ধ", delay: "300" },
    { id: 4, end: 12, label: "গবেষণাগার", delay: "400" },
  ];

  return (
    <section className="bg-slate-950 text-white py-10 relative overflow-hidden">
      <div className="container mx-auto px-5 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12 sm:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.id}
              data-aos="fade-up"
              data-aos-delay={stat.delay}
              className="relative p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl hover:border-teal-500/50 hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] hover:-translate-y-2 transition-all duration-500 group overflow-hidden"
            >
              {/* মডার্ন ব্যাকগ্রাউন্ড হোভার লাইট */}
              <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-shimmer" />
              
              <div className="text-4xl md:text-5xl font-extrabold text-teal-400 mb-3 tracking-tight">
                <CountUp to={stat.end} duration={2.5} />+
              </div>
              <p className="text-slate-400 font-medium text-sm md:text-base group-hover:text-white transition-colors">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
