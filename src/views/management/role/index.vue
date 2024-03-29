<script setup lang="tsx">
import { reactive, ref } from 'vue';
import type { Ref } from 'vue';
import { NButton, NPopconfirm, NSpace } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
// import { userStatusLabels, userStatusOptions } from '@/constants'
import { useBoolean, useLoading } from '@sa/hooks';
import { delrles, rlesList } from '@/service/api';
import TableActionModal from './modules/table-action-modal.vue';
import EditPasswordModal from './modules/edit-password-modal.vue';
import type { ModalType } from './modules/table-action-modal.vue';
// import ColumnSetting from './components/column-setting.vue'

const { loading, startLoading, endLoading } = useLoading(false);
const { bool: visible, setTrue: openModal } = useBoolean();
const { bool: editPwdVisible } = useBoolean();

type QueryFormModel = Pick<UserManagement.User, 'email' | 'name' | 'status'> & {
  page: number;
  page_size: number;
};

const queryParams = reactive<QueryFormModel>({
  email: null,
  name: null,
  status: null,
  page: 1,
  page_size: 10
});

const tableData = ref<UserManagement.User[]>([]);

function setTableData(data: UserManagement.User[]) {
  tableData.value = data;
}

async function getTableData() {
  startLoading();
  const { data } = await rlesList(queryParams);
  if (data) {
    const list: UserManagement.User[] = data.list;
    setTableData(list);
    endLoading();
  }
}

const columns: Ref<DataTableColumns<UserManagement.User>> = ref([
  {
    key: 'name',
    title: '角色名称',
    align: 'center'
  },
  {
    key: 'description',
    title: '角色描述',
    align: 'center'
  },
  {
    key: 'created_at',
    title: '创建日期',
    align: 'center'
  },
  {
    key: 'updated_at',
    title: '修改日期',
    align: 'center'
  },
  {
    key: 'actions',
    title: '操作',
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton type="primary" size={'small'} onClick={() => handleEditTable(row.id)}>
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteTable(row.id)}>
            {{
              default: () => '确认删除',
              trigger: () => (
                <NButton type="error" size={'small'}>
                  删除
                </NButton>
              )
            }}
          </NPopconfirm>
        </NSpace>
      );
    }
  }
]) as Ref<DataTableColumns<UserManagement.User>>;

const modalType = ref<ModalType>('add');

function setModalType(type: ModalType) {
  modalType.value = type;
}

const editData = ref<UserManagement.User | null>(null);

function setEditData(data: UserManagement.User | null) {
  editData.value = data;
}

function handleAddTable() {
  openModal();
  setModalType('add');
}

// function handleEditPwd(rowId: string) {
//   const findItem = tableData.value.find(item => item.id === rowId);
//   if (findItem) {
//     setEditData(findItem);
//   }
//   openEditPwdModal();
// }

function handleEditTable(rowId: string) {
  const findItem = tableData.value.find(item => item.id === rowId);
  if (findItem) {
    setEditData(findItem);
  }
  setModalType('edit');
  openModal();
}

async function handleDeleteTable(rowId: string) {
  const data = await delrles(rowId);
  if (!data.error) {
    window.$message?.success('删除成功');
    getTableData();
  }
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

// function handleQuery() {
//   init();
// }

// function handleReset() {
//   Object.assign(queryParams, {
//     email: null,
//     name: null,
//     status: null,
//     page: 1
//   });
//   handleQuery();
// }

function init() {
  getTableData();
}

// 初始化
init();
</script>

<template>
  <div class="overflow-hidden">
    <n-card :bordered="false" class="h-full rounded-8px shadow-sm">
      <div class="h-full flex-col">
        <NSpace class="pb-12px" justify="space-between">
          <NSpace>
            <NButton type="primary" @click="handleAddTable">
              <icon-ic-round-plus class="mr-4px text-20px" />
              新增
            </NButton>
          </NSpace>
        </NSpace>

        <n-data-table
          :columns="columns"
          :data="tableData"
          :loading="loading"
          :pagination="pagination"
          flex-height
          class="flex-1-hidden"
        />
        <TableActionModal v-model:visible="visible" :type="modalType" :edit-data="editData" @success="getTableData" />
        <EditPasswordModal
          v-model:visible="editPwdVisible"
          :edit-data="editData"
          @success="getTableData"
        ></EditPasswordModal>
      </div>
    </n-card>
  </div>
</template>

<style scoped></style>
