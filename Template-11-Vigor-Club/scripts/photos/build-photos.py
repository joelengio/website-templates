#!/usr/bin/env python3
"""Optional maintainer tool: re-creates public/images/*.webp from the licensed source photographs
listed in scripts/photos/sources.json. Not needed to build or run the website.

Usage:  python3 scripts/photos/build-photos.py <folder-with-original-jpgs>
Each original is a full-resolution download named <key>.jpg (key = "id" in sources.json); it is
cover-cropped around the focal point to the exact slot size and saved as WebP."""
import json, sys, os
from PIL import Image

here = os.path.dirname(os.path.abspath(__file__))
src_dir = sys.argv[1]
out_dir = os.path.abspath(os.path.join(here, '..', '..', 'public', 'images'))
manifest = json.load(open(os.path.join(here, 'sources.json'), encoding='utf-8'))

def cover(im, w, h, fx, fy):
    s = max(w / im.width, h / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    x = min(max(round(fx * im.width - w / 2), 0), im.width - w)
    y = min(max(round(fy * im.height - h / 2), 0), im.height - h)
    return im.crop((x, y, x + w, y + h))

for slot in manifest['slots']:
    im = Image.open(os.path.join(src_dir, slot['source'] + '.jpg')).convert('RGB')
    out = cover(im, slot['width'], slot['height'], *slot.get('focus', [0.5, 0.5]))
    quality = 74 if slot['width'] >= 2000 else 78
    out.save(os.path.join(out_dir, slot['file'] + '.webp'), 'WEBP', quality=quality, method=6)
    print('wrote', slot['file'])
