<script setup lang="ts">
import { useAuthStore } from '@/store/modules/auth';

defineOptions({ name: 'DashboardWorkbenchHeader' });

const auth = useAuthStore();

interface StatisticData {
  id: number;
  label: string;
  value: string;
}

const statisticData: StatisticData[] = [
  {
    id: 0,
    label: '项目数',
    value: '25'
  },
  {
    id: 1,
    label: '待办',
    value: '4/16'
  },
  {
    id: 2,
    label: '消息',
    value: '12'
  }
];
</script>

<template>
  <NCard :bordered="false" class="rounded-8px shadow-sm">
    <div class="flex-y-center justify-between">
      <div class="flex-y-center">
        <IconLocalAvatar class="text-70px" />
        <div class="pl-12px">
          <h3 class="text-18px font-semibold">早安，{{ auth.userInfo.userName }}, 今天又是充满活力的一天！</h3>
          <p class="text-#999 leading-30px">今日多云转晴，20℃ - 25℃！</p>
        </div>
      </div>
      <NSpace :size="24" :wrap="false">
        <NStatistic v-for="item in statisticData" :key="item.id" class="whitespace-nowrap" v-bind="item"></NStatistic>
      </NSpace>
    </div>
  </NCard>
</template>

<style scoped></style>
