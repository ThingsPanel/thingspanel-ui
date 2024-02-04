<template>
  <div>
    <div>
      <span class="inline-block w-[80px]">插件类型：</span>
      <n-radio-group v-model:value="state.pluginName" name="radiobuttongroup2" size="medium">
        <n-radio-button v-for="pitem in pluginTyps" :key="pitem.value" :value="pitem.value">
          {{ pitem.name }}
        </n-radio-button>
      </n-radio-group>
    </div>
    <div class="my-4">
      <span class="inline-block w-[80px]">查询：</span>
      <n-input v-model:value="state.keyword" autosize class="w-[200px]" type="text" placeholder="请输入插件名称" />
      <n-button class="ml-2" type="info" @click="loadList">查询</n-button>
      <n-button class="ml-2 float-right" type="info" @click="handleChangeDisplayMode('table')">表格</n-button>
      <n-button class="ml-2 float-right" type="info" @click="handleChangeDisplayMode('grid')">卡片</n-button>
    </div>

    <div v-if="state.displayMode === 'grid'" v-loading="state.listLoading">
      <plugin-card v-for="item in listArr" :key="item.id" :data="item" :is-installed="true"></plugin-card>
    </div>
    <div v-else>
      <n-table :single-line="false">
        <thead>
          <tr>
            <th>名称</th>
            <th>作者</th>
            <th>描述</th>
            <th>插件分类</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in listArr" :key="index">
            <td>插件名称{{ item.name }}</td>
            <td>插件作作者</td>
            <td>插件描述</td>
            <td>插件分类</td>
            <td>
              <n-button class="mr-2" type="info" @click="loadList">编辑</n-button>
              <n-button class="mr-2" type="info" @click="loadList">导出</n-button>
              <n-button class="" type="info" @click="loadList">卸载</n-button>
            </td>
          </tr>
        </tbody>
      </n-table>
    </div>

    <n-pagination v-model:page="state.page" class="text-right float-right" :page-count="state.pageCount" />
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import PluginCard from './plugin-card.vue'
const pluginTyps = ref([
  { name: '设备插件', label: 'device', value: 1 },
  { name: '协议插件', label: 'protocol', value: 4 },
  { name: '解析脚本', label: 'script', value: 3 },
  { name: '规则引擎', label: 'nodRed', value: 2 },
  { name: '可视化插件', label: 'visual', value: 5 }
])
const listArr: any = ref([{}, {}, {}, {}, {}, {}])

const state = reactive({
  pluginName: '',
  keyword: '',
  displayMode: 'grid',
  listLoading: false,
  page: 1,
  pageCount: 100
})

function loadList() {
  console.log(1)
}

function handleChangeDisplayMode(mode: string) {
  state.displayMode = mode
}
</script>
