<script lang="tsx" setup>
import type { VueElement } from 'vue';
import { computed, defineProps, ref, watchEffect } from 'vue';
import { NButton, NDataTable, NDatePicker, NInput, NPopconfirm, NSelect, NSpace } from 'naive-ui';
import type { TreeSelectOption } from 'naive-ui';
import { throttle } from 'lodash-es';
import { useLoading } from '@sa/hooks';
import TencentMap from './modules/tencent-map.vue';
// 定义搜索配置项的类型，支持多种输入类型：纯文本、日期选择器、日期范围选择器、下拉选择和树形选择器
export type SearchConfig =
  | {
      key: string;
      label: string;
      type: 'input' | 'date' | 'date-range';
    }
  | {
      key: string;
      label: string;
      type: 'select';
      options: { label: string; value: any }[];
      loadOptions?: (pattern) => Promise<{ label: string; value: any }[]>;
    }
  | {
      key: string;
      label: string;
      type: 'tree-select';
      options: TreeSelectOption[];
      multiple: boolean;
      loadOptions?: () => Promise<TreeSelectOption[]>;
    };

// 通过props从父组件接收参数
const props = defineProps<{
  fetchData: (data: any) => Promise<any>; // 数据获取函数
  columnsToShow: // 表格列配置
  | {
        key: string;
        label: string;
        render?: (row: any) => VueElement | string | undefined; // 自定义渲染函数
      }[]
    | 'all'; // 特殊值'all'表示显示所有列
  searchConfigs: SearchConfig[]; // 搜索配置数组
  tableActions: Array<{
    // 表格行操作
    label: string; // 按钮文本
    callback: any; // 点击回调
  }>;
  topActions: { element: () => JSX.Element }[]; // 顶部操作组件列表
  rowClick?: (row: any) => void; // 表格行点击回调
}>();
const { loading, startLoading, endLoading } = useLoading();
// 解构props以简化访问
const { fetchData, columnsToShow, tableActions, searchConfigs } = props;
const isTableView = ref(true); // 默认显示表格视图
const dataList = ref([]); // 表格数据列表
const total = ref(0); // 数据总数
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页显示数量
const searchCriteria = ref({}); // 每页显示数量

// 获取数据的函数，结合搜索条件、分页等
const getData = async () => {
  // 处理搜索条件，特别是将日期对象转换为字符串
  startLoading();
  const processedSearchCriteria = Object.fromEntries(
    Object.entries(searchCriteria.value).map(([key, value]) => {
      if (value && Array.isArray(value)) {
        // 处理日期范围
        return [key, value.map(v => (v instanceof Date ? v.toISOString() : v))];
      }
      // 单一日期处理
      return [key, value instanceof Date ? value.toISOString() : value];
    })
  );
  // 调用提供的fetchData函数获取数据
  const response = await fetchData({
    page: currentPage.value,
    page_size: pageSize.value,
    ...processedSearchCriteria
  });
  // 处理响应
  if (!response.error) {
    dataList.value = response.data.list;
    total.value = response.data.total;
  } else {
    console.error('Error fetching data:', response.error);
  }
  endLoading();
};

// 使用计算属性动态生成表格的列配置
const generatedColumns = computed(() => {
  let columns;

  if (dataList.value.length > 0) {
    // 根据columnsToShow生成列配置
    columns = (columnsToShow === 'all' ? Object.keys(dataList.value[0]) : columnsToShow).map(item => {
      if (item.render) {
        // 使用自定义的render函数渲染列
        return {
          title: item.label,
          key: item.key,
          render: () => item.render()
        };
      }
      return {
        title: item.label,
        key: item.key,
        render: row => <>{row[item.key]}</>
      };
    });
    // 添加操作列
    columns.push({
      title: '操作',
      key: 'actions',
      render: row => (
        <NSpace>
          {tableActions.map(action => {
            if (action.label === '删除') {
              return (
                <NPopconfirm
                  onPositiveClick={async () => {
                    await action.callback(row);
                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                    handleReset();
                  }}
                >
                  {{
                    trigger: () => (
                      <NButton text size="small">
                        {action.label}
                      </NButton>
                    ),
                    default: () => '确认删除'
                  }}
                </NPopconfirm>
              );
            }
            return (
              <NButton text size="small" onClick={() => action.callback(row)}>
                {action.label}
              </NButton>
            );
          })}
        </NSpace>
      )
    });
  }

  return columns || [];
});

// 更新页码或页面大小时重新获取数据
const onUpdatePage = newPage => {
  currentPage.value = newPage;
  getData(); // 更新数据
};
const onUpdatePageSize = newPageSize => {
  pageSize.value = newPageSize;
  currentPage.value = 1; // 重置为第一页
  getData(); // 更新数据
};
// 观察分页和搜索条件的变化，自动重新获取数据
watchEffect(getData);

// 搜索和重置按钮的逻辑
const handleSearch = () => {
  currentPage.value = 1; // 搜索时重置到第一页
  getData();
};

const handleReset = () => {
  // 重置搜索条件
  Object.keys(searchCriteria.value).forEach(key => {
    searchCriteria.value[key] = ''; // 或者对应字段的默认值
  });
  handleSearch(); // 重置后重新获取数据
};
defineExpose({
  handleReset
});
// 更新树形选择器的选项
const handleTreeSelectUpdate = (value, key) => {
  searchCriteria.value[key] = value;
};

// 用于加载动态选项的函数，适用于select和tree-select类型的搜索配置
const loadOptionsOnMount = async pattern => {
  for (const config of searchConfigs) {
    if (config.type === 'select' && config.loadOptions) {
      // eslint-disable-next-line no-await-in-loop
      const opts = await config.loadOptions(pattern); // 调用传入的loadOptions函数加载选项数据
      config.options = [...config.options, ...opts];
    }
  }
};
const rowProps = row => {
  if (props && props.rowClick) {
    return {
      style: 'cursor: pointer;',
      onClick: () => {
        props.rowClick && props.rowClick(row);
      }
    };
  }
  return {};
};
const loadOptionsOnMount2 = async () => {
  for (const config of searchConfigs) {
    if (config.type === 'tree-select' && config.loadOptions) {
      // eslint-disable-next-line no-await-in-loop
      const opts = await config.loadOptions(); // 调用传入的loadOptions函数加载选项数据
      config.options = [...config.options, ...opts];
    }
  }
};
// 使用throttle减少动态加载选项时的请求频率
const throttledLoadOptionsOnMount = throttle(loadOptionsOnMount, 300);
// 在组件挂载时加载选项
loadOptionsOnMount('');
loadOptionsOnMount2();
</script>

<template>
  <n-card>
    <div class="flex flex-col gap-6 rounded-lg">
      <!-- 搜索区域与操作按钮 -->
      <div class="row flex items-end justify-between gap-4">
        <!-- 搜索输入和选择器 -->
        <div class="flex flex-1 flex-wrap items-end gap-4">
          <div v-for="config in searchConfigs" :key="config.key" class="flex flex-col gap-2">
            <template v-if="config.type === 'input'">
              <NInput
                v-model:value="searchCriteria[config.key]"
                size="small"
                :placeholder="config.label"
                class="input-style"
              />
            </template>
            <template v-else-if="config.type === 'date-range'">
              <NDatePicker
                v-model:value="searchCriteria[config.key]"
                size="small"
                type="daterange"
                :placeholder="config.label"
                class="input-style"
              />
            </template>
            <template v-else-if="config.type === 'select'">
              <NSelect
                v-model:value="searchCriteria[config.key]"
                size="small"
                filterable
                :options="config.options"
                :placeholder="config.label"
                class="input-style"
                @search="
                  value => {
                    throttledLoadOptionsOnMount(value);
                  }
                "
              />
            </template>
            <template v-else-if="config.type === 'date'">
              <NDatePicker
                v-model:value="searchCriteria[config.key]"
                size="small"
                type="date"
                :placeholder="config.label"
                class="input-style"
              />
            </template>
            <template v-else-if="config.type === 'tree-select'">
              <n-tree-select
                v-model:value="searchCriteria[config.key]"
                size="small"
                filterable
                :options="config.options"
                :multiple="config.multiple"
                class="input-style"
                @update:value="value => handleTreeSelectUpdate(value, config.key)"
              />
            </template>
          </div>
          <NButton class="btn-style" size="small" @click="handleSearch">搜索</NButton>
          <NButton class="btn-style" size="small" @click="handleReset">重置</NButton>
        </div>
        <!-- 新建与返回按钮 -->
      </div>
      <div class="h-2px w-full bg-[#f6f9f8]"></div>
      <div class="flex items-center justify-between">
        <div class="flex gap-2">
          <component :is="action.element" v-for="(action, index) in topActions" :key="index"></component>
        </div>
        <!-- 组件内部的表操作 -->
        <div>
          <NButton quaternary @click="isTableView = true">
            <template #icon>
              <n-icon text style="font-size: 24px">
                <icon-material-symbols:table-rows-narrow-outline-sharp class="text-24px" />
              </n-icon>
            </template>
          </NButton>
          <NButton quaternary @click="isTableView = false">
            <template #icon>
              <n-icon text style="font-size: 24px">
                <icon-material-symbols:map-rounded class="text-24px" />
              </n-icon>
            </template>
          </NButton>
          <NButton quaternary @click="getData">
            <template #icon>
              <n-icon text style="font-size: 24px">
                <icon-material-symbols:refresh class="text-24px" />
              </n-icon>
            </template>
          </NButton>
        </div>
      </div>
      <!-- 数据表格 -->
      <div v-if="isTableView" class="overflow-x-auto">
        <NDataTable
          :row-props="rowProps"
          :loading="loading"
          :columns="generatedColumns"
          :data="dataList"
          class="w-full"
        />
      </div>
      <div v-else class="h-525px">
        <!-- 地图视图占位 -->
        <TencentMap :devices="dataList" />
      </div>

      <n-pagination
        v-model:page="currentPage"
        v-model:page-size="pageSize"
        class="justify-end"
        :item-count="total"
        :page-size-options="[10, 20, 30, 40]"
        show-size-picker
        @update:page="onUpdatePage"
        @update:page-size="onUpdatePageSize"
      />
    </div>
  </n-card>
</template>

<style scoped>
.input-style {
  min-width: 140px;
}

.btn-style {
  @apply hover:bg-[var(--color-primary-hover)] rounded-md shadow;
}

.card-wrapper {
  @apply rounded-lg shadow overflow-hidden;
  margin: 0 auto;
  padding: 16px;
}
</style>
