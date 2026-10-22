"""California-touch versions of the client's own logo artwork (public/assets/logo-footer.png).
The logo is embedded untouched; sun, waves, hills and palms are drawn around it as vectors.
Usage: python scripts/brand-kit/logo_concepts.py  (then node scripts/brand-kit/render-png.mjs)"""
import base64, math, os
from generate import grad, retro_sun, palm, write, svg, text_path, NAVY, NAVY_DEEP, SUN, GOLD_LAW

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "..", "..", "public", "assets", "logo-footer.png")
with open(SRC, "rb") as fh:
    LOGO_B64 = base64.b64encode(fh.read()).decode()
LW, LH = 705, 293  # cut-out size


def logo_img(x, y, w):
    h = w * LH / LW
    return f'<image href="data:image/png;base64,{LOGO_B64}" x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}"/>'


def wave_line(x0, x1, y, amp, length, stroke, width, opacity=1):
    pts = " L".join(f"{x:.1f},{y + amp * math.sin(2 * math.pi * (x - x0) / length):.1f}" for x in range(int(x0), int(x1) + 1, 4))
    return f'<path d="M{pts}" fill="none" stroke="{stroke}" stroke-width="{width}" stroke-linecap="round" opacity="{opacity}"/>'


def fade_mask(id_, x0, x1, y0, y1):
    """Fade wave ends to transparent."""
    return (f'<linearGradient id="{id_}G" x1="{x0}" x2="{x1}" y1="0" y2="0" gradientUnits="userSpaceOnUse">'
            f'<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".2" stop-color="#fff"/>'
            f'<stop offset=".8" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
            f'<mask id="{id_}"><rect x="{x0}" y="{y0}" width="{x1 - x0}" height="{y1 - y0}" fill="url(#{id_}G)"/></mask>')


# ---- 1. Sun & Surf: compact, header-friendly ------------------------------------------
def sun_surf(bg=NAVY, transparent=False):
    W, H = 860, 400
    defs = grad("gSun", SUN) + grad("gGold", GOLD_LAW, 0, 0, 1, 0) + fade_mask("fade", 40, 820, 300, 400)
    body = [] if transparent else [f'<rect width="{W}" height="{H}" fill="{bg}"/>']
    body.append(retro_sun(770, 66, 44))                      # sun in the open top-right corner
    body.append(logo_img(40, 22, LW))
    body.append('<g mask="url(#fade)">' +
                wave_line(40, 820, 338, 7, 92, "url(#gGold)", 6) +
                wave_line(40, 820, 360, 6, 92, "#FFFFFF", 3.5, .8) +
                wave_line(40, 820, 378, 5, 92, "url(#gGold)", 2.5, .6) + '</g>')
    return svg(W, H, "".join(body), defs)


# ---- 2. Golden Hour plate: logo over a sunset coast ------------------------------------
def golden_hour():
    W, H = 900, 560
    hz = 440
    defs = (grad("gSky", [("0", NAVY), ("0.45", "#2F3772"), ("0.75", "#A9567A"), ("1", "#F2915A")], 0, 0, 0, hz, "userSpaceOnUse") +
            grad("gSun", SUN) + grad("gSea", [("0", "#173A6B"), ("1", NAVY_DEEP)], 0, hz, 0, H, "userSpaceOnUse") +
            '<clipPath id="plate"><rect width="900" height="560" rx="28"/></clipPath>')
    body = ['<g clip-path="url(#plate)">',
            f'<rect width="{W}" height="{H}" fill="url(#gSky)"/>',
            retro_sun(W / 2, hz + 10, 115),
            f'<rect y="{hz}" width="{W}" height="{H - hz}" fill="url(#gSea)"/>',
            wave_line(0, W, hz + 40, 5, 120, "#FCC96B", 2, .5), wave_line(0, W, hz + 72, 6, 150, "#FFFFFF", 2, .25),
            palm(20, H + 10, 300, NAVY_DEEP, lean=0.3, seed=11),
            palm(W - 20, H + 10, 310, NAVY_DEEP, lean=-0.3, seed=2),
            logo_img((W - 620) / 2, 28, 620),
            '</g>']
    return svg(W, H, "".join(body), defs)


# ---- 3. Round badge: hills with a sign-style homage, sun, ocean ------------------------
def badge():
    S = 720
    c = S / 2
    R = 330
    defs = (grad("gSky", [("0", NAVY), ("0.45", "#34397A"), ("0.8", "#C9607A"), ("1", "#F8A65A")], 0, 30, 0, 470, "userSpaceOnUse") +
            grad("gSun", SUN) + grad("gRing", GOLD_LAW, 0, 0, 0, 1) +
            f'<clipPath id="disc"><circle cx="{c}" cy="{c}" r="{R}"/></clipPath>')
    hill_y = lambda x: 452 - 34 * math.sin((x - 60) / 600 * math.pi)
    hill = f"M0,{S} " + " ".join(f"L{x},{hill_y(x):.1f}" for x in range(0, S + 1, 10)) + f" L{S},{S}Z"
    body = [f'<circle cx="{c}" cy="{c}" r="{R + 22}" fill="{NAVY}"/>',
            f'<circle cx="{c}" cy="{c}" r="{R + 14}" fill="none" stroke="url(#gRing)" stroke-width="6"/>',
            '<g clip-path="url(#disc)">',
            f'<rect width="{S}" height="{S}" fill="url(#gSky)"/>',
            retro_sun(520, 405, 62),
            f'<path d="{hill}" fill="#163A63"/>']
    # small white hillside sign letters with posts (homage; spells the firm's own name)
    x = 150
    for ch in "CALIFORNIA LAW":
        if ch == " ":
            x += 12
            continue
        d, w, _ = text_path("Anton", ch, 30, 0, 0)
        cx = x + w / 2
        base = hill_y(cx) - 6
        d, w, _ = text_path("Anton", ch, 30, x, base)
        body.append(f'<rect x="{cx - 1:.1f}" y="{base - 4:.1f}" width="2" height="12" fill="#9FB0C8"/><path d="{d}" fill="#fff"/>')
        x += w + 6
    body += [f'<rect y="500" width="{S}" height="{S}" fill="{NAVY_DEEP}"/>',
             wave_line(0, S, 524, 5, 80, "#FCC96B", 3, .8), wave_line(0, S, 546, 5, 96, "#FFFFFF", 2.5, .5),
             palm(70, 520, 230, NAVY_DEEP, lean=0.28, seed=13),
             palm(S - 70, 520, 215, NAVY_DEEP, lean=-0.28, seed=17),
             '</g>',
             logo_img(c - 245, 105, 490)]
    t, _, _ = text_path("AbrilFatface", "ATTORNEYS AT LAW", 30, c, 618, tracking=0.16, anchor="middle")
    body.append(f'<path d="{t}" fill="url(#gRing)"/>')
    return svg(S, S, "".join(body), defs)


if __name__ == "__main__":
    write("logo-ca-sun-surf.svg", sun_surf())
    write("logo-ca-sun-surf-transparent.svg", sun_surf(transparent=True))
    write("logo-ca-golden-hour.svg", golden_hour())
    write("logo-ca-badge.svg", badge())
