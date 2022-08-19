<template>
  <van-pull-refresh
    v-model="loading"
    @refresh="onRefresh"
    success-text="刷新成功"
  >
    <div class="home px-3 pt-3 h-full">
      <van-sticky>
        <div class="home-search">
          <van-search shape="round" placeholder="请搜索内容" />
        </div>
      </van-sticky>
      <div class="home-tab w-[100%]">
        <van-tabs v-model:active="tabsData.active" :sticky="true">
          <van-tab
            v-for="item in tabsData.list"
            :key="item.id"
            :name="item.id"
            :title="item.name"
          >
            <div class="home-list mt-5">
              <ul>
                <li
                  v-for="(item, index) in homeList"
                  :key="item.user.userId"
                  class="mb-7"
                >
                  <div class="list-header flex justify-between">
                    <div class="list-header-left flex-center">
                      <div class="header-left-avatar mr-3">
                        <van-image
                          round
                          class="w-[50px] h-[50px]"
                          :src="item.user.avatar"
                        />
                      </div>
                      <div class="header-left-info">
                        <div class="info-name">
                          {{ item.user.nickName }}
                        </div>
                        <div class="info-signature">
                          {{ item.user.signature }}
                        </div>
                      </div>
                    </div>
                    <div class="left-header-right flex justify-center">
                      <div class="list-header-more">+ 关注</div>
                      <van-icon name="ellipsis" class="header-right-icon" />
                    </div>
                  </div>
                  <div class="list-content w-full h-80 mt-5">
                    <xg-player
                      :id="`home-video-${item.user.userId}`"
                      :video-url="handleDecrypt('video', item.joke.videoUrl)"
                      :poster="handleDecrypt('image', item.joke.thumbUrl)"
                      width="100%"
                      :other-options="{
                        otherOptions: true,
                      }"
                    />
                  </div>
                </li>
              </ul>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </van-pull-refresh>
</template>

<script setup>
import { ref, watch } from "vue";
import { useUserStore } from "@/stores/modules/user";
import { showConfirmDialog, showSuccessToast } from "vant";
import { useRouter } from "vue-router";
import { homeService } from "@/api/modules/home";
import { decryptDes, encryptDes } from "@/utils/crypto";
import XgPlayer from "@/components/xgPlayer/xgPlayer.vue";

const loading = ref(false);
const homeList = ref([]);
const tabsData = ref({
  active: 2,
  list: [
    {
      id: 0,
      name: "关注",
    },
    // {
    //   id: 1,
    //   name: "推荐"
    // },
    {
      id: 2,
      name: "新鲜",
    },
    {
      id: 3,
      name: "纯文",
    },
    {
      id: 4,
      name: "趣图",
    },
  ],
});

const router = useRouter();
const userStore = useUserStore();
const token = userStore.token;

watch(
  () => tabsData.value.active,
  (val) => {
    if (val === 0 && !token) {
      return showConfirmDialog({
        title: "提示",
        message: "暂未登录，请先登录",
        confirmButtonText: "去登录",
      })
        .then(() => {
          router.push("/login");
        })
        .catch(() => {
          tabsData.value.active = 2;
        });
    }
    getHomeData();
  }
);

const onRefresh = () => {
  loading.value = true;
  getHomeData();
  showSuccessToast("刷新成功");
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const getHomeData = async () => {
  const active = tabsData.value.active;
  let data = [];
  switch (active) {
    case 1:
      data = await homeService.recommend().then((res) => res.data);
      break;
    case 2:
      data = await homeService.latest().then((res) => res.data);
      break;
    case 3:
      data = await homeService.text().then((res) => res.data);
      break;
    case 4:
      data = await homeService.pic().then((res) => res.data);
      break;
  }
  homeList.value = data;
};
const handleDecrypt = (type, data) => {
  const val = data.replace(/^ftp:\/\//, "");
  switch (type) {
    case "video":
      return decryptDes(val);
    case "image":
      return decryptDes(val);
  }
};
getHomeData();
</script>

<style scoped lang="scss">
:deep(.van-tab--active) {
  .van-tab__text {
    font-size: 19px;
    color: var(--van-primary-color);
    letter-spacing: 2px;
  }
}

:deep(.van-tabs__line) {
  display: none;
}

//.van-pull-refresh {
//  height: 100vh;
//}

.home {
  background: var(--van-background-2);
}

.home-search-icon {
  font-size: 19px;
  top: 3px;
}

.header-left-info {
  .info-name {
    font-weight: 700;
    font-size: 16px;
  }

  .info-signature {
    font-size: 12px;
    color: var(--van-text-color-2);
    width: 180px;
  }
}

.left-header-right {
  .list-header-more {
    font-size: 15px;
    color: var(--van-primary-color);
    margin-right: 12px;
  }

  .header-right-icon {
    font-size: 22px;
    font-weight: 700;
  }
}

//.home-list{
//  overflow: auto;
//  height: calc(100% - 45px);
//}
:deep(.van-sticky--fixed) {
  z-index: 99999;
}
</style>
