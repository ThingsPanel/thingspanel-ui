<script setup lang="tsx">
import { reactive, ref } from 'vue';
import type { Ref } from 'vue';
import { NButton } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
import dayjs from 'dayjs';
import { getNotificationHistoryList } from '@/service/api/notification';
import { notificationOptions } from '@/constants/business';
import { useLoading } from '~/packages/hooks';

const { loading, startLoading, endLoading } = useLoading(false);

const queryParams = reactive({
  notification_type: '',
  selected_time: null,
  send_target: ''
});
const total = ref(0);

const tableData = ref<Api.Alarm.NotificationHistoryList[]>([]);

function setTableData(data: Api.Alarm.NotificationHistoryList[] | []) {
  tableData.value = data || [];
}

const pagination: PaginationProps = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20, 25, 30],
  onChange: (page: number) => {
    pagination.page = page;
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
  }
});

const formatTime = (time: string | null) => {
  if (time) {
    return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
  }
  return '';
};

const getTableData = async () => {
  startLoading();
  const start_time = queryParams.selected_time ? queryParams.selected_time[0] : null;
  const end_time = queryParams.selected_time ? queryParams.selected_time[1] : null;
  const prams = {
    page: pagination.page || 1,
    page_size: pagination.pageSize || 10,
    notification_type: queryParams.notification_type,
    send_target: queryParams.send_target,
    send_time_start: formatTime(start_time),
    send_time_stop: formatTime(end_time)
  };
  const res = await getNotificationHistoryList(prams);
  if (res?.data) {
    setTableData(res?.data.list || []);
    total.value = res.data.total || 0;
  }
  endLoading();
};

const columns: Ref<DataTableColumns<DataService.Data>> = ref([
  {
    key: 'send_time_start',
    title: '发送时间',
    align: 'left'
  },
  {
    key: 'send_content',
    title: '发送标题和内容',
    align: 'left'
  },
  {
    key: 'send_target',
    title: '接收人',
    align: 'left',
    width: '200'
  },
  {
    key: 'send_result',
    title: '发送结果',
    align: 'left'
  },
  {
    key: 'notification_type',
    title: '通知类型',
    align: 'left'
  }
]) as Ref<DataTableColumns<DataService.Data>>;

function handleQuery() {
  getTableData();
}

getTableData();
</script>

<template>
  <div class="overflow-hidden">
    <NCard title="通知记录" :bordered="false" class="h-full rounded-8px shadow-sm">
      <div class="h-full flex-col">
        <NForm inline label-placement="left" :model="queryParams">
          <NFormItem path="name" label="通知类型:">
            <NSelect
              v-model:value="queryParams.notification_type"
              :options="notificationOptions"
              class="input-style min-w-160px"
            />
          </NFormItem>
          <NFormItem path="selected_time">
            <NDatePicker v-model:value="queryParams.selected_time" type="datetimerange" clearable separator="-" />
          </NFormItem>
          <NFormItem path="send_target">
            <NInput v-model:value="queryParams.send_target" placeholder="接收人" />
          </NFormItem>
          <NButton class="w-72px" type="primary" @click="handleQuery">搜索</NButton>
        </NForm>
        <NDataTable :columns="columns" :data="tableData" :loading="loading" flex-height class="flex-1-hidden" />
        <div class="pagination-box">
          <NPagination v-model:page="pagination.page" :item-count="total" @update:page="getTableData" />
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.pagination-box {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>
