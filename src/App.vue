<script setup>
import { RouterView } from "vue-router";
import { ref } from "vue";
//根据系统更换主题
const themeMedia = window.matchMedia("(prefers-color-scheme: light)");
const theme = ref(themeMedia.matches ? "light" : "dark");
</script>

<template>
  <van-config-provider :theme="theme">
    <RouterView />
  </van-config-provider>
</template>

<style scoped></style>
