# 🌟 Xuzhou-Journey（虚舟）

> 一个基于 React 构建的现代化智能旅游应用，融合了 AI 智能推荐、个性化行程规划和沉浸式体验。旨在为用户提供如星辰般璀璨、精准的旅行服务，让每一次出行都充满惊喜与便捷。

## ✨ 项目亮点

- 🤖 **AI 智能助手** - 集成多模型 AI 对话，提供个性化旅游建议
- 🗺️ **高德地图集成** - 精准定位、POI 搜索、路径规划
- 🎨 **智能瀑布流** - 无限滚动、图片懒加载、响应式布局
- 🔍 **智能搜索** - 实时搜索、历史记录、搜索建议
- 📱 **移动端优化** - 完美适配移动设备，流畅的用户体验
- ⚡ **性能优化** - 代码分割、缓存策略、防抖节流

## 🎯 核心功能

### 🏠 智能首页
- 瀑布流布局展示精选旅游内容
- 智能推荐算法
- 无限滚动加载
- 快速搜索入口

### 🤖 AI 旅游助手
- 支持 GPT-4、Claude、Gemini 等多模型
- 智能对话，提供个性化旅游建议
- 行程规划建议
- 实时问答服务
- 上下文记忆功能

### 🗺️ 地图探索
- 高德地图深度集成
- POI 搜索与详情展示
- 多种出行方式路径规划
- 周边景点推荐
- 拖拽交互体验

### 📋 行程管理
- 个性化行程创建
- 智能时间安排
- 行程分享功能
- 历史行程查看

### 👤 用户中心
- 个人信息管理
- 历史记录查看
- 偏好设置
- 登录状态管理

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

### 前端核心
- **框架**: React 18.3.1 + TypeScript 5.8.3
- **构建工具**: Vite 6.3.5
- **路由**: React Router v7.8.0
- **状态管理**: Zustand 5.0.7
- **UI 组件**: React Vant 3.3.5
- **动画**: Framer Motion 12.23.12
- **HTTP 客户端**: Axios 1.11.0

### 地图服务
- **地图 SDK**: 高德地图 JavaScript API
- **定位服务**: HTML5 Geolocation API
- **地图功能**: POI 搜索、路径规划、地理编码

### AI 集成
- **多模型支持**: GPT-4、Claude、Gemini
- **流式响应**: Server-Sent Events
- **上下文管理**: 会话持久化

### 开发工具
- **包管理器**: pnpm
- **代码规范**: ESLint + Prettier
- **Git 规范**: Commitizen + Commitlint + Husky
- **Mock 数据**: Vite Plugin Mock + MockJS
- **样式处理**: PostCSS + Stylus

### 性能优化
- **代码分割**: React.lazy + Suspense
- **图片优化**: 懒加载 + 占位符
- **缓存策略**: 本地存储 + 内存缓存
- **防抖节流**: 搜索和滚动优化

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
├── src/                    # 源代码目录
│   ├── components/         # 可复用组件
│   │   ├── Waterfall/      # 瀑布流组件
│   │   ├── MainLayout/     # 主布局组件
│   │   ├── BlankLayout/    # 空白布局组件
│   │   ├── HomeSearchBar/  # 首页搜索栏
│   │   ├── SearchBox/      # 搜索框组件
│   │   ├── Loading/        # 加载组件
│   │   ├── Toast/          # 提示组件
│   │   └── ...
│   ├── pages/              # 页面组件
│   │   ├── Home/           # 首页
│   │   ├── AIAssistant/    # AI 助手页面
│   │   ├── Map/            # 地图页面
│   │   ├── Search/         # 搜索页面
│   │   ├── Detail/         # 详情页面
│   │   ├── Itinerary/      # 行程页面
│   │   ├── User/           # 用户中心
│   │   └── Login/          # 登录页面
│   ├── store/              # 状态管理
│   │   ├── useAIStore.ts   # AI 助手状态
│   │   ├── useSearchStore.ts # 搜索状态
│   │   ├── useUserStore.ts # 用户状态
│   │   └── ...
│   ├── hooks/              # 自定义 Hooks
│   │   ├── useAMap.ts      # 高德地图 Hook
│   │   ├── useWaterfall.ts # 瀑布流 Hook
│   │   ├── useDebounce.ts  # 防抖 Hook
│   │   └── ...
│   ├── api/                # API 接口
│   │   ├── config.ts       # Axios 配置
│   │   ├── search.ts       # 搜索接口
│   │   ├── detail.ts       # 详情接口
│   │   └── ...
│   ├── utils/              # 工具函数
│   │   ├── imageOptimizer.ts # 图片优化
│   │   ├── mapLoader.ts    # 地图加载器
│   │   └── ...
│   ├── types/              # TypeScript 类型定义
│   │   ├── ai.ts           # AI 相关类型
│   │   ├── components.ts   # 组件类型
│   │   └── ...
│   ├── config/             # 配置文件
│   │   └── mapConfig.ts    # 地图配置
│   ├── llm/                # LLM 集成
│   │   └── index.ts        # AI 模型接口
│   └── styles/             # 样式文件
│       └── vant-override.css # Vant 样式覆盖
├── mock/                   # Mock 数据
│   ├── index.ts            # Mock 配置
│   ├── home.ts             # 首页数据
│   ├── search.ts           # 搜索数据
│   └── ...
├── public/                 # 静态资源
│   ├── icons/              # 图标文件
│   └── ...
├── .husky/                 # Git Hooks
├── .cz-config.cjs          # Commitizen 配置
├── commitlint.config.cjs   # Commitlint 配置
├── eslint.config.js        # ESLint 配置
├── vite.config.ts          # Vite 配置
└── package.json            # 项目配置
```

## 🚀 部署说明

### 本地开发
```bash
# 克隆项目
git clone <repository-url>
cd xuzhou

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 生产构建
```bash
# 构建项目
pnpm build

# 预览构建结果
pnpm preview
```

### 环境变量
创建 `.env.local` 文件配置环境变量：
```env
# 高德地图 API Key
VITE_AMAP_KEY=your_amap_key

# AI 服务配置
VITE_AI_API_BASE=your_ai_api_base
VITE_AI_API_KEY=your_ai_api_key
```

## 🔧 开发指南

### 添加新页面
1. 在 `src/pages/` 下创建页面组件
2. 在 `src/App.tsx` 中添加路由配置
3. 如需状态管理，在 `src/store/` 下创建对应的 store

### 添加新组件
1. 在 `src/components/` 下创建组件目录
2. 创建 `index.tsx` 和相关样式文件
3. 导出组件供其他模块使用

### API 接口开发
1. 在 `src/api/` 下创建接口文件
2. 使用统一的 axios 实例
3. 在 `mock/` 下添加对应的 mock 数据

### 开发流程

#### 个人开发
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

# 4. 创建 Pull Request
```

## 🎨 设计理念

### 用户体验
- **响应式设计**: 完美适配移动端和桌面端
- **流畅动画**: 使用 Framer Motion 提供丝滑体验
- **直观交互**: 符合用户习惯的操作逻辑
- **快速响应**: 优化加载速度和交互反馈

### 技术架构
- **组件化开发**: 高度可复用的组件设计
- **状态管理**: 使用 Zustand 进行轻量级状态管理
- **类型安全**: 全面的 TypeScript 类型定义
- **性能优化**: 多维度性能优化策略

## 🤝 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`pnpm run cz`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request


## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。


