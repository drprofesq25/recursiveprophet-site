"""Generate the hero constellation from the cover's own node positions (v2).

Usage: python3 scripts/constellation/gen_constellation.py scripts/constellation/cover-nodes.json src/components/Constellation.astro
cover-nodes.json = amber node centroids sampled from public/cover/rp-cover-600.jpg (x, y, area).
Regenerate whenever the final cover master changes.

Coordinates are in the cover's 600x960 space, so the SVG sits exactly on the cover image
(viewBox 0 0 600 960, overflow visible).

v2 (2026-10-21):
- Bridges: every outside line starts at a REAL cover node near an edge. The short stretch
  from that node across the cover's edge is drawn in a second SVG layered in front of the
  cover, so the line visibly leaves a node on the cover instead of appearing from nowhere.
- Graph, not just constellation: hubs with spokes, small clusters, a few cross-links and a
  few unlinked nodes, with node size set by degree (an Obsidian-style knowledge graph).
- Deterministic (seeded).
"""
import json
import math
import random
import sys

dots = json.load(open(sys.argv[1]))
out = sys.argv[2]
random.seed(20261021)

W, H = 600, 960
TITLE_Y = 650  # below this the cover is the title band; no anchors there


def dist_to_cover(x, y):
    dx = max(0 - x, 0, x - W)
    dy = max(0 - y, 0, y - H)
    return math.hypot(dx, dy)


def d2(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])


# --- anchors: real cover nodes close to an edge (left, right, top), above the title band
cands = [(x, y, s) for x, y, s in dots if y < TITLE_Y and s >= 6 and (x < 48 or x > 552 or y < 36)]
cands.sort(key=lambda d: -d[2])
anchors = []
for x, y, s in cands:
    if all(d2((x, y), a) > 30 for a in anchors):
        anchors.append((x, y))

# --- outside nodes: dense near the cover, thinning with distance
nodes = []
tries = 0
while len(nodes) < 138 and tries < 400000:
    tries += 1
    x, y = random.uniform(-520, 1120), random.uniform(-330, 1270)
    d = dist_to_cover(x, y)
    if d < 26 or d > 470:
        continue
    if random.random() > math.exp(-d / 210):
        continue
    spacing = 30 + d * 0.11
    if any(d2((x, y), p) < spacing for p in nodes + anchors):
        continue
    nodes.append((x, y))

nodes.sort(key=lambda p: dist_to_cover(*p))

edges = {}  # (a, b) -> {'front': bool}
depth = {a: 0 for a in anchors}


def crosses_cover(a, b, pad=4):
    """True if segment a-b passes over the cover rectangle (bridges excepted)."""
    for t in [i / 24 for i in range(1, 24)]:
        x, y = a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t
        if -pad < x < W + pad and -pad < y < H + pad:
            return True
    return False


def add_edge(a, b, front=False):
    if not front and crosses_cover(a, b):
        return False
    key = (a, b) if a <= b else (b, a)
    if key not in edges:
        edges[key] = {'front': front}
    return True


# 1. bridges: each anchor reaches outward to its nearest outside node on the far side of its edge
for a in anchors:
    outward = [p for p in nodes if dist_to_cover(*p) < 140 and (
        (a[0] < 48 and p[0] < 0) or (a[0] > 552 and p[0] > W) or (a[1] < 36 and p[1] < 0))]
    outward.sort(key=lambda p: d2(a, p))
    for p in outward[: 1 if random.random() < 0.6 else 2]:
        add_edge(a, p, front=True)
        depth[p] = 1

# 2. tree: everything else hangs off the nearest already-placed node
placed = list(anchors) + [p for p in nodes if p in depth]
orphans = set()
for p in nodes:
    if p in depth:
        continue
    if dist_to_cover(*p) > 200 and random.random() < 0.06:
        orphans.add(p)  # Obsidian-style unlinked notes
        depth[p] = 6
        continue
    linked = sorted((q for q in placed if q not in orphans and q not in anchors), key=lambda q: d2(p, q))
    for q in linked:
        if add_edge(q, p):
            depth[p] = depth[q] + 1
            break
    else:
        orphans.add(p)
        depth[p] = 6
        continue
    placed.append(p)

# 3. hubs: a handful of well-spread nodes gather spokes
hub_pool = [p for p in nodes if p not in orphans and 70 < dist_to_cover(*p) < 380]
random.shuffle(hub_pool)
hubs = []
for p in hub_pool:
    if all(d2(p, h) > 230 for h in hubs):
        hubs.append(p)
    if len(hubs) >= 9:
        break
for h in hubs:
    near = sorted((q for q in nodes if q != h and q not in orphans), key=lambda q: d2(h, q))
    for q in near[: random.randint(3, 6)]:
        if d2(h, q) < 175:
            add_edge(h, q)

# 4. a few cross-links so it meshes like the cover instead of branching like a tree
for p in nodes:
    if p in orphans or random.random() > 0.28:
        continue
    near = sorted((q for q in nodes if q != p and q not in orphans), key=lambda q: d2(p, q))
    for q in near[1:3]:
        if d2(p, q) < 115:
            add_edge(p, q)
            break

degree = {}
for (a, b) in edges:
    degree[a] = degree.get(a, 0) + 1
    degree[b] = degree.get(b, 0) + 1


def op(p):
    return round(max(0.08, 0.64 - dist_to_cover(*p) / 640), 2)


def delay(p):
    return round(0.085 * depth.get(p, 4) + random.uniform(0, 0.06), 2)


back_lines, front_lines = [], []
for (a, b), meta in edges.items():
    # draw outward: from the shallower end
    if depth.get(a, 9) > depth.get(b, 9):
        a, b = b, a
    o = op(b) if a not in anchors else 0.55
    path = (f'<path d="M{a[0]:.0f} {a[1]:.0f}L{b[0]:.0f} {b[1]:.0f}" pathLength="1" '
            f'style="--d:{delay(a):.2f};--o:{o}"/>')
    (front_lines if meta['front'] else back_lines).append(path)

circles = []
for p in nodes:
    deg = degree.get(p, 0)
    r = min(6.0, 2.0 + 1.05 * math.sqrt(max(deg - 1, 0)))
    if p in hubs:
        r = max(r, 4.6)
    o = min(0.95, op(p) + 0.25)
    circles.append(f'<circle cx="{p[0]:.0f}" cy="{p[1]:.0f}" r="{r:.1f}" style="--d:{delay(p) + 0.3:.2f};--o:{o:.2f}"/>')
rings = []
for h in hubs[:4]:
    rings.append(f'<circle class="ring" cx="{h[0]:.0f}" cy="{h[1]:.0f}" r="15" style="--d:{delay(h) + 0.45:.2f};--o:{op(h):.2f}"/>')

back = ('<svg class="constellation" viewBox="0 0 600 960" preserveAspectRatio="none" aria-hidden="true" focusable="false">'
        '<g class="c-lines">' + ''.join(back_lines) + '</g>'
        '<g class="c-nodes">' + ''.join(circles + rings) + '</g></svg>')
front = ('<svg class="constellation constellation-front" viewBox="0 0 600 960" preserveAspectRatio="none" aria-hidden="true" focusable="false">'
         '<g class="c-lines">' + ''.join(front_lines) + '</g></svg>')

open(out, 'w').write(
    '---\n// Generated from the cover\'s node positions by scripts/constellation/gen_constellation.py (v2, seed 20261021).\n'
    '// Coordinates share the cover image\'s 600x960 space; see .constellation in global.css.\n'
    '// `bridges` draws the short stretch from real cover nodes across the cover edge, in front of the cover.\n'
    'interface Props { bridges?: boolean }\nconst { bridges = true } = Astro.props;\n---\n'
    + back + '\n{bridges && <Fragment set:html={' + json.dumps(front) + '} />}\n'
)
print('anchors', len(anchors), 'nodes', len(nodes), 'edges', len(edges), 'front', len(front_lines), 'hubs', len(hubs), 'orphans', len(orphans))
