<template>
  <div class="mapContainer">
    <div class="searchInfo">
      <input
        id="tipinput"
        v-model="newKeyAddress"
        placeholder="请输入关键字..."
        class="input-with-select"
      />
    </div>
    <div id="container" style="height: 300px"></div>
  </div>
</template>
<script>
import { watch, reactive, toRefs, onMounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
export default {
  // isMarkerShow 是否使用标记点
  props: ["keywords", "keyAddress", "isMarkerShow", "dimension"],
  emits: ["locationValue"],
  setup(props, context) {
    const state = reactive({
      newKeyAddress: props.keyAddress,
      conheight: {
        height: "1000px",
        width: "",
      },
      map: null,
      marker: null,
      // 默认维度
      dimension: props.dimension,
      // 新维度
      newdimension: [],
      lnglatArr: [], //多边形需要的数据
    });
    const methods = {
      sweepAway() {
        console.log(1111111, state.lnglatArr);
        state.lnglatArr = [];
        state.newKeyAddress = "";
        methods.mapInit();
      },
      mapInit(type) {
        state.newKeyAddress = "";
        AMapLoader.load({
          key: "5c842e97cdff04d92eb472cf4a4860b2",
          version: "2.0",
          plugins: [
            "AMap.ToolBar",
            "AMap.PlaceSearch",
            "AMap.Geolocation",
            "AMap.Geocoder",
          ],
        })
          .then((AMap) => {
            console.log("AMap", AMap);
            state.map = new AMap.Map("container", {
              center: type,
              resizeEnable: true,
              zoom: 12,
              lang: "cn",
            });

            let polygon = ""; //定义多边形

            function showInfoClick(e) {
              state.lnglatArr.push(e.lnglat); //每次点击把坐标存下
              console.log(state.lnglatArr);
              context.emit("update:value", state.lnglatArr);
              let marker = new AMap.Marker({
                position: new AMap.LngLat(e.lnglat.lng, e.lnglat.lat), // 经纬度对象
              });
              // 将创建的点标记添加到已有的地图实例：
              state.map.add(marker);
              //每次新建多边形前先把之前的删掉，避免覆盖。
              if (state.lnglatArr.length > 1) {
                state.map.remove(polygon);
              }
              polygon = new AMap.Polygon({
                path: state.lnglatArr, //多边形坐标
                strokeColor: "#A0CFF6", //线颜色
                strokeWeight: 1,
                strokeOpacity: 1, //线透明度
                fillOpacity: 0.4, //填充透明度
                fillColor: "#1791fc", //填充颜色
                zIndex: 50,
              });
              state.map.add(polygon); //生成多边形
            }
            state.map.on("click", showInfoClick); //点击划图
            // state.map.setFitView(); //根据地图上添加的覆盖物分布情况，自动缩放地图到合适的视野级别

            // 第一次不打标记 &&  isMarkerShow：组件是否使用标记点
            if (type[0] !== state.dimension[0] && props.isMarkerShow) {
              state.marker = new AMap.Marker({
                position: [type[0], type[1]],
                map: state.map,
              });
            }
            AMap.plugin(["AMap.AutoComplete", "AMap.PlaceSearch"], function () {
              const autoOptions = {
                input: "tipinput",
              };
              const autocomplete = new AMap.Autocomplete(autoOptions);
              const placeSearch = new AMap.PlaceSearch({
                city: "上海",
                map: state.map,
              });
              AMap.Event.addListener(autocomplete, "select", function (e) {
                context.emit("locationValue", e.poi);
                placeSearch.search(e.poi.name);
              });
            });
          })
          .catch((e) => {
            console.log(e);
          });
      },
    };
    watch(
      () => props.keywords,
      () => {
        let newArr = props.keywords.split(",");
        if (newArr.length > 1) {
          state.newdimension = newArr.map((item) => {
            return item - 0;
          });
          methods.mapInit(state.newdimension);
        } else {
          methods.mapInit(state.dimension);
        }
      },
      { immediate: true }
    );
    onMounted(() => {});
    return { ...methods, ...toRefs(state) };
  },
};
</script>
<style scoped lang="scss">
.mapContainer {
  width: 100%;
  position: relative;
  .searchInfo {
    display: flex;
    width: 90%;
    position: absolute;
    top: 20px;
    left: 5%;
    z-index: 99;
    input {
      width: 100%;
      padding-left: 10px;
    }
  }
}
:deep(.amap-marker) {
  width: 10px !important;
  height: 10px !important;
  background-color: rgba(11, 65, 243, 0.496) !important;
  overflow: hidden !important;
  border-radius: 50%;
  transform: translate(-4.5px, -5px) scale(1) rotate(0deg) !important;
  img {
    display: none !important;
  }
}
</style>
