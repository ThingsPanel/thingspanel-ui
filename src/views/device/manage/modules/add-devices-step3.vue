<script setup lang="ts">
const props = defineProps<{
  isSuccess: boolean;
  closeCallback: () => void;
  backCallback: () => void;
}>();
console.log(props);
</script>

<template>
  <n-result v-if="isSuccess" status="success" title="成功" description="设备配成功">
    <template #footer>
      <n-button @click="closeCallback">关闭</n-button>
    </template>
  </n-result>
  <n-result v-if="!isSuccess" status="error" title="失败" description="设备配遇到问题，请返回重试">
    <template #footer>
      <n-button @click="backCallback">返回</n-button>
      <n-button @click="closeCallback">关闭</n-button>
    </template>
  </n-result>
</template>

<style scoped></style>
