"""Generate the hero constellation SVG from the cover's own node positions.
# Usage: python3 scripts/constellation/gen_constellation.py scripts/constellation/cover-nodes.json src/components/Constellation.astro
# cover-nodes.json = amber node centroids sampled from public/cover/rp-cover-600.jpg (x, y, area).
# Regenerate whenever the final cover master changes.

Coordinates are in the cover's 600x960 space, so the SVG can sit exactly on the
cover image (viewBox 0 0 600 960, overflow visible) and its lines appear to leave
the cover's edge nodes and spread across the hero. Deterministic (seeded).
"""
import json, math, random, sys

dots = json.load(open(sys.argv[1]))
out = sys.argv[2]
random.seed(1729)

W, H = 600, 960
# Anchors: the cover's own nodes nearest each edge (title band excluded upstream).
anchors = [(x, y) for x, y, s in dots if x < 60 or x > 540 or y < 60]
anchors += [(0, 640), (600, 640)]  # lower flanks so the field reaches the title band

def dist_to_cover(x, y):
    dx = max(0 - x, 0, x - W)
    dy = max(0 - y, 0, y - H)
    return math.hypot(dx, dy)

# Halo: nodes hug the cover and thin out fast, so the network reads as the
# cover's own field spilling past its edges, not a page-wide "plexus" texture.
nodes = []
tries = 0
while len(nodes) < 46 and tries < 80000:
    tries += 1
    x, y = random.uniform(-340, 900), random.uniform(-260, 1240)
    d = dist_to_cover(x, y)
    if d < 22 or d > 320:
        continue
    if random.random() > math.exp(-d / 120):
        continue
    spacing = 44 + d * 0.12
    if any(math.hypot(x - a, y - b) < spacing for a, b in nodes + anchors):
        continue
    nodes.append((x, y))

nodes.sort(key=lambda p: dist_to_cover(*p))
placed = [(a, 0) for a in anchors]
edges = []
depth = {}
for p in nodes:
    cands = sorted(placed, key=lambda q: math.hypot(p[0] - q[0][0], p[1] - q[0][1]))
    parent, pd = cands[0]
    edges.append((parent, p, pd))
    if len(cands) > 1 and random.random() < 0.3:
        q, qd = cands[1]
        if math.hypot(p[0] - q[0], p[1] - q[1]) < 150:
            edges.append((q, p, qd))
    depth[p] = pd + 1
    placed.append((p, pd + 1))

# Tendrils: three chains leave the cover's left edge and reach toward the
# headline, fading out before they reach the text column.
left_anchors = sorted([a for a in anchors if a[0] < 60], key=lambda a: a[1])
starts = [left_anchors[1], left_anchors[len(left_anchors) // 2], (0, 640)]
for sx, sy in starts:
    ang = math.pi + random.uniform(-0.35, 0.35)
    prev, dep = (sx, sy), 0
    for step in range(random.randint(5, 7)):
        ang += random.uniform(-0.45, 0.45)
        ang = min(max(ang, math.pi - 0.7), math.pi + 0.7)
        L = random.uniform(48, 78)
        nxt = (prev[0] + L * math.cos(ang), prev[1] + L * math.sin(ang))
        if nxt[0] < -470:
            break
        edges.append((prev, nxt, dep))
        dep += 1
        depth[nxt] = dep
        nodes.append(nxt)
        prev = nxt

maxd = max(depth.values())

def op(p):
    d = dist_to_cover(*p)
    return round(max(0.07, 0.6 - d / 560), 2)

def delay(dep):
    return round(0.12 * dep + random.uniform(0, 0.08), 2)

lines = []
for a, b, dep in edges:
    lines.append(
        f'<path d="M{a[0]:.0f} {a[1]:.0f}L{b[0]:.0f} {b[1]:.0f}" pathLength="1" '
        f'style="--d:{delay(dep)};--o:{op(b)}"/>'
    )
circles = []
for p in nodes:
    r = 3.6 if random.random() < 0.14 else 2.2
    circles.append(
        f'<circle cx="{p[0]:.0f}" cy="{p[1]:.0f}" r="{r}" style="--d:{delay(depth[p]) + 0.35:.2f};--o:{min(0.95, op(p) + 0.25):.2f}"/>'
    )
# two quiet rings echo the cover's orbit motif
rings = []
for p in random.sample([n for n in nodes if 60 < dist_to_cover(*n) < 220], 2):
    rings.append(
        f'<circle class="ring" cx="{p[0]:.0f}" cy="{p[1]:.0f}" r="22" style="--d:{delay(depth[p]) + 0.5:.2f};--o:{op(p):.2f}"/>'
    )

svg = (
    '<svg class="constellation" viewBox="0 0 600 960" preserveAspectRatio="none" '
    'aria-hidden="true" focusable="false">'
    '<g class="c-lines">' + ''.join(lines) + '</g>'
    '<g class="c-nodes">' + ''.join(circles + rings) + '</g>'
    '</svg>'
)
open(out, 'w').write(
    '---\n// Generated from the cover\'s node positions by gen_constellation.py (seed 1729).\n'
    '// Coordinates share the cover image\'s 600x960 space; see .constellation in global.css.\n---\n'
    + svg + '\n'
)
print(len(nodes), len(edges), maxd, len(svg))
