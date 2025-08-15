// 项目状态检查脚本
import fs from 'fs'
import path from 'path'

const requiredFiles = [
  'src/App.tsx',
  'src/main.tsx',
  'src/pages/Home/index.tsx',
  'src/components/Waterfall/index.tsx',
  'src/hooks/useWaterfallSimple.ts',
  'src/hooks/useIntersectionObserver.ts',
  'src/components/Toast/index.tsx',
  'mock/data.ts',
  'vite.config.ts',
  'postcss.config.js'
]

console.log('🔍 检查项目文件...')

let allFilesExist = true

requiredFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - 文件不存在`)
    allFilesExist = false
  }
})

if (allFilesExist) {
  console.log('\n🎉 所有必需文件都存在！')
  console.log('📱 项目应该可以正常运行了')
  console.log('🌐 访问 http://localhost:5173/ 查看效果')
} else {
  console.log('\n⚠️  有文件缺失，请检查上述错误')
}

// 检查 package.json 依赖
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const requiredDeps = [
  'react',
  'react-dom',
  'react-router-dom',
  'zustand',
  'mitt'
]
const requiredDevDeps = [
  'vite',
  'typescript',
  '@vitejs/plugin-react',
  'vite-plugin-mock'
]

console.log('\n📦 检查依赖...')
requiredDeps.forEach((dep) => {
  if (packageJson.dependencies[dep]) {
    console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`)
  } else {
    console.log(`❌ ${dep} - 依赖缺失`)
  }
})

requiredDevDeps.forEach((dep) => {
  if (packageJson.devDependencies[dep]) {
    console.log(`✅ ${dep}: ${packageJson.devDependencies[dep]}`)
  } else {
    console.log(`❌ ${dep} - 开发依赖缺失`)
  }
})

console.log('\n✨ 检查完成！')
