import { def } from '_@vue_shared@3.2.45@@vue/shared'

const ws = new WebSocket('ws://10.0.7.30:20021/ws')

ws.onopen = function () {
  // Web Socket 已连接上，使用 send() 方法发送数据
  // ws.send('{"msgId":"id2312", "msg":"讲个笑话"}');
  // ws.send(data)
  console.log('与服务器建立连接成功！')
}

ws.onmessage = function (evt) {
  var received_msg = evt.data
  console.log('msg: ' + received_msg)
}

ws.onclose = function () {
  // 关闭 websocket
  alert('连接已关闭...')
}

export default ws
