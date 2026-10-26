#!/usr/bin/env python3
"""Original home artwork. Static SVG palette is exported from the current training tokens."""
from pathlib import Path
import re,sys
R=Path(__file__).resolve().parents[1]
A=R/'miniprogram/images/module-home'
theme=(R/'miniprogram/styles/theme.wxss').read_text()
def token(n):
 return re.search(r'--'+n+r':\s*(#[0-9a-fA-F]+)',theme)[1]
b=token('color-primary-600');p=token('color-primary-100');g=token('color-green-700');w=token('bg-card')
art={
'book':f'<path d="M5 7q5-1 11 2v18q-6-3-11-2z" fill="{b}"/><path d="M16 9q6-3 11-2v18q-5-1-11 2z" fill="{p}"/><path d="M16 10v16" stroke="{w}"/><path d="M23 7v8l-2-1-2 1V8z" fill="{g}"/>',
'route':f'<rect x="4" y="5" width="10" height="10" rx="3" fill="{b}"/><rect x="18" y="18" width="10" height="10" rx="3" fill="{p}"/><path d="M9 18v3q0 2 3 2h4M17 10h3q3 0 3 3v3" stroke="{b}" fill="none"/><path d="m20 13 3 3 3-3" stroke="{g}" fill="none"/><circle cx="9" cy="10" r="2" fill="{w}"/><circle cx="23" cy="23" r="2" fill="{g}"/>',
'compare':f'<rect x="3" y="6" width="11" height="21" rx="3" fill="{b}"/><rect x="18" y="6" width="11" height="21" rx="3" fill="{p}"/><path d="M7 12h3m-3 5h3" stroke="{w}"/><path d="M22 12h3m-3 5h3" stroke="{b}"/><path d="M11 23h10m-3-3 3 3-3 3" stroke="{g}" fill="none"/>',
'memory':f'<rect x="5" y="4" width="19" height="23" rx="3" fill="{b}" transform="rotate(-8 14 15)"/><rect x="10" y="8" width="18" height="22" rx="3" fill="{p}"/><path d="M14 14h10m-10 4h6" stroke="{b}"/><path d="m16 24 3 3 5-6" stroke="{g}" fill="none"/>',
'application':f'<rect x="6" y="3" width="21" height="27" rx="4" fill="{p}"/><path d="M10 3h13v8H10z" fill="{b}"/><path d="M11 16h10m-10 4h6" stroke="{b}"/><circle cx="12" cy="25" r="2" fill="{g}"/><path d="M17 25h5" stroke="{g}"/>',
'daily-memory':f'<rect x="5" y="6" width="22" height="23" rx="4" fill="{b}"/><rect x="9" y="3" width="17" height="21" rx="3" fill="{p}"/><path d="M13 9h8m-8 5h5" stroke="{b}"/><path d="M6 17q-4-8 4-11m-2-2 2 2-1 3" stroke="{g}" fill="none"/>',
'daily-common':f'<rect x="4" y="16" width="24" height="12" rx="3" fill="{b}"/><rect x="6" y="10" width="20" height="12" rx="3" fill="{p}"/><rect x="8" y="4" width="16" height="12" rx="3" fill="{w}" stroke="{p}"/><path d="M16 7v6m-3-3h6" stroke="{g}"/><path d="M10 23h12" stroke="{w}"/>',
'daily-theory':f'<rect x="3" y="4" width="26" height="24" rx="6" fill="{p}"/><path d="m9 19 7-9 7 10M9 19h14" stroke="{b}" fill="none"/><circle cx="16" cy="10" r="4" fill="{b}"/><circle cx="9" cy="20" r="3" fill="{b}"/><circle cx="23" cy="20" r="3" fill="{g}"/>',
'directory':f'<path d="M8 48h63v7H8z" fill="{p}"/><path d="m12 14 14-3 8 37-14 3z" fill="{p}"/><path d="m12 14 5-1 8 37-5 1z" fill="{b}"/><rect x="29" y="8" width="19" height="43" rx="3" fill="{b}"/><path d="M34 15h9m-9 5h6" stroke="{w}"/><path d="M36 8v9l3-2 3 2V8z" fill="{g}"/><rect x="46" y="18" width="23" height="33" rx="3" fill="{p}"/><path d="M49 18h17v4H49z" fill="{w}"/><path d="M51 29h12m-12 6h9m-9 6h6" stroke="{b}"/><path d="M65 27h7v5h-7zm0 9h7v5h-7z" fill="{g}"/>',
}
A.mkdir(exist_ok=True)
def svg(name):
 box='0 0 80 64' if name=='directory' else '0 0 32 32'
 return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">{art[name]}</svg>\n'
for n in art:(A/(n+'.svg')).write_text(svg(n))
if len(sys.argv)>1:
 # At 750rpx viewport, ordinary=28px/daily=22px/directory=48x36px.
 rows=[]
 for i,n in enumerate(art):
  y=55+i*78;size=48 if n=='directory' else 22 if n.startswith('daily-') else 28;h=36 if n=='directory' else size
  rows.append(f'<text x="20" y="{y+22}" font-size="16" fill="#111827">{n}</text><svg x="200" y="{y}" width="{size}" height="{h}" viewBox="'+('0 0 80 64' if n=='directory' else '0 0 32 32')+f'" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">{art[n]}</svg><svg x="340" y="{y-10}" width="{size*2}" height="{h*2}" viewBox="'+('0 0 80 64' if n=='directory' else '0 0 32 32')+f'" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">{art[n]}</svg>')
 Path(sys.argv[1]).write_text('<svg xmlns="http://www.w3.org/2000/svg" width="790" height="790" viewBox="0 0 790 790"><rect width="790" height="790" fill="white"/><text x="20" y="26" font-size="16">Asset proof — 1x logical / 2x enlarged; not a page</text>'+''.join(rows)+'</svg>')
