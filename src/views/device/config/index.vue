<script lang="tsx" setup>
import { onMounted, ref } from 'vue';
import { NButton, NCard, NFlex, NGrid, NGridItem, NPagination } from 'naive-ui';
import { IosSearch } from '@vicons/ionicons4';
import type { LastLevelRouteKey } from '@elegant-router/types';
import { deviceConfig } from '@/service/api/device';
import { useRouterPush } from '@/hooks/common/router';
const { routerPushByKey } = useRouterPush();

const showModal = () => {
  routerPushByKey('device_config-edit');
};
const queryData = ref({
  page: 1,
  page_size: 12,
  name: ''
});
const deviceConfigList = ref([] as any[]);
const dataTotal = ref(0);
const getData = async () => {
  const res = await deviceConfig(queryData.value);
  if (!res.error) {
    deviceConfigList.value = res.data.list;
    dataTotal.value = res.data.total;
  }
};
const handleQuery = async () => {
  queryData.value.page = 1;
  deviceConfigList.value = [];
  await getData();
};
// 页面跳转
const goRouter = (name: LastLevelRouteKey, id: string) => {
  routerPushByKey(name, { query: { id } });
};

onMounted(() => {
  getData();
});
</script>

<template>
  <div class="h-full w-full">
    <NCard :bordered="false">
      <NFlex justify="space-between" class="mb-4">
        <NButton type="primary" @click="showModal()">+创建设备配置</NButton>
        <NFlex align="center" justify="flex-end" :wrap="false">
          <NInput
            v-model:value="queryData.name"
            placeholder="请输入配置名称"
            type="text"
            clearable
            @clear="handleQuery"
            @keydown.enter="handleQuery"
          >
            <template #prefix>
              <NIcon>
                <IosSearch />
              </NIcon>
            </template>
          </NInput>
          <NButton class="w-72px" type="primary" @click="handleQuery">搜索</NButton>
        </NFlex>
      </NFlex>
      <n-empty
        v-if="deviceConfigList.length === 0"
        size="huge"
        description="暂无数据"
        class="min-h-60 justify-center"
      ></n-empty>
      <template v-else>
        <NGrid x-gap="24" y-gap="16" :cols="24">
          <NGridItem
            v-for="item in deviceConfigList"
            :key="item.id"
            :span="6"
            @click="goRouter('device_config-detail', item.id)"
          >
            <NCard hoverable>
              <div class="text-16px font-600">
                {{ item.name }}
              </div>
              <NFlex justify="space-between" align="center" class="mt-4">
                <div>{{ item.device_count }}个设备</div>
                <div>
                  <template v-if="item.device_type === '1'">直连设备</template>
                  <template v-if="item.device_type === '2'">网关</template>
                  <template v-if="item.device_type === '3'">网关子设备</template>
                </div>
              </NFlex>
            </NCard>
          </NGridItem>
        </NGrid>
        <NFlex justify="end" class="mt-4">
          <NPagination
            v-model:page="queryData.page"
            :page-size="queryData.page_size"
            :item-count="dataTotal"
            @update:page="getData"
          />
        </NFlex>
      </template>
    </NCard>
  </div>
</template>

<style scoped lang="scss">
.config-content {
  display: flex;
  flex-flow: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  padding: 10px 0;
  .config-item {
    //height: 120px;
    //width: 25%;
    //border: solid 1px #000000;
    //margin: 0 10px;
    padding: 12px;
    flex: 0 0 23%;
    margin-right: calc(8% / 3);
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    border-radius: 12px;
  }
}
</style>
