<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { FormInst, FormItemRule } from 'naive-ui';
import { createRequiredFormRule } from '@/utils/form/rule';
import { notificationOptions } from '@/constants/business';
import { postNotificationGroup, putNotificationGroup } from '@/service/api/notification';
import { handleSearch, initMemberData, memberTypeData, notificationTypeOptions } from '../utils';
import MemberTypeData from './member-type-data.vue';

export interface Props {
  visible: boolean;
  type?: 'add' | 'edit';
  editData?: Api.Alarm.NotificationGroupList | null;
}

export type ModalType = NonNullable<Props['type']>;

defineOptions({ name: 'TableActionModal' });

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: null
});

interface Emits {
  (e: 'update:visible', visible: boolean): void;

  (e: 'getTableData'): void;
}

const emit = defineEmits<Emits>();

function createDefaultFormModel(): FormModel {
  return {
    name: '',
    description: '',
    notification_type: '',
    status: 'CLOSE'
  };
}

const initNotificationConfig = {
  MEMBER: '',
  EMAIL: '',
  SME: '',
  VOICE: '',
  WEBHOOK: '',
  PayloadURL: '',
  Secret: ''
};

const formModel = ref<FormModel>(createDefaultFormModel());
const notificationConfig = ref<any>({ ...initNotificationConfig });
const closeModal = () => {
  memberTypeData.value = [{ ...initMemberData }];
  formModel.value = createDefaultFormModel();
  notificationConfig.value = { ...initNotificationConfig };
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  modalVisible.value = false;
};
const modalVisible = computed({
  get() {
    if (!props.visible) {
      closeModal();
    }
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  }
});

const title = computed(() => {
  const titles: Record<ModalType, string> = {
    add: '创建通知组',
    edit: '修改通知组'
  };
  return titles[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

type FormModel = Pick<DataService.Data, any>;

const rules: Record<keyof FormModel, FormItemRule | FormItemRule[]> = {
  name: createRequiredFormRule('请输入规则名称'),
  description: createRequiredFormRule('请输入通知组描述'),
  notification_type: createRequiredFormRule('请选择通知方式')
};

function handleUpdateFormModel(model: Partial<FormModel>) {
  Object.assign(formModel.value, model);
}

function handleUpdateFormModelByModalType() {
  const handlers: Record<ModalType, () => void> = {
    add: () => {
      const defaultFormModel = createDefaultFormModel();
      handleUpdateFormModel(defaultFormModel);
    },
    edit: () => {
      if (props.editData) {
        handleUpdateFormModel(props.editData);
        const notification_config = JSON.parse(props.editData.notification_config);
        const notification_type = props.editData.notification_type;
        if (notification_type === 'MEMBER') {
          notificationConfig.value.MEMBER = memberTypeData;
        } else if (['EMAIL', 'SME', 'VOICE'].includes(notification_type)) {
          formModel.value.info = notification_config[notification_type];
        } else if (notification_type === 'WEBHOOK') {
          notificationConfig.value.PayloadURL = notification_config.PayloadURL;
          notificationConfig.value.Secret = notification_config.Secret;
        }
        notificationConfig.value[notification_type] = notification_config[notification_type];
      }
    }
  };

  handlers[props.type]();
}

async function handleSubmit() {
  await formRef.value?.validate();
  if (formModel.value.notification_type === 'MEMBER') {
    notificationConfig.value.MEMBER = memberTypeData;
  } else if (['EMAIL', 'SME', 'VOICE'].includes(formModel.value.notification_type)) {
    notificationConfig.value[formModel.value.notification_type] = formModel.value.info;
  }

  const params = {
    name: formModel.value.name,
    description: formModel.value.description,
    notification_type: formModel.value.notification_type,
    notification_config: JSON.stringify(notificationConfig.value),
    status: formModel.value.status
  };
  if (props.type === 'add') {
    await postNotificationGroup(params);
  } else {
    await putNotificationGroup({ ...params, tenant_id: props.editData?.tenant_id || '' }, props.editData?.id || '');
  }

  const titles: Record<ModalType, string> = {
    add: '添加',
    edit: '编辑'
  };
  window.$message?.success(`${titles[props.type]}成功!`);
  emit('getTableData');
  closeModal();
}

watch(
  () => props.visible,
  newValue => {
    if (newValue) {
      notificationTypeOptions.value = [];
      handleSearch();
      handleUpdateFormModelByModalType();
    }
  }
);

const handleAddMember = () => {
  memberTypeData.value.push(initMemberData);
};
</script>

<template>
  <NModal v-model:show="modalVisible" preset="card" :title="title" class="w-700px" @on-after-leave="closeModal">
    <NForm ref="formRef" label-placement="left" :label-width="120" :model="formModel" :rules="rules">
      <NFormItem path="name" label="通知组名称">
        <NInput v-model:value="formModel.name" />
      </NFormItem>
      <NFormItem path="description" label="通知组描述">
        <NInput v-model:value="formModel.description" type="textarea" />
      </NFormItem>
      <NFormItem path="notification_type" label="通知方式">
        <NSelect v-model:value="formModel.notification_type" :options="notificationOptions" class="w-full" />
      </NFormItem>

      <div style="margin-left: 120px">
        <template v-if="formModel.notification_type === 'MEMBER'">
          <NFormItem path="age" label="">
            <div class="flex">
              <div>设置成员通知方式</div>
              <NButton type="primary" size="small" style="margin-left: 24px" @click="handleAddMember">新增</NButton>
            </div>
          </NFormItem>

          <template v-for="(item, index) in memberTypeData" :key="item">
            <MemberTypeData :selected-notification-type="item.notificationType" :index="index" />
          </template>
        </template>

        <template v-if="['EMAIL', 'SME', 'VOICE'].includes(formModel.notification_type)">
          <div>设置收件邮箱/接收手机号</div>
          <NFormItem path="age" label="">
            <NInput v-model:value="formModel.info" type="textarea" placeholder="多个邮箱/手机号使用英文逗号隔开" />
          </NFormItem>
        </template>

        <template v-if="formModel.notification_type === 'WEBHOOK'">
          <div>Payload URL*</div>
          <NFormItem path="age" label="">
            <NInput v-model:value="notificationConfig.PayloadURL" />
          </NFormItem>
          <div>Secret</div>
          <NInput v-model:value="notificationConfig.Secret" />
          <div style="font-size: 12px; color: #8f8e94; margin-top: 8px">
            <div>签名：使用 SHA-256 哈希函数和 HMAC 生成</div>
            <div>格式："sha256="+signature</div>
            <div>请求头：X-Signature-256</div>
          </div>
        </template>
      </div>

      <NSpace class="w-full pt-16px" :size="24" justify="end">
        <NButton class="w-72px" @click="closeModal">取消</NButton>
        <NButton class="w-72px" type="primary" @click="handleSubmit">保存</NButton>
      </NSpace>
    </NForm>
  </NModal>
</template>

<style scoped></style>
