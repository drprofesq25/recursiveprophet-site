"""Generate the hero knowledge graph from the cover's own node positions (v3).

Usage: python3 scripts/constellation/gen_constellation.py scripts/constellation/cover-nodes.json src/components/Constellation.astro
cover-nodes.json = amber node centroids sampled from public/cover/rp-cover-600.jpg (x, y, area).
Regenerate whenever the final cover master changes.

Coordinates are in the cover's 600x960 space, so the SVG sits exactly on the cover image
(viewBox 0 0 600 960, overflow visible).

v2 (2026-10-21): bridges. Every outside line starts at a REAL cover node near an edge; the short
stretch across the cover's edge is drawn in a front SVG so the line visibly leaves the cover.
No outside line passes behind the cover.

v3 (2026-10-21, Prof: "reads as constellations, not the graph"): the outside field is now built
like an Obsidian / second-brain graph instead of star chains:
- clusters: each hub note sits in a ring of leaf notes that link straight back to it;
- hubs link to each other, and the cover's edge nodes link to the nearest cluster;
- node size follows link count; a few notes are unlinked;
- faint filename-style labels on some notes (everyday fragments of a life, never canon).
Deterministic (seeded).
"""
import json
import math
import random
import sys

dots = json.load(open(sys.argv[1]))
out = sys.argv[2]
random.seed(1021)

W, H = 600, 960
TITLE_Y = 650  # below this the cover is the title band; no anchors there

LABELS = [
    'voice memo 14', 'setlist (fall)', 'school pickup', 'mower — ignition coil', 'chorus idea',
    'draft 3', 'grocery list', 'second verse', 'note to self', 'untitled', 'rehearsal notes',
    'permission slip', 'chapter notes', 'half a song', 'ideas.md', 'filter size', 'bills',
    'soccer sat', 'lyrics v2', 'call mom', 'sleep?', 'bridge (fix)',
]


def dist_to_cover(x, y):
    dx = max(0 - x, 0, x - W)
    dy = max(0 - y, 0, y - H)
    return math.hypot(dx, dy)


def d2(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])


def crosses_cover(a, b, pad=4):
    for i in range(1, 24):
        t = i / 24
        x, y = a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t
        if -pad < x < W + pad and -pad < y < H + pad:
            return True
    return False


# --- anchors: real cover nodes close to the left, right or top edge, above the title band
cands = sorted(((x, y, s) for x, y, s in dots
                if y < TITLE_Y and s >= 6 and (x < 48 or x > 552 or y < 36)), key=lambda d: -d[2])
anchors = []
for x, y, s in cands:
    if all(d2((x, y), a) > 30 for a in anchors):
        anchors.append((x, y))

# --- cluster centres (hubs): spread around the cover, thinning with distance
hubs = []
tries = 0
while len(hubs) < 17 and tries < 200000:
    tries += 1
    x, y = random.uniform(-470, 1070), random.uniform(-300, 1240)
    d = dist_to_cover(x, y)
    if d < 70 or d > 420:
        continue
    if any(d2((x, y), h) < 175 for h in hubs):
        continue
    hubs.append((x, y))

nodes = list(hubs)
leaf_of = {}
edges = {}
depth = {}


def add_edge(a, b, front=False):
    if a == b or (not front and crosses_cover(a, b)):
        return False
    key = (a, b) if a <= b else (b, a)
    edges.setdefault(key, {'front': front})
    return True


def free(p, gap):
    return dist_to_cover(*p) > 22 and all(d2(p, q) > gap for q in nodes + anchors)


# --- leaves ring each hub at varied radii
for h in hubs:
    n = random.randint(7, 13)
    base = random.uniform(0, math.tau)
    for i in range(n):
        for _ in range(30):
            ang = base + i * math.tau / n + random.uniform(-0.35, 0.35)
            r = random.uniform(34, 112)
            p = (h[0] + r * math.cos(ang), h[1] + r * math.sin(ang))
            if free(p, 24) and add_edge(h, p):
                nodes.append(p)
                leaf_of[p] = h
                break

# --- a band of notes just off the cover's edges, so the bridges stay short
band = []
for _ in range(6000):
    if len(band) >= 26:
        break
    side = random.random()
    if side < 0.36:
        p = (random.uniform(-85, -28), random.uniform(-20, TITLE_Y + 40))
    elif side < 0.72:
        p = (random.uniform(W + 28, W + 85), random.uniform(-20, TITLE_Y + 40))
    else:
        p = (random.uniform(-20, W + 20), random.uniform(-85, -28))
    if not free(p, 34):
        continue
    near = sorted((q for q in nodes if q not in band), key=lambda q: d2(p, q))
    for q in near[:4]:
        if add_edge(q, p):
            nodes.append(p)
            band.append(p)
            leaf_of[p] = q
            break

# --- a sprinkle of unlinked notes and short side-chains off leaves
orphans = []
for _ in range(400):
    if len(orphans) >= 7:
        break
    p = (random.uniform(-430, 1030), random.uniform(-260, 1200))
    if 140 < dist_to_cover(*p) < 420 and free(p, 40):
        nodes.append(p)
        orphans.append(p)

leaves = [p for p in nodes if p in leaf_of]
for p in random.sample(leaves, k=len(leaves) // 5):
    ang = math.atan2(p[1] - leaf_of[p][1], p[0] - leaf_of[p][0]) + random.uniform(-0.5, 0.5)
    q = (p[0] + 34 * math.cos(ang), p[1] + 34 * math.sin(ang))
    if free(q, 22) and add_edge(p, q):
        nodes.append(q)
        leaf_of[q] = p

# --- hubs link to nearby hubs (the graph's long edges)
for h in hubs:
    near = sorted((g for g in hubs if g != h), key=lambda g: d2(h, g))
    for g in near[:2]:
        if d2(h, g) < 380:
            add_edge(h, g)

# --- a few leaf-to-leaf links between neighbouring clusters
for p in leaves:
    if random.random() > 0.18:
        continue
    near = sorted((q for q in leaves if leaf_of.get(q) != leaf_of.get(p) and q != p), key=lambda q: d2(p, q))
    if near and d2(p, near[0]) < 90:
        add_edge(p, near[0])

# --- bridges: each cover edge node reaches out to the nearest outside note on its side
outside = [p for p in nodes if p not in orphans]
for a in anchors:
    side = [p for p in outside if (
        (a[0] < 48 and p[0] < 0) or (a[0] > 552 and p[0] > W) or (a[1] < 36 and p[1] < 0))]
    side.sort(key=lambda p: d2(a, p))
    for p in side[: 1 if random.random() < 0.55 else 2]:
        if d2(a, p) < 150:
            add_edge(a, p, front=True)

# --- depth from the cover (for the draw-in order)
adj = {}
for (a, b) in edges:
    adj.setdefault(a, []).append(b)
    adj.setdefault(b, []).append(a)
frontier = list(anchors)
for a in anchors:
    depth[a] = 0
while frontier:
    nxt = []
    for p in frontier:
        for q in adj.get(p, []):
            if q not in depth:
                depth[q] = depth[p] + 1
                nxt.append(q)
    frontier = nxt

degree = {p: len(v) for p, v in adj.items()}


def op(p):
    return round(max(0.13, 0.76 - dist_to_cover(*p) / 560), 2)


def delay(p):
    return round(0.11 * depth.get(p, 6) + random.uniform(0, 0.05), 2)


back_lines, front_lines = [], []
for (a, b), meta in edges.items():
    if depth.get(a, 99) > depth.get(b, 99):
        a, b = b, a
    o = 0.55 if a in anchors else round(min(op(a), op(b)) * 0.8, 2)
    path = (f'<path d="M{a[0]:.0f} {a[1]:.0f}L{b[0]:.0f} {b[1]:.0f}" pathLength="1" '
            f'style="--d:{delay(a):.2f};--o:{o}"/>')
    (front_lines if meta['front'] else back_lines).append(path)

circles, texts = [], []
for p in nodes:
    deg = degree.get(p, 0)
    r = 2.6 + 1.5 * math.sqrt(max(deg - 1, 0))
    if p in hubs:
        r = max(r, 6.5)
    r = min(r, 9.5)
    o = min(0.95, op(p) + 0.22)
    circles.append(f'<circle cx="{p[0]:.0f}" cy="{p[1]:.0f}" r="{r:.1f}" style="--d:{delay(p) + 0.25:.2f};--o:{o:.2f}"/>')

# labels: every hub, plus a few leaves; skip anything too close to another label
labelled = []
label_pool = list(LABELS)
random.shuffle(label_pool)
for p in hubs + random.sample(leaves, k=min(10, len(leaves))):
    if not label_pool:
        break
    if any(d2(p, q) < 70 for q in labelled):
        continue
    labelled.append(p)
    r = 9.5 if p in hubs else 4
    texts.append(f'<text x="{p[0]:.0f}" y="{p[1] + r + 13:.0f}" text-anchor="middle" '
                 f'style="--d:{delay(p) + 0.45:.2f};--o:{max(0.24, op(p) * 0.9):.2f}">{label_pool.pop()}</text>')

back = ('<svg class="constellation" viewBox="0 0 600 960" preserveAspectRatio="none" aria-hidden="true" focusable="false">'
        '<g class="c-lines">' + ''.join(back_lines) + '</g>'
        '<g class="c-nodes">' + ''.join(circles) + '</g>'
        '<g class="c-labels">' + ''.join(texts) + '</g></svg>')
front = ('<svg class="constellation constellation-front" viewBox="0 0 600 960" preserveAspectRatio="none" aria-hidden="true" focusable="false">'
         '<g class="c-lines">' + ''.join(front_lines) + '</g></svg>')

open(out, 'w').write(
    '---\n// Generated from the cover\'s node positions by scripts/constellation/gen_constellation.py (v3, seed 1021).\n'
    '// Coordinates share the cover image\'s 600x960 space; see .constellation in global.css.\n'
    '// `bridges` draws the short stretch from real cover nodes across the cover edge, in front of the cover.\n'
    'interface Props { bridges?: boolean }\nconst { bridges = true } = Astro.props;\n---\n'
    + back + '\n{bridges && <Fragment set:html={' + json.dumps(front) + '} />}\n'
)
print('anchors', len(anchors), 'hubs', len(hubs), 'nodes', len(nodes), 'edges', len(edges),
      'front', len(front_lines), 'labels', len(texts), 'orphans', len(orphans))
