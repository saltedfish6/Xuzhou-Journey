// commitlint.config.js
module.exports = {
  //   extends: ['@commitlint/config-conventional'],
  extends: ['cz'],
  rules: {
    // 类型枚举
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复bug
        'docs', // 文档变更
        'style', // 代码格式调整
        'refactor', // 代码重构
        'perf', // 性能优化
        'test', // 测试相关
        'build', // 构建流程、依赖变更
        'ci', // CI配置、脚本
        'chore', // 其他变更
        'revert', // 回滚
        'init', // 项目初始化
        'release' // 发布版本
      ]
    ],
    // 主题不能为空
    'subject-empty': [2, 'never'],
    // 主题不能以句号结尾
    'subject-full-stop': [2, 'never', '.'],
    // 主题格式（小写开头）
    'subject-case': [2, 'always', 'lower-case'],
    // 类型不能为空
    'type-empty': [2, 'never'],
    // 类型格式（小写）
    'type-case': [2, 'always', 'lower-case']
  }
}
