// Sidebar "free case evaluation" card. Opens the site-wide case-review popup (components/LeadDialog.tsx);
// a plain link, so it also works before the page's scripts load.
export default function ReviewCard() {
  return (
    <div className="review-card">
      <span className="review-card__eyebrow">Free case evaluation</span>
      <h3>Tell us what happened</h3>
      <p>Free, confidential and no obligation. It takes about a minute.</p>
      <a className="btn btn--gold btn--block" href="#lead-form" aria-haspopup="dialog">Start my free review &rarr;</a>
    </div>
  );
}
