<template>
  <div class="overflow-hidden">
    <n-card title="" :bordered="false" class="h-full rounded-8px shadow-sm">
      <n-tabs type="line" animated>
        <n-tab-pane name="installed" tab="已安装">
          <install-plugins></install-plugins>
        </n-tab-pane>
        <n-tab-pane name="plugins" tab="插件市场">
          <plugins-market></plugins-market>
        </n-tab-pane>
        <n-tab-pane name="deviceTemplate" tab="设备模版生成器">设备模版生成器</n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>
<script setup lang="ts">
import installPlugins from '../../components/market/install-plugins.vue'
import pluginsMarket from '../../components/market/plugins-market.vue'
</script>
