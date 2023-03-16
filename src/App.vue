<script setup>
  import LeftBar from './components/LeftBar.vue'
  import MainContent from './components/MainContent.vue'
  import Login from './components/Login.vue'
  import Contact from './components/Contact.vue'
  import TopBar from './components/TopBar.vue'
  import { getWxShareInfo } from './api/http'

  function  weplay() {
    let ua = navigator.userAgent.toLowerCase();
    let isWeixin = ua.indexOf('micromessenger') != -1;
    tar.init({
      //选填，debug 模式：值为true 开启、 false 为关闭，默认开启。
      tar_debug: false, 
      // 必填，监测系统分配给此次监测活动的token
      tar_token: "86087a14d61eb9647393f48f9e74e142",
      // 必填，监测系统分配给此次监测活动的id
      tar_tid: "162493",
    });
    // 如果需要获取openid 或判断监测授权是否完成，调⽤以下⽅法：
    tar.ready(function(tar_oid){
        //授权并上报访问数据完成
        //tar_oid 是监测授权拿到的openid
    })
    if(isWeixin){
      getWxShareInfo().then(res=>{
        let config = res.data
        let { appid, signature, noncestr, timestamp } = res.data
        console.log('====返回配置===')
        console.log(config)
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: appid, // 必填，公众号的唯一标识
          timestamp, // 必填，生成签名的时间戳
          nonceStr: noncestr, // 必填，生成签名的随机串
          signature,// 必填，签名
          jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline'] // 必填，需要使用的JS接口列表
        });

        wx.ready(function () {
          var shareData64 = {
              title: "TargetSocial-AI助手", //必填,分享标题
              desc: "仟传AI助手，启迪灵感，释放效率", //选填,分享描述
              imgUrl: "https://ai-domain-mapping.tarsocial.com/ai-assistant/favicon.ico", //选填,分享图链接
              link: window.location.href, //必填,⽀持直接填写location.href
              success: function () {
              // ⽤户确认分享后执⾏的回调函数
              },
              cancel: function () {
              // ⽤户取消分享后执⾏的回调函数
              }
              };
              wx.onMenuShareAppMessage(tar.shapeShareAppMessage(shareData64));
              wx.onMenuShareTimeline(tar.shapeShareTimeline(shareData64));
          });
      })
    }
  }
  weplay()
</script>

<template>
  <div class="container">
    <TopBar />
    <LeftBar />
    <MainContent />
    <Login v-show="$store.getters.loginPanelShow" />
    <Contact v-show="$store.getters.contactPanelShow" />
  </div>
</template>

<style lang="less">
  .container{
    height:100%;
    width: 100%;
    display: flex;
  }

  .empty{
    color:#333;
    text-align:center;
    margin-top:50%;
    transform:translateY(-50%);
    font-size:0;
    line-height:0;
    .icon{
      width:50px;
      margin-bottom:20px;
    }
    p{
      line-height:25px;
      font-size:12px;
      margin:0;
      padding:0;
    }
  }
</style>
