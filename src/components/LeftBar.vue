<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { showConfirmDialog, showToast } from 'vant'
export default {
  setup () {
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
    return{
      newDialog:() => {
        if(store.getters.isFilling){
          showToast('正在回复中，请稍后操作~')
          return
        }
        let userId = store.getters.userId
        if(userId){
          store.commit('newDialog')
          store.dispatch('getRecords')
        }else{
          store.commit('loginPanelSet',true)
        }
      },
      openLogin:() => store.commit('loginPanelSet',true),
      openContact:() => store.commit('contactPanelSet',true),
      logOut:()=>{
        showConfirmDialog({
          title: '退出登录',
          message:
            '您确定要退出登录吗？',
        })
        .then(() => {
          store.commit('userIdSet','')
          location.reload()       
        })
      }, 
      openDialog:(id)=>{
        if(store.getters.isFilling){
          showToast('正在回复中，请稍后操作~')
          return
        }
        store.commit('consIdSet',id)
        store.dispatch('getMsgList',id)
      },
      consDelete(id){
        store.dispatch('consDel',id)
      }
    }
  },

  created(){
    this.$store.dispatch('getRecords')
  }
}
</script>

<template>
  <section class="sidebar">
      <div class="btn_add" @click="newDialog">+ 新对话</div>
      <div class="dialogList" v-if="$store.getters.records.length">
        <div class="item" :class="{'active': item.id == $store.getters.consId}" v-for="item in $store.getters.records" :key="item.id" @click="openDialog(item.id)">
            <p class="name">{{ item.name }}</p>
            <p class="answer">{{ item.msgDesc }}</p>
            <img title="删除" @click.stop="consDelete(item.id)" class="btn more" src="../assets/del.png" />
        </div>
      </div>
      <div class="dialogList" v-else>
          <div class="empty">
            <img class="icon" src="../assets/empty.png" />
            <p>暂无记录~</p>
          </div>
      </div>
      <div class="menuList">
        <div class="item" @click="openContact"><img src="../assets/link.png" /><span>联系我们</span></div>
        <div v-if="$store.getters.userId" class="item" @click="logOut"><img src="../assets/out.png" /><span>退出登录</span></div>
        <div v-else class="item" @click="openLogin"><img src="../assets/out.png" /><span>登录</span></div>
      </div>
      
  </section>
</template>
  
<style scoped lang="less">
  .sidebar{
      background:rgba(255,255,255,0.2);
      color:#fff;
      display:flex;
      flex-direction:column;
      padding:30px 20px;
      .btn_add{
        height:40px;
        line-height:40px;
        background:#fff;
        color:#333;
        border-radius:5px;
        text-align:center;
        margin-bottom:20px;
        cursor: pointer;
        user-select:none;
      }
      .dialogList{
        width:260px;
        &::-webkit-scrollbar { 
          background:rgba(0,0,0,0.2);
          width:0px;
        }
        flex:1;
        overflow-y:scroll;
        .item{
          padding:5px 10px;
          font-size:14px;
          color:lightcyan;
          cursor: pointer;
          position: relative;
          margin-top:10px;
          background:rgba(255,255,255,0.1);
          border-radius:10px;
          .name{
            padding-right:10px;
          }
          .more{
            position:absolute;
            right:10px;
            top:10px;
            width:15px;
          }
          &.active{
            background:rgba(255,255,255,0.4);
            border-radius:5px;
          }
          p{
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
          }
        }
      }
      .menuList{
        border-top:1px solid #fff;
        height:100px;
        padding:20px 15px 15px 15px;
        .item{
          height:40px;
          line-height:40px;
          font-size:15px;
          cursor: pointer;
          user-select:none;
          img{
            height:20px;
            margin-right:10px;
            transform:translateY(5px);
          }
        }
      }
  }
  @media screen and(max-width:1200px) {
    .sidebar{
      display:none;
    }
  }
</style>
  