# Xuzhou-Journey（虚舟）

一个基于 React + Vite 的现代化旅行应用。

## 🚀 快速开始

### 环境要求
- Node.js 18+
- pnpm

### 安装依赖
```bash
pnpm install
```

### 开发服务器
```bash
pnpm dev
```
在浏览器中打开 http://localhost:5173 查看应用。

### 构建项目
```bash
pnpm build
```

### 预览生产版本
```bash
pnpm preview
```

## 🛠️ 技术栈

- **框架**: React 19.1.0
- **构建工具**: Vite 6.3.5
- **语言**: TypeScript 5.8.3
- **样式**: Stylus + CSS Modules (`.module.styl`) PostCSS
- **代码规范**: ESLint + Prettier
- **包管理器**: pnpm
- **Git 规范**: Commitizen + Commitlint + Husky

## 📝 开发规范

### Git 提交规范

本项目使用 `cz-customizable` + `commitizen` + `commitlint` + `husky` 来规范化 Git 提交流程，支持中文提示和 emoji 表情。

#### 使用方法

```bash
# 使用规范化提交（推荐）
pnpm run cz

# 或者直接使用 commitizen
npx cz
```

#### 提交类型

- ✨ **feat**: 新增功能
- 🐛 **fix**: 修复缺陷
- 📝 **docs**: 文档变更
- 💄 **style**: 代码格式调整（不影响功能）
- ♻️ **refactor**: 代码重构（非功能/非Bug）
- ⚡ **perf**: 性能优化
- ✅ **test**: 测试相关
- 📦 **build**: 构建系统或依赖变更
- 🎡 **ci**: CI配置、脚本
- 🔨 **chore**: 其他变更
- ⏪ **revert**: 代码回退
- 🎉 **init**: 项目初始化
- 🔖 **release**: 发布版本

### 代码质量保证

项目配置了完整的代码质量工具链：

- **Pre-commit Hook**: 提交前自动运行 `lint-staged`，只检查暂存的文件
- **Commit-msg Hook**: 提交时验证提交信息格式
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化

## 🔧 可用脚本

```bash
# 开发服务器
pnpm dev

# 构建项目
pnpm build

# 预览构建结果
pnpm preview

# 代码检查
pnpm lint

# 代码格式化
pnpm format

# 检查代码格式
pnpm format:check

# 规范化提交
pnpm run cz
```

## 📁 项目结构

```
xuzhou/
├── src/                    # 源代码
│   ├── components/         # 可复用组件
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   └── Button.module.styl
│   │   └── ...
│   ├── pages/             # 页面组件
│   ├── styles/            # 全局样式
│   │   ├── index.styl     # 全局样式入口
│   │   └── variables.styl # 样式变量
│   ├── App.tsx            # 主应用组件
│   ├── App.css            # 应用样式
│   ├── main.tsx           # 应用入口
│   ├── index.css          # 全局样式
│   └── vite-env.d.ts      # Vite 类型定义
├── public/                # 静态资源
├── .husky/                # Git Hooks
│   ├── pre-commit         # 提交前检查
│   └── commit-msg         # 提交信息验证
├── .cz-config.js          # Commitizen 自定义配置
├── .prettierrc            # Prettier 配置
├── .prettierignore        # Prettier 忽略文件
├── .gitignore             # Git 忽略文件
├── commitlint.config.js   # Commitlint 配置
├── eslint.config.js       # ESLint 配置
├── vite.config.ts         # Vite 配置
├── tsconfig.json          # TypeScript 配置
├── tsconfig.app.json      # 应用 TS 配置
├── tsconfig.node.json     # Node.js TS 配置
└── package.json           # 项目配置
```

### 开发流程

#### 个人开发(本项目就是个人开发者)
```bash
# 直接在主分支开发和提交
git add .
pnpm run cz
git push origin main
```

#### 团队协作开发


```bash
# 1. 创建功能分支
git checkout -b feature/your-feature-name

# 2. 开发并提交（会自动触发代码检查）
pnpm run cz

# 3. 推送分支
git push origin feature/your-feature-name
```

## 📄 许可证

本项目采用 MIT 许可证。
