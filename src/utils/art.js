// 静态图片路径：用 import.meta.glob 让构建工具给出正确的 URL（H5 部署在子路径下也能用）
const urls = import.meta.glob('../static/art/*.svg', { eager: true, import: 'default', query: '?url' })
export const art = (name) => {
  const url = urls[`../static/art/${name}.svg`]
  if (!url) console.warn(`[art] 找不到图片 ${name}.svg`)
  return url || ''
}
