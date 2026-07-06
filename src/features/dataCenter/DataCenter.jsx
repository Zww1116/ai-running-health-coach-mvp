import { useState } from 'react';
import { Activity, Camera, ChevronRight, Moon, PencilLine, Watch } from 'lucide-react';
import { LocalImageGallery } from '../../components/LocalImageGallery';
import { RecordForm } from '../../components/RecordForm';
import { RecordImageUploader } from '../../components/RecordImageUploader';
import { SleepRecoveryPage } from '../../components/SleepRecoveryPage';
import { ImportCenter } from '../import/ImportCenter';
import { dataCenterSections, manualRecordTypes } from './dataCenterConfig';

const sectionIcons = {
  coros: Watch,
  sleep: Moon,
  nutrition: Camera,
  manual: PencilLine,
};

export function DataCenter({ onAddRecord, onResetData, onSaveSleepRecord }) {
  const [activeSection, setActiveSection] = useState(dataCenterSections[0].id);
  const [nutritionAttachments, setNutritionAttachments] = useState([]);

  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {dataCenterSections.map((section) => {
            const Icon = sectionIcons[section.id] ?? Activity;
            const isActive = section.id === activeSection;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`min-h-28 rounded-md border p-4 text-left transition ${
                  isActive
                    ? 'border-ink bg-ink text-white'
                    : 'border-slate-200 bg-slate-50 text-ink hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`rounded-md p-2 ${isActive ? 'bg-white/15' : 'bg-white'}`}>
                    <Icon size={18} />
                  </span>
                  <ChevronRight size={17} className={isActive ? 'text-white/70' : 'text-slate-400'} />
                </div>
                <h3 className="mt-3 text-base font-semibold">{section.title}</h3>
                <p className={`mt-1 text-xs leading-5 ${isActive ? 'text-white/75' : 'text-slate-500'}`}>
                  {section.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {activeSection === 'coros' && (
        <PanelIntro
          eyebrow="手表数据"
          title="COROS 文件先导入，再复核保存"
          text="当前可上传 FIT / TCX / GPX / CSV。未来可在这里接入 COROS / Terra API 自动同步。"
        >
          <ImportCenter onAddRecord={onAddRecord} enabledSources={['coros']} />
        </PanelIntro>
      )}

      {activeSection === 'sleep' && (
        <PanelIntro
          eyebrow="恢复数据"
          title="睡眠结构和恢复状态单独记录"
          text="睡眠时长、深睡、浅睡、REM、HRV、夜间静息心率和起床疲劳感会进入多专家 Agent 分析。"
        >
          <SleepRecoveryPage onSaveSleepRecord={onSaveSleepRecord} />
        </PanelIntro>
      )}

      {activeSection === 'nutrition' && (
        <PanelIntro
          eyebrow="营养数据"
          title="先保存饮食照片，后续接 OCR / AI 识别"
          text="当前阶段图片只保存在本地浏览器，不上传服务器；你也可以在手动记录里补充热量、蛋白、碳水和饮水。"
        >
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <RecordImageUploader
              title="上传饮食照片"
              defaultType="meal"
              value={nutritionAttachments}
              onChange={setNutritionAttachments}
            />
            <div className="mt-4">
              <LocalImageGallery attachments={nutritionAttachments} />
            </div>
          </section>
        </PanelIntro>
      )}

      {activeSection === 'manual' && (
        <PanelIntro
          eyebrow="手动补充"
          title="一次补齐训练、饮食、睡眠、疼痛和经期"
          text="适合没有导出文件时快速录入。保存后不会改变历史数据结构，仍会进入今日决策台和规则版 Agent。"
        >
          <div className="grid gap-4">
            <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-white p-4">
              {manualRecordTypes.map((type) => (
                <span
                  key={type.id}
                  className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600"
                >
                  {type.label}
                </span>
              ))}
            </div>
            <RecordForm onAddRecord={onAddRecord} onResetData={onResetData} />
          </div>
        </PanelIntro>
      )}
    </div>
  );
}

function PanelIntro({ eyebrow, title, text, children }) {
  return (
    <div className="grid gap-4">
      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-sm text-slate-500">{eyebrow}</p>
        <h2 className="mt-1 text-xl font-semibold text-ink">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
      </section>
      {children}
    </div>
  );
}
