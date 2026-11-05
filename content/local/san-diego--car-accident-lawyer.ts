import type { ServiceContent } from "@/content/types";

const page: ServiceContent = {
  slug: "/san-diego/car-accident-lawyer",
  group: "Vehicle Accidents",
  name: "Car Accidents",
  title: "San Diego Car Accident Lawyer",
  description:
    "Hurt in a San Diego car crash? How to get your SDPD or CHP report, claims against the City, County or MTS, and where your case is filed. Free consultation.",
  h1: "San Diego Car Accident Lawyer",
  heroText:
    "Whether the crash happened on I-5, I-805, I-15 or a city street, we help injured drivers, passengers and families across San Diego County - with no fee unless we win.",
  summary: "Car crashes on San Diego County roads - SDPD and CHP reports, claims against local agencies, and cases in San Diego Superior Court.",
  intro:
    "If you were hurt in a car accident in San Diego County, the first practical questions are local ones: which agency wrote the collision report and how you get it, whether a public agency such as the City of San Diego, the County or MTS is involved, and where a lawsuit would be filed. California law sets the rules - generally **two years** to sue the at fault driver and only **six months** to file a claim against a public entity - but San Diego’s police, CHP offices and courts decide the steps. This page walks through them. For the general law on fault, insurance and compensation, see our [California car accident lawyer page](/car-accident-lawyer).",
  steps: {
    heading: "What to do after a car accident in San Diego",
    items: [
      { title: "Call 911 if anyone is hurt", text: "The San Diego Police Department responds to injury crashes and to hit and runs with injuries or suspect leads. On a freeway, the California Highway Patrol responds. Get checked by a doctor even if you feel fine." },
      { title: "Exchange information", text: "Names, addresses, driver’s license numbers, insurance, vehicle owner and plate number. SDPD lists exactly what to collect for property damage only crashes, where officers may not come out." },
      { title: "Note the exact location", text: "Freeway, direction, nearest exit or cross street. It decides whether the report comes from SDPD, another city’s police or CHP - and whether a public agency could be responsible for the road." },
      { title: "Report to the DMV within 10 days", text: "California requires an SR-1 report if anyone was injured or killed, or property damage is over $1,000 (Veh. Code §16000) - even if police wrote a report." },
      { title: "Request the collision report", text: "Allow a few business days, then request it from the agency that took it (details below)." },
      { title: "Watch the six month clock", text: "If a city or county vehicle, an MTS bus or trolley, or a dangerous road condition was involved, a written government claim is usually due within six months." },
    ],
  },
  sections: [
    {
      heading: "Where crashes happen in San Diego County",
      blocks: [
        { p: "San Diego County’s freeways carry commuters, border traffic, a large military community and visitors at the same time. In North County, CHP’s Oceanside Area patrols **I-5** along the coast, **I-15** inland, **SR-78** and **SR-76**. In East County, the El Cajon Area covers **I-8**, **SR-125**, **SR-52**, **SR-67**, **SR-94** and backcountry routes such as **SR-79** and **SR-188**. In the south, **SR-905** links the Otay Mesa border crossing with I-5 and the metro area, with direct connectors to **I-805**." },
        { p: "Local conditions shape the evidence in these cases: merges at freeway to freeway connectors, stop and go traffic approaching the border crossings, and long stretches of two lane state route in the backcountry. What matters is often traffic camera or dashcam footage and the exact lane, direction and exit where the crash happened - details worth writing down before you leave the scene." },
      ],
    },
    {
      heading: "Getting your collision report: SDPD or CHP",
      blocks: [
        { p: "Who wrote the report depends on where the crash happened:" },
        {
          ul: [
            "**City streets in San Diego** - the **San Diego Police Department**. SDPD responds only to injury crashes and hit and runs with injuries or suspect leads; for property damage only crashes, drivers exchange information themselves. Allow three to 10 business days, then request the report online through LexisNexis eCrash or in person at the SDPD Records Division, 1401 Broadway. See SDPD’s [get a police report page](https://www.sandiego.gov/police/services/get-police-report). Drivers, injured passengers, insurers and a driver’s employer can generally get a copy.",
            "**Freeways and unincorporated roads** - the **California Highway Patrol**. SDPD itself directs freeway incidents to CHP. In San Diego County, CHP’s **San Diego Area** covers freeways in San Diego, Chula Vista, National City and Coronado plus unincorporated communities such as Bonita and Otay Mesa; the **Oceanside Area** patrols I-5, I-15, SR-78 and SR-76 and county roads in places like Rancho Santa Fe, Bonsall, Fallbrook and Valley Center; and the **El Cajon Area** covers I-8, SR-125, SR-52, SR-67, SR-94 and other East County routes and backcountry roads. Request a CHP report through CHP’s online Crash Portal, or with form CHP 190 by mail or in person at a CHP Area office. See CHP’s [request a crash report page](https://www.chp.ca.gov/traffic/request-a-crash-report).",
            "**Other cities** (Chula Vista, Oceanside, Escondido and so on) - the report comes from the law enforcement agency that responded. Ask the officer at the scene for the agency name and report number.",
          ],
        },
      ],
    },
    {
      heading: "When a public agency is involved",
      blocks: [
        { p: "Some San Diego crashes involve a government defendant: a City of San Diego or County vehicle, an MTS bus or trolley, an NCTD BREEZE bus, or a dangerous road condition such as a broken signal, missing sign or poorly designed intersection. A public entity can be liable for a dangerous condition of its property under Gov. Code §835, but the claim process is different and much faster than an ordinary insurance claim:" },
        {
          ul: [
            "**City of San Diego** - Risk Management Department, through the online Public Liability Claims Portal or the RM-9 paper form ([city claims page](https://www.sandiego.gov/riskmanagement/services/liability)).",
            "**County of San Diego** - County Counsel’s Claims and Investigation Division, Claim Form CD-1, by mail or in person ([county claims page](https://www.sandiegocounty.gov/content/sdc/CountyCounsel/claims.html)). County roads in unincorporated areas fall here.",
            "**MTS** - the MTS Claims Administrator, on MTS’s form ([MTS Policy 51](https://www.sdmts.com/sites/default/files/POLICY.51.CLAIMS%20AGAINST%20MTS%20SDTC%20OR%20SDTI.pdf)).",
            "**State highways (Caltrans District 11)** - the Department of General Services’ Government Claims Program ([DGS](https://www.dgs.ca.gov/ORIM/File-a-Claim)).",
          ],
        },
        { callout: "**Six months, not two years.** A claim for injury or vehicle damage against a public entity generally must be presented within **six months** of the crash (Gov. Code §911.2). Miss it and you may lose the right to sue. See our [government claims page](/government-claims-lawyer)." },
      ],
    },
    {
      heading: "California law in brief",
      blocks: [
        { p: "Most car accident claims are negligence claims. California uses **pure comparative fault**: you can recover even if you were partly to blame, with your award reduced by your share of fault. Every driver must carry at least $30,000 per person and $60,000 per accident in bodily injury coverage (Veh. Code §16056), which often isn’t enough after a serious crash - your own uninsured/underinsured motorist coverage may fill the gap. A lawsuit against the at fault driver generally must be filed within **two years** (CCP §335.1). Our [statewide car accident page](/car-accident-lawyer) covers fault, insurance and damages in detail." },
      ],
    },
    {
      heading: "Where a San Diego car accident case is filed",
      blocks: [
        { p: "If the case doesn’t settle, it is filed in the **Superior Court of California, County of San Diego**. Civil cases from central San Diego, East County and South County are filed at the **Hall of Justice**, 330 West Broadway; North County cases may be filed at the **North County Regional Center** in Vista. The location generally depends on where the defendant lives or does business, or where the crash happened. Our [San Diego office page](/san-diego) has the court details." },
        { p: "We offer home and hospital visits anywhere in San Diego County, a free consultation, and a contingency fee - no attorney’s fee unless we win." },
      ],
    },
  ],
  faqs: [
    { q: "Will SDPD come to my car accident?", a: "SDPD says it responds to injury crashes and to hit and runs where someone is hurt or there are leads on a suspect. For property damage only crashes, drivers exchange information. Freeway crashes are handled by the California Highway Patrol." },
    { q: "How do I get a San Diego police collision report?", a: "Wait three to 10 business days, then request it through LexisNexis eCrash online or in person at the SDPD Records Division at 1401 Broadway. Drivers, injured passengers, insurers and a driver’s employer can generally get a copy." },
    { q: "My crash was on I-5 (or I-8, I-15, I-805). Who has the report?", a: "The California Highway Patrol. Depending on the location, it will be CHP’s San Diego, Oceanside or El Cajon Area office. You can request it through CHP’s online Crash Portal or with form CHP 190." },
    { q: "I was hit by an MTS bus or trolley. What’s different?", a: "MTS is a public agency, so you generally must present a written claim within six months before you can sue. MTS’s claims policy requires claims to go to its Claims Administrator on its form." },
    { q: "Can I sue the City of San Diego for a dangerous road?", a: "Possibly. A public entity can be liable for a dangerous condition of its property if it caused a foreseeable injury and the city created it or had notice in time to fix it. The first step is a claim with the City’s Risk Management Department, usually within six months." },
    { q: "Where would my lawsuit be filed?", a: "In San Diego Superior Court - at the Hall of Justice downtown for central, East County and South County cases, or at the North County Regional Center in Vista for North County cases." },
  ],
  related: ["/car-accident-lawyer", "/san-diego", "/san-diego/truck-accident-lawyer", "/government-claims-lawyer"],
  updated: "2026-10-02",
  location: "san-diego",
};

export default page;
