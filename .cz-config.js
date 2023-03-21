module.exports = {
  types: [
    {
      value: 'feat',
      name: 'feat: 新功能'
    },
    {
      value: 'fix',
      name: 'fix: 修复bug'
    },
    {
      value: 'init',
      name: 'init: 初始化'
    },
    {
      value: 'docs',
      name: 'docs: 文档变更'
    },
    {
      value: 'style',
      name: 'style: 代码美化（不影响代码含义的更改）'
    },
    {
      value: 'refactor',
      name: 'refactor: 重构'
    },
    {
      value: 'perf',
      name: 'perf: 性能优化'
    },
    {
      value: 'test',
      name: 'test: 测试用例更改'
    },
    {
      value: 'revert',
      name: 'revert: 回退'
    },
    {
      value: 'build',
      name: 'build: 打包（影响构建系统或外部依赖项的更改，gulp，npm等）'
    },
    {
      value: 'chore',
      name: 'chore: 构建/工程依赖/工具（更改构建过程或辅助工具和库，例如文档生成）'
    },
    {
      value: 'ci',
      name: 'ci: 持续集成流程（对CI配置文件和脚本的更改）'
    },
    {
      value: 'merge',
      name: 'merge: 合并分支'
    }
  ],
  scopes: [
    ['components', '组件相关'],
    ['utils', 'utils 相关'],
    ['ui', '对 ui 的调整'],
    ['styles', '样式相关'],
    ['deps', '项目依赖'],
    ['config', '配置 修改'],
    ['other', '其他 修改']
  ].map(([value, description]) => {
    return {
      value,
      name: `${value.padEnd(30)} (${description})`
    }
  }),
  // allowCustomScopes: true,
  messages: {
    type: '请选择提交类型(必填)',
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
