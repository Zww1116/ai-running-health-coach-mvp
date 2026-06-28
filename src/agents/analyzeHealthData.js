import { femaleHealthAgent } from './femaleHealthAgent';
import { headCoachAgent } from './headCoachAgent';
import { nutritionAgent } from './nutritionAgent';
import { rehabAgent } from './rehabAgent';
import { runCoachAgent } from './runCoachAgent';
import { strengthCoachAgent } from './strengthCoachAgent';

export function analyzeHealthData(dailyHealthData) {
  const specialists = [
    runCoachAgent(dailyHealthData),
    strengthCoachAgent(dailyHealthData),
    nutritionAgent(dailyHealthData),
    femaleHealthAgent(dailyHealthData),
    rehabAgent(dailyHealthData),
  ];

  return {
    dailyHealthData,
    specialists,
    headCoach: headCoachAgent(specialists, dailyHealthData),
  };
}
