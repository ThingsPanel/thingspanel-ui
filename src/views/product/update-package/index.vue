<script setup lang="tsx">
import { reactive, ref, watch } from 'vue';
import type { Ref } from 'vue';
import { NButton, NPopconfirm, NSpace } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
import { useBoolean, useLoading } from '@sa/hooks';
import { $t } from '@/locales';
import { deleteOtaPackage, getOtaPackageList } from '@/service/product/update-package';
import { getDeviceList } from '@/service/product/list';
import TablePackageModal from './components/table-package-modal.vue';
import type { ModalType } from './components/table-package-modal.vue';
import ColumnSetting from './components/column-setting.vue';
const { loading, startLoading, endLoading } = useLoading(false);
const { bool: visible, setTrue: openModal } = useBoolean();

const queryParams = reactive({
  name: '',
  device_config_id: '',
  page: 1,
  page_size: 10
});
watch(
  visible,
  () => {
    if (!visible) {
      getTableData();
    }
  },
  { deep: true }
);
const tableData = ref<productPackageRecord[]>([]);
function setTableData(data: productPackageRecord[]) {
  tableData.value = data;
}

const pagination: PaginationProps = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20, 25, 30],
  onChange: (page: number) => {
    pagination.page = page;
    queryParams.page = page;
    getTableData();
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    queryParams.page = 1;
    queryParams.page_size = pageSize;
    getTableData();
  }
});
function handleQuery() {
  init();
}
function handleReset() {
  Object.assign(queryParams, {
    deviceNumber: '',
    batchNumber: '',
    page: 1
  });
  handleQuery();
}
async function getTableData() {
  startLoading();
  const { data } = await getOtaPackageList(queryParams);
  if (data) {
    const list: productPackageRecord[] = data.list;
    setTableData(list);
    pagination.pageCount = Math.ceil(data.total / queryParams.page_size);
    endLoading();
  }
}

const columns: Ref<DataTableColumns<productPackageRecord>> = ref([
  {
    key: 'name',
    title: $t('page.product.update-package.packageName')
  },
  {
    key: 'target_version',
    title: $t('page.product.update-package.version')
  },
  {
    key: 'version',
    title: $t('page.product.update-package.versionCode')
  },
  {
    key: 'device_config_name',
    title: $t('page.product.update-package.deviceConfig')
  },
  {
    key: 'package_type',
    title: $t('page.product.update-package.type')
  },
  {
    key: 'module',
    title: $t('page.product.update-package.moduleName')
  },
  {
    key: 'created_at',
    title: $t('page.product.update-package.createTime')
  },
  {
    key: 'description',
    title: $t('page.product.update-package.desc')
  },
  {
    key: 'actions',
    title: $t('common.action'),
    align: 'center',
    width: '200px',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton size={'small'} type="primary" onClick={() => handleEditTable(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteTable(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" size={'small'}>
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </NSpace>
      );
    }
  }
]) as Ref<DataTableColumns<productPackageRecord>>;

const modalType = ref<ModalType>('add');

function setModalType(type: ModalType) {
  modalType.value = type;
}

const editData = ref<productPackageRecord | null>(null);

function setEditData(data: productPackageRecord | null) {
  editData.value = data;
}

function handleAddTable() {
  setEditData(null);
  setModalType('add');
  openModal();
}

function handleEditTable(rowId: string) {
  const findItem = tableData.value.find(item => item.id === rowId);
  if (findItem) {
    setEditData(findItem);
  }
  setModalType('edit');
  openModal();
}

async function handleDeleteTable(rowId: string) {
  const data = await deleteOtaPackage(rowId);
  if (!data.error) {
    window.$message?.success($t('common.deleteSuccess'));
    getTableData();
  }
}
const deviceOptions = ref();
const getDevice = () => {
  getDeviceList({ page: 1, page_size: 99 }).then(res => {
    deviceOptions.value = res.data.list.map(item => ({
      label: item.name,
      value: item.id
    }));
  });
};
function init() {
  getDevice();
  getTableData();
}

// 初始化
init();
</script>

<template>
  <div class="h-full overflow-hidden">
    <NCard
      :title="$t('page.product.update-package.packageList')"
      :bordered="false"
      class="h-full rounded-8px shadow-sm"
    >
      <div class="h-full flex-col">
        <NForm inline label-placement="left" :model="queryParams">
          <NGrid :cols="24" :x-gap="18">
            <NFormItemGridItem :span="6" :label="$t('page.product.list.deviceConfig')" path="email">
              <NSelect v-model:value="queryParams.device_config_id" :options="deviceOptions" />
            </NFormItemGridItem>
            <NFormItemGridItem :span="6" :label="$t('page.product.update-package.packageName')" path="name">
              <NInput v-model:value="queryParams.name" />
            </NFormItemGridItem>
            <NFormItemGridItem>
              <NButton class="w-72px" type="primary" @click="handleQuery">{{ $t('common.search') }}</NButton>
              <NButton class="ml-20px w-72px" type="primary" @click="handleReset">{{ $t('common.reset') }}</NButton>
            </NFormItemGridItem>
          </NGrid>
        </NForm>
        <NSpace class="pb-12px" justify="space-between">
          <NSpace>
            <NButton type="primary" @click="handleAddTable">
              <IconIcRoundPlus class="mr-4px text-20px" />
              {{ $t('common.add') }}
            </NButton>
          </NSpace>
          <NSpace align="center" :size="18">
            <NButton size="small" type="primary" @click="getTableData">
              <IconMdiRefresh class="mr-4px text-16px" :class="{ 'animate-spin': loading }" />
              {{ $t('common.refreshTable') }}
            </NButton>
            <ColumnSetting v-model:columns="columns" />
          </NSpace>
        </NSpace>
        <NDataTable
          remote
          :columns="columns"
          :data="tableData"
          :loading="loading"
          :pagination="pagination"
          flex-height
          class="flex-1-hidden"
        />
        <TablePackageModal v-model:visible="visible" :type="modalType" :edit-data="editData" @success="getTableData" />
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
