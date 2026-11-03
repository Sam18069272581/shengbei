# 签文数据格式

每位神明一个 JSON 文件，放在 `data/qian/<deity_id>.json`，UTF-8，简体中文，2 空格缩进。
JSON 是唯一数据源（便于多人并行、Git 合并）。`npm run build:data` 会：

1. 校验所有 `data/qian/*.json`；
2. 生成 `data/qian.sqlite`（静态 SQL 库，可用任何 SQLite 工具查询）；
3. 生成前端用的 `src/static/qian/<deity_id>.json` 和 `src/static/qian/index.json`。

## 神明 id

| id | 神明 | 签种 | 签数 |
| --- | --- | --- | --- |
| `mazu` | 妈祖（天上圣母） | 六十甲子签 | 60 |
| `wenchang` | 文昌帝君 | 文昌帝君灵签 | 100 |
| `guandi` | 关圣帝君 | 关帝灵签 | 100 |
| `yuelao` | 月下老人 | 月老灵签 | 100 |

## 文件结构

```json
{
  "deity": {
    "id": "mazu",
    "name": "妈祖",
    "title": "天上圣母",
    "domains": ["平安", "综合", "出行"],
    "intro": "一两句介绍（自写）"
  },
  "set": {
    "id": "mazu_60jiazi",
    "name": "妈祖六十甲子签",
    "total": 60,
    "source": "签诗采用的版本/庙宇，如：台湾各妈祖庙通行六十甲子签"
  },
  "qian": [
    {
      "no": 1,
      "label": "甲甲",
      "level": "上上",
      "title": "",
      "poem": ["第一句", "第二句", "第三句", "第四句"],
      "meaning": "总释义，自写白话，80–200 字",
      "topics": {
        "study": "学业/考试",
        "career": "工作/求职/事业",
        "love": "感情/婚姻",
        "wealth": "财运",
        "health": "健康",
        "travel": "出行/平安"
      },
      "source_note": ""
    }
  ]
}
```

## 字段规则

- `no`：签号，从 1 连续到 `set.total`，不能缺号。
- `label`：原签自带的编号或名称（如「甲甲」「甲壬」），没有就留空字符串。
- `level`：统一归一成 `上上` / `上` / `中` / `下` / `下下` 五档之一；原签的叫法（如「甲壬大吉签」）可写进 `label`。
- `title`：典故标题（如「刘备招亲」），没有就留空字符串。
- `poem`：签诗原文，数组，每句一个元素（通常 4 句）。只收录传统签诗原文，不加标点以外的改动。
- `meaning`：总释义，必须自己撰写（可 AI 起草 + 人工校对），不要照抄网站或书籍的解签文字。
- `topics`：六个 key 必填：`study` `career` `love` `wealth` `health` `travel`，每条 30–80 字，自写。
  可以额外加 `family`、`lawsuit` 等 key，前端暂时不显示。月老签可以把重点放在 `love`，其他 key 也要写，短一些即可。
- `source_note`：该签有版本差异时写明，没有就留空字符串。

## 分支与合并

- 每位神明一个分支：`data/<deity_id>`（如 `data/wenchang`），只改 `data/qian/<deity_id>.json`。
- 从 `main` 拉分支，提 PR 到 `main`。
- 提交前运行 `npm run build:data` 确认校验通过（会报出缺号、缺字段、level 不合法等问题）。
