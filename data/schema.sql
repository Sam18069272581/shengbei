-- 由 scripts/build-data.mjs 从 data/qian/*.json 生成 data/qian.sqlite
CREATE TABLE deity (
  id      TEXT PRIMARY KEY,   -- mazu / wenchang / guandi / yuelao
  name    TEXT NOT NULL,
  title   TEXT,
  domains TEXT,               -- JSON 数组
  intro   TEXT
);

CREATE TABLE qian_set (
  id       TEXT PRIMARY KEY,  -- mazu_60jiazi
  deity_id TEXT NOT NULL REFERENCES deity(id),
  name     TEXT NOT NULL,
  total    INTEGER NOT NULL,
  source   TEXT                -- 采用的签诗版本
);

CREATE TABLE qian (
  set_id      TEXT NOT NULL REFERENCES qian_set(id),
  no          INTEGER NOT NULL,
  label       TEXT,            -- 甲甲 / 甲壬
  level       TEXT NOT NULL CHECK (level IN ('上上','上','中','下','下下')),
  title       TEXT,            -- 典故
  poem        TEXT NOT NULL,   -- 签诗原文，换行分句
  meaning     TEXT NOT NULL,   -- 总释义（自撰）
  source_note TEXT,
  PRIMARY KEY (set_id, no)
);

CREATE TABLE qian_topic (
  set_id TEXT NOT NULL,
  no     INTEGER NOT NULL,
  topic  TEXT NOT NULL,        -- study / career / love / wealth / health / travel ...
  text   TEXT NOT NULL,
  PRIMARY KEY (set_id, no, topic),
  FOREIGN KEY (set_id, no) REFERENCES qian(set_id, no)
);
