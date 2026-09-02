import type { AdvancedAnswerField, AdvancedAnswers } from './worksheet';

const LAB_URL = 'https://suimaire.github.io/predator-prey-simulation/';

type AdvancedChallengeProps = {
  answers: AdvancedAnswers;
  checks: boolean[];
  open: boolean;
  onToggle: () => void;
  onChange: (key: AdvancedAnswerField, value: string) => void;
  onReveal: () => void;
};

function AdvancedChoices({ name, value, options, onChange }: {
  name: string;
  value: string;
  options: { value: string; label: string; detail: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="radio-cards advanced-radio">
      {options.map((option) => (
        <label key={option.value} className={value === option.value ? 'selected' : ''}>
          <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} />
          <span className="radio-dot" aria-hidden="true" />
          <span><b>{option.label}</b><small>{option.detail}</small></span>
        </label>
      ))}
    </div>
  );
}

function AdvancedFeedback({ show, correct, children }: { show: boolean; correct: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return <div className={`feedback ${correct ? 'correct' : 'review'}`}><b>{correct ? '식의 의미를 잘 해독했어요' : '항의 방향을 다시 살펴보세요'}</b><p>{children}</p></div>;
}

export default function AdvancedChallenge({ answers, checks, open, onToggle, onChange, onReveal }: AdvancedChallengeProps) {
  const advancedScore = checks.filter(Boolean).length;

  return (
    <section className={`optional-challenge ${open ? 'is-open' : ''}`} aria-labelledby="challenge-title">
      <div className="challenge-gate">
        <div className="challenge-badges"><span>OPTIONAL CHALLENGE</span><b>선택 심화</b></div>
        <div className="challenge-gate-copy">
          <p>기본 20분 활동을 마친 뒤, 더 탐구하고 싶은 학생을 위한 선택 활동입니다.</p>
          <h2 id="challenge-title">심화 도전: 생태계의 규칙을 수학으로 읽어 보자</h2>
          <span className="challenge-time"><span aria-hidden="true">◷</span> 예상 시간 약 3~5분 · 기본 진행률에 포함되지 않아요</span>
        </div>
        <button type="button" className="challenge-toggle" aria-expanded={open} aria-controls="challenge-body" onClick={onToggle}>
          <span>{open ? '심화 활동 접기' : '수학으로 한 단계 더 들어가 볼까요?'}</span>
          <b>{open ? '접기' : '심화 활동 펼치기'} <i aria-hidden="true">{open ? '↑' : '↓'}</i></b>
        </button>
      </div>

      {open && (
        <div className="challenge-body" id="challenge-body">
          <header className="challenge-intro">
            <div><span>수식을 푸는 활동이 아닙니다</span><h3>관찰한 생태계 규칙을 식의 언어로 번역해 봅시다.</h3></div>
            <p>여러분이 지금까지 관찰한 규칙을 수학자와 생태학자는 두 개의 식으로 압축해서 표현할 수 있습니다. 식을 풀 필요는 없습니다. 각 부분이 어떤 생물학적 의미를 가지는지만 해독해 봅시다.</p>
          </header>

          <section className="math-step" aria-labelledby="derivative-title">
            <div className="math-step-heading"><b>1</b><div><span>변화의 방향 읽기</span><h3 id="derivative-title">먼저 dN/dt의 의미를 직관적으로 이해해 봅시다</h3></div></div>
            <div className="derivative-explainer">
              <div className="big-symbol" aria-label="디 엔 나누기 디 티">dN/dt</div>
              <div className="symbol-definitions"><p><b>N</b><span>현재 피식자 개체수</span></p><p><b>dN/dt</b><span>단위 시간 동안 피식자 개체수가 얼마나 빠르게 증가하거나 감소하는가</span></p></div>
            </div>
            <div className="direction-cards">
              <div className="positive"><b>dN/dt &gt; 0</b><span aria-hidden="true">→</span><p>피식자 증가 중</p></div>
              <div className="neutral"><b>dN/dt = 0</b><span aria-hidden="true">→</span><p>그 순간 변화 없음</p></div>
              <div className="negative"><b>dN/dt &lt; 0</b><span aria-hidden="true">→</span><p>피식자 감소 중</p></div>
            </div>
            <p className="math-note">미분방정식은 <strong>현재 상태에서 앞으로 어느 방향으로 얼마나 빠르게 변할지</strong>를 나타내는 규칙입니다. 여기서는 미분의 정의나 계산법을 다루지 않습니다.</p>
          </section>

          <section className="math-step" aria-labelledby="prey-equation-title">
            <div className="math-step-heading"><b>2</b><div><span>피식자 방정식 해독</span><h3 id="prey-equation-title">증가시키는 항과 감소시키는 항을 나누어 읽어 봅시다</h3></div></div>
            <div className="equation-banner" aria-label="디 엔 나누기 디 티는 알파 엔 곱하기 일 빼기 엔 나누기 케이, 빼기 베타 엔 피">
              <span className="equation-left">dN/dt</span><i>=</i>
              <span className="equation-term growth-term"><b>αN(1 − N/K)</b><small>피식자를 증가시키는 부분</small></span>
              <i>−</i>
              <span className="equation-term loss-term"><b>βNP</b><small>포식으로 피식자를 감소시키는 부분</small></span>
            </div>

            <fieldset className="question advanced-question"><legend><span>11</span>다음 중 αN(1 − N/K)가 의미하는 것에 가장 가까운 것은?</legend><AdvancedChoices name="advanced-growth" value={answers.advancedPreyGrowth} onChange={(value) => onChange('advancedPreyGrowth', value)} options={[{value:'A',label:'A',detail:'포식자에게 먹혀 감소하는 피식자'},{value:'B',label:'B',detail:'환경의 제한을 받으면서 피식자가 스스로 증가하는 과정'},{value:'C',label:'C',detail:'포식자의 자연 사망'},{value:'D',label:'D',detail:'포식자가 피식자를 먹고 증가하는 과정'}]} /><AdvancedFeedback show={answers.advancedRevealed} correct={checks[0]}>αN(1 − N/K)는 환경의 제한을 받으면서 피식자가 스스로 증가하는 과정을 나타냅니다.</AdvancedFeedback></fieldset>

            <fieldset className="question advanced-question"><legend><span>12</span>식의 마지막 부분인 <strong className="inline-equation loss">−βNP</strong> 앞에는 왜 ‘−’ 부호가 붙어 있을까요?</legend><AdvancedChoices name="advanced-minus" value={answers.advancedMinusReason} onChange={(value) => onChange('advancedMinusReason', value)} options={[{value:'A',label:'A',detail:'포식이 피식자의 개체수를 감소시키기 때문이다.'},{value:'B',label:'B',detail:'피식자가 포식자를 감소시키기 때문이다.'},{value:'C',label:'C',detail:'β가 항상 음수이기 때문이다.'},{value:'D',label:'D',detail:'시간이 감소하기 때문이다.'}]} /><AdvancedFeedback show={answers.advancedRevealed} correct={checks[1]}>포식은 피식자의 개체수에 감소 방향으로 작용하므로 피식자 식에서 빼는 항으로 표현합니다.</AdvancedFeedback></fieldset>
          </section>

          <section className="math-step" aria-labelledby="np-title">
            <div className="math-step-heading"><b>3</b><div><span>만남 가능성 단순화</span><h3 id="np-title">왜 N × P일까요?</h3></div></div>
            <fieldset className="question advanced-question open-question"><legend><span>생각</span>포식에 의한 감소량이 왜 피식자 수 N과 포식자 수 P의 곱 NP에 비례한다고 가정했을까요?</legend><label className="text-field"><textarea rows={4} value={answers.advancedNPReason} onChange={(event) => onChange('advancedNPReason', event.target.value)} placeholder="두 집단이 서로 만날 가능성을 생각해 설명해 보세요." /></label></fieldset>
            <div className="np-examples" aria-label="엔 피 곱의 간단한 예시"><div><span>N = 10, P = 2</span><b>NP = 20</b></div><i>→</i><div><span>N = 20, P = 2</span><b>NP = 40</b></div><i>→</i><div><span>N = 20, P = 4</span><b>NP = 80</b></div></div>
            {answers.advancedRevealed && <div className="advanced-explanation"><b>NP의 의미</b><p>이 단순한 모델에서는 피식자가 많을수록 포식자와 만날 기회가 많아지고, 포식자가 많을수록 역시 만날 기회가 많아진다고 가정합니다. 따라서 두 집단의 만남 가능성을 N × P에 비례한다고 표현합니다.</p><strong>주의:</strong><p>NP 자체가 실제로 잡아먹힌 개체 수라는 뜻은 아닙니다. β가 만남이 실제 포식으로 이어지는 정도를 조절합니다.</p></div>}
          </section>

          <section className="math-step" aria-labelledby="capacity-title">
            <div className="math-step-heading"><b>4</b><div><span>환경수용력 K 해독</span><h3 id="capacity-title">환경에 남은 ‘여유’를 식에서 찾아봅시다</h3></div></div>
            <div className="capacity-focus">(1 − N/K)</div>
            <div className="capacity-compare">
              <div><b>N ≪ K</b><span>1 − N/K가 1에 가까움</span><p>환경에 여유가 있어 피식자가 비교적 잘 증가할 수 있음</p></div>
              <div><b>N ≈ K</b><span>1 − N/K가 0에 가까움</span><p>환경수용력에 가까워져 증가가 억제됨</p></div>
            </div>
            <fieldset className="question advanced-question"><legend><span>13</span>피식자 수 N이 환경수용력 K에 가까워질수록 αN(1 − N/K)의 값은 일반적으로 어떻게 변할까요?</legend><AdvancedChoices name="advanced-capacity" value={answers.advancedCapacity} onChange={(value) => onChange('advancedCapacity', value)} options={[{value:'A',label:'A',detail:'커진다'},{value:'B',label:'B',detail:'작아져 0에 가까워진다'},{value:'C',label:'C',detail:'항상 일정하다'},{value:'D',label:'D',detail:'반드시 음수가 된다'}]} /><AdvancedFeedback show={answers.advancedRevealed} correct={checks[2]}>N이 K에 가까워지면 (1 − N/K)가 0에 가까워져 피식자의 증가 항도 작아집니다.</AdvancedFeedback></fieldset>
          </section>

          <section className="math-step" aria-labelledby="predator-equation-title">
            <div className="math-step-heading"><b>5</b><div><span>포식자 방정식 해독</span><h3 id="predator-equation-title">이번에는 두 항을 직접 연결해 봅시다</h3></div></div>
            <div className="predator-equation"><b>dP/dt = δNP − γP</b><span>P = 포식자 개체수</span></div>
            <fieldset className="question advanced-question"><legend><span>14</span>다음 두 부분을 각각 생물학적 의미와 연결하세요.</legend><div className="term-matching"><label><b>δNP</b><select aria-label="델타 엔 피의 생물학적 의미" value={answers.advancedDeltaMeaning} onChange={(event) => onChange('advancedDeltaMeaning', event.target.value)}><option value="">의미 선택</option><option value="predator-growth">피식자를 먹음으로써 포식자가 증가하는 과정</option><option value="natural-loss">포식자가 자연적으로 감소하는 과정</option></select></label><label><b>γP</b><select aria-label="감마 피의 생물학적 의미" value={answers.advancedGammaMeaning} onChange={(event) => onChange('advancedGammaMeaning', event.target.value)}><option value="">의미 선택</option><option value="predator-growth">피식자를 먹음으로써 포식자가 증가하는 과정</option><option value="natural-loss">포식자가 자연적으로 감소하는 과정</option></select></label></div><AdvancedFeedback show={answers.advancedRevealed} correct={checks[3]}>δNP는 피식자를 먹음으로써 포식자가 증가하는 과정, γP는 포식자가 자연적으로 감소하는 과정입니다.</AdvancedFeedback></fieldset>
            <div className="sentence-equation"><span>포식자 개체수의 변화</span><b>=</b><label><input value={answers.advancedPredatorGain} onChange={(event) => onChange('advancedPredatorGain', event.target.value)} aria-label="포식자 개체수를 증가시키는 과정" placeholder="증가시키는 과정" /></label><b>−</b><label><input value={answers.advancedPredatorLoss} onChange={(event) => onChange('advancedPredatorLoss', event.target.value)} aria-label="포식자 개체수를 감소시키는 과정" placeholder="감소시키는 과정" /></label></div>
          </section>

          <section className="math-step" aria-labelledby="simulation-link-title">
            <div className="math-step-heading"><b>6</b><div><span>시뮬레이션과 다시 연결</span><h3 id="simulation-link-title">앞에서 바꾼 γ를 식으로 예측해 봅시다</h3></div></div>
            <div className="simulation-reconnect"><div><b>dP/dt = δNP − <em>γP</em></b><p>γ는 포식자 자연 사망률입니다.</p></div><a href={LAB_URL} target="_blank" rel="noopener noreferrer">실험실 다시 보기 <span aria-hidden="true">↗</span></a></div>
            <fieldset className="question advanced-question open-question"><legend><span>15</span>이 식만 보고도 γ가 증가했을 때 포식자 개체군에 나타날 직접적인 효과를 설명하세요.</legend><label className="text-field"><textarea rows={3} value={answers.advancedGammaEffect} onChange={(event) => onChange('advancedGammaEffect', event.target.value)} placeholder="−γP 항의 크기가 어떻게 달라지는지 연결해 보세요." /></label>{answers.advancedRevealed && <div className="model-answer emphasized"><b>핵심 해설</b><p>γ가 증가하면 −γP 항의 크기가 커지므로 다른 조건이 같을 때 포식자 개체수를 감소시키는 효과가 커집니다. 달라진 포식 압력은 다시 피식자에게 간접적으로 영향을 줄 수 있습니다.</p></div>}</fieldset>
          </section>

          <section className="math-step" aria-labelledby="translation-title">
            <div className="math-step-heading"><b>7</b><div><span>마지막 종합</span><h3 id="translation-title">수학 기호를 생태학의 문장으로 번역해 봅시다</h3></div></div>
            <div className="translation-equation">dN/dt = αN(1 − N/K) − βNP</div>
            <fieldset className="question advanced-question open-question"><legend><span>16</span>위 피식자 방정식을 수학 기호를 거의 사용하지 않고 한 문장으로 번역하세요.</legend><label className="text-field"><textarea rows={5} value={answers.advancedPreyTranslation} onChange={(event) => onChange('advancedPreyTranslation', event.target.value)} placeholder="증가시키는 과정과 감소시키는 과정을 모두 포함해 보세요." /></label>{answers.advancedRevealed && <div className="model-answer"><b>모범 해석의 한 예</b><p>피식자 개체수는 환경의 수용 능력에 제한을 받으면서 스스로 증가하지만, 포식자와의 상호작용에 의해 감소합니다. 표현이 정확히 일치하지 않아도 핵심 관계가 들어 있으면 됩니다.</p></div>}</fieldset>
          </section>

          <section className="challenge-finish" id="advanced-answer-summary">
            {!answers.advancedRevealed ? <div><p>먼저 자신의 언어로 식을 해독해 보세요.</p><button type="button" onClick={onReveal}>심화 답안 확인하기 <span aria-hidden="true">→</span></button></div> : <div className="advanced-score"><span>심화 객관식·연결 문항</span><b>4개 중 {advancedScore}개 해독</b><small>서술형은 정오 채점하지 않고 핵심 해석을 보여줍니다.</small></div>}
            <div className="important-message"><b>중요한 것은 이 식을 푸는 것이 아닙니다.</b><p>우리가 그래프에서 발견한 ‘피식자의 증가’, ‘포식에 의한 감소’, ‘포식자의 증가’, ‘포식자의 자연 감소’라는 생태학적 규칙이 수학식의 각 항으로 표현되어 있다는 것을 읽어내는 것이 목표입니다.</p></div>
            <div className="model-flow" aria-label="생태계 관찰에서 수학식으로 관계 표현까지의 흐름"><span>생태계 관찰</span><i>↓</i><span>그래프에서 패턴 발견</span><i>↓</i><span>변수 조작과 예측</span><i>↓</i><span>수학식으로 관계 표현</span></div>
            <p className="model-limit-note">수학적 모델은 현실을 그대로 복사하는 것이 아니라, 현상의 핵심 관계를 단순화하여 표현한 것입니다.</p>
          </section>
        </div>
      )}
    </section>
  );
}
