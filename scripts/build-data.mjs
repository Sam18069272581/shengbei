// 校验 data/qian/*.json，生成 data/qian.sqlite 和 src/generated/qian/*.json
import { readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const srcDir = join(root, 'data/qian')
const outDir = join(root, 'src/generated/qian')
const dbPath = join(root, 'data/qian.sqlite')

const LEVELS = ['上上', '上', '中', '下', '下下']
const TOPICS = ['study', 'career', 'love', 'wealth', 'health', 'travel']

const errors = []
const err = (file, msg) => errors.push(`${file}: ${msg}`)
const isStr = (v) => typeof v === 'string'

function validate(file, d) {
  if (!d.deity || !isStr(d.deity.id) || !isStr(d.deity.name)) err(file, 'deity.id / deity.name 缺失')
  if (d.deity && file !== `${d.deity.id}.json`) err(file, `文件名应为 ${d.deity.id}.json`)
  if (!Array.isArray(d.deity?.domains)) err(file, 'deity.domains 应为数组')
  const s = d.set
  if (!s || !isStr(s.id) || !isStr(s.name) || !Number.isInteger(s.total) || !isStr(s.source)) {
    err(file, 'set.id / name / total / source 缺失')
    return
  }
  if (!Array.isArray(d.qian)) return err(file, 'qian 应为数组')
  if (d.qian.length !== s.total) err(file, `签数 ${d.qian.length} ≠ set.total ${s.total}`)
  d.qian.forEach((q, i) => {
    const at = `第 ${i + 1} 条`
    if (q.no !== i + 1) err(file, `${at}: no 应为 ${i + 1}，实际 ${q.no}`)
    if (!LEVELS.includes(q.level)) err(file, `${at}: level「${q.level}」不在 ${LEVELS.join('/')}`)
    for (const k of ['label', 'title', 'meaning', 'source_note']) if (!isStr(q[k])) err(file, `${at}: ${k} 应为字符串`)
    if (!q.meaning) err(file, `${at}: meaning 为空`)
    if (!Array.isArray(q.poem) || q.poem.length < 2 || !q.poem.every((l) => isStr(l) && l)) err(file, `${at}: poem 应为非空字符串数组`)
    for (const t of TOPICS) if (!isStr(q.topics?.[t]) || !q.topics[t]) err(file, `${at}: topics.${t} 缺失`)
  })
}

const files = readdirSync(srcDir).filter((f) => f.endsWith('.json')).sort()
const all = files.map((f) => {
  try {
    const d = JSON.parse(readFileSync(join(srcDir, f), 'utf8'))
    validate(f, d)
    return d
  } catch (e) {
    err(f, `JSON 解析失败: ${e.message}`)
    return null
  }
}).filter(Boolean)

if (errors.length) {
  console.error(`校验失败（${errors.length} 处）：\n` + errors.slice(0, 50).join('\n'))
  process.exit(1)
}

// 前端 JSON
rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })
const index = all.map((d) => ({ ...d.deity, set: { id: d.set.id, name: d.set.name, total: d.set.total } }))
writeFileSync(join(outDir, 'index.json'), JSON.stringify(index))
for (const d of all) writeFileSync(join(outDir, `${d.deity.id}.json`), JSON.stringify(d))

// SQLite（Node 22.5+ 内置 node:sqlite）
let sqlite
try {
  sqlite = await import('node:sqlite')
} catch {
  console.warn('当前 Node 不支持 node:sqlite，跳过 qian.sqlite 生成')
}
if (sqlite) {
  if (existsSync(dbPath)) rmSync(dbPath)
  const db = new sqlite.DatabaseSync(dbPath)
  db.exec(readFileSync(join(root, 'data/schema.sql'), 'utf8'))
  const insDeity = db.prepare('INSERT INTO deity VALUES (?,?,?,?,?)')
  const insSet = db.prepare('INSERT INTO qian_set VALUES (?,?,?,?,?)')
  const insQian = db.prepare('INSERT INTO qian VALUES (?,?,?,?,?,?,?,?)')
  const insTopic = db.prepare('INSERT INTO qian_topic VALUES (?,?,?,?)')
  db.exec('BEGIN')
  for (const { deity: g, set: s, qian } of all) {
    insDeity.run(g.id, g.name, g.title ?? '', JSON.stringify(g.domains), g.intro ?? '')
    insSet.run(s.id, g.id, s.name, s.total, s.source)
    for (const q of qian) {
      insQian.run(s.id, q.no, q.label, q.level, q.title, q.poem.join('\n'), q.meaning, q.source_note)
      for (const [t, text] of Object.entries(q.topics)) insTopic.run(s.id, q.no, t, text)
    }
  }
  db.exec('COMMIT')
  db.close()
}

console.log(`OK：${all.map((d) => `${d.deity.name} ${d.qian.length} 签`).join('，')}`)
