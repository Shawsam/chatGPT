<script>
export default {
  emits: ['clickInput'], //向父级组件传参
  setup() {},

  unmounted() {}
}
</script>

<template>
  <div class="logo">
    <img src="../assets/logo.png" />
  </div>
  <div class="instruct">
    <div class="item">
      <div class="title">
        <p>示例</p>
        <p class="en">Examples</p>
      </div>
      <div class="rect demo">
        <p @click="this.$emit('clickInput', '写一个面霜产品的slogan')">
          写一个面霜产品的slogan
          <img class="icon" src="../assets/go.png" />
        </p>
        <p @click="this.$emit('clickInput', '介绍一下早C晚A这个护肤概念')">
          介绍一下早C晚A这个护肤概念
          <img class="icon" src="../assets/go.png" />
        </p>
        <p @click="this.$emit('clickInput', '帮一周啥也没干的运营人写个周报')">
          帮一周啥也没干的运营人写个周报
          <img class="icon" src="../assets/go.png" />
        </p>
      </div>
    </div>
    <div class="item">
      <div class="title">
        <p>能力</p>
        <p class="en">Capabilities</p>
      </div>
      <div class="rect">
        <p>思路清楚，及时反馈的的文案助手</p>
        <p>改代码修bug，经验丰富工作伙伴</p>
        <p>串联前文，持续对话的智慧伴侣</p>
      </div>
    </div>
    <div class="item">
      <div class="title">
        <p>缺陷</p>
        <p class="en">Limitations</p>
      </div>
      <div class="rect">
        <p>偶尔有点小错误</p>
        <p>有可能出现偏激观点</p>
        <p>偶尔服务可能不稳定</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.logo {
  padding-top: 90px;
  padding-bottom: 80px;
  text-align: center;

  img {
    width: auto;
    height: 80px;
  }
}

.instruct {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  text-align: center;
  color: #fff;

  .item {
    padding: 0 10px;
    width: 320px;

    .title {
      margin-bottom: 30px;
      font-size: 26px;

      p {
        padding: 0;
        margin: 0;
        line-height: 36px;
      }

      .en {
        font-size: 18px;
      }
    }

    .rect {
      margin: 0 20px;
      font-size: 14px;

      p {
        background: rgb(255 255 255 / 30%);
        border-radius: 10px;
        line-height: 55px;
      }

      &.demo p {
        cursor: pointer;
        position: relative;

        .icon {
          position: absolute;
          top: 5px;
          right: 8px;
          width: 12px;
        }
      }
    }
  }
}

@media screen and(max-width:1400px) {
  .instruct {
    padding: 0;

    .item {
      padding: 0;
      margin-bottom: 50px;
      width: 295px;
    }
  }
}

@media screen and(max-width:1200px) {
  .logo {
    padding-top: 50px;
    padding-bottom: 50px;
    text-align: center;

    img {
      width: auto;
      height: 50px;
    }
  }

  .instruct {
    flex-direction: column;

    .item {
      padding: 0;
      margin-bottom: 50px;
    }
  }
}
</style>
