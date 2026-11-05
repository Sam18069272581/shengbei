// 生成神明像、筊杯、签筒、祥云等 SVG 到 src/static/art/
// 风格：精致萌系 Q 版（大眼高光、渐变上色），置于金线圆形徽章前；暗金底色
// SVG 内自带 MG 动效：徽章描边自绘、光芒旋转、呼吸、眨眼、饰物摆动、闪光
// 改形象时改这里，然后运行 node scripts/draw-art.mjs
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const out = join(dirname(fileURLToPath(import.meta.url)), '../src/static/art')
mkdirSync(out, { recursive: true })

const GOLD = '#d4af6e'
const GOLD_LIGHT = '#f6e2b0'
const OUTLINE = '#7a4630'

const STYLE = `<style>
.ring{stroke-dasharray:580;stroke-dashoffset:580;animation:draw 1.4s cubic-bezier(.6,0,.3,1) forwards}
@keyframes draw{to{stroke-dashoffset:0}}
.rays{animation:spin 50s linear infinite;transform-origin:100px 96px}
@keyframes spin{to{transform:rotate(360deg)}}
.glow{animation:glow 3.6s ease-in-out infinite}
@keyframes glow{0%,100%{opacity:.5}50%{opacity:1}}
.char{animation:pop .7s cubic-bezier(.2,1.5,.4,1) .2s both;transform-origin:100px 190px}
@keyframes pop{from{transform:scale(.3) translateY(30px);opacity:0}to{transform:none;opacity:1}}
.breath{animation:breath 3s ease-in-out infinite;transform-origin:100px 192px}
@keyframes breath{0%,100%{transform:scale(1,1)}50%{transform:scale(1.025,.975)}}
.head{animation:tilt 4.2s ease-in-out infinite;transform-origin:100px 128px}
@keyframes tilt{0%,100%{transform:rotate(-2.5deg)}50%{transform:rotate(2.5deg)}}
.eye{animation:blink 4.6s infinite;transform-box:fill-box;transform-origin:50% 60%}
@keyframes blink{0%,91%,97%,100%{transform:scaleY(1)}94%{transform:scaleY(.08)}}
.sway{animation:sway 2.8s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 0}
@keyframes sway{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}
.float{animation:float 3.4s ease-in-out infinite}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
.tw{animation:tw 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
.tw2{animation-delay:.8s}.tw3{animation-delay:1.6s}
@keyframes tw{0%,100%{transform:scale(.2);opacity:0}50%{transform:scale(1);opacity:1}}
</style>`

const defs = (bgTint, robe1, robe2, skin1 = '#fff3e6', skin2 = '#f5d3b8') => `<defs>
<radialGradient id="bg" cx=".5" cy=".4" r=".62"><stop offset="0" stop-color="${bgTint}"/><stop offset="1" stop-color="#15100c"/></radialGradient>
<radialGradient id="halo" cx=".5" cy=".5" r=".5"><stop offset=".4" stop-color="${GOLD_LIGHT}" stop-opacity=".55"/><stop offset="1" stop-color="${GOLD_LIGHT}" stop-opacity="0"/></radialGradient>
<linearGradient id="skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${skin1}"/><stop offset="1" stop-color="${skin2}"/></linearGradient>
<linearGradient id="robe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${robe1}"/><stop offset="1" stop-color="${robe2}"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbe7b0"/><stop offset=".5" stop-color="#e2b65e"/><stop offset="1" stop-color="#a87830"/></linearGradient>
<linearGradient id="iris" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1610"/><stop offset=".6" stop-color="#5a3420"/><stop offset="1" stop-color="#b07a48"/></linearGradient>
<radialGradient id="blush" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff8f8f" stop-opacity=".75"/><stop offset="1" stop-color="#ff8f8f" stop-opacity="0"/></radialGradient>
<clipPath id="clip"><circle cx="100" cy="96" r="90"/></clipPath>
<clipPath id="charClip"><rect x="0" y="0" width="200" height="96"/><circle cx="100" cy="96" r="89"/></clipPath>
</defs>`

const medallion = `
<circle cx="100" cy="96" r="90" fill="url(#bg)"/>
<g clip-path="url(#clip)">
<g class="rays" opacity=".16">${Array.from({ length: 20 }, (_, i) => `<path d="M100 96 L96 0 L104 0Z" fill="${GOLD_LIGHT}" transform="rotate(${i * 18} 100 96)"/>`).join('')}</g>
<circle class="glow" cx="100" cy="84" r="70" fill="url(#halo)"/>
</g>
<circle class="ring" cx="100" cy="96" r="90" fill="none" stroke="${GOLD}" stroke-width="2"/>
<circle class="ring" cx="100" cy="96" r="84" fill="none" stroke="${GOLD}" stroke-width=".7" opacity=".6" style="animation-delay:.2s"/>`

const sparkles = `
<path class="tw" d="M30 50 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2Z" fill="${GOLD_LIGHT}"/>
<path class="tw tw2" d="M168 70 l1.5 4.5 4.5 1.5 -4.5 1.5 -1.5 4.5 -1.5 -4.5 -4.5 -1.5 4.5 -1.5Z" fill="${GOLD_LIGHT}"/>
<path class="tw tw3" d="M160 150 l1.5 4.5 4.5 1.5 -4.5 1.5 -1.5 4.5 -1.5 -4.5 -4.5 -1.5 4.5 -1.5Z" fill="${GOLD_LIGHT}"/>`

// 身体：圆润小袍子 + 金领 + 小手
const body = (collar = 'url(#gold)', pattern = '') => `
<path d="M58 196 Q56 150 78 136 Q100 144 122 136 Q144 150 142 196Z" fill="url(#robe)" stroke="${OUTLINE}" stroke-width="1.5" stroke-linejoin="round"/>
${pattern}
<path d="M84 137 L100 160 L116 137" fill="none" stroke="${collar}" stroke-width="6" stroke-linejoin="round"/>
<path d="M62 186 Q100 194 138 186" fill="none" stroke="url(#gold)" stroke-width="3.5" stroke-linecap="round"/>
<ellipse cx="66" cy="168" rx="13" ry="18" fill="url(#robe)" stroke="${OUTLINE}" stroke-width="1.5" transform="rotate(22 66 168)"/>
<ellipse cx="134" cy="168" rx="13" ry="18" fill="url(#robe)" stroke="${OUTLINE}" stroke-width="1.5" transform="rotate(-22 134 168)"/>`
const hands = `<circle cx="74" cy="180" r="7" fill="url(#skin)" stroke="${OUTLINE}" stroke-width="1.2"/>
<circle cx="126" cy="180" r="7" fill="url(#skin)" stroke="${OUTLINE}" stroke-width="1.2"/>`

// 脸：大眼睛（双高光）、腮红、小嘴
const face = ({ brows = '', mouth = 'smile', lash = '#2a1610' } = {}) => {
  const m = {
    smile: `<path d="M94 113 Q100 119 106 113" fill="none" stroke="${OUTLINE}" stroke-width="2" stroke-linecap="round"/>`,
    open: `<path d="M94 112 Q100 122 106 112Z" fill="#c8504a" stroke="${OUTLINE}" stroke-width="1.5" stroke-linejoin="round"/><path d="M96.5 116 Q100 119 103.5 116" fill="#ff9a8a"/>`,
    cat: `<path d="M93 112 Q96.5 116 100 112 Q103.5 116 107 112" fill="none" stroke="${OUTLINE}" stroke-width="2" stroke-linecap="round"/>`,
  }[mouth]
  const eye = (x) => `<g class="eye">
<ellipse cx="${x}" cy="96" rx="8.5" ry="10.5" fill="url(#iris)"/>
<ellipse cx="${x}" cy="99" rx="4.5" ry="5.5" fill="#1a0c08" opacity=".55"/>
<circle cx="${x - 3}" cy="91.5" r="3.4" fill="#fff"/><circle cx="${x + 3.4}" cy="101" r="1.6" fill="#fff" opacity=".9"/>
</g>
<path d="M${x - 10} 88 Q${x} 82 ${x + 10} 88" fill="none" stroke="${lash}" stroke-width="2.6" stroke-linecap="round"/>`
  return `${eye(82)}${eye(118)}
<ellipse cx="70" cy="108" rx="11" ry="6.5" fill="url(#blush)"/><ellipse cx="130" cy="108" rx="11" ry="6.5" fill="url(#blush)"/>
<path d="M66 106 l2 -3 M70 106 l2 -3 M130 106 l2 -3 M134 106 l2 -3" stroke="#fff" stroke-width="1" opacity=".7" stroke-linecap="round"/>
${brows}${m}`
}

const headShape = (fill = 'url(#skin)') => `<ellipse cx="100" cy="94" rx="40" ry="37" fill="${fill}" stroke="${OUTLINE}" stroke-width="1.6"/>`

const wrap = (bg, robe1, robe2, inner, skin) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
${STYLE}
${defs(bg, robe1, robe2, ...(skin || []))}
${medallion}
${sparkles}
<g clip-path="url(#charClip)"><g class="char"><g class="float">${inner}</g></g></g>
</svg>`

// 妈祖 ---------------------------------------------------------------------
const mazu = wrap('#5a2620', '#d2493c', '#8e2620', `
<path class="sway" d="M64 92 Q56 140 66 166 Q74 150 72 110Z" fill="#2a1a16" stroke="${OUTLINE}" stroke-width="1.2"/>
<path class="sway" d="M136 92 Q144 140 134 166 Q126 150 128 110Z" fill="#2a1a16" stroke="${OUTLINE}" stroke-width="1.2" style="animation-delay:.4s"/>
<g class="breath">${body('url(#gold)', `<path d="M74 172 q6 -6 12 0 q6 6 12 0 M102 172 q6 -6 12 0 q6 6 12 0" fill="none" stroke="#f6c97a" stroke-width="1.2" opacity=".7"/>`)}
<g transform="rotate(-28 128 168)"><rect x="125" y="150" width="6" height="36" rx="3" fill="url(#gold)" stroke="${OUTLINE}" stroke-width="1"/><path d="M118 152 q10 -18 20 0 q-10 8 -20 0Z" fill="url(#gold)" stroke="${OUTLINE}" stroke-width="1.2"/><circle cx="128" cy="150" r="2.5" fill="#d23c3c"/></g>
${hands}</g>
<g class="head">
${headShape()}
<path d="M60 94 Q58 52 100 50 Q142 52 140 94 Q136 72 116 70 Q112 80 100 78 Q88 80 84 70 Q64 72 60 94Z" fill="#2a1a16" stroke="${OUTLINE}" stroke-width="1.4"/>
<path d="M76 62 Q90 56 100 58" fill="none" stroke="#6a4a3e" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>
${face({ mouth: 'smile' })}
<path d="M66 60 L72 34 L84 50 L100 26 L116 50 L128 34 L134 60 Q100 50 66 60Z" fill="url(#gold)" stroke="${OUTLINE}" stroke-width="1.4" stroke-linejoin="round"/>
<circle cx="100" cy="42" r="5.5" fill="#e0473a" stroke="#fff3d0" stroke-width="1.2"/><circle cx="98.5" cy="40.5" r="1.6" fill="#fff"/>
<circle cx="78" cy="48" r="3" fill="#5fc2b0"/><circle cx="122" cy="48" r="3" fill="#5fc2b0"/>
<g class="sway"><line x1="68" y1="60" x2="64" y2="86" stroke="url(#gold)" stroke-width="1.4"/><circle cx="64" cy="88" r="3.2" fill="#e0473a"/></g>
<g class="sway" style="animation-delay:.5s"><line x1="132" y1="60" x2="136" y2="86" stroke="url(#gold)" stroke-width="1.4"/><circle cx="136" cy="88" r="3.2" fill="#e0473a"/></g>
</g>`)

// 文昌帝君 -------------------------------------------------------------------
const wenchang = wrap('#1e3048', '#5b8fd0', '#2b4f80', `
<g class="breath">${body('url(#gold)', `<path d="M70 176 h60" stroke="#a9c6ec" stroke-width="1" opacity=".6"/>`)}
<g transform="rotate(-24 70 172)"><rect x="56" y="166" width="30" height="12" rx="5" fill="#f4ead2" stroke="${OUTLINE}" stroke-width="1.2"/><rect x="53" y="164" width="5" height="16" rx="2" fill="#b08050"/><rect x="84" y="164" width="5" height="16" rx="2" fill="#b08050"/></g>
<g transform="rotate(18 130 160)"><rect x="127" y="132" width="5" height="44" rx="2.5" fill="#8a5a30" stroke="${OUTLINE}" stroke-width="1"/><path d="M127 133 L129.5 118 L132 133Z" fill="#2a1a16"/></g>
${hands}</g>
<g class="head">
${headShape()}
<path d="M60 96 Q58 56 100 54 Q142 56 140 96 Q130 76 100 74 Q70 76 60 96Z" fill="#2a1a16" stroke="${OUTLINE}" stroke-width="1.4"/>
${face({ mouth: 'cat', brows: `<path d="M74 82 Q82 79 90 82 M110 82 Q118 79 126 82" stroke="#2a1a16" stroke-width="2" fill="none" stroke-linecap="round" opacity=".7"/>` })}
<path d="M70 64 Q70 34 100 32 Q130 34 130 64Z" fill="#1f1a24" stroke="${OUTLINE}" stroke-width="1.4"/>
<rect x="66" y="58" width="68" height="10" rx="5" fill="#1f1a24" stroke="${OUTLINE}" stroke-width="1.2"/>
<path d="M88 40 Q100 36 112 40" fill="none" stroke="#4a4458" stroke-width="2.5" stroke-linecap="round"/>
<g class="sway" style="transform-origin:0% 50%"><path d="M134 62 Q160 56 178 60 Q182 63 178 66 Q160 66 134 66Z" fill="#1f1a24" stroke="${OUTLINE}" stroke-width="1"/></g>
<g class="sway" style="transform-origin:100% 50%;animation-delay:.3s"><path d="M66 62 Q40 56 22 60 Q18 63 22 66 Q40 66 66 66Z" fill="#1f1a24" stroke="${OUTLINE}" stroke-width="1"/></g>
<circle cx="100" cy="46" r="4" fill="url(#gold)"/>
</g>`)

// 关圣帝君 -------------------------------------------------------------------
const guandi = wrap('#173a30', '#3f9a72', '#1e5a42', `
<g transform="rotate(-8 36 120)"><rect x="33" y="64" width="5" height="128" rx="2.5" fill="#8a5a30" stroke="${OUTLINE}" stroke-width="1"/>
<path d="M36 68 Q18 48 30 22 Q48 44 42 72Z" fill="#dfe6ea" stroke="${OUTLINE}" stroke-width="1.4"/><path d="M28 34 Q34 48 40 60" stroke="#fff" stroke-width="1.5" fill="none" opacity=".8"/>
<rect x="30" y="70" width="11" height="6" rx="2" fill="url(#gold)"/><path class="sway" d="M41 74 q8 6 4 16" stroke="#e0473a" stroke-width="3" fill="none" stroke-linecap="round"/></g>
<g class="breath">${body('url(#gold)', `<path d="M72 172 q14 -10 28 0 q14 10 28 0" fill="none" stroke="#9fe0c0" stroke-width="1.2" opacity=".5"/>`)}${hands}</g>
<g class="head">
${headShape('#e2705c')}
<ellipse cx="100" cy="88" rx="30" ry="18" fill="#f08a72" opacity=".5"/>
${face({ mouth: 'smile', brows: `<path d="M70 82 L90 86 M130 82 L110 86" stroke="#2a1610" stroke-width="4" stroke-linecap="round"/>` })}
<path class="sway" d="M78 114 Q76 136 88 150 Q94 160 100 168 Q106 160 112 150 Q124 136 122 114 Q112 122 100 120 Q88 122 78 114Z" fill="#2a1a16" stroke="${OUTLINE}" stroke-width="1.2"/>
<path d="M88 112 Q100 104 112 112" fill="none" stroke="#2a1a16" stroke-width="3.5" stroke-linecap="round"/>
<path d="M92 132 Q100 140 108 132 M90 146 Q100 154 110 146" fill="none" stroke="#5a463e" stroke-width="1.2" opacity=".8"/>
<path d="M60 86 Q60 46 100 44 Q140 46 140 86 Q122 70 100 70 Q78 70 60 86Z" fill="#3f9a72" stroke="${OUTLINE}" stroke-width="1.5"/>
<path d="M62 84 Q100 62 138 84" fill="none" stroke="url(#gold)" stroke-width="3"/>
<path d="M76 58 Q100 50 124 58" fill="none" stroke="#7fd0aa" stroke-width="2" opacity=".6" stroke-linecap="round"/>
<circle class="float" cx="100" cy="40" r="7" fill="#e0473a" stroke="${OUTLINE}" stroke-width="1.2"/><circle cx="98" cy="38" r="2" fill="#fff" opacity=".8"/>
</g>`, ['#f59a82', '#d0583f'])

// 月下老人 -------------------------------------------------------------------
const yuelao = wrap('#4a1e2a', '#e0605e', '#9a2c34', `
<g transform="rotate(10 160 120)"><rect x="157" y="80" width="5" height="112" rx="2.5" fill="#8a5a30" stroke="${OUTLINE}" stroke-width="1"/>
<g class="sway"><ellipse cx="159.5" cy="78" rx="8" ry="10" fill="url(#gold)" stroke="${OUTLINE}" stroke-width="1.2"/><circle cx="159.5" cy="64" r="5.5" fill="url(#gold)" stroke="${OUTLINE}" stroke-width="1.2"/><path d="M157 70 h5" stroke="#e0473a" stroke-width="2"/></g></g>
<g class="breath">${body('url(#gold)')}
<circle cx="70" cy="178" r="10" fill="#e0473a" stroke="${OUTLINE}" stroke-width="1.2"/>
<path d="M62 174 Q70 182 78 174 M61 180 Q70 188 79 180" stroke="#9a1c1c" stroke-width="1.2" fill="none"/>
<path class="sway" d="M70 188 Q60 196 74 200" stroke="#e0473a" stroke-width="2" fill="none"/>
${hands}</g>
<g class="head">
${headShape()}
<path d="M58 98 Q48 80 60 66 Q58 84 68 92Z M142 98 Q152 80 140 66 Q142 84 132 92Z" fill="#fbf6ee" stroke="${OUTLINE}" stroke-width="1.2"/>
<circle cx="64" cy="70" r="9" fill="#fbf6ee" stroke="${OUTLINE}" stroke-width="1.2"/><circle cx="136" cy="70" r="9" fill="#fbf6ee" stroke="${OUTLINE}" stroke-width="1.2"/>
<ellipse cx="100" cy="56" rx="14" ry="10" fill="#fbf6ee" stroke="${OUTLINE}" stroke-width="1.2"/><circle cx="100" cy="46" r="6" fill="#e0473a" stroke="${OUTLINE}" stroke-width="1"/>
${face({ mouth: 'open', lash: '#8a7a6a', brows: `<path d="M70 84 Q80 76 90 84 M110 84 Q120 76 130 84" stroke="#fbf6ee" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M70 84 Q80 76 90 84 M110 84 Q120 76 130 84" stroke="${OUTLINE}" stroke-width=".8" fill="none" opacity=".5"/>` })}
<path class="sway" d="M80 118 Q76 140 86 154 Q92 162 100 170 Q108 162 114 154 Q124 140 120 118 Q110 126 100 124 Q90 126 80 118Z" fill="#fbf6ee" stroke="${OUTLINE}" stroke-width="1.2"/>
<path d="M86 116 Q93 110 100 116 Q107 110 114 116" fill="#fbf6ee" stroke="${OUTLINE}" stroke-width="1.2"/>
<path d="M92 136 Q100 142 108 136 M94 150 Q100 155 106 150" fill="none" stroke="#d8ccc0" stroke-width="1.2"/>
</g>
<path class="tw" d="M44 120 c-4 -6 -12 -2 -8 4 l8 8 8 -8 c4 -6 -4 -10 -8 -4Z" fill="#ff7a8a"/>`)

// 观音菩萨 -------------------------------------------------------------------
const guanyin = wrap('#23383a', '#fbf8f2', '#d6cdbd', `
<path class="sway" d="M62 84 Q50 136 62 176 Q74 160 72 104Z" fill="#fbf8f2" stroke="${OUTLINE}" stroke-width="1.2"/>
<path class="sway" d="M138 84 Q150 136 138 176 Q126 160 128 104Z" fill="#fbf8f2" stroke="${OUTLINE}" stroke-width="1.2" style="animation-delay:.4s"/>
<g class="breath">${body('url(#gold)', `<path d="M70 170 q10 -8 20 0 q10 8 20 0 q10 -8 20 0" fill="none" stroke="#b8d8cc" stroke-width="1.3" opacity=".8"/>`)}
<g transform="rotate(16 132 160)"><path d="M124 176 Q120 160 128 152 L128 144 L136 144 L136 152 Q144 160 140 176Z" fill="#e8f4f0" stroke="${OUTLINE}" stroke-width="1.2"/><rect x="127" y="140" width="10" height="5" rx="2" fill="url(#gold)"/>
<g class="sway"><path d="M132 140 Q128 120 140 104" stroke="#5a8a4a" stroke-width="1.6" fill="none"/><path d="M134 128 q-8 -2 -10 -8 q8 0 10 8Z M137 118 q8 -4 12 -10 q-8 1 -12 10Z M139 108 q-6 -4 -6 -10 q6 3 6 10Z" fill="#7cbf6a"/></g></g>
${hands}</g>
<g class="head">
${headShape()}
<path d="M60 96 Q58 56 100 54 Q142 56 140 96 Q130 74 100 72 Q70 74 60 96Z" fill="#2a1a16" stroke="${OUTLINE}" stroke-width="1.4"/>
${face({ mouth: 'smile', brows: `<path d="M74 84 Q82 81 90 84 M110 84 Q118 81 126 84" stroke="#2a1a16" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".6"/>` })}
<circle cx="100" cy="80" r="2.6" fill="#e0473a"/>
<path d="M56 100 Q50 52 100 44 Q150 52 144 100 Q138 70 100 64 Q62 70 56 100Z" fill="#fbf8f2" stroke="${OUTLINE}" stroke-width="1.4"/>
<path d="M64 76 Q100 56 136 76" fill="none" stroke="#e6ddcc" stroke-width="2" opacity=".9"/>
<path d="M80 54 L86 38 L94 48 L100 30 L106 48 L114 38 L120 54 Q100 48 80 54Z" fill="url(#gold)" stroke="${OUTLINE}" stroke-width="1.3" stroke-linejoin="round"/>
<circle cx="100" cy="42" r="4.5" fill="#5fc2b0" stroke="#fff3d0" stroke-width="1"/><circle cx="98.8" cy="40.8" r="1.3" fill="#fff"/>
</g>
<circle class="glow" cx="100" cy="92" r="52" fill="none" stroke="${GOLD_LIGHT}" stroke-width="1.2" opacity=".5"/>`)

// 财神 -----------------------------------------------------------------------
const caishen = wrap('#4e1a14', '#e04a36', '#9a2418', `
<g class="breath">${body('url(#gold)', `<circle cx="100" cy="176" r="9" fill="none" stroke="url(#gold)" stroke-width="2"/><rect x="96.5" y="172.5" width="7" height="7" fill="none" stroke="url(#gold)" stroke-width="1.6"/>`)}
<g class="float" transform="translate(0 2)"><path d="M54 172 Q56 160 64 162 Q70 152 78 162 Q86 160 88 172 Q72 182 54 172Z" fill="url(#gold)" stroke="${OUTLINE}" stroke-width="1.2"/><ellipse cx="71" cy="161" rx="6" ry="4" fill="#fbe7b0"/></g>
<g transform="rotate(-20 136 160)"><rect x="133" y="140" width="5" height="40" rx="2.5" fill="url(#gold)" stroke="${OUTLINE}" stroke-width="1"/><path d="M128 142 q7 -16 15 0 q-7 6 -15 0Z" fill="#7cbf6a" stroke="${OUTLINE}" stroke-width="1.1"/></g>
${hands}</g>
<g class="head">
${headShape()}
${face({ mouth: 'open', brows: `<path d="M72 84 Q81 78 90 84 M110 84 Q119 78 128 84" stroke="#2a1610" stroke-width="3" fill="none" stroke-linecap="round"/>` })}
<path class="sway" d="M84 118 Q82 136 92 148 Q96 154 100 158 Q104 154 108 148 Q118 136 116 118 Q108 124 100 122 Q92 124 84 118Z" fill="#2a1a16" stroke="${OUTLINE}" stroke-width="1.1"/>
<path d="M86 114 Q93 108 100 113 Q107 108 114 114" fill="none" stroke="#2a1a16" stroke-width="3.5" stroke-linecap="round"/>
<path d="M64 74 Q64 40 100 38 Q136 40 136 74Z" fill="#e04a36" stroke="${OUTLINE}" stroke-width="1.4"/>
<rect x="60" y="68" width="80" height="11" rx="5" fill="#2a1a16" stroke="${OUTLINE}" stroke-width="1.2"/>
<path d="M66 66 Q100 54 134 66" fill="none" stroke="url(#gold)" stroke-width="3"/>
<g class="sway" style="transform-origin:0% 50%"><path d="M138 68 Q160 58 172 50 Q178 52 174 58 Q160 70 138 76Z" fill="#2a1a16" stroke="${OUTLINE}" stroke-width="1"/><circle cx="172" cy="54" r="3" fill="url(#gold)"/></g>
<g class="sway" style="transform-origin:100% 50%;animation-delay:.3s"><path d="M62 68 Q40 58 28 50 Q22 52 26 58 Q40 70 62 76Z" fill="#2a1a16" stroke="${OUTLINE}" stroke-width="1"/><circle cx="28" cy="54" r="3" fill="url(#gold)"/></g>
<rect x="92" y="44" width="16" height="12" rx="2" fill="url(#gold)" stroke="${OUTLINE}" stroke-width="1"/>
<text x="100" y="54" font-size="9" text-anchor="middle" fill="#9a2418" font-family="'Songti SC','STSong','Noto Serif SC',serif" font-weight="bold">财</text>
</g>`)

const cloud = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 60">
<path d="M10 50 Q0 50 4 40 Q8 30 22 33 Q22 16 42 16 Q54 4 72 12 Q88 4 100 18 Q122 14 126 32 Q144 32 146 44 Q148 52 136 50Z M40 40 q10 -12 20 -2 q10 10 -2 14 M92 36 q12 -12 22 0" fill="none" stroke="${GOLD}" stroke-width="1.4" stroke-linecap="round"/>
</svg>`

const tube = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 200">
<defs><linearGradient id="t" x1="0" x2="1"><stop offset="0" stop-color="#3a1410"/><stop offset=".45" stop-color="#8e2a1e"/><stop offset="1" stop-color="#2a0e0a"/></linearGradient></defs>
<path d="M24 20 L136 20 L128 192 Q80 200 32 192Z" fill="url(#t)" stroke="${GOLD}" stroke-width="1.8"/>
<ellipse cx="80" cy="20" rx="56" ry="10" fill="#1a0806" stroke="${GOLD}" stroke-width="1.8"/>
<path d="M27 42 L133 42 M30 168 L130 168" stroke="${GOLD}" stroke-width="1.4"/>
<circle cx="80" cy="105" r="30" fill="none" stroke="${GOLD}" stroke-width="1.4"/>
<circle cx="80" cy="105" r="25" fill="none" stroke="${GOLD}" stroke-width=".6" opacity=".7"/>
<text x="80" y="117" font-size="32" text-anchor="middle" fill="${GOLD}" font-family="'Songti SC','STSong','Noto Serif SC',serif">签</text>
<path d="M36 30 L40 186" stroke="#fff" stroke-width="5" opacity=".08" stroke-linecap="round"/>
</svg>`

const corner = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
<path d="M2 38 V2 H38 M8 38 V8 H38 M8 20 H20 V8" fill="none" stroke="${GOLD}" stroke-width="1.2"/>
</svg>`

// 筊杯已改为手绘写实版（src/static/art/jiao-*.svg），不再由本脚本生成
const files = { 'mazu.svg': mazu, 'wenchang.svg': wenchang, 'guandi.svg': guandi, 'yuelao.svg': yuelao, 'guanyin.svg': guanyin, 'caishen.svg': caishen, 'cloud.svg': cloud, 'tube.svg': tube, 'corner.svg': corner }
for (const [name, content] of Object.entries(files)) writeFileSync(join(out, name), content)
console.log('wrote', Object.keys(files).join(', '))
