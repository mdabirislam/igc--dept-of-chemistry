import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="hero-banner">

      <img
        src="/images/banners/campus-01.jpg"
        alt="ঈশ্বরদী সরকারি কলেজ"
        className="hero-image"
      />

      <div className="hero-overlay" />

      <div className="hero-content site-container">
        <div className="hero-text">

          <h1>রসায়ন বিভাগ</h1>

          <h2>ঈশ্বরদী সরকারি কলেজ</h2>

          <p>
            জ্ঞান, অভিজ্ঞতা, চিন্তা ও পরীক্ষণের সমন্বয়ে
            রসায়নের গভীরতর জ্ঞান অর্জন এবং আধুনিক
            শিক্ষার মাধ্যমে দক্ষ ও মেধাবী শিক্ষার্থী
            গড়ে তোলাই আমাদের লক্ষ্য।
          </p>

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