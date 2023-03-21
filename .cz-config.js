module.exports = {
  types: [
    { value: 'feat', name: '✨ Features | 新功能' },
    { value: 'fix', name: '🐛 Bug Fixes | Bug 修复' },
    { value: 'merge', name: '🎸Code Merge | 代码合并' },
    { value: 'docs', name: '✏️ Documentation | 文档' },
    { value: 'perf', name: '⚡ Performance Improvements | 性能优化' },
    { value: 'style', name: '💄 Styles | 风格' },
    { value: 'init', name: '🎉 Init | 初始化' },
    { value: 'revert', name: '⏪ Revert | 版本回退' },
    { value: 'refactor', name: '♻️ Code Refactor | 代码重构' },
    { value: 'chore', name: '🚀 Chore | 构建/工程依赖/工具(配置文件)' },
    { value: 'build', name: '📦‍ Build System | 打包构建(gulp, npm等)' },
    { value: 'ci', name: '👷 Continuous Integration | CI 配置' },
    { value: 'test', name: '✅ Tests | 测试用例更改' }
  ],
  scopes: [
    ['components', '组件相关'],
    ['utils', 'utils相关'],
    ['ui', 'UI相关'],
    ['styles', '样式相关'],
    ['deps', '项目依赖'],
    ['config', '配置修改'],
    ['other', '其他修改']
  ].map(([value, description]) => {
    return {
      value,
      name: `${value.padEnd(30)} (${description})`
    }
  }),
  // allowCustomScopes: true,
  messages: {
    value: '请选择提交类型(必填)',
    scope: '选择文件修复范围(可选)',
    customScope: '请输入文件修改范围', // 选择 scope: custom 时会出下面的提示
    subject: '请简要描述提交(必填)',
    body: '请输入详细描述(可选)',
    breaking: '列举非兼容性重大的变更(可选)',
    footer: '请输入要关闭的issue(可选)',
    confirmCommit: '确定提交此说明吗？'
  },
  allowBreakingChanges: ['feat', 'fix'], // 当提交类型为feat、fix时才有破坏性修改选项
  subjectLimit: 72
}
