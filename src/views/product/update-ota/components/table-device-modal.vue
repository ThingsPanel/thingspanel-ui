<template>
  <n-modal v-model:show="modalVisible" preset="card" :title="title" class="w-700px">
    <n-form ref="formRef" label-placement="left" :label-width="80" :model="formModel" :rules="rules">
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" :label="$t('page.product.list.productName')" path="name">
          <n-input v-model:value="formModel.deviceNumber" />
        </n-form-item-grid-item>
      </n-grid>
      <n-space class="w-full pt-16px" :size="24" justify="end">
        <n-button class="w-72px" @click="closeModal">取消</n-button>
        <n-button class="w-72px" type="primary" @click="handleSubmit">确定</n-button>
      </n-space>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue'
import type { FormInst, FormItemRule } from 'naive-ui'
import { createRequiredFormRule } from '@/utils'
import { $t } from '~/src/locales'
import { addProduct, editProduct } from '~/src/service/product/list'

export interface Props {
  /** 弹窗可见性 */
  visible: boolean
  /**
   * 弹窗类型
   * add: 新增
   * edit: 编辑
   */
  type?: 'add' | 'edit'
  /** 编辑的表格行数据 */
  editData?: productDeviceRecord | null
}

export type ModalType = NonNullable<Props['type']>

defineOptions({ name: 'TableActionModal' })

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: null
})

interface Emits {
  (e: 'update:visible', visible: boolean): void
  /** 点击协议 */
  (e: 'success'): void
}

const emit = defineEmits<Emits>()

const modalVisible = computed({
  get() {
    return props.visible
  },
  set(visible) {
    emit('update:visible', visible)
  }
})
const closeModal = () => {
  modalVisible.value = false
}

const title = computed(() => {
  const titles: Record<ModalType, string> = {
    add: $t('page.product.list.addProduct'),
    edit: $t('page.product.list.editProduct')
  }
  return titles[props.type]
})

const formRef = ref<HTMLElement & FormInst>()

const formModel = reactive<productDeviceRecord>(createDefaultFormModel() as productDeviceRecord)

const rules: Record<'name' | 'device_type', FormItemRule | FormItemRule[]> = {
  name: createRequiredFormRule($t('page.product.list.productNamePlaceholder')),
  device_type: createRequiredFormRule($t('page.product.list.productTypePlaceholder'))
}

function createDefaultFormModel() {
  return {}
}

function handleUpdateFormModel(model: Partial<productDeviceRecord>) {
  Object.assign(formModel, model)
}

function handleUpdateFormModelByModalType() {
  const handlers: Record<ModalType, () => void> = {
    add: () => {
      const defaultFormModel = createDefaultFormModel()
      handleUpdateFormModel(defaultFormModel)
    },
    edit: () => {
      if (props.editData) {
        handleUpdateFormModel(props.editData as productDeviceRecord)
      }
    }
  }

  handlers[props.type]()
}

async function handleSubmit() {
  await formRef.value?.validate()
  let data: any
  if (props.type === 'add') {
    data = await addProduct(formModel)
  } else if (props.type === 'edit') {
    data = await editProduct(formModel)
  }
  if (!data.error) {
    window.$message?.success(data.msg)
    emit('success')
  }
  closeModal()
}

watch(
  () => props.visible,
  newValue => {
    if (newValue) {
      handleUpdateFormModelByModalType()
    }
  }
)
</script>

<style scoped></style>