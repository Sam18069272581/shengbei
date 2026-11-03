// 生成 Q 版神明形象、筊杯、祥云等 SVG 到 src/static/art/
// 改形象时改这里，然后运行 node scripts/draw-art.mjs
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const out = join(dirname(fileURLToPath(import.meta.url)), '../src/static/art')
mkdirSync(out, { recursive: true })

const INK = '#2b1d14'
const SKIN = '#ffe2c8'
const GOLD = '#e8b54a'

const svg = (vb, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">
<style>
.eye{animation:blink 4.5s infinite;transform-box:fill-box;transform-origin:center}
@keyframes blink{0%,93%,100%{transform:scaleY(1)}96%{transform:scaleY(.1)}}
.sway{animation:sway 3s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0}
@keyframes sway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
</style>
${body}
</svg>`

// 通用部件 -------------------------------------------------------------
const robe = (color, trim) => `
<path d="M58 142 Q100 128 142 142 L166 230 Q100 244 34 230 Z" fill="${color}"/>
<path d="M58 142 Q100 128 142 142 L166 230 Q100 244 34 230 Z" fill="url(#shade)" opacity=".25"/>
<path d="M82 138 L100 168 L118 138" fill="none" stroke="${trim}" stroke-width="7" stroke-linejoin="round"/>
<path d="M44 214 Q100 226 156 214" fill="none" stroke="${trim}" stroke-width="6" stroke-linecap="round"/>
<ellipse cx="54" cy="186" rx="22" ry="30" fill="${color}" transform="rotate(18 54 186)"/>
<ellipse cx="146" cy="186" rx="22" ry="30" fill="${color}" transform="rotate(-18 146 186)"/>
<circle cx="62" cy="206" r="10" fill="${SKIN}"/>
<circle cx="138" cy="206" r="10" fill="${SKIN}"/>`

const defs = `<defs>
<linearGradient id="shade" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".0"/><stop offset=".5" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>
<radialGradient id="aura" cx=".5" cy=".42" r=".5"><stop offset="0" stop-color="#ffe9a8" stop-opacity=".9"/><stop offset=".7" stop-color="#ffd36b" stop-opacity=".25"/><stop offset="1" stop-color="#ffd36b" stop-opacity="0"/></radialGradient>
</defs>
<circle cx="100" cy="100" r="98" fill="url(#aura)"/>`

const head = (skin = SKIN) => `
<circle cx="48" cy="100" r="9" fill="${skin}"/><circle cx="152" cy="100" r="9" fill="${skin}"/>
<circle cx="100" cy="94" r="52" fill="${skin}"/>`

const face = ({ brows = '', blush = '#ff9a8a', mouth = 'M91 117 Q100 126 109 117' } = {}) => `
<ellipse class="eye" cx="82" cy="100" rx="5.5" ry="7.5" fill="${INK}"/>
<ellipse class="eye" cx="118" cy="100" rx="5.5" ry="7.5" fill="${INK}"/>
<circle cx="84" cy="97" r="2" fill="#fff"/><circle cx="120" cy="97" r="2" fill="#fff"/>
<ellipse cx="70" cy="114" rx="9" ry="5" fill="${blush}" opacity=".55"/>
<ellipse cx="130" cy="114" rx="9" ry="5" fill="${blush}" opacity=".55"/>
${brows}
<path d="${mouth}" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`

const hairCap = (c) => `<path d="M48 96 Q48 40 100 40 Q152 40 152 96 Q146 70 100 66 Q54 70 48 96Z" fill="${c}"/>`

// 妈祖：红衣金冠，冠垂珠串 -------------------------------------------------
const mazu = svg('0 0 200 240', `${defs}
${robe('#c8322a', GOLD)}
<path d="M48 96 Q40 140 58 150 L62 110Z M152 96 Q160 140 142 150 L138 110Z" fill="${INK}"/>
${head()}
${hairCap(INK)}
${face()}
<g>
<path d="M56 62 Q100 48 144 62 L140 74 Q100 62 60 74Z" fill="${GOLD}"/>
<path d="M62 62 L70 34 L84 54 L100 22 L116 54 L130 34 L138 62Z" fill="${GOLD}" stroke="#c98f22" stroke-width="2"/>
<circle cx="100" cy="44" r="7" fill="#e0473a"/><circle cx="74" cy="50" r="4" fill="#4fb0a0"/><circle cx="126" cy="50" r="4" fill="#4fb0a0"/>
</g>
<g class="sway"><line x1="60" y1="72" x2="56" y2="118" stroke="${GOLD}" stroke-width="2"/><circle cx="58" cy="90" r="3" fill="#fff6d0"/><circle cx="57" cy="104" r="3" fill="#fff6d0"/><circle cx="56" cy="118" r="4" fill="#e0473a"/></g>
<g class="sway"><line x1="140" y1="72" x2="144" y2="118" stroke="${GOLD}" stroke-width="2"/><circle cx="142" cy="90" r="3" fill="#fff6d0"/><circle cx="143" cy="104" r="3" fill="#fff6d0"/><circle cx="144" cy="118" r="4" fill="#e0473a"/></g>
<g transform="rotate(-30 140 200)"><rect x="137" y="168" width="6" height="44" rx="3" fill="${GOLD}"/><path d="M128 170 q12 -22 24 0 q-12 8 -24 0Z" fill="${GOLD}" stroke="#c98f22" stroke-width="2"/></g>`)

// 文昌帝君：蓝袍幞头，手执毛笔 ----------------------------------------------
const wenchang = svg('0 0 200 240', `${defs}
${robe('#3b6fb6', '#f3d9a4')}
${head()}
${hairCap(INK)}
${face({ brows: `<path d="M72 86 Q82 82 90 86 M110 86 Q118 82 128 86" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`, mouth: 'M93 118 Q100 124 107 118' })}
<path d="M92 128 Q100 140 108 128" fill="${INK}"/>
<path d="M58 66 Q60 30 100 28 Q140 30 142 66Z" fill="#1f1a24"/>
<rect x="56" y="60" width="88" height="10" rx="4" fill="#1f1a24"/>
<rect x="10" y="58" width="48" height="6" rx="3" fill="#1f1a24"/>
<rect x="142" y="58" width="48" height="6" rx="3" fill="#1f1a24"/>
<circle cx="100" cy="48" r="5" fill="${GOLD}"/>
<g transform="rotate(-25 140 200)"><rect x="136" y="150" width="7" height="58" rx="3" fill="#8a5a2b"/><path d="M136 150 L139.5 132 L143 150Z" fill="${INK}"/></g>
<rect x="44" y="196" width="30" height="16" rx="4" fill="#f6ecd2" stroke="#c9a46a" stroke-width="2"/>`)

// 关圣帝君：红脸长髯，绿袍绿巾，青龙偃月刀 -----------------------------------
const guandi = svg('0 0 200 240', `${defs}
<g><line x1="24" y1="236" x2="24" y2="70" stroke="#8a5a2b" stroke-width="6" stroke-linecap="round"/>
<path d="M24 70 Q4 40 20 14 Q40 40 30 76Z" fill="#cfd8dc" stroke="#7a8a90" stroke-width="2"/>
<path d="M20 76 h14" stroke="${GOLD}" stroke-width="6"/></g>
${robe('#2f7d4f', GOLD)}
${head('#d9493a')}
${face({
  blush: '#a8281c',
  brows: `<path d="M68 88 L92 92 M132 88 L108 92" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>`,
  mouth: 'M93 117 Q100 121 107 117',
})}
<path d="M76 118 Q78 150 100 186 Q122 150 124 118 Q112 128 100 126 Q88 128 76 118Z" fill="${INK}"/>
<path d="M84 114 Q92 110 100 114 Q108 110 116 114" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>
<path d="M50 84 Q52 34 100 32 Q148 34 150 84 Q100 62 50 84Z" fill="#2f7d4f"/>
<path d="M50 84 Q100 62 150 84" stroke="${GOLD}" stroke-width="4" fill="none"/>
<circle cx="100" cy="30" r="9" fill="#e0473a"/>`)

// 月下老人：白发白须红袍，手持红线团与拐杖 -----------------------------------
const yuelao = svg('0 0 200 240', `${defs}
<line x1="170" y1="236" x2="160" y2="120" stroke="#8a5a2b" stroke-width="6" stroke-linecap="round"/>
<ellipse cx="160" cy="114" rx="9" ry="12" fill="${GOLD}"/><circle cx="160" cy="100" r="6" fill="${GOLD}"/>
${robe('#d23c3c', '#ffe6a8')}
${head()}
<path d="M50 100 Q44 70 62 60 Q58 84 66 92Z M150 100 Q156 70 138 60 Q142 84 134 92Z" fill="#f4f1ea"/>
<ellipse cx="100" cy="40" rx="14" ry="11" fill="#f4f1ea"/>
${face({ brows: `<path d="M70 88 Q80 80 90 88 M110 88 Q120 80 130 88" stroke="#f4f1ea" stroke-width="6" fill="none" stroke-linecap="round"/>`, mouth: 'M92 116 Q100 123 108 116' })}
<path d="M74 118 Q80 164 100 196 Q120 164 126 118 Q112 130 100 126 Q88 130 74 118Z" fill="#f4f1ea"/>
<path d="M82 116 Q100 106 118 116" stroke="#f4f1ea" stroke-width="6" fill="none" stroke-linecap="round"/>
<circle cx="54" cy="206" r="14" fill="#e0473a"/>
<path d="M44 200 Q54 212 64 200 M42 208 Q54 218 66 208" stroke="#a3160d" stroke-width="2" fill="none"/>
<path class="sway" d="M54 220 Q40 232 58 236 Q78 238 70 226" stroke="#e0473a" stroke-width="2.5" fill="none"/>`)

// 筊杯：新月形，平面（木色）与凸面（红漆）-------------------------------------
const jiaoPath = 'M66 6 C24 10 6 50 8 96 C10 142 30 180 70 188 C46 162 34 128 36 96 C38 62 46 30 66 6Z'
const jiaoFlat = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 194">
<path d="${jiaoPath}" fill="#f0d29a" stroke="#a3160d" stroke-width="4"/>
<path d="M58 30 C44 60 40 120 58 166" stroke="#c99a4a" stroke-width="3" fill="none" opacity=".7"/>
<path d="M44 36 C30 70 28 120 44 158" stroke="#c99a4a" stroke-width="2" fill="none" opacity=".5"/>
</svg>`
const jiaoRound = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 194">
<defs><radialGradient id="g" cx=".35" cy=".35" r=".8"><stop offset="0" stop-color="#ef6a5a"/><stop offset=".55" stop-color="#b81d12"/><stop offset="1" stop-color="#6e0c06"/></radialGradient></defs>
<path d="${jiaoPath}" fill="url(#g)" stroke="#6e0c06" stroke-width="3"/>
<ellipse cx="34" cy="60" rx="6" ry="20" fill="#fff" opacity=".35"/>
</svg>`

// 祥云 ---------------------------------------------------------------------
const cloud = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 70">
<path d="M20 58 Q2 58 6 42 Q10 28 28 32 Q30 12 52 14 Q66 0 86 10 Q104 2 116 18 Q140 14 144 34 Q160 38 154 52 Q150 60 136 58Z" fill="#fff8e6" stroke="#e8c98a" stroke-width="3"/>
<path d="M40 44 q10 -12 22 -2 M92 40 q12 -14 26 -2" stroke="#e8c98a" stroke-width="3" fill="none" stroke-linecap="round"/>
</svg>`

// 签筒 ---------------------------------------------------------------------
const tube = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 200">
<defs><linearGradient id="t" x1="0" x2="1"><stop offset="0" stop-color="#6e0c06"/><stop offset=".45" stop-color="#d23c2c"/><stop offset="1" stop-color="#6e0c06"/></linearGradient></defs>
<path d="M22 20 L138 20 L130 190 Q80 200 30 190Z" fill="url(#t)"/>
<ellipse cx="80" cy="20" rx="58" ry="12" fill="#4a0804"/>
<rect x="22" y="40" width="116" height="10" fill="${GOLD}"/><rect x="26" y="160" width="108" height="10" fill="${GOLD}"/>
<circle cx="80" cy="105" r="34" fill="none" stroke="${GOLD}" stroke-width="4"/>
<text x="80" y="120" font-size="42" text-anchor="middle" fill="${GOLD}" font-family="serif">签</text>
</svg>`

const files = { 'mazu.svg': mazu, 'wenchang.svg': wenchang, 'guandi.svg': guandi, 'yuelao.svg': yuelao, 'jiao-flat.svg': jiaoFlat, 'jiao-round.svg': jiaoRound, 'cloud.svg': cloud, 'tube.svg': tube }
for (const [name, content] of Object.entries(files)) writeFileSync(join(out, name), content)
console.log('wrote', Object.keys(files).join(', '))
