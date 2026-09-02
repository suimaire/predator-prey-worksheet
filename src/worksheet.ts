export const CORRECT_EVENT_ORDER = ['prey-up', 'predator-up', 'prey-down', 'predator-down'] as const;

export type ObjectiveAnswers = {
  aRole: string;
  bRole: string;
  graphEvidence: string;
  peakOrder: string;
  eventOrder: string[];
  blankFood: string;
  blankPredatorUp: string;
  blankPreyDown: string;
  blankPredatorDown: string;
  gammaPrediction: string;
  instantClaim: string;
};

export function objectiveChecks(answers: ObjectiveAnswers): boolean[] {
  return [
    answers.aRole === 'prey' && answers.bRole === 'predator',
    answers.graphEvidence === 'B',
    answers.peakOrder === 'prey-first',
    answers.eventOrder.join('|') === CORRECT_EVENT_ORDER.join('|'),
    answers.blankFood === '먹이' && answers.blankPredatorUp === '증가' && answers.blankPreyDown === '감소' && answers.blankPredatorDown === '감소',
    answers.gammaPrediction === 'B',
    answers.instantClaim === 'false',
  ];
}

export type AdvancedAnswers = {
  advancedPreyGrowth: string;
  advancedMinusReason: string;
  advancedNPReason: string;
  advancedCapacity: string;
  advancedDeltaMeaning: string;
  advancedGammaMeaning: string;
  advancedPredatorGain: string;
  advancedPredatorLoss: string;
  advancedGammaEffect: string;
  advancedPreyTranslation: string;
  advancedRevealed: boolean;
};

export type AdvancedAnswerField = Exclude<keyof AdvancedAnswers, 'advancedRevealed'>;

export const DEFAULT_ADVANCED_ANSWERS: AdvancedAnswers = {
  advancedPreyGrowth: '',
  advancedMinusReason: '',
  advancedNPReason: '',
  advancedCapacity: '',
  advancedDeltaMeaning: '',
  advancedGammaMeaning: '',
  advancedPredatorGain: '',
  advancedPredatorLoss: '',
  advancedGammaEffect: '',
  advancedPreyTranslation: '',
  advancedRevealed: false,
};

export function advancedObjectiveChecks(answers: AdvancedAnswers): boolean[] {
  return [
    answers.advancedPreyGrowth === 'B',
    answers.advancedMinusReason === 'A',
    answers.advancedCapacity === 'B',
    answers.advancedDeltaMeaning === 'predator-growth' && answers.advancedGammaMeaning === 'natural-loss',
  ];
}
