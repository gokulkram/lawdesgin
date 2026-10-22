import Link from "next/link";
import Logo from "@/components/Logo";
import CookiePrefsLink from "@/components/CookiePrefsLink";
import { getContent } from "@/lib/content-store";

export default async function Footer() {
  const { firm } = await getContent();
  const social = firm.social.filter((s) => s.url);
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Link className="footer__logo" href="/" aria-label="California Law home"><Logo tone="light" /></Link>
            <p>{firm.footerAbout}</p>
          </div>
          <div>
            <h4>Practice Areas</h4>
            <ul>
              <li><Link href="/wrongful-death">Wrongful Death</Link></li>
              <li><Link href="/car-accident-lawyer">Car Accidents</Link></li>
              <li><Link href="/truck-accident-lawyer">Truck Accidents</Link></li>
              <li><Link href="/medical-malpractice-lawyer">Medical Malpractice</Link></li>
              <li><Link href="/catastrophic-injury-lawyer">Catastrophic Injury</Link></li>
              <li><Link href="/workplace-injury-lawyer">Workplace Injuries</Link></li>
              <li><Link href="/practice-areas">All Practice Areas</Link></li>
            </ul>
          </div>
          <div>
            <h4>Firm</h4>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/resources">Guides &amp; Resources</Link></li>
              <li><Link href="/#testimonials">Testimonials</Link></li>
              <li><Link href="/contact">Locations</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>Get Help Now</h4>
            <p>Available 24/7 for new matters.</p>
            <p style={{ margin: "6px 0" }}><a href={firm.phoneHref} style={{ color: "var(--gold-300)", fontWeight: 700, fontSize: "1.1rem" }}>{firm.phone}</a></p>
            <p><a href={`mailto:${firm.email}`}>{firm.email}</a></p>
            {social.length > 0 && (
              <div className="footer__social" style={{ marginTop: 16 }}>
                {social.map((s) => (
                  <a key={s.label} href={s.url} aria-label={s.label} target="_blank" rel="noopener">{s.short}</a>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="disclaimer">
          {firm.footerDisclaimer}
        </div>
        <div className="footer__bottom">
          <span>&copy; {new Date().getFullYear()} California Law. All rights reserved.</span>
          <span><Link href="/privacy">Privacy Policy</Link> &nbsp;&middot;&nbsp; <Link href="/disclaimer">Disclaimer</Link> &nbsp;&middot;&nbsp; <CookiePrefsLink /> &nbsp;&middot;&nbsp; <Link href="/site-map">Site Map</Link></span>
        </div>
      </div>
    </footer>
  );
}
