<script>
import { showDialog, showToast } from 'vant'
import { ref, onMounted, computed } from 'vue'
import { getTag } from '../api/http'
import { v4 as uuidv4 } from 'uuid'
import Instruct from './Instruct.vue'
import { useStore } from 'vuex'

export default {
  components: { Instruct },
  setup() {
    const inputRef = ref() //用于focus控制
    const store = useStore()
    const askVal = computed({
      //input双向绑定
      get() {
        return store.getters.askVal
      },
      set(val) {
        store.commit('askValSet', val)
      }
    })

    let msgId = '' // 每次请求的标识
    let timeOut = null
    let reTryTimes = 0
    let ws = null
    let refreshAnswerIndex = -1

    onMounted(() => {
      initWords() //违禁词加载
      initSocket() //建立socket连接
    })

    // 提问
    const onSubmit = async () => {
      let userId = store.getters.userId
      if (!userId) {
        store.commit('loginPanelSet', true)
        return
      }
      let _askVal = askVal.value
      if (_askVal == '') return //输入校验
      page_scroll()
      store.commit('Dialoging') //正在对话
      if (_askVal !== '') {
        // 先在前端判定违禁词
        let re = ''
        for (let i = 0; i < CWords.length; i++) {
          if (i == CWords.length - 1) re += CWords[i]
          else re += CWords[i] + '|'
        }
        let pattern = new RegExp(re, 'g')
        if (pattern.test(_askVal)) {
          showDialog({
            title: '警告提示',
            message: '您的内容包含违禁词，请重试!!'
          })
          return
        }

        // 获取msgId
        msgId = gmsgId()
        console.log('==========')
        console.log(msgId)
        // 将正在输入字样打开 并将按钮禁用
        store.commit('fillStateSet', true)
        await getTag({ text: encode(_askVal), id: msgId })
          .then((res) => {
            if (res.data.isforbidden === 1) {
              showDialog({
                title: '警告提示',
                message: '您的内容包含违禁词，请重试!'
              }).then(() => {
                store.commit('fillStateSet', false)
                return
              })
            } else {
              console.log(res)
              if (res.status === 200 && res.data.status === 200) {
                store.commit('msgListAdd', {
                  msg: _askVal,
                  msgId,
                  role: '我',
                  isAsk: true,
                  sentiment: res.data.sentiment,
                  showSentiment: res.data.sentiment !== 0,
                  tip:
                    res.data.sentiment === 1
                      ? ' 你的话充满正能量'
                      : '你的内容比较消极',
                  icon: res.data.sentiment === 1 ? 'like' : 'comment',
                  tipColor: res.data.sentiment === 1 ? '#1989fa' : 'red'
                })
                store.commit('msgListAdd', {
                  msg: '',
                  role: 'gpt',
                  msgId,
                  isAsk: false
                })
              }
              // 请求ws
              sendMsg(msgId, _askVal)
            }
          })
          .catch((res) => {})
      }
    }

    // 编码
    function encode(str) {
      return btoa(
        encodeURIComponent(str).replace(
          /%([0-9A-F]{2})/g,
          function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1)
          }
        )
      )
    }
    // 滚动
    function page_scroll() {
      let interval
      clearInterval(interval)
      let element = document.getElementById('scrollDiv')
      element.scrollTop = 0 // 不管他在哪里，都让他先回到最上面

      // 设置定时器，时间即为滚动速度
      function main() {
        if (element.scrollTop + element.clientHeight == element.scrollHeight) {
          clearInterval(interval)
          console.log('已经到底部了')
        } else {
          element.scrollTop += 300
        }
        inputRef.value.focus() //自动聚焦
      }
      interval = setInterval(main, 0)
    }

    // 生成umsgId
    function gmsgId() {
      let id = uuidv4()
      console.log('生成消息id' + id)
      return id
    }

    function linkSocket(msgId, isRetry) {
      console.log(msgId, isRetry)
      initSocket()
    }

    //加载违禁词
    function initWords() {
      const oScript = document.createElement('script')
      oScript.type = 'text/javascript'
      oScript.src =
        'https://ai-domain-mapping.tarsocial.com/chatgpt/staticf/Contraband.js'
      document.body.appendChild(oScript)
    }

    //建立socket连接
    function initSocket(times) {
      if ('WebSocket' in window) {
        console.log('您的浏览器支持')
      } else {
        showDialog({
          title: '温馨提示',
          message: '你的浏览器暂不支持'
        })
        return
      }

      ws = new WebSocket('wss://ai-domain-mapping-wss.tarsocial.com:53443/ws')
      ws.onopen = onOpen
      ws.onmessage = onMessage
      ws.onerror = onError
      ws.onclose = onClose
      if (times == 2) {
        showDialog({
          title: '断网重连',
          message: '与服务器的连接已经断开，请重试'
        })
      }
    }

    function onOpen() {
      console.log('ws--onOpen')
    }

    function onError(err) {
      console.log(err)
      let msgList = store.getters.msgList
      msgList[msgList.length - 1].msg = '请求失败了'
      store.commit('fillStateSet', false)
      // 显示 重试按钮
      msgList.forEach((item) => {
        if (item.msgId === msgId && item.isAsk) {
          console.log(item)
          item.reTry = true
        }
      })
      // 滚动条
      // if (!isRetry) page_scroll();
      // timeOut = null;
      // return;
    }

    function onClose() {
      console.log('连接已关闭...', ws.readyState)
      showDialog({
        title: '温馨提示',
        message: '长时间没有响应，与服务连接断开, 点击重连'
      }).then(() => {
        initSocket()
        store.commit('fillStateSet', false)
      })
    }

    function onMessage(evt) {
      if (evt.data) {
        // 滚动条
        handle_chatgpt_msg(evt.data)
      }
    }

    function handle_chatgpt_msg(data) {
      console.log(data)
      if (JSON.parse(data).msg == '\\n\\n') return
      let msgList = store.getters.msgList
      if (msgList.length == 0) {
        return
      }
      store.commit('consIdSet', JSON.parse(data).consId)
      clearTimeout(timeOut)
      let jsonData = JSON.parse(data)
      if (!jsonData.isDone) {
        if (refreshAnswerIndex >= 0) {
          msgList[refreshAnswerIndex].msg += jsonData.msg
          store.commit('msgListSet', msgList)
        } else {
          msgList[msgList.length - 1].msg += jsonData.msg
          store.commit('msgListSet', msgList)
        }
      }
      // 最后一条的isDone为true 代表此次请求结束
      if (jsonData.isDone) {
        // 随后关闭 正在输入.. z 按钮取消禁用 输入框也清空 超时任务也置为false
        store.commit('fillStateSet', false)
        // 滚动条
        page_scroll()
        refreshAnswerIndex = -1
      }
    }

    // 重试
    function reConnect(item) {
      let msgList = store.getters.msgList
      if (reTryTimes < 3) {
        // 先把自己隐藏
        msgList.forEach((i) => {
          if ((item.msgId = i.msgId)) item.reTry = false
        })
        // 发送请求
        // 将正在输入字样打开 并将按钮禁用
        store.commit('fillStateSet', true)
        linkSocket(item.msgId, true)
      } else {
        // 重试次数太多
        let indexs = []
        // 把下标存起来
        msgList.forEach((i, index) => {
          if (item.msgId === i.msgId) {
            indexs.push(index)
          }
        })
        msgList[indexs[0]].reTry = false
        msgList[indexs[1]].msg = '请求过于频繁，请刷新后试'
        reTryTimes = 0
      }
      reTryTimes++
    }

    function sendMsg(msgId, data) {
      console.log('发送前判断套接字状态:', ws.readyState)
      if (ws.readyState == 3 || ws.readyState == 2) {
        initSocket(2)
        console.log('----')
        console.log(ws.readyState)
        console.log('======')
        store.commit('fillStateSet', false)
        return
      }

      let { userId, consId } = store.getters
      console.log({ userId, consId, msgId, msg: data })
      ws.send(`${JSON.stringify({ userId, consId, msgId, msg: data })}`)
    }

    const refreshAnswer = (index) => {
      let isFilling = store.getters.isFilling
      if (isFilling) {
        showToast('正在回复中，请稍后操作~')
        return
      }
      store.commit('fillStateSet', true)
      let msgList = store.getters.msgList
      let askObj = msgList[index - 1]
      let answerObj = msgList[index]
      answerObj.msg = ''
      store.commit('msgListSet', msgList)
      refreshAnswerIndex = index
      sendMsg(askObj.msgId, askObj.msg)
    }

    return {
      isFilling: computed(() => store.getters.isFilling),
      inputRef,
      askVal,
      refreshAnswer,
      onSubmit,
      reConnect,
      setInputVal: (e) => {
        askVal.value = e
      },
      askKeyDown: (e) => {
        if (!e.shiftKey && e.keyCode == 13) {
          if (e.keyCode == 13) {
            e.preventDefault()
            onSubmit()
          } else {
            console.log('换行')
          }
        }
      }
    }
  },

  unmounted() {}
}
</script>

<template>
  <div class="main">
    <div class="title" v-if="$store.getters.dialogShow">
      <p>{{ isFilling ? '正在回复...' : '仟传AI助手' }}</p>
    </div>
    <div class="content" id="scrollDiv" v-if="$store.getters.dialogShow">
      <div
        class="row"
        v-for="(item, index) in $store.getters.msgList"
        :key="item.name"
        clearable
      >
        <div class="name" :class="{ isGPTname: item.role === 'gpt' }">
          {{ item.role === 'gpt' ? 'AI助手' : '我' }} :
          <img
            title="刷新"
            @click="refreshAnswer(index)"
            v-if="item.role == 'gpt'"
            class="fresh"
            src="../assets/refresh.png"
          />
        </div>
        <div
          class="text"
          :style="{
            color:
              item.msg === '请求失败了' ||
              item.msg === '请求超时了' ||
              item.msg === '请求过于频繁，请刷新后试'
                ? 'red'
                : '#fff'
          }"
        >
          {{ item.msg }}
          <van-icon
            v-show="item.reTry"
            @click="reConnect(item)"
            name="replay"
          />
        </div>
        <van-notice-bar
          class="notice-tip"
          v-if="item.showSentiment"
          color="item.tipColor"
          background="#ecf9ff"
          :left-icon="item.icon"
        >
          {{ item.tip }}
        </van-notice-bar>
      </div>
    </div>
    <div class="content" id="scrollDiv" v-else>
      <Instruct @clickInput="setInputVal" />
    </div>
    <div class="footer">
      <van-field
        autocomplete="off"
        class="van-field"
        v-model="askVal"
        placeholder="需要我做些什么?"
        maxlength="1000"
        ref="inputRef"
        rows="1"
        autosize
        type="textarea"
        :disabled="isFilling"
        @keydown.stop="askKeyDown"
      />
      <van-button
        type="primary"
        :disabled="isFilling || askVal == ''"
        @click="onSubmit()"
      >
        提 问
      </van-button>
    </div>
  </div>
</template>

<style scoped lang="less">
.main {
  position: relative;
  display: flex;
  padding: 0 50px;
  padding-top: 70px;
  flex: 1;
  flex-direction: column;

  .title {
    position: absolute;
    top: 30px;
    left: 0;
    width: 100%;
    height: 5vh;
    font-size: 1.2rem;
    text-align: center;
    color: #fff;
    line-height: 5vh;
    font-weight: 600;

    @keyframes spin {
      to {
        transform: translateY(-48px);
      }
    }

    p {
      padding: 0;
      margin: 0;
    }
  }

  .content {
    overflow-y: auto;
    padding: 15px 20px;
    // border: 1px solid rgb(212, 212, 212);
    margin: 5px 0 10px;
    width: 100%;
    border-radius: 4px;
    box-sizing: border-box;
    flex: 1;

    &::-webkit-scrollbar {
      width: 0 !important;
    }

    .row {
      width: 100%;
      line-height: 28px;

      .notice-tip {
        margin-bottom: 20px;
      }

      .name {
        position: relative;
        margin: 0 8px 8px 0;
        width: 100%;
        font-size: 0.8rem;
        color: #fff;

        .tag {
          float: right;

          .tag_1 {
            position: relative;

            .tag_1_list {
              position: absolute;
              top: 20px;
              right: 0;
              z-index: 10000;
              width: 80vw;
              text-align: right;
            }
          }
        }

        .fresh {
          position: absolute;
          top: 5px;
          right: 10px;
          height: 22px;
          cursor: pointer;
        }
      }

      .text {
        position: relative;
        padding: 15px;
        margin-bottom: 10px;
        width: auto;
        min-height: 58px;
        font-size: 0.8rem;
        white-space: pre-wrap;
        color: #fff;
        background: rgb(255 255 255 / 30%);
        border-radius: 4px;
        word-wrap: break-word;

        span {
          position: absolute;
          // top: 10px;
          right: 10px;
          display: inline-block;
          color: #4975e9;
        }
      }
    }
  }

  .footer {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    overflow: hidden;
    padding: 4px;
    margin-bottom: 80px;
    border-radius: 10px;
    background-image: linear-gradient(90deg, lightblue, #1989fa);

    .van-field {
      overflow-y: scroll;
      padding: 7px 100px 7px 20px;
      max-height: 180px;
      font-size: 15px;
      border-radius: 5px;
      flex: 1;
      line-height: 31px;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .van-button {
      position: absolute;
      right: 4px;
      bottom: 4px;
      width: 90px;
      height: 45px;
      text-align: center;
      color: #fff;
      border-radius: 5px 0 0 5px;
      outline: none;
      line-height: 45px;

      &::before {
        display: none;
      }
    }
  }
}

.loading_wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  // background: rgb(0, 0, 0, .3);
  .van-loading {
    margin-top: 70%;
  }
}

.main .footer .van-field::after {
  display: none;
}

::v-deep .van-popover__action-text {
  width: 10vw !important;
}

::v-deep .van-icon-replay {
  position: absolute;
  top: 22px;
  right: 15px;
}

@media screen and(max-width:1400px) {
  .main {
    padding-right: 30px;
    padding-left: 30px;
  }

  .content {
    padding-right: 0 !important;
    padding-left: 0 !important;
  }
}

@media screen and(max-width:1200px) {
  .main {
    padding: 60px 15px 0 !important;

    .title {
      display: none;
    }
  }

  .footer {
    margin-bottom: 40px !important;
  }
}
</style>
