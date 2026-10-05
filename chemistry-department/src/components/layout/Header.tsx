import TrackedImage from "@/components/layout/TrackedImage";

export default function Header() {
  return (
    <header className="college-header">
      <div className="college-header-inner">

        <div className="college-logo">
          <TrackedImage
            assetId="header-logo-bd"
            src="/images/branding/bd-govt-logo.png"
            alt="Bangladesh government Logo"
            width={64}
            height={64}
            priority
          />
        </div>

        <div className="college-identity">
          <h1>Department of Chemistry</h1>
          <h2>ঈশ্বরদী সরকারি কলেজ</h2>

          <p>
            College Code:3200&nbsp;&nbsp;EIIN: 125552
          </p>
        </div>

        <div className="nu-logo">
          <TrackedImage
            assetId="header-logo-igc"
            src="/images/branding/igc-logo.png"
            alt="Ishwardi Government College Logo"
            width={64}
            height={64}
            priority
          />
        </div>

      </div>
    </header>
  );
}
