# AI 助手

1. 基于 chatGPT 实现 AI 对话问答
2. 记录历史会话

## 1. 使用 Vue3 + Vite 构建

1. 使用 Vant UI 框架
2. 使用 Less CSS 编译预处理器
3. 使用 Vuex 状态管理库（计划后续采用 pinia 替换）

- npm install 安装依赖
- npm run dev 本地运行

## 2. 使用 eslint 检测代码，发现语法错误，规范代码规则

- npm run lint

## 3. 使用 pretieer 格式化代码，统一代码风格

- npm run format

## 4. 使用 husky 工具来进行 commit 前的 staged-lint 及 message 校验

1.  husky 是 git hook 的管理工具，在提交代码的时候会触发 husky 的回调，因此可以使用 husky 监听 git commit 事件，触发其他的操作或者指令。
    &nbsp;
2.  pre-commit 钩子中运行 lint-staged 对暂存代码进行检测；(整个项目上运行 lint 速度会很慢，lint-staged 能够让 lint 只检测暂存区的文件，所以速度很快)。
    `` npx husky add .husky/pre-commit '`npm run lint` --edit "$1"' `` 添加钩子
    &nbsp;
3.  commit-msg 钩子中运行 commitlint 对提交信息进行校验。(commitlint.config.js 报错->commitlint.config.cjs)
    `npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'` 添加钩子
    &nbsp;

    - 单行信息

      ```
      git commit -m <type>(<scope>): <subject>
      ```

    - _scope 指本次提交的影响范围，为可选项，可以是指定提交更改位置的任何内容。一般为更改部分的模块名或者文件名。_
    - _subject 指本次提交的简要描述，它有如下两个规则_

    &nbsp;

    示例：

    ```
    git commit -m feat(eslint): 配置更新
    ```

    - 多行信息

      ```
      <type>(<scope>): <subject>
      <BLANK LINE> // 空行
      <body>
      <BLANK LINE>
      <footer>
      ```

      示例：

      ```
      git commit -m feat(eslint): 集成 eslint - xcder - 2022.07.01

      1. Vscode 安装 Eslint 插件即可在保存时自动格式化
      2. 运行 pnpm lint:eslint 可全局进行代码格式化

      可以浏览 docs/1.工程化实践/1.eslint 文件了解详情。
      ```

4.  禁用 husky

        - 某一次提交想要禁用 husky，可以添加参数--no-verify

          ```
          git commit --no-verify -m "xxx"
          ```

## 5.使用 commitizen 生成符合规范的 commit message —— [参考](https://juejin.cn/post/6934292467160514567#heading-7)

- commitizen 全局安装通过 git cz 执行，项目安装 通过 npm run commit 执行
- cz-conventional-changelog 是 commitizen 的首选适配器，缺点是提示信息都是英文
- cz-customizable 自定义适配器来支持中文提示 创建.cz-config.js 文件 —— [参考](https://blog.csdn.net/DoubleLift_DSX/article/details/121984767)
- ~~git-cz 适配器、cz-emoji 适配器 等~~

## 6.生成 changelog —— [参考](https://juejin.cn/post/7199250631114407995#heading-9)

- npm run release
