// Line icon for a practice-area card, picked from the page's URL. Pages added later in the admin
// panel get the closest match by keyword, or the scales-of-justice icon.
const ICONS: [RegExp, React.ReactNode][] = [
  // Guide topics on the resources page ("topic:<name>").
  [/^topic:after/, <><path d="M9 4h6v3H9z" /><path d="M7 5.5H5.5V21h13V5.5H17" /><path d="M9 12l2 2 4-4" /><path d="M9 17h6" /></>],
  [/^topic:insurance/, <><circle cx="12" cy="12" r="9" /><path d="M15 9.2c-.5-1-1.6-1.7-3-1.7-1.8 0-3 1-3 2.3 0 3 6 1.6 6 4.6 0 1.3-1.3 2.3-3 2.3-1.5 0-2.6-.7-3.1-1.8" /><path d="M12 6v1.5M12 16.5V18" /></>],
  [/^topic:wrongful/, <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" />],
  [/rideshare/, <><path d="M5 17h14v-4l-2-5H7l-2 5v4z" /><path d="M5 13h14" /><circle cx="8" cy="17" r="1.6" /><circle cx="16" cy="17" r="1.6" /><path d="M10 5h4" /></>],
  [/truck/, <><path d="M2 6h11v10H2z" /><path d="M13 9h4l4 4v3h-8" /><circle cx="6" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></>],
  [/motorcycle/, <><circle cx="5.5" cy="16" r="3" /><circle cx="18.5" cy="16" r="3" /><path d="M5.5 16l4-6h5l4 6" /><path d="M14 6h3l1.5 4" /></>],
  [/pedestrian/, <><circle cx="13" cy="4" r="1.8" /><path d="M10 21l2-6-2-3 1-4 3 2 3 1" /><path d="M12 15l3 6" /><path d="M11 8l-3 3" /></>],
  [/bicycle/, <><circle cx="5.5" cy="16" r="3.5" /><circle cx="18.5" cy="16" r="3.5" /><path d="M5.5 16l4-7h6l3 7" /><path d="M9.5 9l3 7h-7" /><path d="M14 6h2.5" /></>],
  [/car-accident|\/car\b/, <><path d="M4 16h16v-4l-2.5-5h-11L4 12v4z" /><path d="M4 12h16" /><circle cx="7.5" cy="16.5" r="1.8" /><circle cx="16.5" cy="16.5" r="1.8" /></>],
  [/brain/, <><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h1V4H9z" /><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3h-1V4h1z" /></>],
  [/spinal/, <><rect x="9" y="3" width="6" height="3.5" rx="1" /><rect x="9" y="8.5" width="6" height="3.5" rx="1" /><rect x="9" y="14" width="6" height="3.5" rx="1" /><path d="M12 19.5V21" /></>],
  [/burn/, <path d="M12 21c4 0 7-2.7 7-6.5 0-4-3.5-6-4-10-2.5 1.5-4 4-4 6.5-1-.8-1.8-2-2-3.5C7 9.5 5 12 5 14.5 5 18.3 8 21 12 21z" />],
  [/catastrophic/, <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" /><path d="M12 9v6M9 12h6" /></>],
  [/nursing|elder/, <><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M12 17s-3-1.8-3-3.6a1.6 1.6 0 0 1 3-.8 1.6 1.6 0 0 1 3 .8C15 15.2 12 17 12 17z" /></>],
  [/medical/, <><path d="M6 3v5a4 4 0 0 0 8 0V3" /><path d="M10 12v3a5 5 0 0 0 10 0v-2" /><circle cx="20" cy="11" r="2" /></>],
  [/premises|slip/, <><path d="M4 20h16" /><path d="M4 20v-4h4v-4h4V8h4V4h4" /></>],
  [/dog/, <><circle cx="6" cy="10" r="1.8" /><circle cx="10" cy="6" r="1.8" /><circle cx="14" cy="6" r="1.8" /><circle cx="18" cy="10" r="1.8" /><path d="M12 11c-3 0-5 4-5 6a2.5 2.5 0 0 0 3.5 2.2c1-.4 2-.4 3 0A2.5 2.5 0 0 0 17 17c0-2-2-6-5-6z" /></>],
  [/product/, <><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path d="M4 7.5l8 4.5 8-4.5M12 12v9" /></>],
  [/workplace/, <><path d="M4 15a8 8 0 0 1 16 0" /><path d="M2.5 15h19v2.5h-19z" /><path d="M10 7.5V5h4v2.5" /></>],
  [/government/, <><path d="M3 9l9-5 9 5" /><path d="M5 9v9M9.5 9v9M14.5 9v9M19 9v9" /><path d="M3 20h18" /></>],
  [/who-can-file/, <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><circle cx="17" cy="9" r="2.4" /><path d="M16 14.2a5 5 0 0 1 5.5 5.8" /></>],
  [/statute|deadline/, <><circle cx="12" cy="13" r="8" /><path d="M12 9v4l3 2" /><path d="M10 2h4" /></>],
  [/^\/wrongful-death$/, <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" />],
];
const SCALES = <><path d="M12 3v18M7 21h10" /><path d="M5 7h14" /><path d="M5 7l-3 6a3 3 0 0 0 6 0L5 7zM19 7l-3 6a3 3 0 0 0 6 0l-3-6z" /></>;

export default function ServiceIcon({ slug }: { slug: string }) {
  const icon = ICONS.find(([re]) => re.test(slug))?.[1] ?? SCALES;
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icon}
    </svg>
  );
}
