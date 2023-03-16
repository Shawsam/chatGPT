<script>
import { useStore } from 'vuex';
export default {
  setup() {
    const store = useStore()
    return {
        closeContact:() => store.commit('contactPanelSet',false)
    }
  },

  mounted(){
  },

  destroyed() {},
};
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

<style scoped lang='less'>
.panel{
    position:fixed;
    height:100%;
    width:100%;
    z-index:2;
    .shadow{
        background:rgba(0,0,0,0.5);
        position: relative;
        height:100%;
        width:100%;
    }
    .content{
        background:#fff;
        border-radius:10px;
        padding:30px;
        position:fixed;
        left:50%;
        top:40%;
        transform: translate(-50%,-50%);
        .colse{
          position:absolute;
          right:20px;
          top:20px;
          width:16px;
          height:16px;
        }
        .form{
            padding:20px;
        }
    }
}
</style>