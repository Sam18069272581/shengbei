// 单元测试只测 src/utils 等纯逻辑，不加载 uni 插件；uni 全局对象在 tests/setup.js 里替身
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.js'],
    setupFiles: ['tests/setup.js'],
  },
})
