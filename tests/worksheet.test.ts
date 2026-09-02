import test from 'node:test';
import assert from 'node:assert/strict';
import {
  advancedObjectiveChecks,
  CORRECT_EVENT_ORDER,
  DEFAULT_ADVANCED_ANSWERS,
  objectiveChecks,
  type ObjectiveAnswers,
} from '../src/worksheet.ts';

const correctAnswers: ObjectiveAnswers = {
  aRole: 'prey',
  bRole: 'predator',
  graphEvidence: 'B',
  peakOrder: 'prey-first',
  eventOrder: [...CORRECT_EVENT_ORDER],
  blankFood: '먹이',
  blankPredatorUp: '증가',
  blankPreyDown: '감소',
  blankPredatorDown: '감소',
  gammaPrediction: 'B',
  instantClaim: 'false',
};

test('핵심 문항의 모범 답안 7개를 모두 확인한다', () => {
  assert.deepEqual(objectiveChecks(correctAnswers), [true, true, true, true, true, true, true]);
});

test('A와 B의 역할을 둘 다 맞혀야 첫 문항이 확인된다', () => {
  const checks = objectiveChecks({ ...correctAnswers, bRole: 'prey' });
  assert.equal(checks[0], false);
});

test('사건 배열은 순서가 바뀌면 확인되지 않는다', () => {
  const checks = objectiveChecks({ ...correctAnswers, eventOrder: ['predator-up', 'prey-up', 'prey-down', 'predator-down'] });
  assert.equal(checks[3], false);
});

test('빈칸 네 개를 모두 맞혀야 순환 문장이 확인된다', () => {
  const checks = objectiveChecks({ ...correctAnswers, blankPredatorDown: '증가' });
  assert.equal(checks[4], false);
});

test('심화 객관식과 연결 문항 4개를 기본 채점과 분리해 확인한다', () => {
  const checks = advancedObjectiveChecks({
    ...DEFAULT_ADVANCED_ANSWERS,
    advancedPreyGrowth: 'B',
    advancedMinusReason: 'A',
    advancedCapacity: 'B',
    advancedDeltaMeaning: 'predator-growth',
    advancedGammaMeaning: 'natural-loss',
  });
  assert.deepEqual(checks, [true, true, true, true]);
});

test('심화 포식자 식은 두 항을 모두 연결해야 확인된다', () => {
  const checks = advancedObjectiveChecks({
    ...DEFAULT_ADVANCED_ANSWERS,
    advancedDeltaMeaning: 'predator-growth',
    advancedGammaMeaning: 'predator-growth',
  });
  assert.equal(checks[3], false);
});
