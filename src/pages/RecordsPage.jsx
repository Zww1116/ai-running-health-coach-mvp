import { HistoryList } from '../components/HistoryList';
import { RecordForm } from '../components/RecordForm';
import { SleepRecoveryPage } from '../components/SleepRecoveryPage';

export function RecordsPage({ records, onAddRecord, onResetData, onSaveSleepRecord }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="grid gap-5">
        <SleepRecoveryPage onSaveSleepRecord={onSaveSleepRecord} />
        <RecordForm onAddRecord={onAddRecord} onResetData={onResetData} />
      </div>
      <HistoryList records={records} />
    </div>
  );
}
