<template>
  <div
    class="w-full h-full rounded-lg"
    :id="id"
  ></div>
</template>

<script setup>
import { onMounted, watch, watchEffect } from "vue";
import Player from "xgplayer";

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    default: () =>
      "http://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg"
  },
  playsinline: {
    type: Boolean,
    default: true
  },
  width: {
    type: String,
    default: "100%"
  },
  height: {
    type: String,
    default: "100%"
  },
  otherOptions: {
    type: Object,
    default: () => ({
      autoplay: true,
      rotateFullscreen: true,
      controls: true
    })
  }
});

watch(
  () => props.videoUrl,
  (newUrl) => {
    console.log(newUrl);
    initPlayer();
  }
);

onMounted(() => {
  initPlayer();
});

// 初始化西瓜视频
const initPlayer = () => {
  let player = new Player({
    id: props.id,
    url: props.videoUrl,
    poster: props.poster,
    playsinline: props.playsinline,
    width: props.width,
    height: props.height,
    controls: props.otherOptions.controls,
    thumbnail: {
      pic_num: 44,
      width: 160,
      height: 90,
      col: 10,
      row: 10,
      urls: [
        "//lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/xgplayer-demo-thumbnail.jpg"
      ]
    },
    whitelist: [""]
  });
  //  超清、高清、标清 分别对应的地址
  // player.emit('resourceReady', [{ name: '超清', url: '//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4' }, { name: '高清', url: '//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-480p.mp4' }, { name: '标清', url: '//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4' }]);
};
</script>

<style scoped lang="scss"></style>
