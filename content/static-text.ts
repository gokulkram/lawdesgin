// SEED DATA ONLY - see content/services/index.ts. The editable text of the hand-built pages, as it was
// when it moved into the database (`npm run content:import -- --static-text`). Layout, icons and the
// links the code depends on stay in components/static-pages/; the field list is lib/admin/static-model.ts.
// Inline text supports **bold** and [link text](/path), like the rest of the content.

type Block = { p: string } | { ul: string[] } | { ol: string[] } | { callout: string };
type Section = { heading: string; blocks: Block[] };
type Hero = { title: string; text: string };
type Cta = { eyebrow: string; title: string; text: string; button: string };

export type HomeText = {
  hero: { badge: string; titleStart: string; titleAccent: string; titleEnd: string; text: string; button: string; formTitle: string; formText: string };
  intro: { eyebrow: string; title: string; text: string };
  injury: { title: string; text: string; button: string };
  death: { eyebrow: string; title: string; text: string; checklist: string[]; promise: string; button: string };
  process: { eyebrow: string; title: string; steps: { title: string; text: string }[] };
  cta: Cta;
};

export type AboutText = {
  hero: Hero;
  story: { eyebrow: string; title: string; paragraphs: string[]; tagStrong: string; tagText: string };
  values: { eyebrow: string; title: string; items: { title: string; text: string }[] };
  cta: Cta;
};

export type ContactText = {
  hero: Hero;
  form: { eyebrow: string; title: string; text: string };
  sidebar: { title: string; text: string; emailLabel: string; visitText: string };
};

export type LegalText = { hero: Hero; updated?: string; body: Section[] };

export type WrongfulDeathText = {
  hero: Hero;
  intro: string;
  body: Section[];
  casesTitle: string;
  guidesTitle: string;
  sidebar: { title: string; text: string; button: string; callText: string; statsTitle: string };
  cta: Cta;
};

export type PracticeAreasText = {
  hero: Hero;
  groupIntros: { intro: string }[];
  overviewSummary: string;
  moreLabel: string;
  notListed: { title: string; text: string };
  cta: Cta;
};

export type ResourcesText = { hero: Hero; moreLabel: string; cta: Cta };
export type HeroOnlyText = { hero: Hero };
export type AttorneysText = { hero: Hero; cta: Cta };

const HOME: HomeText = {
  hero: {
    badge: "★ Trusted California personal injury & wrongful death advocates",
    titleStart: "When the worst happens, ",
    titleAccent: "you deserve answers",
    titleEnd: " - and justice.",
    text: "We stand with California families after a wrongful death or serious injury. No fee unless we win.",
    button: "Get a Free Case Review",
    formTitle: "Free, confidential case review",
    formText: "Tell us what happened. We respond within one hour, 24/7.",
  },
  intro: {
    eyebrow: "What We Do",
    title: "Personal injury is all we do - and we do it well",
    text: "From catastrophic accidents to the loss of a loved one, we handle the legal fight so you can focus on healing. Every case is led by a senior attorney.",
  },
  injury: {
    title: "Personal Injury",
    text: "Serious-injury cases of every kind. We take on insurers and corporations to recover everything you’re owed.",
    button: "See all practice areas →",
  },
  death: {
    eyebrow: "Our Focus",
    title: "Wrongful Death",
    text: "When negligence takes a loved one, we protect your family’s rights from day one.",
    checklist: [
      "**We investigate fully** - preserving evidence before it disappears.",
      "**We value the whole loss** - income, support, guidance, and companionship.",
      "**We handle everything** - so your family can focus on each other.",
    ],
    promise: "**You don’t pay** unless we win your case.",
    button: "Understand your rights →",
  },
  process: {
    eyebrow: "How It Works",
    title: "A clear path forward, from day one",
    steps: [
      { title: "Free consultation", text: "Tell us what happened. We listen, answer your questions, and explain your options - at no cost." },
      { title: "Investigation", text: "We gather evidence, consult experts, and build the strongest possible case on your behalf." },
      { title: "Negotiation", text: "We demand full and fair compensation - and we’re not afraid to reject a lowball offer." },
      { title: "Trial, if needed", text: "If insurers won’t be fair, our trial attorneys are ready to take your case to a jury." },
    ],
  },
  cta: {
    eyebrow: "No Fee Unless We Win",
    title: "Talk to a California personal injury attorney today",
    text: "The consultation is free, the call is confidential, and there’s no obligation. The sooner you reach out, the sooner we can protect your rights.",
    button: "Start My Free Case Review",
  },
};

const ABOUT: AboutText = {
  hero: {
    title: "About California Law",
    text: "We built this firm around a single belief: injured people and grieving families deserve an advocate who treats their case like it’s the only one that matters.",
  },
  story: {
    eyebrow: "Our Story",
    title: "Big-firm results, with the care of people who know you",
    paragraphs: [
      "California Law was founded by trial attorneys who grew tired of watching insurance companies take advantage of people at their lowest moments. We set out to build something different: a firm with the resources to take on any opponent, and the heart to treat every client like family.",
      "Today, from six offices across California, we focus our practice on personal injury and wrongful death - because that focus is what produces results. We don’t dabble. We do this every day, and we do it well.",
    ],
    tagStrong: "Client-first",
    tagText: "since day one",
  },
  values: {
    eyebrow: "What Drives Us",
    title: "Our values",
    items: [
      { title: "Compassion", text: "We meet every client with patience and respect. You’ll never feel like a case number here." },
      { title: "Relentlessness", text: "We prepare every case as if it will go to trial - because that’s what gets results." },
      { title: "Transparency", text: "Plain language, honest answers, and no surprises. You’ll always know where your case stands." },
    ],
  },
  cta: { eyebrow: "No Fee Unless We Win", title: "Let’s talk about your case", text: "Meet the team that will fight for you. The first conversation is always free.", button: "Get a Free Case Review" },
};

const CONTACT: ContactText = {
  hero: {
    title: "Contact California Law",
    text: "We’re here 24/7. Call us, or send a message below and an attorney will reach out within one business hour.",
  },
  form: { eyebrow: "Send a Message", title: "Request your free case review", text: "There’s no cost and no obligation. Everything you tell us is confidential." },
  sidebar: {
    title: "Call us anytime",
    text: "Available 24 hours a day, 7 days a week for new matters.",
    emailLabel: "Prefer email?",
    visitText: "Can’t travel? We make **home and hospital visits**. Just ask when you call.",
  },
};

const PRIVACY: LegalText = {
  hero: { title: "Privacy Policy", text: "How we handle the information you share with us through this website." },
  updated: "October 2, 2026",
  body: [
    {
      heading: "Information we collect",
      blocks: [
        { p: "We collect only what you choose to send us and what is technically needed to run the site:" },
        {
          ul: [
            "**Case review requests.** When you submit a form, we receive your name, phone number, email address, the type of case, your preferred office, and anything you write about what happened.",
            "**Phone calls and emails.** If you call or email us, we receive the information you provide.",
            "**Technical data.** Like most websites, our hosting provider automatically records basic request data such as IP address, browser type, and the pages requested, for security and to keep the site running.",
            "**Accessibility settings.** If you use the accessibility menu, your choices (such as text size) are saved in your own browser’s local storage. They are not sent to us.",
          ],
        },
        { p: "This website does not use advertising cookies or third-party analytics." },
      ],
    },
    {
      heading: "How we use your information",
      blocks: [
        {
          ul: [
            "To review your inquiry and contact you about a potential case",
            "To run conflict checks before we can represent anyone",
            "To operate, secure, and improve this website",
            "To meet our legal and professional obligations",
          ],
        },
        { p: "We do not sell or share your personal information for advertising, and we do not use it to build marketing profiles." },
      ],
    },
    {
      heading: "Who we share it with",
      blocks: [{ p: "We share information only with service providers that help us run this website and receive your messages - our website host and our email delivery provider - and only as needed for that purpose. We may also disclose information when required by law or court order, or to protect our rights." }],
    },
    {
      heading: "Submitting a form does not make you a client",
      blocks: [{ p: "Contacting us does not create an attorney-client relationship. Please don’t send confidential or time-sensitive details through this website until an attorney has agreed to represent you. We nonetheless treat every inquiry as confidential." }],
    },
    {
      heading: "How long we keep it",
      blocks: [{ p: "We keep inquiry information as long as needed to evaluate your matter, maintain conflict-check records, and meet our legal and professional record-keeping obligations." }],
    },
    {
      heading: "Your California privacy rights",
      blocks: [{ p: "Depending on the circumstances, California residents may have the right to know what personal information we hold about them, to request that it be corrected or deleted, and to not be discriminated against for exercising these rights. Some information may be kept where the law or our professional duties require it. To make a request, contact us using the details below. We will need to verify your identity before responding." }],
    },
    {
      heading: "Security",
      blocks: [{ p: "We use reasonable safeguards, including encrypted (HTTPS) connections, to protect the information you send us. No method of transmission over the internet is completely secure." }],
    },
    {
      heading: "Children",
      blocks: [{ p: "This website is not directed to children under 13. If a parent or guardian is contacting us about a child’s injury, please have the adult submit the inquiry." }],
    },
    {
      heading: "Changes to this policy",
      blocks: [{ p: "We may update this policy from time to time. The date at the top shows when it was last changed." }],
    },
  ],
};

const DISCLAIMER: LegalText = {
  hero: { title: "Legal Disclaimer", text: "Please read this before relying on anything on this website." },
  body: [
    { heading: "Attorney advertising", blocks: [{ p: "This website is an advertisement for legal services under the California Rules of Professional Conduct." }] },
    { heading: "No legal advice", blocks: [{ p: "The information on this website is for general information only. It is not legal advice and is not a substitute for advice from a lawyer about your specific situation. Laws change, and how they apply depends on the facts of each case." }] },
    { heading: "No attorney-client relationship", blocks: [{ p: "Viewing this website, submitting a form, or contacting us by phone or email does not create an attorney-client relationship. An attorney-client relationship is formed only when the firm agrees in writing to represent you. Until then, please don’t send confidential information you would not want shared." }] },
    { heading: "Results and testimonials", blocks: [{ p: "Prior results do not guarantee or predict a similar outcome in any future matter. Every case is different and is decided on its own facts. Testimonials reflect individual clients’ experiences and are not a guarantee of the outcome in your case. Figures shown on this website are illustrative." }] },
    { heading: "Deadlines", blocks: [{ p: "Legal claims are subject to strict time limits. Some - such as claims against government entities - can be as short as six months. Don’t delay seeking advice because of anything you read here." }] },
    { heading: "Where we practice", blocks: [{ p: "Our attorneys are licensed to practice law in California. We do not seek to represent anyone based on this website in a state where it does not comply with that state’s laws and rules." }] },
    { heading: "Fees", blocks: [{ p: "“No fee unless we win” refers to attorney’s fees under a contingency-fee agreement. Case costs and how they are handled are explained in the written fee agreement before representation begins." }] },
    { heading: "Links to other websites", blocks: [{ p: "Links to outside websites are provided for convenience. We don’t control and aren’t responsible for their content." }] },
  ],
};

const WRONGFUL_DEATH: WrongfulDeathText = {
  hero: {
    title: "California Wrongful Death Attorneys",
    text: "When negligence takes a life, California law gives surviving families the right to seek accountability and compensation. We are here to help you carry that fight.",
  },
  intro: "Nothing can undo the loss of someone you love. But holding the responsible party accountable can bring a measure of justice - and the financial stability your family needs to move forward.",
  body: [
    {
      heading: "What is a wrongful death claim in California?",
      blocks: [
        { p: "A wrongful death claim is a civil action brought when a person dies because of the negligent, reckless, or intentional act of another. Unlike a criminal case - which punishes wrongdoing - a wrongful death claim is brought by the surviving family to recover for their losses." },
        { p: "These claims commonly arise from:" },
        { ul: ["Car, truck, and motorcycle collisions", "Medical malpractice and hospital negligence", "Workplace and construction accidents", "Defective products and dangerous premises", "Nursing home neglect and abuse"] },
      ],
    },
    {
      heading: "Who can file a claim?",
      blocks: [
        { p: "Under California Code of Civil Procedure §377.60, a wrongful death claim may be brought by the deceased person’s surviving spouse or domestic partner, children, and the children of a deceased child. If there are none, the claim belongs to those who would inherit under California’s intestate succession laws - often parents or siblings." },
        { p: "Certain dependents may also qualify, including a putative spouse, stepchildren, or parents who relied on the deceased for support, and some minors who lived in the household. Separately, the estate’s personal representative may bring a **survival action** for losses the deceased person suffered before death. We’ll help you understand exactly who has standing in your situation. [Read the full guide to who can file](/wrongful-death/who-can-file), or learn how a [survival action](/wrongful-death/survival-action) differs from a wrongful death claim." },
      ],
    },
    {
      heading: "What compensation may be available?",
      blocks: [
        { p: "While every case is different, California wrongful death and survival claims can recover:" },
        {
          ul: [
            "**Economic losses** - the financial support, household services, and benefits the deceased would have provided, plus funeral and burial expenses",
            "**Loss of love and companionship** - the comfort, care, guidance, and moral support the family has lost",
            "**Survival damages** - through the estate’s survival action: losses the deceased suffered before death, such as medical bills and lost earnings, and in cases of especially egregious conduct, punitive damages",
          ],
        },
      ],
    },
    {
      heading: "Act before time runs out",
      blocks: [
        { p: "In California, most wrongful death lawsuits must be filed within **two years of the date of death** (Code of Civil Procedure §335.1). Some deadlines are far shorter: if a city, county, state agency, or other public entity may be responsible, a written government claim generally must be filed within **six months** (Government Code §911.2). Cases involving medical negligence follow their own rules. See our guide to [wrongful death deadlines in California](/wrongful-death/statute-of-limitations)." },
        { p: "Evidence also fades quickly: vehicles are repaired, records are lost, and memories blur. The sooner we begin, the stronger your case. There is no cost to speak with us, and we never charge a fee unless we win." },
      ],
    },
    {
      heading: "How California Law helps",
      blocks: [{ p: "We handle wrongful death claims with the sensitivity they demand and the rigor they require. From the first call, a senior attorney leads your case - investigating thoroughly, retaining the right experts, and pressing for the full value of your family’s loss, at the negotiating table or before a jury." }],
    },
  ],
  casesTitle: "Wrongful death cases we handle",
  guidesTitle: "Understand your family’s rights",
  sidebar: {
    title: "Talk to us, free",
    text: "A confidential, no-obligation conversation with a wrongful death attorney - available 24/7.",
    button: "Request a Free Review",
    callText: "Or call us anytime:",
    statsTitle: "A track record families trust",
  },
  cta: {
    eyebrow: "We’re Ready to Listen",
    title: "You don’t have to face this alone",
    text: "Reach out whenever you’re ready. We’ll handle the legal burden so your family can focus on healing.",
    button: "Start My Free Case Review",
  },
};

const PRACTICE_AREAS: PracticeAreasText = {
  hero: {
    title: "California Personal Injury Practice Areas",
    text: "We represent people and families throughout California across the full range of serious injury and wrongful death matters. Whatever happened, we’ll tell you honestly how we can help.",
  },
  groupIntros: [
    { intro: "When negligence takes a life, California law lets the family hold the responsible party accountable. Start here for your rights, deadlines, and the claims we handle." },
    { intro: "Crashes on California roads - cars, trucks, motorcycles, rideshares, and the pedestrians and cyclists who share them." },
    { intro: "Injuries that change a life require accounting for a lifetime of care, lost earnings, and loss of independence." },
    { intro: "Medical negligence, elder abuse, dangerous property and products, workplace injuries, and claims against public entities." },
  ],
  overviewSummary: "The heart of our practice. When negligence takes a life, we help families seek accountability and the compensation they’re owed.",
  moreLabel: "Learn more",
  notListed: { title: "Don’t see your situation?", text: "Call us. If we can’t help, we’ll point you to someone who can - at no charge. [Contact us](/contact)" },
  cta: { eyebrow: "No Fee Unless We Win", title: "Not sure if you have a case?", text: "That’s exactly what a free consultation is for. Tell us what happened - we’ll give you a straight answer.", button: "Get a Free Case Review" },
};

const RESOURCES: ResourcesText = {
  hero: {
    title: "Guides for Injured Californians and Their Families",
    text: "Straight answers to the questions people ask us most - what to do, who pays, and what to expect. General information, not legal advice.",
  },
  moreLabel: "Read the guide",
  cta: { eyebrow: "No Fee Unless We Win", title: "Rather talk it through?", text: "A free consultation gives you answers about your specific situation - no cost and no obligation.", button: "Get a Free Case Review" },
};

const SITE_MAP: HeroOnlyText = { hero: { title: "Site Map", text: "Every page on this website, in one place." } };

const ATTORNEYS: AttorneysText = {
  hero: {
    title: "Our Attorneys",
    text: "The people who will handle your case. Every attorney is licensed by the State Bar of California - follow the license number to the official record.",
  },
  cta: { eyebrow: "No Fee Unless We Win", title: "Talk to our team", text: "The consultation is free, the call is confidential, and there’s no obligation.", button: "Get a Free Case Review" },
};

export const STATIC_TEXT: Record<string, object> = {
  "/": HOME,
  "/about": ABOUT,
  "/contact": CONTACT,
  "/privacy": PRIVACY,
  "/disclaimer": DISCLAIMER,
  "/wrongful-death": WRONGFUL_DEATH,
  "/practice-areas": PRACTICE_AREAS,
  "/resources": RESOURCES,
  "/site-map": SITE_MAP,
  "/attorneys": ATTORNEYS,
};
