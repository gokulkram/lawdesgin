import type { LocationContent } from "@/content/types";

const page: LocationContent = {
  slug: "/bay-area",
  officeId: "bay-area",
  name: "Bay Area",
  title: "Bay Area Personal Injury Lawyer",
  description:
    "Hurt in San Francisco, Oakland or on the Peninsula? Our Bay Area office handles car, truck, Muni and BART injury claims. Free consultation, no win, no fee.",
  h1: "Bay Area Personal Injury Lawyer - San Francisco, East Bay & Peninsula",
  heroText:
    "From a Muni collision on Market Street to a truck crash on I-880 near the Port of Oakland, we help injured people across the Bay Area and their families pursue full compensation - with no fee unless we win.",
  summary: "Our San Francisco office serves the city, the East Bay and the Peninsula - car, transit and truck injury claims, with home and hospital visits.",
  intro:
    "If you were hurt in San Francisco, Alameda County or San Mateo County because someone else was careless, our Bay Area office can help you claim compensation for medical bills, lost income and pain. Bay Area cases have their own wrinkles: several different transit agencies - each with its own claim rules - share the same streets, bridge traffic and port trucks mix with commuters, and the county where the injury happened usually decides which courthouse hears the case. Most injury lawsuits must be filed within **two years**, but a claim against a city, county or transit agency is generally due within **six months**. Here is how injury cases work locally.",
  areasServed: [
    "San Francisco",
    "Oakland",
    "Berkeley",
    "Alameda",
    "Emeryville",
    "San Leandro",
    "Hayward",
    "Fremont",
    "Newark",
    "Daly City",
    "South San Francisco",
    "San Bruno",
    "Millbrae",
    "Burlingame",
    "San Mateo",
    "Redwood City",
    "Pacifica",
  ],
  courts: [
    {
      name: "Superior Court of California, County of San Francisco - Civic Center Courthouse",
      address: "400 McAllister Street, San Francisco, CA 94102",
      url: "https://sf.courts.ca.gov/divisions/civil-division",
      note: "Home of the court’s Civil Division; injury cases arising in San Francisco are generally filed here.",
    },
    {
      name: "Superior Court of California, County of Alameda - René C. Davidson Courthouse",
      address: "1225 Fallon Street, Oakland, CA 94612",
      url: "https://www.alameda.courts.ca.gov/locations",
      note: "Civil filings for Alameda County (East Bay) cases are presented here.",
    },
    {
      name: "Superior Court of California, County of San Mateo - Southern Branch: Hall of Justice and Records",
      address: "400 County Center, Redwood City, CA 94063",
      url: "https://sanmateo.courts.ca.gov/divisions/civil-division",
      note: "Civil Division clerk’s office for Peninsula cases.",
    },
  ],
  sections: [
    {
      heading: "Personal injury in the Bay Area: what makes local cases different",
      blocks: [
        { p: "The Bay Area’s geography shapes how people get hurt here. Interstate 80 carries traffic across the [San Francisco–Oakland Bay Bridge](https://dot.ca.gov/caltrans-near-me/district-4/d4-news/2026-03-04-sfobb-west-span-rehabilitation-project), and Caltrans regularly schedules overnight lane closures on the bridge for maintenance - work zones where lane changes and merges cause collisions. On the East Bay side, the [Port of Oakland](https://www.portofoakland.com/) seaport sits between I-80 and I-880, and the port describes I-80, I-580 and I-880 as freight routes in and out of the region. That puts heavy trucks alongside commuters every day; see our [truck accident page](/truck-accident-lawyer) for how those claims work." },
        { p: "Transit is the other big difference. In a single trip, a rider might use a Muni bus or light rail car, a BART train and an AC Transit bus - three separate public entities. If one of their vehicles, drivers or stations caused your injury, the claim goes to that specific agency, on its own form, within the six month deadline (see below)." },
        { p: "State highways in the nine Bay Area counties are run by [Caltrans District 4](https://dot.ca.gov/caltrans-near-me/district-4/d4-programs/d4-public-affairs), based in Oakland. When a dangerous highway condition - a broken guardrail, a missing sign, a poorly designed merge - contributes to a crash, the State can be responsible under the rules for [claims against government entities](/government-claims-lawyer)." },
      ],
    },
    {
      heading: "Getting the collision report in San Francisco",
      blocks: [
        { p: "Inside San Francisco, city streets are covered by the San Francisco Police Department. According to the [SFPD’s traffic collision report page](https://www.sanfranciscopolice.org/traffic-collision-report), officers prepare full traffic collision reports only for hit and run, drunk driving and injury crashes, and you should allow at least five business days before requesting a copy. Reports can be requested through the [SFPD police reports page](https://www.sanfranciscopolice.org/get-service/police-reports) online, by mail, or in person at the Report Management Section." },
        { p: "Crashes on freeways, including the Bay Bridge, are generally investigated by the California Highway Patrol. A driver, passenger or vehicle owner can request a CHP report with form [CHP 190](https://www.chp.ca.gov/notify-chp/collision-report-chp-190/) from the CHP office that took the report. In Oakland, the East Bay and the Peninsula, the city police department or CHP will have the report, depending on where the crash happened." },
        { p: "Whoever wrote the report, remember the separate requirement to file an SR-1 with the DMV within 10 days if anyone was hurt. Our [car accident page](/car-accident-lawyer) explains the full checklist." },
      ],
    },
    {
      heading: "Claims against Muni, BART, AC Transit and local governments",
      blocks: [
        { p: "Before you can sue a public entity in California, you generally must file a written government claim within **six months** of the injury (Government Code §911.2). In the Bay Area, where you file depends on who was involved:" },
        {
          ul: [
            "**Muni or a San Francisco city department** - Muni is part of the San Francisco Municipal Transportation Agency, a City department, so injury claims are filed against the City and County of San Francisco. The [City Attorney’s claims page](https://www.sf.gov/cityattorney-file-claim) has the form and explains that the original must be mailed or hand delivered to the Controller’s Claims Division - email and fax are not accepted. For a bus or light rail incident, the form asks for the line and vehicle number.",
            "**BART** - the San Francisco Bay Area Rapid Transit District is a separate public agency. Its claim form is on [BART’s insurance page](https://www.bart.gov/about/business/insurance).",
            "**AC Transit** - claims for bus collisions or falls on District property go to the District Secretary using the form on [AC Transit’s claims page](https://www.actransit.org/government-tort-claims); the original signed form must be delivered or mailed, not faxed or emailed.",
            "**Caltrans and other State agencies** - Caltrans’ [damage claim page](https://dot.ca.gov/online-services/submit-damage-claim) explains that larger claims go to the State’s Government Claims Program.",
          ],
        },
        { callout: "**Don’t guess which agency is responsible.** A crash at a Muni stop near a BART entrance on a State highway can involve more than one public entity, and each needs its own timely claim. Missing one can end that part of the case. Children and people who were incapacitated may have a late claim option - ask us before assuming it is too late." },
      ],
    },
    {
      heading: "Where a Bay Area injury case is filed",
      blocks: [
        { p: "A lawsuit is usually filed in the Superior Court of the county where the injury happened or where a defendant lives. Because the Bay Area spans several counties, a crash on the Oakland side of the Bay Bridge and one on the San Francisco side may end up in different courthouses. In San Francisco, civil cases are handled at the Civic Center Courthouse on McAllister Street; Alameda County civil filings go to the René C. Davidson Courthouse in Oakland; San Mateo County civil cases are handled at the Hall of Justice in Redwood City." },
        { p: "Most cases settle without a trial, but filing within the two year deadline protects your rights while negotiations continue. Wrongful death cases follow the same two year rule from the date of death - see [California wrongful death law](/wrongful-death)." },
      ],
    },
    {
      heading: "Home and hospital visits across the Bay Area",
      blocks: [
        { p: "You shouldn’t have to cross a bridge in rush hour traffic to talk to a lawyer while you’re recovering. We meet clients at home, in the hospital, or by video anywhere in San Francisco, the East Bay and the Peninsula - and anywhere else in California. Consultations are free and confidential, we answer calls 24/7, and we work on a contingency fee: no attorney’s fee unless we win." },
      ],
    },
  ],
  faqs: [
    { q: "I was hurt on a Muni bus. Who do I file a claim with?", a: "Muni is run by the SFMTA, a department of the City and County of San Francisco, so the claim is filed against the City using the form on the City Attorney’s claims page. It generally must be filed within six months of the injury, and the original must be mailed or hand delivered - email and fax aren’t accepted." },
    { q: "Is a BART injury claim the same as a Muni claim?", a: "No. BART is a separate transit district with its own claim form, available on BART’s insurance page. If your injury involved both systems - for example, an incident at a station both systems use - you may need to file with both, each within six months." },
    { q: "Why didn’t SFPD write a full report for my crash?", a: "According to the SFPD, full traffic collision reports are prepared for hit and run, drunk driving and injury crashes. If you were hurt but no report was written, tell us - witness statements, video and medical records can fill the gap." },
    { q: "My crash happened on the Bay Bridge. Which court would hear my case?", a: "Generally the Superior Court of the county where the crash happened or where a defendant lives. On the Bay Bridge that can be San Francisco or Alameda County, so the exact location matters. We sort this out early so the case is filed in the right place." },
    { q: "I was hit by a truck near the Port of Oakland. What should I do?", a: "Get medical care, request the police or CHP report, and talk to a lawyer quickly. Trucking companies keep electronic logs and engine data that can be overwritten, and there may be several companies involved - the driver’s employer, the trailer owner, and the shipper." },
    { q: "Do you charge for a consultation at the Bay Area office?", a: "No. The consultation is free, and we work on a contingency fee - no attorney’s fee unless we win. We can meet at your home, in the hospital, or by video." },
  ],
  updated: "2026-10-02",
};

export default page;
