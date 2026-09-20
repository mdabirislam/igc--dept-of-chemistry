import Link from "next/link";

import Header from "@/components/layout/Header";
import Navbar from "@/components/layout/Navbar";

import "./under-construction.css";

interface UnderConstructionProps {
  /** পাতার নাম, যেমন "গবেষণা ও প্রকাশনা" */
  title: string;
}

export default function UnderConstruction({
  title,
}: UnderConstructionProps) {
  return (
    <div className="uc-shell">
      <Header />
      <Navbar />

      <main className="uc-page">
        <div className="uc-card">
          <svg
            className="uc-art"
            viewBox="0 0 320 290"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <clipPath id="uc-flask-clip">
                <path d="M132 50 H188 V108 L248 222 Q262 252 232 256 H88 Q58 252 72 222 L132 108 Z" />
              </clipPath>
            </defs>

            {/* মাটির ছায়া */}
            <ellipse
              className="uc-shadow"
              cx="160"
              cy="270"
              rx="92"
              ry="8"
            />

            <g className="uc-flask">
              {/* ফ্লাস্কের কাচ */}
              <path
                className="uc-glass"
                d="M132 50 H188 V108 L248 222 Q262 252 232 256 H88 Q58 252 72 222 L132 108 Z"
              />

              {/* তরল ও ঢেউ */}
              <g clipPath="url(#uc-flask-clip)">
                <path
                  className="uc-wave uc-wave-back"
                  d="M40 168 q20 -12 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 V280 H40 Z"
                />
                <path
                  className="uc-wave uc-wave-front"
                  d="M40 176 q20 -12 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 V280 H40 Z"
                />

                <circle className="uc-bubble uc-b1" cx="128" cy="238" r="6" />
                <circle className="uc-bubble uc-b2" cx="172" cy="228" r="4" />
                <circle className="uc-bubble uc-b3" cx="204" cy="242" r="5" />
                <circle className="uc-bubble uc-b4" cx="152" cy="246" r="3" />
              </g>

              {/* কাচের ঝলক */}
              <path
                className="uc-shine"
                d="M146 64 V104"
              />
              <path
                className="uc-shine"
                d="M108 176 L96 200"
              />

              {/* মুখ */}
              <g className="uc-eyes">
                <circle className="uc-eye-white" cx="132" cy="206" r="11" />
                <circle className="uc-eye-white" cx="188" cy="206" r="11" />
                <circle className="uc-pupil" cx="134" cy="208" r="5" />
                <circle className="uc-pupil" cx="190" cy="208" r="5" />
              </g>
              <circle className="uc-cheek" cx="112" cy="226" r="7" />
              <circle className="uc-cheek" cx="208" cy="226" r="7" />
              <path
                className="uc-mouth"
                d="M144 228 Q160 244 176 228"
              />

              {/* হার্ড হ্যাট */}
              <g className="uc-hat">
                <path
                  className="uc-hat-dome"
                  d="M118 44 Q118 6 160 6 Q202 6 202 44 Z"
                />
                <rect
                  className="uc-hat-ridge"
                  x="152"
                  y="6"
                  width="16"
                  height="38"
                />
                <rect
                  className="uc-hat-brim"
                  x="108"
                  y="40"
                  width="104"
                  height="11"
                  rx="5.5"
                />
              </g>
            </g>
          </svg>

          <h1 className="uc-title">{title}</h1>

          <p className="uc-status">
            এই পাতার কাজ চলছে
            <span className="uc-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </p>

          <p className="uc-english">This page is under construction</p>

          <p className="uc-text">
            আমরা এই পাতার তথ্য সাজাচ্ছি। কিছুদিন পর আবার দেখুন।
          </p>

          <div className="uc-tape" aria-hidden="true" />

          <div className="uc-actions">
            <Link href="/" className="uc-button uc-button-primary">
              হোমে ফিরে যান
            </Link>
            <Link href="/notices" className="uc-button uc-button-outline">
              নোটিশ দেখুন
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
