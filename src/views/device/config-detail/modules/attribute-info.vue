<script setup lang="ts">
import type { Ref } from 'vue';
import { h, onMounted, ref } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NButton, NFlex, NPagination, useMessage } from 'naive-ui';
import { deviceConfigEdit, deviceTemplate, deviceTemplateDetail } from '@/service/api/device';
import { useRouterPush } from '@/hooks/common/router';
const { routerPushByKey } = useRouterPush();

const message = useMessage();
// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits();

const showPopover = ref(false);
interface Props {
  configInfo?: object | any;
}
const props = withDefaults(defineProps<Props>(), {
  configInfo: null
});
const columns: Ref<DataTableColumns<ServiceManagement.Service>> = ref([
  {
    key: 'name',
    title: '名称',
    align: 'center'
  },
  {
    key: 'author',
    title: '作者',
    align: 'center',
    width: '150px'
  },
  {
    key: 'operate',
    title: '操作',
    align: 'center',
    width: '130px',
    render() {
      return h(
        NFlex,
        {
          justify: 'center'
        },
        [
          h(
            NButton,
            {
              ghost: true,
              type: 'primary',
              tertiary: true,
              size: 'small',
              // eslint-disable-next-line @typescript-eslint/no-use-before-define,@typescript-eslint/no-shadow
              onClick: row => choseTemp(row)
            },
            { default: () => '选择' }
          ),
          h(
            NButton,
            {
              ghost: true,
              type: 'info',
              tertiary: true,
              size: 'small',
              // eslint-disable-next-line @typescript-eslint/no-use-before-define,@typescript-eslint/no-shadow
              onClick: () => openTemp()
            },
            { default: () => '查看' }
          )
        ]
      );
    }
  }
]);
const choseTemp = async row => {
  const postData = props.configInfo;
  postData.device_template_id = row.id;
  const res = await deviceConfigEdit(postData);
  if (!res.error) {
    message.success('修改成功');
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    templateDetail.value = row;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    plugQuery.value.name = row.name;
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    searchPlug();
    emit('upDateConfig');
  }
};
const openTemp = () => {};
const plugList = ref([]);
const plugQuery = ref({
  page: 1,
  page_size: 10,
  name: ''
});
const plugTotal = ref(0);
const getTableData = async () => {
  const res = await deviceTemplate(plugQuery.value);
  plugList.value = res.data.list;
  plugTotal.value = res.data.total;
};
const searchPlug = () => {
  plugQuery.value.page = 1;
  getTableData();
};
const templateDetail = ref<any>({});
const getTemplateDetail = async () => {
  if (props.configInfo.device_template_id) {
    const res = await deviceTemplateDetail({ id: props.configInfo.device_template_id });
    templateDetail.value = res.data;
  }
};
const openPopover = () => {
  showPopover.value = true;
  plugQuery.value.name = templateDetail.value.name;
  getTableData();
};
const toTemplate = () => {
  routerPushByKey('device_template');
};
// watch(
//     () => props.configInfo,
//     (newValue) => {
//       if(newValue){
//           message.success('111');
//         // getTemplateDetail()
//       }
//     }
// )
onMounted(async () => {
  await getTemplateDetail();
});
</script>

<template>
  <div class="attribute-box">
    <NFlex align="center">
      <div>绑定设备模板</div>
      <n-popover :show="showPopover" placement="bottom-start" trigger="manual" @clickoutside="showPopover = false">
        <template #trigger>
          <NInput
            v-model:value="templateDetail.name"
            class="w-300px"
            @focus="openPopover"
            @blur="showPopover = false"
          />
        </template>
        <div class="w-500">
          <NInput v-model:value="plugQuery.name" @focus="showPopover = true" @input="searchPlug" />
          <NDataTable :columns="columns" :data="plugList" size="small" class="m-tb-10" />
          <div class="pagination-box">
            <!-- Data table to display device groups -->
            <!-- Pagination component -->
            <NPagination
              v-model:page="plugQuery.page"
              :page-size="plugQuery.page_size"
              :item-count="plugTotal"
              @update:page="getTableData"
            />
          </div>
        </div>
      </n-popover>
      <div class="to-create" @click="toTemplate">没有找到？去创建</div>
    </NFlex>
  </div>
</template>

<style scoped lang="scss">
.attribute-box {
  padding: 50px;

  .to-create {
    color: #999999;
  }

  .to-create:hover {
    cursor: pointer;
    text-decoration: underline;
    color: #646cff;
  }

  .m-b-10 {
    margin-bottom: 10px;
  }
}
.pagination-box {
  display: flex;
  justify-content: flex-end;
}
.m-tb-10 {
  margin: 10px 0;
}
.w-300px {
  width: 300px;
  margin: 0 15px;
}
.w-500 {
  width: 500px;
}
</style>
