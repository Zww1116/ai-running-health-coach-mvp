import { ExpertReports } from '../components/ExpertReports';
import { RuleAgentAnalysis } from '../components/RuleAgentAnalysis';

export function AnalysisPage({ analysis }) {
  return (
    <div className="grid gap-5">
      <RuleAgentAnalysis />
      <ExpertReports specialists={analysis.specialists} />
    </div>
  );
}
