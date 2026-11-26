<script setup>
import { ref } from 'vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import PageHead from '@/components/PageHead.vue'
import AppButton from '@/components/AppButton.vue'
import { accountNav } from '@/data/nav'
import { load, save } from '@/utils/storage'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()

const list = ref(load('addresses', []))

const blank = () => ({ name: '', phone: '', city: '', detail: '', isDefault: false })
const draft = ref(blank())
const editing = ref(false)

function persist() {
  save('addresses', list.value)
}

function startAdd() {
  draft.value = blank()
  editing.value = true
}

function submit() {
  const d = draft.value
  if (!d.name || !d.phone || !d.detail) {
    ui.say('收货人、手机号、地址要填')
    return
  }
  if (d.isDefault) list.value.forEach((a) => (a.isDefault = false))
  list.value.push({ ...d })
  persist()
  editing.value = false
  ui.say('地址已保存')
}

function remove(i) {
  list.value.splice(i, 1)
  persist()
  ui.say('已删除')
}

function setDefault(i) {
  list.value.forEach((a, idx) => (a.isDefault = idx === i))
  persist()
}
</script>

<template>
  <div class="page shell">
    <Breadcrumb :items="[{ label: '我的', to: '/account' }, { label: '收货地址' }]" />

    <PageHead
      no="06.4"
      eyebrow="ADDRESSES"
      title="收货地址"
      lead="存在这台设备的浏览器里，第一版不做真实账号。"
    />

    <nav class="subnav">
      <RouterLink v-for="a in accountNav" :key="a.to" :to="a.to" class="subnav__item">
        {{ a.label }}
      </RouterLink>
    </nav>

    <div class="layout">
      <div class="list">
        <article v-for="(a, i) in list" :key="i" class="addr">
          <div>
            <p class="addr__name">
              {{ a.name }}
              <span v-if="a.isDefault" class="tag">默认</span>
            </p>
            <p class="addr__phone">{{ a.phone }}</p>
            <p class="addr__detail">{{ a.city }} {{ a.detail }}</p>
          </div>
          <div class="addr__acts">
            <button v-if="!a.isDefault" type="button" @click="setDefault(i)">设为默认</button>
            <button type="button" @click="remove(i)">删除</button>
          </div>
        </article>

        <p v-if="!list.length" class="muted empty">还没有地址。</p>
      </div>

      <aside class="form">
        <p class="eyebrow">{{ editing ? 'NEW ADDRESS' : 'ADD' }}</p>

        <template v-if="editing">
          <label class="field"><span>收货人</span><input v-model="draft.name" type="text" /></label>
          <label class="field"><span>手机号</span><input v-model="draft.phone" type="tel" /></label>
          <label class="field"><span>省市</span><input v-model="draft.city" type="text" /></label>
          <label class="field"><span>详细地址</span><input v-model="draft.detail" type="text" /></label>
          <label class="check">
            <input v-model="draft.isDefault" type="checkbox" />
            <span>设为默认地址</span>
          </label>

          <div class="form__acts">
            <AppButton variant="solid" size="sm" @click="submit">保存</AppButton>
            <AppButton variant="text" size="sm" @click="editing = false">取消</AppButton>
          </div>
        </template>

        <AppButton v-else variant="line" size="md" @click="startAdd">添加新地址</AppButton>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.page {
  padding-top: var(--s4);
}

.subnav {
  display: flex;
  gap: var(--s4);
  flex-wrap: wrap;
  padding-top: var(--s2);
  padding-bottom: var(--s3);
  border-bottom: 1px solid var(--line);
}

.subnav__item {
  font-size: 13px;
  color: var(--ink-60);
  letter-spacing: 0.08em;
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: var(--s5);
  padding-top: var(--s4);
  align-items: start;
}

.list {
  display: flex;
  flex-direction: column;
  gap: var(--s3);
}

.addr {
  display: flex;
  justify-content: space-between;
  gap: var(--s3);
  padding: var(--s3);
  border: 1px solid var(--line);
  background: var(--paper-4);
}

.addr__name {
  font-family: var(--font-cn);
  font-size: 16px;
  letter-spacing: 0.06em;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tag {
  font-size: 10px;
  letter-spacing: 0.1em;
  padding: 2px 8px;
  background: var(--celadon);
  color: var(--cream);
}

.addr__phone {
  margin-top: 4px;
  font-size: 12px;
  color: var(--ink-40);
}

.addr__detail {
  margin-top: 6px;
  font-size: 13px;
  color: var(--ink-60);
}

.addr__acts {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.addr__acts button {
  font-size: 11px;
  color: var(--ink-40);
  border-bottom: 1px solid var(--line);
}

.addr__acts button:hover {
  color: var(--ink);
}

.empty {
  padding: var(--s4) 0;
}

.form {
  padding: var(--s3);
  border: 1px solid var(--line);
  background: var(--paper-4);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field span {
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--ink-40);
}

.field input {
  padding: 9px 11px;
  border: 1px solid var(--line);
  background: var(--paper-4);
  font-size: 13px;
  outline: none;
}

.field input:focus {
  border-color: var(--celadon);
}

.check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--ink-60);
}

.check input {
  accent-color: var(--celadon);
}

.form__acts {
  display: flex;
  gap: 10px;
  align-items: center;
}

@media (max-width: 860px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
