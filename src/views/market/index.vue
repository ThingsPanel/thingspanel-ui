<template>
  <div>
    <n-card title="" :bordered="false" class="h-full rounded-8px shadow-sm">
      <n-tabs type="line" animated>
        <n-tab-pane name="installed" tab="已安装">
          <install-plugins show-type="installed"></install-plugins>
        </n-tab-pane>
        <n-tab-pane name="plugins" tab="插件市场">
          <install-plugins show-type="market"></install-plugins>
        </n-tab-pane>
        <n-tab-pane name="deviceTemplate" tab="设备模版生成器">
          <div
            class="w-[200px] cursor-pointer h-[200px] border round m-auto text-center flex flex-items-center flex-col justify-center mt-[100px]"
          >
            <p class="font-size-[16px]">自定义插件</p>
            <p>解决个性化设备需求</p>
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>
<script setup lang="ts">
import installPlugins from '../../components/market/install-plugins.vue'
// import pluginsMarket from '../../components/market/plugins-market.vue'
</script>
