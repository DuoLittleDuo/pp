import { createRouter, createWebHistory } from 'vue-router'

/**
 * 路由表 —— 页面命名全部用大白话，方便客户理解
 * meta.title  浏览器标题
 * meta.crumb  面包屑用的短名
 */
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首页', crumb: '首页', bare: true },
  },
  {
    path: '/shop',
    name: 'shop',
    component: () => import('@/views/ShopView.vue'),
    meta: { title: '逛陶器', crumb: '逛陶器' },
  },
  {
    path: '/shop/:id',
    name: 'product',
    component: () => import('@/views/ProductDetailView.vue'),
    meta: { title: '陶器详情', crumb: '陶器详情' },
  },
  {
    path: '/patterns',
    name: 'patterns',
    component: () => import('@/views/PatternLibraryView.vue'),
    meta: { title: '纹样库', crumb: '纹样库' },
  },
  {
    path: '/patterns/:id',
    name: 'pattern',
    component: () => import('@/views/PatternDetailView.vue'),
    meta: { title: '纹样详情', crumb: '纹样详情' },
  },
  {
    path: '/customize',
    name: 'customize',
    component: () => import('@/views/CustomizeView.vue'),
    meta: { title: '自己定做', crumb: '自己定做' },
  },
  {
    path: '/story',
    name: 'story',
    component: () => import('@/views/StoryView.vue'),
    meta: { title: '工艺故事', crumb: '工艺故事' },
  },
  {
    path: '/story/:slug',
    name: 'story-article',
    component: () => import('@/views/StoryArticleView.vue'),
    meta: { title: '工艺故事', crumb: '故事正文' },
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/CartView.vue'),
    meta: { title: '购物袋', crumb: '购物袋' },
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/views/CheckoutView.vue'),
    meta: { title: '结算', crumb: '结算' },
  },
  {
    path: '/pay/result',
    name: 'pay-result',
    component: () => import('@/views/PayResultView.vue'),
    meta: { title: '支付结果', crumb: '支付结果' },
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/views/account/AccountHomeView.vue'),
    meta: { title: '我的', crumb: '我的' },
  },
  {
    path: '/account/orders',
    name: 'orders',
    component: () => import('@/views/account/OrdersView.vue'),
    meta: { title: '我的订单', crumb: '我的订单' },
  },
  {
    path: '/account/orders/:id',
    name: 'order-detail',
    component: () => import('@/views/account/OrderDetailView.vue'),
    meta: { title: '订单详情', crumb: '订单详情' },
  },
  {
    path: '/account/favorites',
    name: 'favorites',
    component: () => import('@/views/account/FavoritesView.vue'),
    meta: { title: '我的收藏', crumb: '我的收藏' },
  },
  {
    path: '/account/designs',
    name: 'designs',
    component: () => import('@/views/account/DesignsView.vue'),
    meta: { title: '我的定做', crumb: '我的定做' },
  },
  {
    path: '/account/addresses',
    name: 'addresses',
    component: () => import('@/views/account/AddressesView.vue'),
    meta: { title: '收货地址', crumb: '收货地址' },
  },
  {
    path: '/styleguide',
    name: 'styleguide',
    component: () => import('@/views/StyleGuideView.vue'),
    meta: { title: '样式页', crumb: '样式页' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: '没找到这一页', crumb: '404' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const t = to.meta.title ? `${to.meta.title} · 垚 · 陶` : '垚 · 陶'
  document.title = t
})

export default router
