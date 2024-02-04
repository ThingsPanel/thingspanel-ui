<template>
  <div class="w-1/4 p-card">
    <div class="p-card-container">
      <img src="/image/wsd.png" />
      <div class="p-4">
        <p class="p-title">插件的名称</p>
        <p class="py-2">分类：传感器</p>
        <p class="py-2">版本号：传感器</p>
        <p class="py-2">作者：传感器</p>
        <p class="py-2">评分：传感器</p>
        <p class="text-center py-4">
          <n-button class="mr-2" type="info" @click="loadList">编辑</n-button>
          <n-button class="mr-2" type="info" @click="loadList">导出</n-button>
          <n-button class="" type="info" @click="loadList">卸载</n-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
function loadList() {
  console.log(1)
}
</script>

<style lang="scss">
.p-card {
  display: inline-block;
  margin-bottom: 24px;
  padding: 0 16px;
  .p-card-container {
    border: 1px solid #70a0ed;
    border-radius: 8px;
  }
  .p-title {
    margin: 8px 0px;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
