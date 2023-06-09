<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
import { showToast, showConfirmDialog } from 'vant'
export default {
  setup() {
    const store = useStore()
    const show = ref(false)
    const showPopup = () => {
      show.value = true
    }

    return {
      isFilling: computed(() => store.getters.isFilling),
      show,
      showPopup,
      newDialog: () => {
        if (store.getters.isFilling) {
          showToast('正在回复中，请稍后操作~')
          return
        }
        let userId = store.getters.userId
        if (userId) {
          store.commit('newDialog')
          store.dispatch('getRecords')
        } else {
          store.commit('loginPanelSet', true)
        }
      },
      openLogin: () => store.commit('loginPanelSet', true),
      openContact: () => store.commit('contactPanelSet', true),
      logOut: () => {
        showConfirmDialog({
          title: '退出登录',
          message: '您确定要退出登录吗？'
        }).then(() => {
          store.commit('userIdSet', '')
          location.reload()
        })
      },
      openDialog: (id) => {
        if (store.getters.isFilling) {
          showToast('正在回复中，请稍后操作~')
          return
        }
        show.value = false
        store.commit('consIdSet', id)
        store.dispatch('getMsgList', id)
      },
      consDelete(id) {
        store.dispatch('consDel', id)
      }
    }
  },

  mounted() {},

  created() {
    this.$store.dispatch('getRecords')
  },

  unmounted() {}
}
</script>

<template>
  <div class="header">
    <img @click="showPopup" class="btn menu" src="../assets/menu.png" />
    <p class="tit">{{ isFilling ? '正在回复...' : '仟传AI助手' }}</p>
    <img @click="newDialog" class="btn add" src="../assets/add.png" />
    <van-popup
      position="left"
      closeable
      v-model:show="show"
      :style="{ width: '100%', height: '100%' }"
    >
      <div class="content">
        <div class="title">对话记录</div>
        <div class="dialogList" v-if="$store.getters.records.length">
          <div
            class="item"
            :class="{ active: item.id == $store.getters.consId }"
            v-for="item in $store.getters.records"
            :key="item.id"
            @click="openDialog(item.id)"
          >
            <p class="name">{{ item.name }}</p>
            <p class="answer">{{ item.msgDesc }}</p>
            <img
              title="删除"
              @click.stop="consDelete(item.id)"
              class="btn more"
              src="../assets/del.png"
            />
          </div>
        </div>
        <div class="dialogList" v-else>
          <div class="empty">
            <img class="icon" src="../assets/empty.png" />
            <p>暂无记录~</p>
          </div>
        </div>
        <div class="menuList">
          <div class="item" @click="openContact">
            <img src="../assets/link.png" /><span>联系我们</span>
          </div>
          <div v-if="$store.getters.userId" class="item" @click="logOut">
            <img src="../assets/out.png" /><span>退出登录</span>
          </div>
          <div v-else class="item" @click="openLogin">
            <img src="../assets/out.png" /><span>立即登录</span>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style scoped lang="less">
.header {
  position: fixed;
  z-index: 1;
  display: none;
  width: 100%;
  height: 60px;
  text-align: center;
  color: #fff;
  background: #000;
  line-height: 60px;

  .tit {
    padding: 0 !important;
    margin: 0 !important;
    font-weight: bold;
  }

  .menu {
    position: absolute;
    top: 15px;
    left: 15px;
    width: 30px;
  }

  .add {
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 10;
    width: 26px;
  }

  .content {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
  }

  .title {
    color: #fff;
    background: #000;
  }

  .dialogList {
    overflow-y: scroll;
    padding: 0 15px;
    background: #f1f1f1;
    flex: 1;

    &::-webkit-scrollbar {
      width: 0;
      background: rgb(0 0 0 / 20%);
    }

    .item {
      position: relative;
      padding: 10px 15px;
      margin-top: 15px;
      font-size: 14px;
      text-align: left;
      color: #333;
      background: rgb(255 255 255 / 40%);
      border: 1px solid transparent;
      border-radius: 10px;
      cursor: pointer;

      .name {
        padding-right: 10px;
      }

      &.active {
        background: rgb(255 255 255 / 100%);
        border: 1px solid #e8e8e8;
      }

      &:last-child {
        margin-bottom: 15px;
        border: none;
      }

      p {
        overflow: hidden;
        padding: 0;
        margin: 0;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 30px;

        &.answer {
          color: #999;
        }
      }

      .more {
        position: absolute;
        top: 10px;
        right: 12px;
        width: 15px;
      }
    }
  }

  .menuList {
    position: relative;
    z-index: 100;
    padding: 0 15px;
    height: 100px;
    color: #1989fa;
    box-shadow: 0 1px 2px #e8e8e8 inset;

    .item {
      height: 50px;
      line-height: 50px;
      font-size: 15px;
      cursor: pointer;
      user-select: none;

      &:nth-child(1) {
        border-bottom: 1px solid #e8e8e8;
      }

      img {
        display: inline-block;
        margin-right: 5px;
        height: 25px;
        transform: translateY(5px);
      }

      span {
        display: inline-block;
        width: 70px;
        text-align: center;
      }
    }
  }
}

@media screen and(max-width:1200px) {
  .header {
    display: block;
  }
}
</style>
