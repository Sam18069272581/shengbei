# 圣杯 · 掷筊求签

uni-app（Vue 3）项目：掷筊问事、分神明求灵签、每日运势。先发布 H5，之后打包微信小程序。

- 签文数据：`data/qian/<神明>.json`，格式见 [data/README.md](data/README.md)
- `npm run build:data`：校验数据，生成 `data/qian.sqlite` 和前端 JSON
- `npm run dev:h5` / `npm run build:h5`：H5 开发与构建
- `npm run lint` / `npm test`：ESLint 检查（含禁止空 catch）和 Vitest 单元测试（tests/），改完代码两者都要过
- `npm run build:mp-weixin`：微信小程序构建（含包体检查）。打包、隐私设置和审核风险见 [docs/mp-weixin.md](docs/mp-weixin.md)

签诗为传统民间流传文本；释义为本项目自撰，仅供娱乐与传统文化学习。
