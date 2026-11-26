/**
 * 把前端的商品数据导出成 JSON，供后端工具查询
 * 用法：node tools/export-products.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const src = resolve(here, '../frontend/src/data/products.js')
const out = resolve(here, '../agent/data/products.json')

const { products, categories } = await import('file://' + src.replace(/\\/g, '/'))

const slim = products.map((p) => ({
  sku: p.sku,
  name: p.name,
  category: p.category,
  categoryShort: p.categoryShort,
  craft: p.craft,
  usage: p.usage,
  price: p.price,
  glaze: p.glaze,
  size: p.size,
  capacity: p.capacity,
  material: p.material,
  process: p.process,
  stock: p.stock,
  customizable: p.customizable,
  leadTime: p.leadTime,
  intro: p.intro,
  tags: p.tags,
}))

const cats = categories.map((c) => ({
  code: c.code,
  name: c.name,
  short: c.short,
  en: c.en,
  note: c.note,
}))

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, JSON.stringify({ categories: cats, products: slim }, null, 2), 'utf8')
console.log(`导出 ${slim.length} 件商品 -> ${out}`)
