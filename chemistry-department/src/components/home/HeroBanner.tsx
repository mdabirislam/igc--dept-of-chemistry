import Link from "next/link";
import Image from "next/image";

export default function HeroBanner() {
  return (
    <section className="hero-banner">

      <Image
        src="/images/banners/campus-01.jpg"
        alt="ঈশ্বরদী সরকারি কলেজ"
        fill
        priority
        className="hero-image"
      />

      <div className="hero-overlay" />

      <div className="hero-content site-container">
        <div className="hero-text">

          <h1>রসায়ন বিভাগ</h1>

          <h2>ঈশ্বরদী সরকারি কলেজ</h2>

          <Link href="/about" className="hero-button">
            বিভাগ সম্পর্কে জানুন
            <span>➜</span>
          </Link>

        </div>
      </div>

      <div className="hero-dots">
        <span className="active" />
        <span />
        <span />
        <span />
      </div>

    </section>
  );
}