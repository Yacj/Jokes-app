<template>
  <div class="home h-full">
    <div class="home-tab w-[100%]">
      <van-tabs
          v-model:active="tabsData.active"
          :sticky="true"
          shrink
          swipeable
          animated
      >
        <template #nav-right>
          <div
              class="home-search flex-center text-700 text-xl font-bold w-full"
          >
            <van-icon name="search"/>
          </div>
        </template>
        <van-tab
            v-for="item in tabsData.list"
            :key="item.id"
            :name="item.id"
            :title="item.name"
        >
          <van-pull-refresh
              v-model="loading"
              @refresh="onRefresh"
              success-text="刷新成功"
          >
            <van-list
                v-model:loading="listOptions.loading"
                :finished="listOptions.finished"
                :finished-text="listOptions.finishedText"
                @load="handleListLoad"
                :offset="50"
                :immediate-check="false"
            >
              <div
                  v-for="item in homeList"
                  :key="item.joke.jokesId"
                  class="mb-3"
              >
                <div class="px-3">
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
                      <van-icon name="ellipsis" class="header-right-icon"/>
                    </div>
                  </div>
                  <div
                      class="list-content w-full mt-3"
                      :class="{
                      'h-80': item.joke.type >= 3,
                    }"
                  >
                    <xg-player
                        :id="`home-video-${Math.ceil(Math.random() * 121)}`"
                        :video-url="handleDecrypt(item.joke.videoUrl)"
                        :poster="handleDecrypt(item.joke.thumbUrl)"
                        :other-options="{
                        controls: true,
                      }"
                        v-if="item.joke.type >= 3"
                    />
                    <div v-if="item.joke.type === 1">
                      {{ item.joke.content }}
                    </div>
                    <div v-if="item.joke.type === 2">
                      {{ item.joke.content }}
                      <div
                          :class="getImgHeight(item.joke.imageSize)"
                          class="mt-3"
                      >
                        <van-image :src="handleDecrypt(item.joke.imageUrl)"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="border-b-10 border-gray-100 mt-3"></div>
              </div>
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script setup>
import {computed, ref, watch} from "vue";
import {useUserStore} from "@/stores/modules/user";
import {
  closeToast,
  showConfirmDialog,
  showLoadingToast,
  showSuccessToast,
} from "vant";
import {useRouter} from "vue-router";
import {homeService} from "@/api/modules/home";
import {decryptDes} from "@/utils/crypto";
import XgPlayer from "@/components/xgPlayer/xgPlayer.vue";
import {getImgSize} from "@/utils";

const loading = ref(false);
const homeList = ref([]);
const tabsData = ref({
  active: 1,
  list: [
    {
      id: 0,
      name: "关注",
    },
    {
      id: 1,
      name: "推荐",
    },
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
const listOptions = ref({
  loading: false,
  finished: false,
  finishedText: "没有更多了",
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
      homeList.value = [];
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

const handleDecrypt = (data) => {
  const val = data.replace(/^ftp:\/\//, "");
  return decryptDes(val);
};

const getImgHeight = (size) => {
  const height = size.split("x")[1];
  if (+height > 288) {
    return `max-w-1/2 h-[200px] overflow-hidden`;
  } else {
    return `max-w-1/2 overflow-auto`;
  }
};
const handleListLoad = () => {
  listOptions.value.loading = false;
  getHomeData();
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
  if (data.length === 0) {
    listOptions.value.finished = true;
  } else {
    homeList.value.push(...data);
    listOptions.value.finished = false;
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

:deep(.van-sticky--fixed) {
  z-index: 99999;
}

:deep(.van-tab--shrink) {
  padding: 0 15px;
}

:deep(.van-image__img, .van-image__error, .van-image__loading) {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}

.van-list{
  height: calc(100vh - 5px);
  overflow: scroll;
}
</style>
