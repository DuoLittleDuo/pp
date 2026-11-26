/** 工艺故事（第一版放前端；正式内容请按实际情况核对后替换） */

export const stories = [
  {
    slug: 'from-clay',
    index: '01',
    title: '从一块泥开始',
    en: 'FROM A LUMP OF CLAY',
    date: '2026 · 春',
    excerpt:
      '拉坯之前要先「醒泥」。泥里有气，气不放掉，烧出来就会裂。这一段等待，是整件事里最不被看见的部分。',
    cover: '',
    ratio: '3/2',
    sections: [
      {
        heading: '醒泥',
        body: '泥买回来不能直接用，要摊开、洒水、反复揉，把里面的气泡赶出去，再盖上湿布放几天。这几天叫醒泥。泥醒好了，拉坯时才不会中途歪掉。',
        image: '',
      },
      {
        heading: '拉坯',
        body: '一件杯子的拉坯时间大约三分钟。壁厚控制在 3mm 上下，太薄撑不住釉，太厚端着沉。手离开泥的时候，器型就已经定了。',
        image: '',
      },
      {
        heading: '修坯与素烧',
        body: '半干的时候修底足，把多余的泥刮掉。然后进窑素烧一次，800℃ 左右，让坯体结实到能上釉。',
        image: '',
      },
      {
        heading: '上釉与还原烧',
        body: '釉要薄，薄到能看见胎土的颜色。1280℃ 还原烧十几个小时，窑里氧气不足，釉里的铁被还原，青色才出来。',
        image: '',
      },
    ],
  },
  {
    slug: 'wood-kiln',
    index: '02',
    title: '柴窑三天',
    en: 'THREE DAYS OF WOOD',
    date: '2026 · 夏',
    excerpt: '一窑烧七十二小时，两个人轮班看火。出窑率不到六成，剩下的都是学费。',
    cover: '',
    ratio: '3/2',
    sections: [
      {
        heading: '为什么还用柴',
        body: '柴烧的火焰直接扫过坯体，木灰落在上面熔成一层薄釉。这种落灰的位置和厚薄，用气窑、电窑都做不出来。',
        image: '',
      },
      {
        heading: '看火',
        body: '前 20 小时慢慢升温，之后每小时投一次柴。看火色判断温度，没有仪表可以完全依赖。',
        image: '',
      },
      {
        heading: '出窑',
        body: '降温要一天一夜。开窑的时候才知道哪几件留下了，哪几件裂了。',
        image: '',
      },
    ],
  },
  {
    slug: 'one-line',
    index: '03',
    title: '一道线，试了四个月',
    en: 'ONE LINE, FOUR MONTHS',
    date: '2026 · 秋',
    excerpt: '我们想在器物腰部留一条 2mm 的留白，让釉在那里断开。听起来简单，做起来不是。',
    cover: '',
    ratio: '3/2',
    sections: [
      {
        heading: '问题',
        body: '釉在烧制时会流动，2mm 的留白经常被流下来的釉填满，线就没了。',
        image: '',
      },
      {
        heading: '办法',
        body: '最后是在留白处先上一层极薄的隔离层，烧完自然剥落。',
        image: '',
      },
    ],
  },
]

export function findStory(slug) {
  return stories.find((s) => s.slug === slug)
}
