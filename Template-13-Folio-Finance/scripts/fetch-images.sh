#!/usr/bin/env bash
# Re-downloads the Unsplash photographs listed in ASSET_LICENSES.md (maintainer helper; not needed to build the site).
# Usage: scripts/fetch-images.sh   (needs curl + ImageMagick `convert`)
set -euo pipefail
cd "$(dirname "$0")/../public/images"
get() { # name photo-id [w h gravity]
  local name=$1 id=$2
  curl -fsS -m 60 -o "$name.jpg" "https://images.unsplash.com/photo-$id?w=1600&q=72&fm=jpg&fit=max"
  convert "$name.jpg" -strip -interlace Plane -resize 640x "$name-640.jpg"
}
portrait() { # name photo-id
  curl -fsS -m 60 -o "$2.tmp" "https://images.unsplash.com/photo-$2?w=900&h=1100&fit=crop&crop=faces&q=74&fm=jpg"
  convert "$2.tmp" -strip -interlace Plane "$1.jpg"; rm "$2.tmp"
  convert "$1.jpg" -resize 480x "$1-480.jpg"
}
get hero-skyline 1486406146926-c627a92ad1ab
get office-interior 1497366811353-6870744d04b2
get boardroom 1431540015161-0bf868a2d407
get planning-desk 1454165804606-c3d57bc86b40
get tax-documents 1554224155-6726b3ff858f
get seedling-coins 1579621970563-ebec7560ff3e
get analytics-laptop 1460925895917-afdab827c52f
get handshake 1521791136064-7986c2920216
get signing-documents 1450101499163-c8848c66ca85
get consultation 1551836022-d5d88e9218df
get ind-startup 1568992687947-868a62a9f521
get ind-sme 1600880292203-757bb62b4baf
get ind-professional 1517048676732-d65bc937f952
get ind-retail 1556742049-0cfed4f6a45d
get ind-tech 1551434678-e076c223a692
get ind-property 1512917774080-9991f1c4c750
get ind-enterprise 1531973576160-7125cd663d86
portrait team-elena-marchetti 1573497019940-1c28c88b4f3e
portrait team-daniel-okafor 1560250097-0b93528c311a
portrait team-priya-raman 1573496359142-b8d87734a5a2
portrait team-harold-bright 1472099645785-5658abf4ff4e
portrait team-james-whitfield 1519085360753-af0119f7cbe7
portrait team-marco-silva 1500648767791-00dcc994a43e
convert hero-skyline.jpg -gravity center -crop 1200x630+0+0 +repage -quality 78 og-image.jpg
