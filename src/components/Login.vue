<script>
import { ref } from 'vue'
import { getCodeUrl, msgSend, msgLogin } from '../api/http'
import { useStore } from 'vuex'
import { showToast } from 'vant'
export default {
  setup() {
    const userName = ref('')
    const verCode = ref('')
    const codeImg = ref('')
    const smsCode = ref('')
    const isWait = ref('')
    const countDownVal = ref(60)
    const store = useStore()

    const refreshCodeUrl = () => {
      codeImg.value = getCodeUrl(userName.value)
    }

    const userNameInput = (e) => {
      if (e.target.value.length == 11) refreshCodeUrl()
    }

    const sendCodeMsg = async () => {
      const param = {
        userName: userName.value,
        verCode: verCode.value
      }
      if (userName.value.length != 11) {
        showToast('请输入正确的手机号')
        return
      }
      if (verCode.value == '') {
        showToast('请输入图形验证码')
        return
      }
      try {
        let res = await msgSend(param)
        console.log(res)
        if (res.data.code == 0) {
          console.log('发送短信成功')
          countDownStart()
        } else {
          showToast(res.data.message || '服务器异常')
        }
      } catch (err) {
        showToast('服务器异常')
      }
    }
    const userLogin = async () => {
      const param = {
        userName: userName.value,
        verCode: verCode.value,
        smsCode: smsCode.value
      }
      if (userName.value.length != 11) {
        showToast('请输入正确的手机号')
        return
      }
      if (verCode.value == '') {
        showToast('请输入图形验证码')
        return
      }
      if (smsCode.value == '') {
        showToast('请输入短信验证码')
        return
      }
      try {
        let res = await msgLogin(param)
        if (res.data.code == 0) {
          let userId = res.data.data.id
          store.commit('userIdSet', userId)
          store.commit('loginPanelSet', false)
          store.dispatch('getRecords')
        } else {
          showToast(res.data.message || '服务器异常')
        }
      } catch (err) {
        showToast('服务器异常')
      }
    }

    //倒计时
    const countDownStart = () => {
      isWait.value = true
      let timer = setInterval(() => {
        if (countDownVal.value == 0) {
          clearInterval(timer)
          countDownVal.value = 60
          isWait.value = false
          this.refreshCodeUrl()
        }
        countDownVal.value = countDownVal.value - 1
      }, 1000)
    }

    return {
      userName,
      verCode,
      codeImg,
      smsCode,
      isWait,
      countDownVal,
      userNameInput,
      refreshCodeUrl,
      sendCodeMsg,
      userLogin,
      closeLogin: () => store.commit('loginPanelSet', false)
    }
  },

  mounted() {
    this.refreshCodeUrl()
  },

  unmounted() {}
}
</script>

<template>
  <div class="panel">
    <div class="shadow"></div>
    <div class="content">
      <img class="colse btn" @click="closeLogin" src="../assets/close.png" />
      <form class="form">
        <div class="gp">
          <input
            class="input"
            v-model="userName"
            maxlength="11"
            placeholder="请输入手机号"
            @input="userNameInput"
          />
        </div>
        <div class="gp">
          <input
            class="input"
            v-model="verCode"
            placeholder="请输入验证码"
            maxlength="6"
          />
          <img class="codeImg" :src="codeImg" @click="refreshCodeUrl" />
        </div>
        <div class="gp">
          <input
            class="input"
            v-model="smsCode"
            placeholder="请输入验证码"
            maxlength="6"
          />
          <div v-if="isWait" class="count">{{ countDownVal }}s</div>
          <div v-else class="yzmBtn" @click="sendCodeMsg">获取验证码</div>
        </div>
        <div class="btn" @click="userLogin">登录</div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="less">
.panel {
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 2;
  .shadow {
    background: rgba(0, 0, 0, 0.5);
    position: relative;
    height: 100%;
    width: 100%;
  }
  .content {
    background: #fff;
    border-radius: 10px;
    padding: 30px;
    position: fixed;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    .colse {
      position: absolute;
      right: 20px;
      top: 20px;
      width: 16px;
      height: 16px;
    }
    .form {
      width: 300px;
      .gp {
        border-bottom: 1px solid #e8e8e8;
        padding: 15px 10px;
        display: flex;
        .input {
          flex: 1;
          height: 30px;
          line-height: 30px;
          color: #333 !important;
          background: #fff !important;
        }
        .codeImg {
          height: 30px;
        }
      }
      .count {
        display: inline-block;
        width: 60px;
        text-align: center;
        color: #1989fa;
        height: 30px;
        line-height: 30px;
      }
      .yzmBtn {
        color: #1989fa;
        height: 30px;
        line-height: 30px;
        cursor: pointer;
      }
      .btn {
        background: linear-gradient(90deg, lightblue, #1989fa);
        height: 46px;
        line-height: 46px;
        border-radius: 23px;
        text-align: center;
        color: #fff;
        font-size: 15px;
        margin-top: 20px;
      }
      .other {
        color: #3c3c3c;
        padding: 30px 0;
        text-align: center;
        display: flex;
        justify-content: space-between;
      }
      .tip {
        color: #999;
        margin-top: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        .icon {
          display: inline-block;
          height: 20px;
          width: 20px;
          margin-right: 6px;
        }
        .agreenment {
          color: #1989fa;
        }
      }
    }
  }
}
@media screen and(max-width:1200px) {
  .panel {
    font-size: 14px;
  }
}
</style>
