<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { showConfirmDialog, showToast } from 'vant'
export default {
  setup() {
    const store = useStore()
    // return {
    //   // 在 computed 函数中访问 state
    //   // count: computed(() => store.state.count),

    //   // 在 computed 函数中访问 getter
    //   // double: computed(() => store.getters.double),

    //   // 使用 mutation
    //   // increment: () => store.commit('increment'),

    //   // 使用 action
    //   // asyncIncrement: () => store.dispatch('asyncIncrement')
    // }
    return {
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
        store.commit('consIdSet', id)
        store.dispatch('getMsgList', id)
      },
      consDelete(id) {
        store.dispatch('consDel', id)
      }
    }
  },

  created() {
    this.$store.dispatch('getRecords')
  }
}
</script>

<template>
  <section class="sidebar">
    <div class="btn_add" @click="newDialog">+ 新对话</div>
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
        <img src="../assets/out.png" /><span>登录</span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="less">
.sidebar {
  display: flex;
  padding: 30px 20px;
  color: #fff;
  background: rgb(255 255 255 / 20%);
  flex-direction: column;

  .btn_add {
    margin-bottom: 20px;
    height: 40px;
    text-align: center;
    color: #333;
    background: #fff;
    border-radius: 5px;
    line-height: 40px;
    cursor: pointer;
    user-select: none;
  }

  .dialogList {
    overflow-y: scroll;
    width: 260px;
    flex: 1;

    &::-webkit-scrollbar {
      width: 0;
      background: rgb(0 0 0 / 20%);
    }

    .item {
      position: relative;
      padding: 5px 10px;
      margin-top: 10px;
      font-size: 14px;
      color: lightcyan;
      background: rgb(255 255 255 / 10%);
      border-radius: 10px;
      cursor: pointer;

      .name {
        padding-right: 10px;
      }

      .more {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 15px;
      }

      &.active {
        background: rgb(255 255 255 / 40%);
        border-radius: 5px;
      }

      p {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .menuList {
    padding: 20px 15px 15px;
    height: 100px;
    border-top: 1px solid #fff;

    .item {
      height: 40px;
      line-height: 40px;
      font-size: 15px;
      cursor: pointer;
      user-select: none;

      img {
        margin-right: 10px;
        height: 20px;
        transform: translateY(5px);
      }
    }
  }
}

@media screen and(max-width:1200px) {
  .sidebar {
    display: none;
  }
}
</style>
