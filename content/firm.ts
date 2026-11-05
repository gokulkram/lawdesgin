// SEED DATA ONLY - see content/services/index.ts. Firm details and trust signals as they were when they
// moved into the database (`npm run content:import -- --settings`). Edit them in the admin panel
// (Site settings).
//
// ⚠ The figures and testimonials are PLACEHOLDERS from the original design (verified: false). Before
// launch, replace each with a verified figure or an approved client review, or delete it - California
// Rules of Professional Conduct 7.1–7.2 prohibit misleading claims.
import type { Credibility, Firm } from "@/lib/admin/settings-model";

export const FIRM: Firm = {
  description: "California personal injury law firm focused on wrongful death, with six offices statewide. Free consultation, no fee unless we win.",
  phone: "(800) 400-5050",
  phoneTel: "+18004005050",
  phoneSchema: "+1-800-400-5050",
  tollFree: "(310) 920-9000",
  email: "intake@californialaw.com",
  social: [
    { label: "Facebook", short: "f", url: "" },
    { label: "LinkedIn", short: "in", url: "" },
    { label: "X", short: "x", url: "" },
  ],
  offices: [
    { id: "los-angeles", label: "Los Angeles", kind: "Main Office", street: "", locality: "Los Angeles", postalCode: "", phone: "(800) 400-5050", tel: "+18004005050", img: "/images/office-los-angeles.webp" },
    { id: "orange-county", label: "Orange County", kind: "Branch Office", street: "", locality: "Irvine", postalCode: "", phone: "(800) 400-5050", tel: "+18004005050", img: "/images/office-orange-county.webp" },
    { id: "san-diego", label: "San Diego", kind: "Branch Office", street: "", locality: "San Diego", postalCode: "", phone: "(800) 400-5050", tel: "+18004005050", img: "/images/office-san-diego.webp" },
    { id: "bay-area", label: "Bay Area", kind: "Branch Office", street: "", locality: "San Francisco", postalCode: "", phone: "(800) 400-5050", tel: "+18004005050", img: "/images/office-bay-area.webp" },
    { id: "sacramento", label: "Sacramento", kind: "Branch Office", street: "", locality: "Sacramento", postalCode: "", phone: "(800) 400-5050", tel: "+18004005050", img: "/images/office-sacramento.webp" },
    { id: "inland-empire", label: "Inland Empire", kind: "Branch Office", street: "", locality: "Riverside", postalCode: "", phone: "(800) 400-5050", tel: "+18004005050", img: "/images/office-inland-empire.webp" },
  ],
  caseTypes: ["Wrongful death", "Car / truck accident", "Medical malpractice", "Workplace injury", "Slip & fall", "Other personal injury"],
  footerAbout: "A California personal injury law firm dedicated to families and the seriously injured - with a focus on wrongful death claims. Compassionate counsel, relentless advocacy.",
  footerDisclaimer: "Attorney Advertising. The information on this website is for general informational purposes only and is not legal advice. Viewing this site or contacting the firm does not create an attorney client relationship. Prior results do not guarantee a similar outcome. Figures shown are illustrative.",
};

export const CREDIBILITY: Credibility = {
  homeStats: [
    { value: "2,000+", label: "Families helped", verified: false },
    { value: "98%", label: "Case success rate", verified: false },
    { value: "35+ yrs", label: "Combined trial experience", verified: false },
    { value: "24/7", label: "Availability", verified: true },
  ],
  wrongfulDeathStats: [
    { value: "$500M+", label: "Recovered for clients", verified: false },
    { value: "98%", label: "Case success rate", verified: false },
    { value: "35+ yrs", label: "Combined trial experience", verified: false },
    { value: "24/7", label: "Free, confidential intake", verified: true },
  ],
  testimonials: [
    {
      quote: "After we lost my husband, I couldn’t think straight. California Law handled everything with such kindness and fought harder than I ever expected. They gave my children a future.",
      initials: "MT",
      who: "Maria T.",
      kind: "Wrongful death - trucking collision",
      verified: false,
    },
    {
      quote: "The insurance company offered almost nothing. My attorney at California Law refused to settle and won a verdict that covered my surgeries and lost income. I’ll never be able to thank them enough.",
      initials: "JR",
      who: "James R.",
      kind: "Catastrophic injury - auto accident",
      verified: false,
    },
    {
      quote: "They explained every step in plain language and always returned my calls. I never felt like just a case number. Truly compassionate, truly relentless.",
      initials: "DC",
      who: "Denise & Carl W.",
      kind: "Medical malpractice",
      verified: false,
    },
  ],
};
