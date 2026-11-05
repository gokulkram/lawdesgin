import type { LocationContent } from "@/content/types";

const page: LocationContent = {
  slug: "/sacramento",
  officeId: "sacramento",
  name: "Sacramento",
  title: "Sacramento Personal Injury Lawyer",
  description:
    "Injured in Sacramento County? Learn where to get your crash report, how to file a claim against the city, county or SacRT, and where cases are heard.",
  h1: "Sacramento Personal Injury Lawyer",
  heroText:
    "Whether you were hurt on US-50, on a SacRT light rail platform or on a neighborhood street in Carmichael or Elk Grove, we help injured people in Sacramento County and their families recover what they’re owed - with no fee unless we win.",
  summary: "Serving Sacramento County - freeway and street crashes, SacRT and government claims, wrongful death - with home and hospital visits.",
  intro:
    "If someone else’s carelessness injured you in Sacramento County, you may be entitled to compensation for medical care, lost income and pain. Sacramento cases have a few local features worth knowing up front: large parts of the county are unincorporated, so the CHP - not a city police department - often writes the crash report; the city, the county and SacRT each take government claims at a different office; and since April 2026 civil cases are heard in a new courthouse in the Sacramento Railyards. Lawsuits generally must be filed within **two years**, but claims against a public entity are usually due within **six months**.",
  areasServed: [
    "Sacramento",
    "Elk Grove",
    "Citrus Heights",
    "Folsom",
    "Rancho Cordova",
    "Arden Arcade",
    "Carmichael",
    "Fair Oaks",
    "Orangevale",
    "Antelope",
    "North Highlands",
    "Rio Linda",
    "Vineyard",
  ],
  courts: [
    {
      name: "Superior Court of California, County of Sacramento - Tani G. Cantil-Sakauye Sacramento County Courthouse",
      address: "500 G Street, Sacramento, CA 95814",
      url: "https://www.saccourt.ca.gov/",
      note: "The new courthouse in the Sacramento Railyards. As of April 13, 2026, matters formerly heard at the Gordon D. Schaber Courthouse and the Hall of Justice moved here; civil filings are made at the Civil Front Counter on the 2nd floor.",
    },
  ],
  sections: [
    {
      heading: "Personal injury in Sacramento County: what’s distinctive locally",
      blocks: [
        { p: "Sacramento sits where several of Northern California’s main highways meet. Interstate 5 runs north–south through the city toward Elk Grove, Interstate 80 enters from Yolo County, US Highway 50 heads east from its interchange with I-5, and State Route 99 connects to US-50 inside the city. Interchanges like the I-5/US-50 and SR-99/US-50 connectors combine fast through traffic, commuters and trucks - and Caltrans has run long term widening and rehabilitation work on [US-50](https://dot.ca.gov/caltrans-near-me/district-3/d3-news/d3-news-release-26-056) and the [I-5 corridor](https://dot.ca.gov/caltrans-near-me/district-3/d3-projects/d3-sac-5-corridor-enhance-0h10u), with ramp and connector closures that change traffic patterns overnight." },
        { p: "State highways here are managed by [Caltrans District 3](https://dot.ca.gov/caltrans-near-me/district-3), whose service area includes Sacramento County and ten other Northern California counties. If a defect in a State highway - a missing barrier, a confusing work zone layout, poor drainage - contributed to your crash, the State may share responsibility (see [claims against government entities](/government-claims-lawyer))." },
        { p: "Sacramento is also served by [SacRT](https://www.sacrt.com/about-us/), which runs buses and the Gold and Blue light rail lines across a service area that includes Citrus Heights, Elk Grove, Folsom and Rancho Cordova. Collisions with light rail trains, falls at platforms, and bus crashes all lead to claims against SacRT itself - a separate public agency from the city or county." },
      ],
    },
    {
      heading: "Getting your collision report: city police or CHP?",
      blocks: [
        { p: "Who writes the report depends on where the crash happened:" },
        {
          ul: [
            "**Inside the City of Sacramento** - the Sacramento Police Department. Its [request a police report page](https://www.cityofsacramento.gov/police/police-services/request-a-police-report) explains that collision reports written by SPD officers may be bought online, usually five to ten days after the crash, or requested by mail or in person at the Public Safety Center on Freeport Boulevard.",
            "**On freeways and in unincorporated communities** such as Arden Arcade, Carmichael, Fair Oaks, Orangevale, Antelope, North Highlands and Rio Linda - the California Highway Patrol, which has traffic jurisdiction on public roads in unincorporated areas. Request the report with form [CHP 190](https://www.chp.ca.gov/notify-chp/collision-report-chp-190/) from the CHP office that handled it.",
            "**In Elk Grove, Citrus Heights, Folsom or Rancho Cordova** - the police agency serving that city.",
          ],
        },
        { p: "Separately, you must report the crash to the DMV on form SR-1 within 10 days if anyone was injured. Our [car accident page](/car-accident-lawyer) covers the rest of the checklist, and our [truck accident page](/truck-accident-lawyer) explains what to preserve after a crash with a big rig on I-5 or I-80." },
      ],
    },
    {
      heading: "Claims against the city, the county, SacRT and the State",
      blocks: [
        { p: "Before suing a public entity, you generally must file a written claim within **six months** of the injury (Government Code §911.2). In Sacramento each entity has its own procedure:" },
        {
          ul: [
            "**City of Sacramento** - injury claims must be filed with the Office of the City Clerk at New City Hall on I Street, using the city’s claim form (see the [City of Sacramento claim instructions](https://www.cityofsacramento.gov/content/dam/portal/hr/Divisions/Risk/RiskClaimForm/HowToFileAClaim.pdf)). The city’s instructions say the City Clerk is the **only** office that accepts claims - not the City Attorney or Risk Management.",
            "**County of Sacramento** - claims are submitted by mail or in person to the Clerk of the Board of Supervisors; electronic submissions are not allowed. Instructions and the form are on the county’s [filing a claim page](https://personnel.saccounty.gov/us/en/risk-management/filing-a-claim-against-sacramento-county.html).",
            "**SacRT** - claims go to SacRT’s Clerk to the Board by mail or by appointment, never by fax or email. See SacRT’s [claim instructions](https://www.sacrt.com/wp-content/uploads/Instructions-for-Submitting-a-Government-Tort-Claim-REVISED_9-19-23.pdf).",
            "**Caltrans and other State agencies** - Caltrans’ [damage claim page](https://dot.ca.gov/online-services/submit-damage-claim) explains that larger claims go to the State’s Government Claims Program.",
          ],
        },
        { callout: "**Filing with the wrong office can cost you the claim.** A crash involving a SacRT bus at a county maintained intersection may require separate claims to SacRT and the county. If the six month window has passed, a late claim application may still be possible in limited situations - for example, if the injured person was a minor - so call before giving up." },
      ],
    },
    {
      heading: "Where a Sacramento injury case is heard",
      blocks: [
        { p: "Injury lawsuits are generally filed in the Superior Court of the county where the injury happened or where a defendant lives. For Sacramento County, civil cases now go to the Tani G. Cantil-Sakauye Sacramento County Courthouse at 500 G Street in the Railyards, which opened in April 2026 and replaced the court’s former civil locations. If you received paperwork listing the Gordon D. Schaber Courthouse or the Hall of Justice, check the court’s website - those matters have moved." },
        { p: "A crash just across the county line - for example in West Sacramento, which is in Yolo County - would generally be filed in that county instead. We can explain which court applies to your case. If a family member was killed, see [California wrongful death law](/wrongful-death) for who can bring a claim." },
      ],
    },
    {
      heading: "Home and hospital visits throughout Sacramento County",
      blocks: [
        { p: "If you’re recovering at home in Elk Grove or still in a hospital downtown, we come to you - or meet by video. Our Sacramento office serves the whole county, and we make home and hospital visits anywhere in California. Consultations are free and confidential, we’re available 24/7, and there is no attorney’s fee unless we win." },
      ],
    },
  ],
  faqs: [
    { q: "Who writes the crash report if I was hit in Carmichael or Arden Arcade?", a: "These are unincorporated communities, so traffic collisions there are generally handled by the California Highway Patrol rather than a city police department. You can request the report from the CHP office that investigated using form CHP 190." },
    { q: "How do I get a Sacramento Police Department collision report?", a: "Reports written by SPD officers can usually be bought online about five to ten days after the crash, or requested by mail or in person at the Public Safety Center on Freeport Boulevard. Bring or include the report number, date, location and the people involved." },
    { q: "Where do I file a claim against the City of Sacramento?", a: "With the Office of the City Clerk at New City Hall. The city states that the City Clerk is the only office that accepts claims. Injury claims are generally due within six months." },
    { q: "I was injured on SacRT light rail. What should I do?", a: "Get medical care, report the incident, keep your ticket or pass record, and note the train, station and time. A claim against SacRT is generally due within six months and must be mailed or delivered by appointment to SacRT’s Clerk to the Board." },
    { q: "Which courthouse hears Sacramento injury cases now?", a: "The Tani G. Cantil-Sakauye Sacramento County Courthouse at 500 G Street. Civil matters moved there from the Gordon D. Schaber Courthouse and the Hall of Justice in April 2026." },
    { q: "What does it cost to talk to your Sacramento office?", a: "Nothing. Consultations are free, and we work on a contingency fee - no attorney’s fee unless we win. We can meet at your home, in the hospital, or by video." },
  ],
  updated: "2026-10-02",
};

export default page;
