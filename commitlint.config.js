module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新增功能（feature）
        'fix', // 修复 bug
        'merge', //分支合并 Merge branch
        'docs', // 文档提交（documents）
        'pref', // 性能、体验相关的提交
        'style', // 不影响程序逻辑的代码修改、主要是样式方面的优化、修改
        'init', // 项目初始化
        'revert', // 代码回滚
        'refactor', // 代码重构
        'chore', // 构建过程或辅助工具的变化
        'build', // 主要目的是修改项目构建系统（例如glup，webpack，rollup的配置等）的提交
        'ci', // 修改项目的持续集成流程（Kenkins、Travis等）的提交
        'test' // 测试用例变更
      ]
    ],
    'type-case': [0],
    'type-empty': [0],
    'scope-empty': [0],
    'scope-case': [0],
    'subject-full-stop': [0, 'never'],
    'subject-case': [0, 'never'],
    'header-max-length': [0, 'always', 72]
  }
}
