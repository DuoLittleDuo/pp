/**
 * 工艺纹样库 —— 按六种工艺分类
 *
 * 目前每个工艺只有文字说明，图案图还没放。
 * 你以后把实际图案图放进 frontend/public/assets/patterns/，
 * 再把下面的 image 填上路径即可，页面会自动显示。
 *
 * match: 用来和商品名里的工艺词做匹配，统计"哪些作品用了这个工艺"
 */

import { products } from './products'

export const crafts = [
  {
    id: 'jiaotai',
    name: '绞胎',
    en: 'MARBLED CLAY',
    tagline: '两种泥叠在一起拉，纹路是泥自己的走向',
    what:
      '把两种或几种不同颜色的泥叠在一起，再一起拉坯。泥被拉长、扭曲，切开断面就能看到花纹。纹路是泥本身的走向，不是画上去的，也不是贴上去的。',
    meaning: '纹在泥里，不在表面。',
    care: '每一件的纹路都不会重复，不能指定花纹落在哪个位置。',
    shapes: ['食盆', '水碗', '挂牌', '摆件', '纪念罐'],
    colors: ['绞胎本色'],
    match: ['绞胎'],
    color: 'var(--k-jiaotai)',
    field: 'rgba(138, 106, 79, 0.20)',
    image: '',
  },
  {
    id: 'wuse',
    name: '五色陶土',
    en: 'FIVE-CLAY',
    tagline: '五种颜色的土，拼在一只器物上',
    what:
      '把五种颜色的陶土分段拼在同一只器物上，烧成之后色块交界的地方会有轻微的流动，像颜色自己走到了一起。',
    meaning: '一只器物上有五种土。',
    care: '色块排布是随机的，不接受指定顺序；同一款两件的配色不会完全一样。',
    shapes: ['食盆', '水碗', '挂牌', '摆件', '纪念罐'],
    colors: ['五色陶土'],
    match: ['五色'],
    color: 'var(--k-wuse)',
    field: 'rgba(176, 106, 82, 0.20)',
    image: '',
  },
  {
    id: 'yaobian',
    name: '窑变',
    en: 'KILN VARIATION',
    tagline: '让火烧决定最后是什么颜色',
    what:
      '靠窑里的气氛和温度变化，让釉自己流动、自己发色。同一窑、不同位置出来的颜色都不一样。星河、暮山、天青、暮云，都是这样出来的，不是调色盘上配的。',
    meaning: '让火参与设计。',
    care: '颜色不可控，实物和照片一定会有差异，这是窑变本身的性质。',
    shapes: ['食盆', '水碗', '挂牌', '摆件', '纪念罐'],
    colors: ['窑变暮山', '窑变天青', '窑变星河', '窑变暮云', '窑变星野'],
    match: ['窑变'],
    color: 'var(--k-yaobian)',
    field: 'rgba(70, 101, 111, 0.20)',
    image: '',
  },
  {
    id: 'zhehong',
    name: '柘红素陶',
    en: 'ZHE RED EARTHENWARE',
    tagline: '不施釉，让泥自己说话',
    what:
      '用含铁量高的红陶土，不施釉，只靠泥的本色和烧成温度定色。温度高一点就发暗，低一点就偏黄，全靠经验卡。',
    meaning: '不遮，把材质本身露出来。',
    care: '表面有颗粒感，会吸水；第一次使用建议先泡透，避免从坯体往外渗。',
    shapes: ['食盆', '挂牌', '摆件', '纪念罐'],
    colors: ['柘红素陶'],
    match: ['柘红', '柘沟红陶'],
    color: 'var(--k-zhehong)',
    field: 'rgba(164, 75, 51, 0.20)',
    image: '',
  },
  {
    id: 'kehua',
    name: '刻花',
    en: 'INCISED',
    tagline: '半干的时候走刀，一刀成型',
    what:
      '坯体半干时用刻刀走线，刻出花、叶、莲瓣、瑞兽。泥太湿会塌，太干会崩，只能在那一段窗口里做完。刻掉的地方不再回来。',
    meaning: '减法，刻掉的不再回来。',
    care: '图案可以从现有花型里选，也可以提供参考图另外商量，但不能和现有作品完全一样。',
    shapes: ['食盆', '水碗', '挂牌', '摆件', '纪念罐'],
    colors: ['月白', '柘红素陶', '刻花山河'],
    match: ['刻花', '手刻'],
    color: 'var(--k-kehua)',
    field: 'rgba(107, 125, 140, 0.20)',
    image: '',
  },
  {
    id: 'sutao',
    name: '素陶原色',
    en: 'RAW CLAY',
    tagline: '完全不施釉，只留泥的原始手感',
    what:
      '不施釉，烧成后保留泥本来的颜色和手感。没有釉面反光，摸上去是粗的，用久了会慢慢变深。',
    meaning: '最少加工。',
    care: '会吸水，不适合长期盛水；如果用来装水，建议先泡透再晾干。',
    shapes: ['水碗', '食盆'],
    colors: ['无釉素陶'],
    match: ['素陶原色'],
    color: 'var(--k-sutao)',
    field: 'rgba(154, 132, 100, 0.20)',
    image: '',
  },
]

/** 每个工艺对应哪些作品（按商品名里的工艺词匹配） */
export function worksOf(craft) {
  return products.filter((p) => craft.match.some((m) => p.craft.includes(m)))
}

export function countOf(craft) {
  return worksOf(craft).length
}

export function findCraft(id) {
  return crafts.find((c) => c.id === id)
}

/** 兼容旧引用 */
export const patterns = crafts
export const patternCategories = crafts.map((c) => c.name)
export function findPattern(id) {
  return findCraft(id)
}
