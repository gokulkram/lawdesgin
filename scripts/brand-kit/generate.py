"""Generate the California Law brand kit: recreated logo + California-themed marketing scenes.
All text is converted to vector paths so the SVGs render identically everywhere."""
import math, os, random, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 and __name__ == "__main__" else os.path.join(HERE, "..", "..", "public", "assets", "brand")

FONTS = {k: TTFont(os.path.join(HERE, "fonts", f"{k}.ttf")) for k in ("Yellowtail", "RozhaOne", "Anton", "AbrilFatface")}

# ---- palette (sampled from the client logo) --------------------------------------------
NAVY = "#0C2A52"
NAVY_DEEP = "#071B36"
WHITE = "#FFFFFF"
GOLD_LAW = [("0", "#FCD77A"), ("0.45", "#F5B144"), ("1", "#E9851A")]
GOLD_PALM = [("0", "#F8DE8C"), ("0.35", "#FCC055"), ("0.7", "#DDA24F"), ("1", "#B98731")]


def grad(id_, stops, x1=0, y1=0, x2=0, y2=1, units=None):
    u = f' gradientUnits="{units}"' if units else ""
    s = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in stops)
    return f'<linearGradient id="{id_}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"{u}>{s}</linearGradient>'


# ---- text -> path ----------------------------------------------------------------------
def text_path(font, s, size, x, y, tracking=0.0, anchor="start"):
    """Return (path d, width, bbox) for string s with baseline at y."""
    f = FONTS[font]
    gs = f.getGlyphSet()
    cmap = f.getBestCmap()
    upm = f["head"].unitsPerEm
    sc = size / upm
    kern = {}
    names = [cmap[ord(ch)] for ch in s]
    width = 0
    for i, n in enumerate(names):
        width += gs[n].width * sc + (tracking * size if i < len(names) - 1 else 0)
    if anchor == "middle":
        x -= width / 2
    elif anchor == "end":
        x -= width
    pen = SVGPathPen(gs, ntos=lambda v: f"{v:.1f}")
    bpen = BoundsPen(gs)
    cx = x
    for n in names:
        t = (sc, 0, 0, -sc, cx, y)
        gs[n].draw(TransformPen(pen, t))
        gs[n].draw(TransformPen(bpen, t))
        cx += gs[n].width * sc + tracking * size
    return pen.getCommands(), width, bpen.bounds


def glyph_path(font, ch, size, x, y):
    return text_path(font, ch, size, x, y)


# ---- palm tree -------------------------------------------------------------------------
def palm(x, y, h, fill, lean=0.18, seed=3, fronds=None, trunk_w=None, frond_scale=1.0, leaflets=15, frond_w=0.11):
    """Palm with trunk base at (x, y), crown at height h. Returns SVG group markup."""
    rnd = random.Random(seed)
    tw = trunk_w or h * 0.055
    top = (x + lean * h, y - h)
    ctrl = (x + lean * h * 0.15, y - h * 0.55)

    def bez(t):
        a = (1 - t) ** 2
        b = 2 * (1 - t) * t
        c = t * t
        return (a * x + b * ctrl[0] + c * top[0], a * y + b * ctrl[1] + c * top[1])

    left, right = [], []
    N = 24
    for i in range(N + 1):
        t = i / N
        px, py = bez(t)
        # tangent
        t2 = min(t + 0.01, 1)
        t1 = t2 - 0.01
        ax, ay = bez(t1)
        bx, by = bez(t2)
        dx, dy = bx - ax, by - ay
        L = math.hypot(dx, dy) or 1
        nx, ny = -dy / L, dx / L
        w = tw * (1 - 0.45 * t) * (1 + (0.08 if i % 2 == 0 else -0.04))  # ring texture
        left.append((px + nx * w, py + ny * w))
        right.append((px - nx * w, py - ny * w))
    pts = left + right[::-1]
    trunk = "M" + " L".join(f"{a:.1f},{b:.1f}" for a, b in pts) + "Z"

    # fronds: (angle deg, length factor, droop)
    fr = fronds or [(-200, .5, .4), (-172, .62, .25), (-145, .6, .1), (-118, .48, 0), (-90, .42, 0),
                    (-62, .48, 0), (-35, .6, .1), (-8, .62, .25), (20, .5, .4)]
    parts = [f'<path d="{trunk}"/>']
    for ang, lf, droop in fr:
        L = h * lf * frond_scale * (0.92 + rnd.random() * 0.16)
        a = math.radians(ang)
        ux, uy = math.cos(a), math.sin(a)
        lift = 0.28 if uy > -0.6 else 0.05  # side fronds arch up before falling
        p0 = top
        p1 = (top[0] + ux * L * 0.55, top[1] + uy * L * 0.55 - L * lift)
        p2 = (top[0] + ux * L, top[1] + uy * L + L * (droop + 0.15))

        def cl(t):
            a_, b_, c_ = (1 - t) ** 2, 2 * (1 - t) * t, t * t
            return (a_ * p0[0] + b_ * p1[0] + c_ * p2[0], a_ * p0[1] + b_ * p1[1] + c_ * p2[1])

        upper, lower = [], []
        M = leaflets
        for i in range(M + 1):
            t = i / M
            px, py = cl(t)
            qx, qy = cl(min(t + 0.02, 1)) if t < 1 else cl(1)
            rx, ry = cl(max(t - 0.02, 0))
            dx, dy = qx - rx, qy - ry
            Ld = math.hypot(dx, dy) or 1
            tx, ty = dx / Ld, dy / Ld
            nx, ny = -ty, tx
            if ny < 0 or (abs(ny) < 0.2 and nx * ux < 0):
                nx, ny = -nx, -ny  # n points to the hanging side
            w = L * frond_w * math.sin(math.pi * min(t, 1)) ** 0.7
            upper.append((px - nx * w * 0.25, py - ny * w * 0.25))
            if 0 < i < M:
                lower.append((px + nx * w * 0.15, py + ny * w * 0.15))
                lower.append((px + nx * w * 1.6 + tx * L * 0.09, py + ny * w * 1.6 + ty * L * 0.09))
        poly = [top] + upper + [cl(1)] + lower[::-1]
        parts.append('<path d="M' + " L".join(f"{a:.1f},{b:.1f}" for a, b in poly) + 'Z"/>')
    return f'<g fill="{fill}">' + "".join(parts) + "</g>"


# ---- logo ------------------------------------------------------------------------------
def logo_group(script_fill=WHITE, law_fill="url(#gLaw)", palm_fill="url(#gPalm)", shadow=True):
    """Logo laid out on a 760x320 canvas, mirroring the client artwork."""
    script, sw, sb = text_path("Yellowtail", "California", 170, 392, 200, tracking=0.004, anchor="middle")
    law, lw, lb = text_path("AbrilFatface", "LAW", 104, 392, 304, tracking=0.04, anchor="middle")
    fr = [(-195, .62, .35), (-168, .72, .22), (-140, .62, .08), (-112, .5, 0), (-86, .42, 0),
          (-60, .5, 0), (-34, .66, .08), (-8, .72, .22), (18, .58, .35)]
    p = palm(138, 214, 142, palm_fill, lean=-0.14, seed=7, trunk_w=7, fronds=fr, frond_scale=0.92, leaflets=8, frond_w=0.16)
    f = ' filter="url(#soft)"' if shadow else ""
    return (f'<g transform="translate(0,0)">{p}'
            f'<path d="{script}" fill="{script_fill}"{f}/>'
            f'<g transform="translate(392,0) scale(1.22,1) translate(-392,0)"><path d="{law}" fill="{law_fill}"{f}/></g></g>')


DEFS_LOGO = (grad("gLawDark", [("0", "#E0A43A"), ("1", "#B4640E")], 0, 236, 0, 306, "userSpaceOnUse") +
             grad("gPalmDark", [("0", "#E6B04A"), ("1", "#A8741E")], 30, 20, 210, 230, "userSpaceOnUse") +
             grad("gLaw", GOLD_LAW, 0, 236, 0, 306, "userSpaceOnUse") +
             grad("gPalm", GOLD_PALM, 30, 20, 210, 230, "userSpaceOnUse") +
             '<filter id="soft" x="-5%" y="-5%" width="110%" height="120%">'
             '<feGaussianBlur in="SourceAlpha" stdDeviation="2.5"/><feOffset dy="3"/>'
             '<feComponentTransfer><feFuncA type="linear" slope=".35"/></feComponentTransfer>'
             '<feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>')


def svg(w, h, body, defs=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">'
            f'<defs>{defs}</defs>{body}</svg>')


def write(name, content):
    os.makedirs(OUT, exist_ok=True)
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as fh:
        fh.write(content)
    print("wrote", name, len(content) // 1024, "KB")


def logo_at(x, y, scale, **kw):
    return f'<g transform="translate({x},{y}) scale({scale})">{logo_group(**kw)}</g>'


# ---- shared scene pieces ---------------------------------------------------------------
SKY = [("0", "#0C2A52"), ("0.38", "#3A3C7A"), ("0.62", "#B8577A"), ("0.82", "#F2865A"), ("1", "#FCC96B")]
SUN = [("0", "#FFE7A0"), ("0.5", "#FCC055"), ("1", "#F08C1A")]


def retro_sun(cx, cy, r, gid="gSun", mask_id="sunMask"):
    bars = "".join(
        f'<rect x="{cx - r}" y="{cy + r * (0.12 + i * 0.17):.1f}" width="{2 * r}" height="{r * (0.03 + i * 0.022):.1f}" fill="#000"/>'
        for i in range(6))
    return (f'<mask id="{mask_id}"><rect x="{cx - r}" y="{cy - r}" width="{2 * r}" height="{2 * r}" fill="#fff"/>{bars}</mask>'
            f'<radialGradient id="{mask_id}Glow"><stop offset=".55" stop-color="#FCC96B" stop-opacity=".45"/><stop offset="1" stop-color="#F2865A" stop-opacity="0"/></radialGradient>'
            f'<circle cx="{cx}" cy="{cy}" r="{r * 1.9}" fill="url(#{mask_id}Glow)"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#{gid})" mask="url(#{mask_id})"/>')


def wave(w, y, amp, length, phase, fill, opacity=1, h=None):
    pts = []
    step = 8
    for xx in range(0, int(w) + step, step):
        pts.append(f"{xx},{y + amp * math.sin(2 * math.pi * xx / length + phase):.1f}")
    bottom = h or y + 2000
    return f'<path d="M0,{bottom} L{" L".join(pts)} L{w},{bottom}Z" fill="{fill}" opacity="{opacity}"/>'


def glints(x0, x1, y0, y1, n, seed=1, color="#FCC96B"):
    rnd = random.Random(seed)
    out = []
    for _ in range(n):
        t = rnd.random()
        y = y0 + (y1 - y0) * t ** 1.4
        spread = (x1 - x0) * (0.15 + 0.85 * t) / 2
        cx = (x0 + x1) / 2 + (rnd.random() * 2 - 1) * spread
        w = 6 + 40 * t * rnd.random()
        out.append(f'<rect x="{cx - w / 2:.1f}" y="{y:.1f}" width="{w:.1f}" height="{1.5 + 2 * t:.1f}" rx="1" fill="{color}" opacity="{0.35 + 0.5 * rnd.random():.2f}"/>')
    return "".join(out)


# ---- Scene 1: Sunset Coast (1600x900) --------------------------------------------------
def scene_sunset(W=1600, H=900, tagline="Experienced California Attorneys. Proven Results."):
    hz = H * 0.66
    k = H / 900
    defs = (grad("gSky", SKY, 0, 0, 0, hz, "userSpaceOnUse") + grad("gSun", SUN) +
            grad("gSea", [("0", "#1B3F73"), ("1", NAVY_DEEP)], 0, hz, 0, H, "userSpaceOnUse") + DEFS_LOGO)
    body = [f'<rect width="{W}" height="{H}" fill="url(#gSky)"/>',
            retro_sun(W / 2, hz - 60 * k, 175 * k),
            f'<rect y="{hz}" width="{W}" height="{H - hz}" fill="url(#gSea)"/>',
            glints(W / 2 - 230, W / 2 + 230, hz + 6, H * 0.86, 70, seed=4),
            wave(W, H * 0.80, 9, 260, 0.4, NAVY, .55),
            wave(W, H * 0.86, 12, 330, 1.7, NAVY_DEEP, .8),
            # sand
            f'<path d="M0,{H} L0,{H * 0.9} Q{W * 0.25},{H * 0.86} {W * 0.5},{H * 0.93} T{W},{H * 0.9} L{W},{H}Z" fill="#E9C98E"/>',
            f'<path d="M0,{H * 0.905} Q{W * 0.25},{H * 0.865} {W * 0.5},{H * 0.935} T{W},{H * 0.905}" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>',
            palm(70 * k, H * 0.95, 470 * k, NAVY_DEEP, lean=0.3, seed=11),
            palm(200 * k, H * 0.97, 320 * k, NAVY_DEEP, lean=0.16, seed=5),
            palm(W - 70 * k, H * 0.95, 500 * k, NAVY_DEEP, lean=-0.3, seed=2),
            palm(W - 210 * k, H * 0.98, 290 * k, NAVY_DEEP, lean=-0.12, seed=9),
            logo_at(W / 2 - 760 * 0.82 * k / 2, H * 0.05, 0.82 * k)]
    if tagline:
        t, tw, _ = text_path("RozhaOne", tagline.upper(), 26 * k, W / 2, H * 0.05 + 300 * k, tracking=0.1, anchor="middle")
        body.append(f'<path d="{t}" fill="#fff" opacity=".95"/>')
    return svg(W, H, "".join(body), defs)


# ---- Scene 2: Hillside sign (1600x900) -------------------------------------------------
def hill_y(x, W, H):
    return H * 0.56 - 120 * math.sin(math.pi * (x / W) * 0.9 + 0.25) + 18 * math.sin(x / 90)


def scene_hills(W=1600, H=900, word="CALIFORNIA LAW", tagline="Fighting for Californians"):
    defs = (grad("gSky2", [("0", "#0C2A52"), ("0.45", "#2D3B78"), ("0.75", "#C9607A"), ("1", "#F8A65A")], 0, 0, 0, H * 0.7, "userSpaceOnUse") +
            grad("gSun", SUN) + grad("gHill", [("0", "#163A63"), ("1", NAVY_DEEP)], 0, H * 0.4, 0, H, "userSpaceOnUse") +
            grad("gHillFar", [("0", "#4A3F7A"), ("1", "#2A2E62")], 0, H * 0.4, 0, H * 0.8, "userSpaceOnUse") + DEFS_LOGO)
    body = [f'<rect width="{W}" height="{H}" fill="url(#gSky2)"/>',
            retro_sun(W * 0.17, H * 0.3, 105),
            # far ridge
            f'<path d="M0,{H} L0,{H * 0.62} C{W * .2},{H * .52} {W * .35},{H * .6} {W * .55},{H * .55} S{W * .85},{H * .5} {W},{H * .6} L{W},{H}Z" fill="url(#gHillFar)"/>']
    # main hill with sign
    pts = [f"{x},{hill_y(x, W, H):.1f}" for x in range(0, W + 10, 10)]
    body.append(f'<path d="M0,{H} L{" L".join(pts)} L{W},{H}Z" fill="url(#gHill)"/>')
    # sign letters following the slope
    size = 100
    letters = []
    x = 360
    f = FONTS["Anton"]
    gs = f.getGlyphSet(); cmap = f.getBestCmap(); sc = size / f["head"].unitsPerEm
    for ch in word:
        if ch == " ":
            x += size * 0.5
            continue
        n = cmap[ord(ch)]
        adv = gs[n].width * sc
        cx = x + adv / 2
        base = hill_y(cx, W, H) - 14
        slope = (hill_y(cx + 5, W, H) - hill_y(cx - 5, W, H)) / 10
        rot = math.degrees(math.atan(slope)) * 0.5
        d, _, b = text_path("Anton", ch, size, x, base)
        legs = "".join(f'<rect x="{x + adv * k - 2:.1f}" y="{base - 6:.1f}" width="4" height="34" fill="#9FB0C8"/>' for k in (0.25, 0.75))
        letters.append(f'<g transform="rotate({rot:.2f},{cx:.1f},{base:.1f})">{legs}<path d="{d}" fill="#fff"/></g>')
        x += adv + size * 0.13
    body.append("".join(letters))
    # foreground ridge + palms
    body.append(f'<path d="M0,{H} L0,{H * 0.86} C{W * .25},{H * .8} {W * .5},{H * .9} {W * .75},{H * .84} S{W},{H * .86} {W},{H * .86} L{W},{H}Z" fill="{NAVY_DEEP}"/>')
    body += [palm(60, H * 0.95, 400, NAVY_DEEP, lean=0.3, seed=13),
             palm(W - 70, H * 0.95, 380, NAVY_DEEP, lean=-0.3, seed=17)]
    if tagline:
        t, _, _ = text_path("Yellowtail", tagline, 84, W / 2, 150, anchor="middle")
        body.append(f'<path d="{t}" fill="url(#gTag)"/>')
        defs += grad("gTag", GOLD_LAW, 0, 80, 0, 160, "userSpaceOnUse")
    return svg(W, H, "".join(body), defs)


# ---- Scene 3: Social square - pier at golden hour (1080x1080) --------------------------
def scene_pier(W=1080, H=1080, headline="Injured in California?", sub="FREE CONSULTATION  ·  NO FEE UNLESS WE WIN"):
    hz = H * 0.6
    defs = (grad("gSky3", SKY, 0, 0, 0, hz, "userSpaceOnUse") + grad("gSun", SUN) +
            grad("gSea", [("0", "#1B3F73"), ("1", NAVY_DEEP)], 0, hz, 0, H, "userSpaceOnUse") +
            grad("gHead", GOLD_LAW, 0, 120, 0, 250, "userSpaceOnUse") + DEFS_LOGO)
    body = [f'<rect width="{W}" height="{H}" fill="url(#gSky3)"/>',
            retro_sun(W * 0.62, hz - 20, 150),
            f'<rect y="{hz}" width="{W}" height="{H - hz}" fill="url(#gSea)"/>',
            glints(W * 0.62 - 160, W * 0.62 + 160, hz + 6, H * 0.95, 55, seed=8)]
    # pier deck with pilings + ferris wheel silhouette (generic boardwalk, no landmark replica)
    deck_y = hz - 18
    body.append(f'<rect x="0" y="{deck_y}" width="{W * 0.5}" height="14" fill="{NAVY_DEEP}"/>')
    body.append("".join(f'<rect x="{px}" y="{deck_y}" width="9" height="{H - deck_y}" fill="{NAVY_DEEP}"/>' for px in range(16, int(W * 0.5), 46)))
    body.append("".join(f'<line x1="{px}" y1="{deck_y + 14}" x2="{px + 46}" y2="{deck_y + 60}" stroke="{NAVY_DEEP}" stroke-width="4"/>' for px in range(16, int(W * 0.5) - 46, 46)))
    wx, wy, wr = W * 0.24, deck_y - 140, 125
    spokes = "".join(f'<line x1="{wx}" y1="{wy}" x2="{wx + wr * math.cos(i * math.pi / 8):.1f}" y2="{wy + wr * math.sin(i * math.pi / 8):.1f}" stroke="{NAVY_DEEP}" stroke-width="3"/>' for i in range(16))
    cars = "".join(f'<rect x="{wx + wr * math.cos(i * math.pi / 8) - 8:.1f}" y="{wy + wr * math.sin(i * math.pi / 8) - 4:.1f}" width="16" height="13" rx="3" fill="{NAVY_DEEP}"/>' for i in range(16))
    body.append(f'<circle cx="{wx}" cy="{wy}" r="{wr}" fill="none" stroke="{NAVY_DEEP}" stroke-width="6"/>{spokes}{cars}'
                f'<path d="M{wx - 70},{deck_y} L{wx},{wy} L{wx + 70},{deck_y}" fill="none" stroke="{NAVY_DEEP}" stroke-width="10"/>')
    body.append(wave(W, H * 0.9, 8, 220, 0.8, NAVY_DEEP, .85))
    body.append(palm(W - 40, H * 0.98, 440, NAVY_DEEP, lean=-0.3, seed=31))
    t, _, _ = text_path("Yellowtail", headline, 108, W / 2, 210, anchor="middle")
    body.append(f'<path d="{t}" fill="url(#gHead)" filter="url(#soft)"/>')
    s, _, _ = text_path("RozhaOne", sub, 26, W / 2, 270, tracking=0.06, anchor="middle")
    body.append(f'<path d="{s}" fill="#fff"/>')
    body.append(f'<rect y="{H - 210}" width="{W}" height="210" fill="{NAVY}" opacity=".92"/>')
    body.append(logo_at(W / 2 - 760 * 0.6 / 2, H - 205, 0.6))
    return svg(W, H, "".join(body), defs)


if __name__ == "__main__":
    # Logo variants
    write("logo-navy.svg", svg(760, 320, f'<rect width="760" height="320" fill="{NAVY}"/>' + logo_group(), DEFS_LOGO))
    write("logo-transparent.svg", svg(760, 320, logo_group(), DEFS_LOGO))
    write("logo-on-light.svg", svg(760, 320, logo_group(script_fill=NAVY, law_fill="url(#gLawDark)", palm_fill="url(#gPalmDark)", shadow=False), DEFS_LOGO))


    # ---- Open Graph (1200x630) -------------------------------------------------------------
    write("scene-sunset-coast.svg", scene_sunset())
    write("scene-hillside-sign.svg", scene_hills())
    write("social-pier-square.svg", scene_pier())
    write("og-sunset.svg", scene_sunset(1200, 630, tagline=None))
