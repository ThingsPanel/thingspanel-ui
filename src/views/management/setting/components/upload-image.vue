<script setup lang="ts">
import { getCurrentInstance, ref, watch } from 'vue';
// eslint-disable-next-line import/order
import { createServiceConfig } from '~/env.config';
import type { UploadFileInfo } from 'naive-ui';
import { localStg } from '@/utils/storage';
import { getFileName } from '@/utils/common/tool';

const { otherBaseURL } = createServiceConfig(import.meta.env);
const url = ref(new URL(otherBaseURL.demo));
defineOptions({ name: 'UploadFile' });

const { proxy } = getCurrentInstance() as any;
export interface Props {
  modelValue: string;
  /** 选取文件的类型 */
  accept: string;
  /** 上传的文件类型 */
  fileType: string[];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  accept: 'image/png, image/jpeg, image/jpg, image/gif',
  fileType: () => ['png', 'jpeg', 'jpg', 'gif']
});

interface Emits {
  (e: 'update:modelValue', val: string): void;
  (e: 'success', file: UploadFileInfo): void;
}

const emit = defineEmits<Emits>();

const fileList = ref<UploadFileInfo[]>([]);

watch(
  () => props.modelValue,
  newVal => {
    let list: UploadFileInfo[] = [];
    if (newVal) {
      list.push({
        id: getFileName(newVal).split('.')[0],
        name: getFileName(newVal),
        url: url.value.origin + newVal.slice(1),
        status: 'finished'
      });
    } else {
      list = [];
    }
    proxy.$nextTick(() => {
      fileList.value = list;
    });
  }
);

async function beforeUpload(data: { file: UploadFileInfo }) {
  let isImg: boolean = false;
  if (props.fileType.length) {
    let fileExtension = '';
    if (data.file?.name.lastIndexOf('.') > -1) {
      fileExtension = data.file?.name.slice(data.file?.name.lastIndexOf('.') + 1);
    }
    isImg = props.fileType.some(type => {
      if (data.file.file?.type && data.file.file?.type.indexOf(type) > -1) return true;
      if (fileExtension && fileExtension.includes(type)) return true;
      return false;
    });
  } else if (data.file.file?.type && data.file.file?.type.indexOf('image') > -1) {
    isImg = true;
  }
  if (!isImg) {
    window.$message?.error(`文件格式不正确, 请上传${props.fileType.join('/')}图片格式文件!`);
    return false;
  }
  return true;
}

function handleFinish({ file, event }: { file: UploadFileInfo; event?: ProgressEvent }) {
  const response = JSON.parse((event?.target as XMLHttpRequest).response);
  window.$message?.success(response.message);
  emit('update:modelValue', response.data.path);
  emit('success', file);
}

function handleError({ event }: { event?: ProgressEvent }) {
  window.$message?.error((event?.target as XMLHttpRequest).response || '文件上传失败，请重试');
}

function handleRemove() {
  emit('update:modelValue', '');
  return true;
}
</script>

<template>
  <NUpload
    v-model:file-list="fileList"
    :action="url + '/file/up'"
    :headers="{
      'x-token': localStg.get('token') || ''
    }"
    :data="{
      type: 'image'
    }"
    list-type="image-card"
    :accept="accept"
    :max="1"
    @before-upload="beforeUpload"
    @finish="handleFinish"
    @remove="handleRemove"
    @error="handleError"
  ></NUpload>
</template>
