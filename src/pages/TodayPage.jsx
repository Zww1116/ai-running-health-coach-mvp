import { HeadCoachPlan } from '../components/HeadCoachPlan';
import { HistoryList } from '../components/HistoryList';
import { WeeklyOverview } from '../components/WeeklyOverview';
import { TodayDecisionPanel } from '../features/today/TodayDecisionPanel';

export function TodayPage({ analysis, monthlyRunningKm, records }) {
  return (
    <>
      <TodayDecisionPanel analysis={analysis} />
      <WeeklyOverview analysis={analysis} monthlyRunningKm={monthlyRunningKm} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <HeadCoachPlan report={analysis.headCoach} riskLevel={analysis.riskLevel} />
        <HistoryList records={records} />
      </div>
    </>
  );
}
