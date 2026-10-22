// Shown in the content area (sidebar stays put) while an admin page loads.
export default function Loading() {
  return (
    <div className="adm-loading" role="status" aria-live="polite">
      <div className="adm-loading__status">
        <span className="adm-nav__spin" aria-hidden />
        Loading…
      </div>
      <div className="adm-loading__bar" />
      <div className="adm-loading__block" />
      <div className="adm-loading__block" />
    </div>
  );
}
