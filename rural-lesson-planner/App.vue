<template>
  <view class="app">
    <router-view />
  </view>
</template>

<script>
export default {
  onLaunch() {
    console.log('App Launch')
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
    console.log('App Hide')
  }
}
</script>

<style>
/* 引入uView的全局样式 */
@import "uview-ui/index.scss";

/* 全局样式 */
.app {
  min-height: 100vh;
  background-color: $bg-color;
}
</style>