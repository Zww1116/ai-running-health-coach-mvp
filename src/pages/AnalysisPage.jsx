import { ExpertReports } from '../components/ExpertReports';
import { RuleAgentAnalysis } from '../components/RuleAgentAnalysis';

export function AnalysisPage({ analysis, records, profile }) {
  return (
    <div className="grid gap-5">
      <RuleAgentAnalysis records={records} profile={profile} />
      <ExpertReports specialists={analysis.specialists} />
    </div>
  );
}
