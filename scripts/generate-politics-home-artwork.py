from pathlib import Path
import re,sys
R=Path(__file__).resolve().parents[1];A=R/'miniprogram/images/politics-home';A.mkdir(exist_ok=True)
t=(R/'miniprogram/styles/theme.wxss').read_text()
def c(n):return re.search(r'--'+n+r':\s*(#[0-9a-fA-F]+)',t)[1]
b=c('color-primary-500');d=c('color-primary-600');l=c('color-primary-100');g=c('color-green-500');w=c('bg-card')
art={
'route':f'<rect x="3" y="19" width="8" height="10" rx="2" fill="{d}"/><rect x="12" y="12" width="8" height="17" rx="2" fill="{b}"/><path d="M21 5h8v24h-8z" fill="{l}"/><path d="M7 13V7h11V3l7 7-7 7v-4z" fill="{b}"/>',
'book':f'<rect x="10" y="4" width="18" height="25" rx="3" fill="{l}"/><rect x="4" y="2" width="19" height="26" rx="3" fill="{b}"/><path d="M7 2h4v26H7z" fill="{d}"/><rect x="14" y="7" width="5" height="3" rx="1" fill="{w}"/>',
'compare':f'<rect x="3" y="5" width="17" height="20" rx="5" fill="{d}"/><rect x="12" y="10" width="17" height="20" rx="5" fill="{b}"/><path d="M12 10h8v15h-8z" fill="{l}"/><path d="m7 12 4 3-4 3zm18 6-4 3 4 3z" fill="{w}"/>',
'memory':f'<rect x="7" y="3" width="21" height="23" rx="4" fill="{l}"/><rect x="3" y="7" width="21" height="23" rx="4" fill="{b}"/><path d="M7 12h11v3H7zm0 6h7v3H7z" fill="{w}"/><path d="M20 3h8v8h-4V7h-4z" fill="{d}"/>',
'daily-theory':f'<rect x="9" y="4" width="17" height="24" rx="4" fill="{d}"/><rect x="4" y="8" width="18" height="22" rx="4" fill="{b}"/><path d="M8 13h9v3H8zm0 6h6v3H8z" fill="{w}"/><rect x="19" y="17" width="10" height="10" rx="3" fill="{g}"/><path d="M21 20h5v2h-5zm2 2h3v2h-3z" fill="{w}"/>',
# Wide open directory: two readable page planes and three chapter tabs.
'directory':f'<path d="M7 9h27c7 0 12 3 14 6v30c-4-3-9-5-15-5H7z" fill="{l}"/><path d="M48 15c4-4 9-6 16-6h22v31H64c-7 0-12 2-16 5z" fill="{b}"/><path d="M48 15v30c3-3 7-4 12-5V10c-5 1-9 3-12 5z" fill="{d}"/><path d="M11 5h22c7 0 12 3 15 6v30c-4-4-9-6-16-6H11z" fill="{w}"/><path d="M48 11c4-4 9-6 16-6h18v30H64c-7 0-12 2-16 6z" fill="{l}"/><rect x="78" y="8" width="13" height="8" rx="2" fill="{g}"/><rect x="78" y="20" width="15" height="8" rx="2" fill="{b}"/><rect x="78" y="32" width="12" height="8" rx="2" fill="{d}"/><rect x="18" y="13" width="21" height="4" rx="2" fill="{b}"/><path d="M18 21h21v3H18zm0 7h16v3H18z" fill="{l}"/><path d="M57 14h15v3H57zm0 7h15v3H57zm0 7h11v3H57z" fill="{b}"/>',
}
for n,v in art.items():
 box='0 0 96 48' if n=='directory' else '0 0 32 32'
 (A/(n+'.svg')).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{box}">{v}</svg>\n')
if len(sys.argv)>1:
 rows=[]
 for i,(n,v) in enumerate(art.items()):
  y=55+i*95;size=72 if n=='directory' else 48 if n=='daily-theory' else 28;h=36 if n=='directory' else size;box='0 0 96 48' if n=='directory' else '0 0 32 32'
  rows.append(f'<text x="20" y="{y+20}" font-size="16">{n}</text><svg x="190" y="{y}" width="{size}" height="{h}" viewBox="{box}">{v}</svg><svg x="330" y="{y-8}" width="{size*2}" height="{h*2}" viewBox="{box}">{v}</svg>')
 Path(sys.argv[1]).write_text('<svg xmlns="http://www.w3.org/2000/svg" width="700" height="700" viewBox="0 0 700 700"><rect width="700" height="700" fill="white"/><text x="20" y="25" font-size="16">Politics geometry / 1x logical and 2x / asset proof only</text>'+''.join(rows)+'</svg>')
