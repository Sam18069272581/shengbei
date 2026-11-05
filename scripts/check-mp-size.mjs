// 小程序包体检查：主包上限 2MB（微信限制），超过 1.8MB 先提醒。
// 用法：npm run build:mp-weixin 之后自动运行，也可单独 node scripts/check-mp-size.mjs
import { readdirSync, statSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../dist/build/mp-weixin')
if (!existsSync(root)) {
  console.error('没找到 dist/build/mp-weixin，请先运行 npm run build:mp-weixin')
  process.exit(1)
}
const files = []
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    statSync(p).isDirectory() ? walk(p) : files.push({ p: p.slice(root.length + 1), size: statSync(p).size })
  }
}
walk(root)
const total = files.reduce((s, f) => s + f.size, 0)
const kb = (n) => (n / 1024).toFixed(0) + ' KB'
console.log(`小程序包体：${kb(total)}（上限 2048 KB）`)
for (const f of files.sort((a, b) => b.size - a.size).slice(0, 5)) console.log(`  ${kb(f.size).padStart(8)}  ${f.p}`)
if (total > 2 * 1024 * 1024) {
  console.error('超过 2MB，微信开发者工具无法上传。签文数据（utils/qian.js）最大，可考虑把签文拆到分包。')
  process.exit(1)
}
if (total > 1.8 * 1024 * 1024) console.warn('已超过 1.8MB，再加神明或签文前请先做分包。')
