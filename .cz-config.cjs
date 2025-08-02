module.exports = {
  // 提交类型配置（必填）- 添加 emoji 让提交记录更直观
  types: [
    { value: 'feat', name: '✨ feat:     新增功能' },
    { value: 'fix', name: '🐛 fix:      修复缺陷' },
    { value: 'docs', name: '📝 docs:     文档变更' },
    { value: 'style', name: '💄 style:    代码格式调整（不影响功能）' },
    { value: 'refactor', name: '♻️  refactor: 代码重构（非功能/非Bug）' },
    { value: 'perf', name: '⚡ perf:     性能优化' },
    { value: 'test', name: '✅ test:     测试相关' },
    { value: 'build', name: '📦 build:    构建系统或依赖变更' },
    { value: 'ci', name: '🎡 ci:       CI配置、脚本' },
    { value: 'chore', name: '🔨 chore:    其他变更' },
    { value: 'revert', name: '⏪ revert:   代码回退' },
    { value: 'init', name: '🎉 init:     项目初始化' },
    { value: 'release', name: '🔖 release:  发布版本' }
  ],

  // 作用域配置（针对你的 React 项目）
  scopes: [
    { name: 'components' }, // 组件相关
    { name: 'hooks' }, // 自定义 hooks
    { name: 'utils' }, // 工具函数
    { name: 'styles' }, // 样式相关
    { name: 'config' }, // 配置文件
    { name: 'deps' }, // 依赖相关
    { name: 'types' }, // 类型定义
    { name: 'api' }, // API 相关
    { name: 'router' }, // 路由相关
    { name: 'assets' } // 静态资源
  ],

  // 是否允许自定义作用域
  allowCustomScopes: true,

  // 交互提示信息配置（中文化）
  messages: {
    type: '🚀 请选择提交类型（必填）:',
    scope: '📂 请选择影响范围（可选，直接回车跳过）:',
    customScope: '📝 请输入自定义影响范围:',
    subject: '💬 请填写简短描述（必填，建议50字以内）:',
    body: '📄 详细说明（可选，使用"|"换行）:\n',
    breaking: '💥 非兼容性变更说明（可选）:\n',
    footer: '🔗 关联关闭的Issue（可选，如 #123, #456）:\n',
    confirmCommit: '✅ 确认提交以上信息？'
  },

  // 提交规则配置
  allowBreakingChanges: ['feat', 'fix'],

  // 跳过的提问环节（简化流程，适合个人项目）
  skipQuestions: ['body', 'breaking'],

  // 描述文字长度限制
  subjectLimit: 50, // 稍微放宽一点

  // 高级配置
  breaklineChar: '|', // 长文本换行符
  footerPrefix: 'ISSUES CLOSED:', // Issue前缀

  // 自定义提交信息格式
  formatCommitMessage: ({ type, scope, subject, body, footer }) => {
    let head = type
    if (scope) {
      head += `(${scope})`
    }
    head += `: ${subject}`

    let message = head
    if (body) {
      message += `\n\n${body}`
    }
    if (footer) {
      message += `\n\n${footer}`
    }

    return message
  }
}
