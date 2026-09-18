import Image from "next/image";

export default function Header() {
  return (
    <header className="college-header">
      <div className="college-header-inner">

        <div className="college-logo">
          <Image
            src="/images/branding/bd-govt-logo.jpg"
            alt="Bangladesh government Logo"
            width={64}
            height={64}
          />
        </div>

        <div className="college-identity">
          <h1>Ishwardi Government College</h1>
          <h2>ঈশ্বরদী সরকারি কলেজ</h2>

          <p>
            College Code:3200&nbsp;&nbsp;EIIN: 125552
          </p>
        </div>

        <div className="nu-logo">
          <Image
            src="/images/branding/igc-logo.jpg"
            alt="Ishwardi Government College Logo"
            width={64}
            height={64}
          />
        </div>

      </div>
    </header>
  );
}