// 선택 심화 활동을 여는 숫자 코드입니다. 다른 숫자로 바꾸려면 이 줄만 수정하세요.
export const ADVANCED_ACCESS_CODE = '3141';

// 잠금 해제 상태를 저장하는 sessionStorage 전용 key입니다. 탭을 닫으면 다시 잠깁니다.
export const ADVANCED_UNLOCK_KEY = 'predator-prey-advanced-unlocked';

// 숫자 변환 없이 문자열로 비교하므로 '03141'이나 '3.141e3'은 통과하지 않습니다.
export function isAdvancedAccessCode(input: string): boolean {
  return input.trim() === ADVANCED_ACCESS_CODE;
}

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
