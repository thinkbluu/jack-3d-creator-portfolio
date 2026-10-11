import json, os, numpy as np
from PIL import Image
from scipy import ndimage as ndi

BG = np.array([0x0B, 0x0F, 0x16])
SIGN = np.array([0xF2, 0xEC, 0xE3])
WIN = np.array([0x17, 0x2A, 0x41])

def dist(a, c):
    return np.sqrt(((a[..., :3].astype(np.int32) - c) ** 2).sum(-1))

def comps(mask, min_frac=0.002):
    lab, n = ndi.label(mask)
    out = []
    for i, sl in enumerate(ndi.find_objects(lab), 1):
        area = int((lab[sl] == i).sum())
        if area >= min_frac * mask.size:
            y, x = sl
            out.append({'x': x.start, 'y': y.start, 'w': x.stop - x.start, 'h': y.stop - y.start, 'area': area})
    return sorted(out, key=lambda r: -r['area'])

def cutout(name, kind):
    im = np.array(Image.open(f'png/{name}.png').convert('RGBA'))
    rgb = im[..., :3]
    content = (dist(im, BG) > 22) & (dist(im, np.array([7, 7, 6])) > 14)
    r = 8
    closed = ndi.binary_dilation(content, iterations=r)
    filled = ndi.binary_fill_holes(closed)
    sil = ndi.binary_erosion(filled, iterations=r)
    # keep only the largest silhouette pieces (drop stray specks)
    lab, n = ndi.label(sil)
    if n > 1:
        sizes = ndi.sum(sil, lab, range(1, n + 1))
        keep = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > 0.01 * sil.sum()])
        sil = keep
    alpha = (ndi.gaussian_filter(sil.astype(float), 0.8) * 255).clip(0, 255).astype(np.uint8)
    ys, xs = np.where(sil)
    pad = 4
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad + 1, sil.shape[0])
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad + 1, sil.shape[1])
    out = np.dstack([rgb, alpha])[y0:y1, x0:x1]
    os.makedirs(f'out/{kind}/{name}', exist_ok=True)
    base = f'out/{kind}/{name}'
    Image.fromarray(out).save(f'{base}/{"facade" if kind == "shops" else "sign"}.webp', quality=90, method=6)
    meta = {'width': int(x1 - x0), 'height': int(y1 - y0)}
    if kind == 'shops':
        crop = im[y0:y1, x0:x1]
        silc = sil[y0:y1, x0:x1]
        sign = (dist(crop, SIGN) < 14) & silc
        win = (dist(crop, WIN) < 12) & silc
        sign = ndi.binary_opening(sign, iterations=2)
        # Only the sign board itself: drop any other cream patch of the drawing.
        lab, n = ndi.label(sign)
        if n > 1:
            sizes = ndi.sum(sign, lab, range(1, n + 1))
            sign = lab == (int(np.argmax(sizes)) + 1)
        win = ndi.binary_opening(win, iterations=2)
        Image.fromarray((sign * 255).astype(np.uint8)).save(f'{base}/mask-sign.png', optimize=True)
        Image.fromarray((win * 255).astype(np.uint8)).save(f'{base}/mask-window.png', optimize=True)
        meta['sign'] = comps(sign)[:1]
        meta['windows'] = comps(win)[:8]
        meta['groundY'] = int(ys.max() - y0)
    return meta

manifest = {'shops': {}, 'signs': {}, 'backdrops': []}
shops = ['hero', 'veterinaria-timisoara', 'agd-innerpath-consulting', 'decodex', 'oncogen', 'painea-casei', 'asesor', 'visitor', 'empty-lot']
for s in shops:
    manifest['shops'][s] = cutout(s, 'shops')
    print(s, manifest['shops'][s]['width'], manifest['shops'][s]['height'], 'sign', manifest['shops'][s]['sign'], 'windows', len(manifest['shops'][s]['windows']))
for s in ['cabinet-veterinar', 'consultanta', 'birou-proiecte', 'laborator', 'utilaje-panificatie', 'salon']:
    manifest['signs'][s] = cutout(s, 'old-signs')
    print('sign', s, manifest['signs'][s])
# lit hero still: keep opaque, it is a fallback image
Image.open('png/hero-lit.png').convert('RGB').save('out/shops/hero/lit.webp', quality=88, method=6)
os.makedirs('out/backdrop', exist_ok=True)
for i in (1, 2, 3):
    Image.open(f'png/backdrop-{i}.png').convert('RGB').save(f'out/backdrop/backdrop-{i}.webp', quality=86, method=6)
    manifest['backdrops'].append(f'backdrop/backdrop-{i}.webp')
json.dump(manifest, open('out/manifest.json', 'w'), indent=2)

# CSS masks read the alpha channel, so each mask also gets an alpha version (mask-*-a.png).
import glob as _glob
for _f in _glob.glob('out/shops/*/mask-*.png'):
    if _f.endswith('-a.png'):
        continue
    _m = Image.open(_f).convert('L')
    Image.merge('LA', (Image.new('L', _m.size, 255), _m)).save(_f.replace('.png', '-a.png'), optimize=True)
