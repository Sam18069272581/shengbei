// 生成神明像、筊杯、签筒、祥云等 SVG 到 src/static/art/
// 风格：深色底上的金线描画，低饱和填色，神明为圆形徽章内的半身像
// 改形象时改这里，然后运行 node scripts/draw-art.mjs
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const out = join(dirname(fileURLToPath(import.meta.url)), '../src/static/art')
mkdirSync(out, { recursive: true })

const GOLD = '#d4af6e'
const GOLD_LIGHT = '#f0d9a6'
const INK = '#1a1410'
const SKIN = '#ead8bc'
const SKIN_SHADE = '#d2b994'
const LINE = `stroke="${GOLD}" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"`

const svg = (vb, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">
<style>
.glow{animation:glow 4s ease-in-out infinite}
@keyframes glow{0%,100%{opacity:.55}50%{opacity:1}}
.rays{animation:spin 40s linear infinite;transform-origin:100px 100px}
@keyframes spin{to{transform:rotate(360deg)}}
.sway{animation:sway 3.6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0}
@keyframes sway{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
</style>
${body}
</svg>`

// 圆形徽章背景：深色渐变 + 双金环 + 缓慢旋转的光芒
const medallion = (tint) => `<defs>
<radialGradient id="bg" cx=".5" cy=".38" r=".62"><stop offset="0" stop-color="${tint}"/><stop offset="1" stop-color="${INK}"/></radialGradient>
<radialGradient id="halo" cx=".5" cy=".5" r=".5"><stop offset=".55" stop-color="${GOLD_LIGHT}" stop-opacity=".0"/><stop offset=".8" stop-color="${GOLD_LIGHT}" stop-opacity=".35"/><stop offset="1" stop-color="${GOLD_LIGHT}" stop-opacity="0"/></radialGradient>
<linearGradient id="robeShade" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".5" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></linearGradient>
<clipPath id="clip"><circle cx="100" cy="100" r="92"/></clipPath>
</defs>
<circle cx="100" cy="100" r="98" fill="none" stroke="${GOLD}" stroke-width="1" opacity=".6"/>
<circle cx="100" cy="100" r="92" fill="url(#bg)" stroke="${GOLD}" stroke-width="1.8"/>
<g clip-path="url(#clip)">
<g class="rays" opacity=".18">${Array.from({ length: 24 }, (_, i) => `<line x1="100" y1="100" x2="100" y2="0" stroke="${GOLD_LIGHT}" stroke-width="${i % 2 ? 0.6 : 1.4}" transform="rotate(${i * 15} 100 100)"/>`).join('')}</g>
<circle class="glow" cx="100" cy="78" r="46" fill="url(#halo)"/>
<circle cx="100" cy="78" r="38" fill="none" stroke="${GOLD}" stroke-width=".8" opacity=".5"/>`
const medallionEnd = `</g>`

// 半身袍服：肩线 + 交领
const robe = (color, collar = GOLD) => `
<path d="M28 200 Q34 136 72 124 Q100 134 128 124 Q166 136 172 200Z" fill="${color}" ${LINE}/>
<path d="M28 200 Q34 136 72 124 Q100 134 128 124 Q166 136 172 200Z" fill="url(#robeShade)"/>
<path d="M78 126 L100 166 L122 126" fill="none" stroke="${collar}" stroke-width="5"/>
<path d="M78 126 L100 166 L122 126" fill="none" ${LINE}/>
<path d="M58 168 Q66 160 74 168 M126 168 Q134 160 142 168" fill="none" stroke="${GOLD}" stroke-width="1" opacity=".7"/>`

const neck = `<path d="M90 112 L90 128 Q100 134 110 128 L110 112Z" fill="${SKIN_SHADE}"/>`

// 头部：椭圆脸，眼为安详的弧线
const head = (skin = SKIN) => `
<ellipse cx="100" cy="86" rx="27" ry="31" fill="${skin}" ${LINE}/>
<path d="M85 88 Q90 92 95 88 M105 88 Q110 92 115 88" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>
<path d="M98 96 Q100 99 102 96" fill="none" stroke="${SKIN_SHADE}" stroke-width="1.4" stroke-linecap="round"/>
<path d="M95 104 Q100 106 105 104" fill="none" stroke="#9a3b2e" stroke-width="1.8" stroke-linecap="round"/>
<circle cx="100" cy="76" r="1.6" fill="#b8382a"/>`

// 妈祖：朱红袍、凤冠垂旒
const mazu = svg('0 0 200 200', `${medallion('#4a1f1a')}
${robe('#6e2219')}
${neck}
<path d="M72 84 Q68 120 80 132 L86 96Z M128 84 Q132 120 120 132 L114 96Z" fill="${INK}" ${LINE}/>
${head()}
<path d="M73 74 Q74 50 100 48 Q126 50 127 74 Q114 62 100 62 Q86 62 73 74Z" fill="${INK}"/>
<path d="M70 62 L76 38 L88 52 L100 30 L112 52 L124 38 L130 62 Q100 54 70 62Z" fill="${GOLD}" stroke="${GOLD_LIGHT}" stroke-width="1"/>
<path d="M70 62 Q100 54 130 62" fill="none" stroke="${GOLD_LIGHT}" stroke-width="1.2"/>
<circle cx="100" cy="44" r="4" fill="#b8382a" stroke="${GOLD_LIGHT}" stroke-width="1"/>
${[80, 88, 112, 120].map((x) => `<g class="sway"><line x1="${x}" y1="60" x2="${x}" y2="${x === 80 || x === 120 ? 84 : 72}" stroke="${GOLD}" stroke-width=".8"/><circle cx="${x}" cy="${x === 80 || x === 120 ? 84 : 72}" r="1.8" fill="${GOLD_LIGHT}"/></g>`).join('')}
${medallionEnd}`)

// 文昌帝君：青袍、展脚幞头、执笔
const wenchang = svg('0 0 200 200', `${medallion('#1c2a3c')}
${robe('#1f3550')}
${neck}
${head()}
<path d="M73 70 Q74 46 100 44 Q126 46 127 70Z" fill="${INK}" ${LINE}/>
<rect x="72" y="66" width="56" height="7" rx="2" fill="${INK}" ${LINE}/>
<path d="M72 69 L30 64 M128 69 L170 64" stroke="${GOLD}" stroke-width="2.2" stroke-linecap="round"/>
<path d="M92 110 Q100 116 108 110 Q104 124 100 126 Q96 124 92 110Z" fill="${INK}"/>
<g transform="rotate(-20 142 160)"><rect x="139" y="122" width="5" height="52" rx="2" fill="#7a5530" ${LINE}/><path d="M139 122 L141.5 108 L144 122Z" fill="${INK}" ${LINE}/></g>
${medallionEnd}`)

// 关圣帝君：绿袍、红面、长髯、青龙偃月刀
const guandi = svg('0 0 200 200', `${medallion('#16302a')}
<line x1="40" y1="200" x2="40" y2="58" stroke="${GOLD}" stroke-width="2.4"/>
<path d="M40 60 Q24 40 34 18 Q52 40 44 66Z" fill="#c9d0d2" stroke="${GOLD}" stroke-width="1.2"/>
${robe('#1d4a3a')}
${neck}
${head('#b5503f')}
<path d="M84 84 L95 86 M116 84 L105 86" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
<path d="M80 100 Q82 130 100 156 Q118 130 120 100 Q110 108 100 107 Q90 108 80 100Z" fill="${INK}" ${LINE}/>
<path d="M88 100 Q100 94 112 100" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
<path d="M70 78 Q72 46 100 44 Q128 46 130 78 Q100 62 70 78Z" fill="#1d4a3a" ${LINE}/>
<path d="M70 78 Q100 62 130 78" fill="none" stroke="${GOLD}" stroke-width="2"/>
<circle cx="100" cy="42" r="5" fill="#b8382a" stroke="${GOLD_LIGHT}" stroke-width="1"/>
${medallionEnd}`)

// 月下老人：绛红袍、白发白须、红线
const yuelao = svg('0 0 200 200', `${medallion('#3e1c22')}
${robe('#6a2028')}
${neck}
${head()}
<path d="M74 82 Q70 62 82 56 Q80 72 86 78Z M126 82 Q130 62 118 56 Q120 72 114 78Z" fill="#efe9de" ${LINE}/>
<ellipse cx="100" cy="54" rx="12" ry="8" fill="#efe9de" ${LINE}/>
<path d="M84 82 Q90 77 95 82 M105 82 Q110 77 116 82" stroke="#efe9de" stroke-width="3" fill="none" stroke-linecap="round"/>
<path d="M80 100 Q84 140 100 168 Q116 140 120 100 Q110 110 100 107 Q90 110 80 100Z" fill="#efe9de" ${LINE}/>
<path d="M88 100 Q100 93 112 100" fill="none" stroke="#efe9de" stroke-width="3" stroke-linecap="round"/>
<path class="sway" d="M150 120 Q170 140 150 156 Q132 170 152 186 Q164 194 160 200" fill="none" stroke="#c0392b" stroke-width="1.8"/>
<circle cx="150" cy="118" r="7" fill="#9e2a22" ${LINE}/>
${medallionEnd}`)

// 筊杯：新月形，平面为木色，凸面为朱漆，金色描边
const jiaoPath = 'M66 6 C24 10 6 50 8 96 C10 142 30 180 70 188 C46 162 34 128 36 96 C38 62 46 30 66 6Z'
const jiaoFlat = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 194">
<defs><linearGradient id="w" x1="0" x2="1"><stop offset="0" stop-color="#c79a62"/><stop offset="1" stop-color="#e8cc98"/></linearGradient></defs>
<path d="${jiaoPath}" fill="url(#w)" stroke="${GOLD}" stroke-width="2"/>
<path d="M54 30 C40 62 36 120 54 166 M40 44 C28 76 28 120 40 154" stroke="#9c7442" stroke-width="1.2" fill="none" opacity=".6"/>
</svg>`
const jiaoRound = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 194">
<defs><radialGradient id="g" cx=".3" cy=".3" r=".9"><stop offset="0" stop-color="#b8443a"/><stop offset=".5" stop-color="#7e1d16"/><stop offset="1" stop-color="#3a0b08"/></radialGradient></defs>
<path d="${jiaoPath}" fill="url(#g)" stroke="${GOLD}" stroke-width="2"/>
<path d="M30 40 C20 70 20 110 28 140" stroke="#fff" stroke-width="3" fill="none" opacity=".18" stroke-linecap="round"/>
</svg>`

// 祥云：金色线描
const cloud = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 60">
<path d="M10 50 Q0 50 4 40 Q8 30 22 33 Q22 16 42 16 Q54 4 72 12 Q88 4 100 18 Q122 14 126 32 Q144 32 146 44 Q148 52 136 50Z M40 40 q10 -12 20 -2 q10 10 -2 14 M92 36 q12 -12 22 0" fill="none" stroke="${GOLD}" stroke-width="1.4" stroke-linecap="round"/>
</svg>`

// 签筒：乌木漆金
const tube = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 200">
<defs><linearGradient id="t" x1="0" x2="1"><stop offset="0" stop-color="#1a1210"/><stop offset=".45" stop-color="#4a2a1e"/><stop offset="1" stop-color="#140e0c"/></linearGradient></defs>
<path d="M24 20 L136 20 L128 192 Q80 200 32 192Z" fill="url(#t)" stroke="${GOLD}" stroke-width="1.6"/>
<ellipse cx="80" cy="20" rx="56" ry="10" fill="#0e0907" stroke="${GOLD}" stroke-width="1.6"/>
<path d="M27 42 L133 42 M30 168 L130 168" stroke="${GOLD}" stroke-width="1"/>
<path d="M28 48 L132 48 M30 162 L130 162" stroke="${GOLD}" stroke-width=".6" opacity=".7"/>
<circle cx="80" cy="105" r="30" fill="none" stroke="${GOLD}" stroke-width="1.2"/>
<circle cx="80" cy="105" r="25" fill="none" stroke="${GOLD}" stroke-width=".6" opacity=".7"/>
<text x="80" y="117" font-size="32" text-anchor="middle" fill="${GOLD}" font-family="'Songti SC','STSong','Noto Serif SC',serif">签</text>
</svg>`

// 背景纹样：回纹边角
const corner = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
<path d="M2 38 V2 H38 M8 38 V8 H38 M8 20 H20 V8" fill="none" stroke="${GOLD}" stroke-width="1.2"/>
</svg>`

const files = { 'mazu.svg': mazu, 'wenchang.svg': wenchang, 'guandi.svg': guandi, 'yuelao.svg': yuelao, 'jiao-flat.svg': jiaoFlat, 'jiao-round.svg': jiaoRound, 'cloud.svg': cloud, 'tube.svg': tube, 'corner.svg': corner }
for (const [name, content] of Object.entries(files)) writeFileSync(join(out, name), content)
console.log('wrote', Object.keys(files).join(', '))
