# AI 运动健康管理 Web MVP

## Project Foundation

最高入口是 [PROJECT.md](PROJECT.md)，它只做项目级导航；当前项目阶段和审核状态只以 [project/CurrentStatus.md](project/CurrentStatus.md) 为准。详细规则分别保存在 `project/`、`brand/`、`architecture/`、`security/`、`schemas/`、`prompts/` 和 `migration/`。

- Project Governance：Sprint 001 Foundation 已是 `Approved / Completed`，见 [project/README.md](project/README.md) 和 [project/SourceOfTruth.md](project/SourceOfTruth.md)。
- Brand Foundation：Brand DNA、Brand Positioning 与 Mission & Vision 派生说明已获批准，派生说明不是正式原文来源；母品牌面向未来公众，当前 Health 处于创始人私人真实验证阶段。其余品牌文件仍为 `proposed`，下一审核对象为 Brand Values，见 [brand/README.md](brand/README.md)。
- Privacy Boundary：私人健康记录、健康图片、导出包、数据库文件和密钥不进入 Git，见 [security/PrivacyModel.md](security/PrivacyModel.md)。
- Data Ownership：用户拥有自己的健康数据；云端同步和 AI 分享必须由用户主动选择。
- AI Portability：规则引擎、OpenAI、Claude、Gemini 和本地模型都应作为可替换 Provider，见 [architecture/AIProviderPortability.md](architecture/AIProviderPortability.md)。
- AI Context Export：可运行 `npm run validate:foundation` 和 `npm run export:ai-context` 生成 `exports/AI_CONTEXT_COMPLETE.md` 与 `exports/AI-Core-Pack/`。`exports/` 已被忽略，不是正式来源。

## V2 第二阶段：数据中心

当前版本新增“数据中心”，把日常数据采集入口集中到一个页面，减少在多个模块之间来回切换。

- COROS 数据导入：入口支持上传 FIT / TCX / GPX / CSV 文件，当前会生成可复核草稿，保存后进入正式健康记录。
- 睡眠数据入口：支持手动输入睡眠时长、深睡、浅睡、REM、睡眠评分、夜间静息心率、HRV、起床疲劳感，并支持上传 COROS 睡眠截图。
- 饮食图片入口：当前支持图片本地上传和预览，图片只保存在当前浏览器 IndexedDB；后续预留 OCR / AI 识别。
- 手动记录入口：集中补充跑步、力量、饮食、睡眠、疼痛、经期数据。

数据中心不会改变已有 `localStorage` / Supabase 记录结构，也不会破坏规则版多专家 Agent。所有保存后的记录仍通过既有 `buildDailyHealthDataFromRecord(record)` 进入 Agent 分析。

## V2 第三阶段：实时规则版 Agent 分析

“多专家分析”页面现在会优先读取你保存的最新一条健康记录，转换为 `dailyHealthData` 后交给规则版多专家 Agent。没有任何记录时，页面才会回退到系统示例数据。

## 睡眠与恢复记录模块

当前版本新增独立的“睡眠与恢复记录”模块，适合把 COROS 睡眠数据先手动录入系统：

- 支持记录睡眠时长、深睡、浅睡、REM、睡眠质量、夜间静息心率、HRV、起床疲劳感。
- 支持上传 COROS 睡眠截图、COROS 运动截图、饮食照片、体重/体脂截图。
- 图片只保存到当前浏览器的 IndexedDB，本阶段不会上传到 Supabase、OpenAI 或任何图片识别服务。
- 健康记录里只保存图片元数据，例如图片 ID、类型、文件名和大小；换设备或清理浏览器数据后，本地图片需要重新上传。
- 跑步教练和总教练会读取睡眠不足、深睡偏少、HRV 偏低、睡眠质量偏低、起床疲劳感偏高等信号，并自动把当天建议调整为恢复跑、低强度有氧或休息。
- 已预留 `src/integrations/recoverySyncClient.js`，后续可接 COROS / Terra API 自动同步睡眠与恢复数据。
- 已预留 `src/integrations/supabaseStorageClient.js`，后续可接 Supabase Storage 保存图片；当前阶段保持本地图片优先，降低隐私泄露风险。

## COROS 数据导入模块

当前项目已经支持 COROS 数据导入，第一阶段重点覆盖跑步记录：

- 在“今日记录中心”点击“导入 COROS 文件”。
- 支持上传 `.fit`、`.tcx`、`.gpx`、`.csv` 文件。
- GPX 会根据轨迹点计算跑步距离、时长、平均配速，并读取轨迹里的心率字段。
- TCX 会读取距离、时长、平均心率。
- FIT 会读取标准 session 汇总里的开始时间、距离、总运动时间和平均心率。
- 导入后只会自动填入跑步记录表单，你仍然可以手动修改距离、时长、配速、心率、RPE 和备注后再保存。
- 保存后数据会进入记录模型，并可通过 `buildDailyHealthDataFromRecord(record)` 映射为规则版 Agent 使用的 `dailyHealthData`。

FIT 说明：当前 MVP 不引入大型第三方 FIT 解析库，只实现 session 汇总解析。若某些 COROS FIT 文件没有 session 汇总，页面会提示改用 TCX/GPX 导出。

第二阶段睡眠支持已经具备基础能力：

- 可上传 COROS 睡眠截图，图片仅保存在当前浏览器 IndexedDB。
- 可手动填写睡眠时长、深睡、浅睡、REM、HRV、夜间静息心率、起床疲劳感。
- OCR 图片识别、COROS API、Terra API 均保留接口入口，当前阶段不连接真实 API。

## 长期记录：Supabase 云端账号版

当前项目已预留并实现 Supabase 云端同步结构。没有配置 Supabase 时，应用仍会使用 `localStorage`，数据只保存在当前浏览器；配置 Supabase 并登录邮箱验证码后，记录会保存到 Supabase/PostgreSQL。

### 隐私保护机制

- 前端只使用 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`。
- 不要把 Supabase `service_role` key 放进前端、GitHub Pages、`.env` 或仓库。
- 云端表 `health_records` 必须开启 Row Level Security。
- 每条记录都有 `user_id`，RLS 策略强制用户只能读取、写入、更新、删除自己的记录。
- 当前阶段不会把健康记录发送给 OpenAI，也不会把饮食图片上传到云端 AI 识别服务。

### Supabase 配置步骤

1. 在 Supabase 创建项目。
2. 打开 SQL Editor，复制执行 `supabase/schema.sql`。
3. 在 Supabase 项目设置里找到 Project URL 和 anon public key。
4. 本地开发时复制 `.env.example` 为 `.env`，填写：

```bash
VITE_SUPABASE_URL=你的 Supabase Project URL
VITE_SUPABASE_ANON_KEY=你的 Supabase anon public key
```

5. GitHub Pages 部署时，在仓库 `Settings -> Secrets and variables -> Actions` 添加：

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

6. 推送到 `main` 后 GitHub Actions 会重新构建公网版本。

### 使用说明

- 未登录：本机浏览器记录模式。
- 登录后：云端同步模式，同一账号可跨设备同步。
- 不同用户登录同一个网址，会看到各自独立的数据。
- 页面提供导出 JSON、清除本机数据、删除当前账号云端记录。

面向女性跑者的 React + Vite + Tailwind MVP。第一版使用本地示例数据和 `localStorage`，用规则版多专家 Agent 模拟 AI 分析流程；饮食图片识别可通过本机 Ollama 运行，不需要 OpenAI API。

## 功能

- 记录跑步、力量、饮食、体重、睡眠、经期、疼痛状态
- 展示 7 日跑量、力量次数、睡眠、体重和综合风险
- 5 位专家独立输出建议：跑步教练、力量训练教练、运动营养师、女性健康顾问、康复防伤顾问
- 总教练综合专家建议，输出每日方案和每周方案
- 新增规则版多专家 Agent 分析区：统一 `dailyHealthData` 输入，一键生成结构化专家 JSON 和总教练方案
- 跑步和力量训练支持 COROS 模拟同步入口
- 支持导入 COROS Training Hub CSV 文件并解析跑步/力量记录
- 饮食记录支持上传饮食图片，通过本地 Ollama 视觉模型评估营养数据
- 响应式布局，适合手机和电脑

## 本地运行

```bash
npm install
npm run dev
```

常用命令：

```bash
npm test
npm run build
npm run preview
```

## 规则版多专家 Agent

当前 Agent 系统位于 `src/agents/`，不连接 OpenAI API，所有建议都由本地规则函数生成。

统一输入为 `dailyHealthData`，包含：

- 基础状态：`date`、`bodyWeight`、`sleepHours`、`fatigueLevel`、`menstrualPhase`
- 跑步：`run.distanceKm`、`durationMin`、`avgPace`、`avgHeartRate`、`intensity`
- 力量：`strength.trained`、`bodyPart`、`durationMin`、`intensity`
- 营养：`calories`、`proteinGram`、`carbsGram`、`fatGram`、`ironRichFoods`、`omega3Foods`、`hydrationMl`
- 疼痛：`pain.knee`、`hip`、`ankle`、`lowerBack`

每个专家 Agent 返回统一结构：

```js
{
  agentName: '',
  riskLevel: 'low',
  summary: '',
  findings: [],
  recommendations: [],
  warningFlags: []
}
```

Agent 职责：

- `runCoachAgent`：分析跑步距离、强度、心率、疲劳、睡眠和膝痛风险。
- `strengthCoachAgent`：分析力量频率、下肢力量后的跑步安排、恢复风险和肌肉量维护。
- `nutritionAgent`：按体重计算蛋白、碳水、脂肪、补铁、Omega-3 和补水是否充足。
- `femaleHealthAgent`：温和评估经期、低能量可用性、脂肪摄入、睡眠和长期高跑量恢复风险。
- `rehabAgent`：评估膝、髋、踝、下背疼痛，并给出防伤和就医提醒。
- `headCoachAgent`：汇总所有专家输出，生成最终训练、营养、恢复、明日调整和本周重点。
- `analyzeHealthData`：统一编排所有专家 Agent。

页面中的“规则版多专家 Agent”区块使用 `src/data/sampleData.js` 里的虚构 Demo Persona。示例只用于演示数据结构和 Agent 行为，不代表真实个人健康档案。

## 本地饮食图片识别

不需要 OpenAI API。图片会从浏览器发送到本机 Node 服务，再由本机 Ollama 视觉模型估算营养数据。

1. 安装 Ollama，并拉取视觉模型：

```bash
ollama pull qwen2.5vl
```

2. 启动 Ollama：

```bash
ollama serve
```

3. 另开一个终端启动本地 AI 服务：

```bash
npm run server
```

4. 再启动前端：

```bash
npm run dev
```

前端默认请求 `http://127.0.0.1:8787/api/nutrition/estimate`，Vite 也保留了 `/api` 代理。若要改成同源代理，可设置 `VITE_NUTRITION_API_URL=/api/nutrition/estimate` 后重启前端。如果你想换模型，可以设置环境变量 `OLLAMA_MODEL`，例如 `OLLAMA_MODEL=llama3.2-vision npm run server`。

营养识别只能做估算，保存前请根据实际份量手动校正热量、蛋白、碳水和饮水。

## 分享给别人使用

`http://127.0.0.1:5173` 是你电脑自己的本地地址，直接转发给别人打不开。

### GitHub Pages 公网预览版

如果 Vercel 登录暂时不可用，可以先用 GitHub Pages 发布公网链接。项目已加入 GitHub Actions workflow：`.github/workflows/deploy-github-pages.yml`。

第一次发布步骤：

```bash
git init
git add .
git commit -m "feat: prepare ai health coach mvp"
git branch -M main
git remote add origin https://github.com/<你的GitHub用户名>/<你的仓库名>.git
git push -u origin main
```

然后在 GitHub 仓库页面开启 Pages：

1. 进入仓库 `Settings`
2. 点击 `Pages`
3. Source 选择 `GitHub Actions`
4. 等待 `Actions` 里的 `Deploy GitHub Pages` 运行完成

部署成功后，公网链接通常是：

```text
https://<你的GitHub用户名>.github.io/<你的仓库名>/
```

GitHub Pages 版本说明：

- 每次推送到 `main` 分支会自动重新部署。
- 数据仍保存在每个访问者自己的浏览器 `localStorage`。
- 本地 Ollama 饮食图片识别默认不可用；规则版 Agent、记录表单、COROS CSV 导入可用。
- 如果仓库名改变，不需要手动改 Vite 配置，workflow 会自动设置路径。

### Vercel 公网预览版

当前项目已加入 `vercel.json`，可以部署为 Vercel 公网预览版。部署后你会得到一个类似 `https://xxx.vercel.app` 的链接，朋友、跑友和教练都可以打开。

部署步骤：

```bash
npm install
npm run build
npx vercel login
npm run deploy
```

部署时 Vercel 的推荐配置：

- Framework Preset：Vite
- Build Command：`npm run build`
- Output Directory：`dist`
- Install Command：`npm install`

公网预览版的数据说明：

- 每个访问者的数据保存在自己浏览器的 `localStorage`。
- 你和朋友打开同一个网址，但不会共享同一份训练数据。
- 换设备或清浏览器缓存后，本地数据可能丢失。
- 这个阶段适合展示、试用和收集反馈；长期记录建议下一阶段接 Supabase。

公网预览版功能边界：

- 规则版多专家 Agent、总教练建议、记录表单、COROS CSV 导入都可用。
- 本地 Ollama 饮食图片识别默认不可用，因为访问者浏览器无法访问你电脑上的本地服务。
- 如果后续部署云端图片识别 API，可在 Vercel 环境变量中设置 `VITE_NUTRITION_API_URL`。

其他可选方式：

- 临时给同一 Wi-Fi 下的人看：用局域网 IP 启动 Vite，例如 `npm run dev -- --host 0.0.0.0`，但饮食图片识别服务也需要改成可访问的局域网地址。
- 临时远程演示：使用内网穿透工具暴露前端和本地 AI 服务。
- 正式给别人使用：部署前端到 Vercel/Netlify，把数据存储迁移到 Supabase/PostgreSQL，并把图片识别服务部署成后端 API。

## 项目结构

```text
server/
  index.js                      本地 AI HTTP 服务
  ollamaNutrition.js            Ollama 请求构造与营养 JSON 解析
src/
  agents/                       规则版多专家 Agent 系统
  ai/expertEngine.js            多专家分析与总教练汇总逻辑
  components/                   页面组件
  data/sampleData.js            女性跑者示例数据
  integrations/corosClient.js   预留 COROS 手表数据接入点
  integrations/corosFileParser.js COROS Training Hub CSV 导入解析
  integrations/nutritionVisionClient.js 本地饮食图片识别前端适配
  integrations/openaiClient.js  OpenAI 多 Agent 安全状态适配
  integrations/supabaseClient.js Supabase/PostgreSQL 安全状态适配
  storage/localStore.js         本地存储适配层
  __tests__/                    核心逻辑测试
```

## 后续接入建议

- Supabase/PostgreSQL：把 `storage/localStore.js` 替换为远程 record repository，保持 `load()` / `save()` 或演进为 async 接口。
- OpenAI API：后续可把 `src/agents/*.js` 的规则函数迁移为服务端 Agent API。建议保留当前 JSON 输出结构，让 OpenAI 多 Agent 返回同样的 `riskLevel`、`findings`、`recommendations` 和 `warningFlags`，再由 `headCoachAgent` 或服务端总教练统一汇总。
- COROS：在 `integrations/corosClient.js` 中替换本地模拟数据，保持返回表单 `patch` 的接口不变。
- COROS 文件导入：从 COROS Training Hub 导出 CSV 后，在“今日记录中心”点击“导入 COROS 文件”，系统会解析最新一条跑步或力量训练并填入表单。当前版本只支持 CSV。
- 饮食图片：当前走本机 Ollama；如后续接入云端视觉服务，可保持 `estimateNutritionFromMealImage(file)` 返回表单 `patch` 的接口不变。
- 数据模型：当前 record 已按 `running`、`strength`、`nutrition`、`body`、`sleep`、`cycle`、`pain` 分组，便于映射到数据库表或 JSONB 字段。

## 说明

第一版建议仅用于产品原型和训练规划辅助，不替代医生、营养师或物理治疗师的专业诊断。
