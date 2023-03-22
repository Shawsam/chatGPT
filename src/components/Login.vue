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
      width: 300px;

      .gp {
        display: flex;
        padding: 15px 10px;
        border-bottom: 1px solid #e8e8e8;

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
        height: 30px;
        text-align: center;
        color: #1989fa;
        line-height: 30px;
      }

      .yzmBtn {
        height: 30px;
        color: #1989fa;
        line-height: 30px;
        cursor: pointer;
      }

      .btn {
        margin-top: 20px;
        height: 46px;
        font-size: 15px;
        text-align: center;
        color: #fff;
        background: linear-gradient(90deg, lightblue, #1989fa);
        border-radius: 23px;
        line-height: 46px;
      }

      .other {
        display: flex;
        justify-content: space-between;
        padding: 30px 0;
        text-align: center;
        color: #3c3c3c;
      }

      .tip {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 60px;
        color: #999;

        .icon {
          display: inline-block;
          margin-right: 6px;
          width: 20px;
          height: 20px;
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
