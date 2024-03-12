/* eslint-disable */
/* prettier-ignore */
// Generated by elegant-router
// Read more: https://github.com/soybeanjs/elegant-router

import type { RouteComponent } from "vue-router";
import type { LastLevelRouteKey, RouteLayout } from "@elegant-router/types";

import BaseLayout from "@/layouts/base-layout/index.vue";
import BlankLayout from "@/layouts/blank-layout/index.vue";

export const layouts: Record<RouteLayout, RouteComponent | (() => Promise<RouteComponent>)> = {
  base: BaseLayout,
  blank: BlankLayout,
};

export const views: Record<LastLevelRouteKey, RouteComponent | (() => Promise<RouteComponent>)> = {
  403: () => import("@/views/_builtin/403/index.vue"),
  404: () => import("@/views/_builtin/404/index.vue"),
  500: () => import("@/views/_builtin/500/index.vue"),
  login: () => import("@/views/_builtin/login/index.vue"),
  about: () => import("@/views/about/index.vue"),
  apply_service: () => import("@/views/apply/service/index.vue"),
  component_button: () => import("@/views/component/button/index.vue"),
  component_card: () => import("@/views/component/card/index.vue"),
  component_table: () => import("@/views/component/table/index.vue"),
  dashboard_analysis: () => import("@/views/dashboard/analysis/index.vue"),
  "dashboard_mobile-panel": () => import("@/views/dashboard/mobile-panel/index.vue"),
  dashboard_panel: () => import("@/views/dashboard/panel/index.vue"),
  dashboard_workbench: () => import("@/views/dashboard/workbench/index.vue"),
  "data-service_rule-engine": () => import("@/views/data-service/rule-engine/index.vue"),
  "device_config-detail": () => import("@/views/device/config-detail/index.vue"),
  "device_config-edit": () => import("@/views/device/config-edit/index.vue"),
  device_config: () => import("@/views/device/config/index.vue"),
  device_details: () => import("@/views/device/details/index.vue"),
  "device_grouping-details": () => import("@/views/device/grouping-details/index.vue"),
  device_grouping: () => import("@/views/device/grouping/index.vue"),
  device_manage: () => import("@/views/device/manage/index.vue"),
  "function_hide-child_one": () => import("@/views/function/hide-child/one/index.vue"),
  "function_hide-child_three": () => import("@/views/function/hide-child/three/index.vue"),
  "function_hide-child_two": () => import("@/views/function/hide-child/two/index.vue"),
  "function_multi-tab": () => import("@/views/function/multi-tab/index.vue"),
  function_tab: () => import("@/views/function/tab/index.vue"),
  home: () => import("@/views/home/index.vue"),
  manage_menu: () => import("@/views/manage/menu/index.vue"),
  manage_role: () => import("@/views/manage/role/index.vue"),
  "manage_user-detail": () => import("@/views/manage/user-detail/[id].vue"),
  manage_user: () => import("@/views/manage/user/index.vue"),
  management_auth: () => import("@/views/management/auth/index.vue"),
  management_role: () => import("@/views/management/role/index.vue"),
  management_route: () => import("@/views/management/route/index.vue"),
  management_setting: () => import("@/views/management/setting/index.vue"),
  management_user: () => import("@/views/management/user/index.vue"),
  "multi-menu_first_child": () => import("@/views/multi-menu/first_child/index.vue"),
  "multi-menu_second_child_home": () => import("@/views/multi-menu/second_child_home/index.vue"),
  plugin_charts_antv: () => import("@/views/plugin/charts/antv/index.vue"),
  plugin_charts_echarts: () => import("@/views/plugin/charts/echarts/index.vue"),
  plugin_copy: () => import("@/views/plugin/copy/index.vue"),
  plugin_editor_markdown: () => import("@/views/plugin/editor/markdown/index.vue"),
  plugin_editor_quill: () => import("@/views/plugin/editor/quill/index.vue"),
  plugin_icon: () => import("@/views/plugin/icon/index.vue"),
  plugin_map: () => import("@/views/plugin/map/index.vue"),
  plugin_print: () => import("@/views/plugin/print/index.vue"),
  plugin_swiper: () => import("@/views/plugin/swiper/index.vue"),
  plugin_video: () => import("@/views/plugin/video/index.vue"),
  product_list: () => import("@/views/product/list/index.vue"),
  "product_update-ota": () => import("@/views/product/update-ota/index.vue"),
  "product_update-package": () => import("@/views/product/update-package/index.vue"),
  "rule-engine": () => import("@/views/rule-engine/index.vue"),
  "system-management-user_system-log": () => import("@/views/system-management-user/system-log/index.vue"),
  test: () => import("@/views/test/index.vue"),
  "user-center": () => import("@/views/user-center/index.vue"),
  "visualization_panel-details": () => import("@/views/visualization/panel-details/index.vue"),
  "visualization_panel-preview": () => import("@/views/visualization/panel-preview/index.vue"),
  visualization_panel: () => import("@/views/visualization/panel/index.vue"),
};
