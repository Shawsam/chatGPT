<script>
import { useStore } from 'vuex'
export default {
  setup() {
    const store = useStore()
    return {
      closeContact: () => store.commit('contactPanelSet', false)
    }
  },

  mounted() {},

  unmounted() {}
}
</script>

<template>
  <div class="panel">
    <div class="shadow"></div>
    <div class="content">
      <img class="colse btn" @click="closeContact" src="../assets/close.png" />
      <form class="form">
        <img src="../assets/contact.png" />
      </form>
    </div>
  </div>
</template>

<style scoped lang="less">
.panel {
  position: fixed;
  z-index: 2;
  width: 100%;
  height: 100%;

  .shadow {
    position: relative;
    width: 100%;
    height: 100%;
    background: rgb(0 0 0 / 50%);
  }

  .content {
    position: fixed;
    top: 40%;
    left: 50%;
    padding: 30px;
    background: #fff;
    border-radius: 10px;
    transform: translate(-50%, -50%);

    .colse {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 16px;
      height: 16px;
    }

    .form {
      padding: 20px;
    }
  }
}
</style>
