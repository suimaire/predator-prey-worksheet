import { useEffect, useMemo, useState } from 'react';
import AdvancedChallenge from './AdvancedChallenge';
import {
  advancedObjectiveChecks,
  DEFAULT_ADVANCED_ANSWERS,
  objectiveChecks,
  type AdvancedAnswerField,
  type AdvancedAnswers,
} from './worksheet';

const LAB_URL = 'https://suimaire.github.io/predator-prey-simulation/';
const STORAGE_KEY = 'predator-prey-worksheet-v3';

const eventLabels: Record<string, string> = {
  'predator-down': '가. 포식자 개체수가 감소한다.',
  'prey-up': '나. 피식자 개체수가 증가한다.',
  'predator-up': '다. 포식자 개체수가 증가한다.',
  'prey-down': '라. 피식자 개체수가 감소한다.',
};

type WorksheetState = AdvancedAnswers & {
  aRole: string;
  bRole: string;
  graphEvidence: string;
  peakOrder: string;
  peakReason: string;
  eventOrder: string[];
  blankFood: string;
  blankPredatorUp: string;
  blankPreyDown: string;
  blankPredatorDown: string;
  delayReason: string;
  gammaPrediction: string;
  predatorObservation: string;
  preyObservation: string;
  oscillationObservation: string;
  indirectReason: string;
  instantClaim: string;
  claimReason: string;
  synthesis: string;
  natureSame: string;
  natureReason: string;
  revealed: boolean;
};

const defaultState: WorksheetState = {
  ...DEFAULT_ADVANCED_ANSWERS,
  aRole: '', bRole: '', graphEvidence: '', peakOrder: '', peakReason: '',
  eventOrder: ['predator-down', 'prey-up', 'predator-up', 'prey-down'],
  blankFood: '', blankPredatorUp: '', blankPreyDown: '', blankPredatorDown: '', delayReason: '',
  gammaPrediction: '', predatorObservation: '', preyObservation: '', oscillationObservation: '', indirectReason: '',
  instantClaim: '', claimReason: '', synthesis: '', natureSame: '', natureReason: '', revealed: false,
};

const activityMeta = [
  { id: 1, label: '그래프 추론', time: '약 4분' },
  { id: 2, label: '순환 관계', time: '약 4분' },
  { id: 3, label: '변인 탐구', time: '약 6분' },
  { id: 4, label: '주장 검토', time: '약 3분' },
  { id: 5, label: '개념 종합', time: '약 3분' },
];

function ActivityHeader({ number, eyebrow, title, time }: { number: number; eyebrow: string; title: string; time: string }) {
  return (
    <div className="activity-heading">
      <div className="activity-number" aria-hidden="true">{String(number).padStart(2, '0')}</div>
      <div><p className="activity-kicker">활동 {number} / 5 · {eyebrow}</p><h2>{title}</h2></div>
      <span className="time-badge"><span aria-hidden="true">◷</span> {time}</span>
    </div>
  );
}

function RadioCards({ name, value, options, onChange }: {
  name: string;
  value: string;
  options: { value: string; label: string; detail?: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="radio-cards">
      {options.map((option) => (
        <label key={option.value} className={value === option.value ? 'selected' : ''}>
          <input type="radio" name={name} value={option.value} checked={value === option.value} onChange={() => onChange(option.value)} />
          <span className="radio-dot" aria-hidden="true" />
          <span><b>{option.label}</b>{option.detail && <small>{option.detail}</small>}</span>
        </label>
      ))}
    </div>
  );
}

function Feedback({ show, correct, children }: { show: boolean; correct: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return <div className={`feedback ${correct ? 'correct' : 'review'}`}><b>{correct ? '확인했어요' : '다시 살펴보세요'}</b><p>{children}</p></div>;
}

function LabLink({ compact = false }: { compact?: boolean }) {
  return (
    <a className={compact ? 'lab-button compact' : 'lab-button'} href={LAB_URL} target="_blank" rel="noopener noreferrer">
      {compact ? '실험실 열기' : '포식자-피식자 동역학 실험실 열기'} <span aria-hidden="true">↗</span>
    </a>
  );
}

export default function Home() {
  const [answers, setAnswers] = useState<WorksheetState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [currentActivity, setCurrentActivity] = useState(1);
  const [hintOpen, setHintOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState<string | null>(null);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) setAnswers({ ...defaultState, ...JSON.parse(stored) });
      } catch { /* 손상된 저장값은 기본값으로 시작합니다. */ }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers, hydrated]);

  useEffect(() => {
    const sections = activityMeta.map(({ id }) => document.getElementById(`activity-${id}`)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setCurrentActivity(Number(visible.target.id.replace('activity-', '')));
    }, { rootMargin: '-20% 0px -55% 0px', threshold: [0.05, 0.25, 0.5] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const setField = <K extends keyof WorksheetState>(key: K, value: WorksheetState[K]) => {
    setAnswers((previous) => ({ ...previous, [key]: value, revealed: key === 'revealed' ? value as boolean : false }));
  };

  const setAdvancedField = (key: AdvancedAnswerField, value: string) => {
    setAnswers((previous) => ({ ...previous, [key]: value, advancedRevealed: false }));
  };

  const completion = useMemo(() => [
    Boolean(answers.aRole && answers.bRole && answers.graphEvidence && answers.peakOrder && answers.peakReason.trim()),
    Boolean(answers.blankFood && answers.blankPredatorUp && answers.blankPreyDown && answers.blankPredatorDown && answers.delayReason.trim()),
    Boolean(answers.gammaPrediction && answers.predatorObservation && answers.preyObservation && answers.oscillationObservation.trim() && answers.indirectReason.trim()),
    Boolean(answers.instantClaim && answers.claimReason.trim()),
    Boolean(answers.synthesis.trim() && answers.natureSame && answers.natureReason.trim()),
  ], [answers]);

  const checks = useMemo(() => objectiveChecks(answers), [answers]);
  const advancedChecks = useMemo(() => advancedObjectiveChecks(answers), [answers]);
  const score = checks.filter(Boolean).length;
  const completedCount = completion.filter(Boolean).length;

  const moveEvent = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= answers.eventOrder.length) return;
    const next = [...answers.eventOrder];
    [next[index], next[target]] = [next[target], next[index]];
    setField('eventOrder', next);
  };

  const dropEvent = (targetId: string) => {
    if (!draggedEvent || draggedEvent === targetId) return;
    const next = [...answers.eventOrder];
    const from = next.indexOf(draggedEvent);
    const target = next.indexOf(targetId);
    next.splice(from, 1);
    next.splice(target, 0, draggedEvent);
    setField('eventOrder', next);
    setDraggedEvent(null);
  };

  const revealAnswers = () => {
    setAnswers((previous) => ({ ...previous, revealed: true }));
    window.setTimeout(() => document.getElementById('answer-summary')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
  };

  const revealAdvancedAnswers = () => {
    setAnswers((previous) => ({ ...previous, advancedRevealed: true }));
    window.setTimeout(() => document.getElementById('advanced-answer-summary')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 80);
  };

  const resetWorksheet = () => {
    if (!window.confirm('작성한 답변을 모두 지우고 학습지를 초기화할까요?')) return;
    window.localStorage.removeItem(STORAGE_KEY);
    setAnswers(defaultState);
    setHintOpen(false);
    setAdvancedOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main>
      <header className="hero" id="top">
        <nav className="portal-nav" aria-label="과학 수업 포털 안내">
          <a className="portal-link" href="https://suimaire.github.io/" aria-label="과학 수업 포털로 돌아가기">← 과학 수업 포털</a>
        </nav>
        <nav className="topbar" aria-label="학습지 도구">
          <a className="brand" href="#top" aria-label="학습지 맨 위로"><span className="brand-mark" aria-hidden="true">↝</span><span>통합과학2 · 자료 해석</span></a>
          <span className="total-time"><span aria-hidden="true">◷</span> 예상 활동 시간 <b>약 20분</b></span>
        </nav>
        <div className="hero-content">
          <p className="eyebrow">PREDATOR–PREY WORKSHEET</p>
          <h1>포식자와 피식자,<br /><em>누가 먼저 변할까?</em></h1>
          <p className="subtitle">포식자-피식자 동역학 자료 해석 활동</p>
          <p className="intro">아래 문제를 먼저 읽고 스스로 답해 보세요. 그래프가 필요하거나 자신의 예상이 맞는지 확인하고 싶을 때 시뮬레이션을 사용해도 됩니다.</p>
          <div className="lab-entry"><LabLink /><span>지금 열지 않아도 괜찮아요 · 필요할 때 사용하세요</span></div>
          <p className="time-note"><span aria-hidden="true">✓</span> 시간 표시는 활동 분량 안내용이며, 제한 시간이 아닙니다.</p>
        </div>
      </header>

      <div className="mobile-progress" aria-label={`현재 활동 ${currentActivity}, 완료 ${completedCount}개`}>
        <span>활동 {currentActivity} / 5</span><div><i style={{ width: `${(completedCount / 5) * 100}%` }} /></div><b>{completedCount}개 작성</b>
      </div>

      <div className="page-shell">
        <aside className="progress-rail" aria-label="활동 진행 순서">
          <div className="progress-title"><p>활동 진행</p><span>{completedCount} / 5 작성</span></div>
          <ol>
            {activityMeta.map((item, index) => (
              <li key={item.id} className={`${currentActivity === item.id ? 'current' : ''} ${completion[index] ? 'done' : ''}`}>
                <a href={`#activity-${item.id}`}><b>{completion[index] ? '✓' : item.id}</b><span>{item.label}<small>{item.time}</small></span></a>
              </li>
            ))}
          </ol>
          <button type="button" className="reset-button" onClick={resetWorksheet}>학습지 초기화</button>
        </aside>

        <section className="worksheet" aria-label="포식자와 피식자 학습 활동">
          <article className="activity-card" id="activity-1">
            <ActivityHeader number={1} eyebrow="그래프 해석" title="두 곡선의 정체를 추론해 보자" time="약 4분" />
            <p className="activity-lead">아래 그래프는 서로 영향을 주는 두 개체군 A와 B의 변화를 나타냅니다. 아직 범례는 숨겨져 있습니다. 정점과 최저점이 나타나는 <strong>시간적 순서</strong>에 주목하세요.</p>
            <figure className="mystery-chart">
              <figcaption><div><b>개체군의 상대적 변화</b><span>선의 높이보다 변화의 순서를 살펴보세요.</span></div><div className="line-key" aria-label="곡선 구분"><span className="key-a">A</span><span className="key-b">B</span></div></figcaption>
              <div className="chart-scroll">
                <svg viewBox="0 0 760 300" role="img" aria-labelledby="chart-title chart-desc">
                  <title id="chart-title">개체군 A와 B의 주기적 변화 그래프</title><desc id="chart-desc">실선 A가 점선 B보다 먼저 정점과 최저점에 도달합니다.</desc>
                  <g className="grid-lines" aria-hidden="true"><path d="M64 48H728M64 101H728M64 154H728M64 207H728M64 260H728" /><path d="M64 32V260M197 32V260M330 32V260M463 32V260M596 32V260M728 32V260" /></g>
                  <path className="axis" d="M64 30V260H735" aria-hidden="true" />
                  <path className="curve-a" d="M64 174 C105 152 125 82 169 60 S247 120 276 190 S353 246 397 205 S449 95 493 62 S574 105 608 181 S685 240 728 194" />
                  <path className="curve-b" d="M64 219 C111 207 148 169 191 109 S274 63 310 102 S363 211 416 229 S499 196 529 129 S607 59 652 91 S704 168 728 211" />
                  <g className="a-markers" aria-hidden="true"><circle cx="169" cy="60" r="5"/><circle cx="397" cy="205" r="5"/><circle cx="493" cy="62" r="5"/></g>
                  <text x="718" y="279">시간</text><text x="22" y="195" transform="rotate(-90 22 195)">상대적 개체수</text>
                </svg>
              </div>
              <p className="chart-note"><span aria-hidden="true">ⓘ</span> A와 B는 비교를 위한 상대적 척도입니다. 평균 개체수만으로 정체를 판단할 수 없습니다.</p>
            </figure>

            <div className="questions">
              <fieldset className="question"><legend><span>1</span>A와 B의 정체를 각각 추론하세요.</legend><div className="paired-selects"><label>A = <select value={answers.aRole} onChange={(e) => setField('aRole', e.target.value)}><option value="">선택</option><option value="prey">피식자</option><option value="predator">포식자</option></select></label><label>B = <select value={answers.bRole} onChange={(e) => setField('bRole', e.target.value)}><option value="">선택</option><option value="prey">피식자</option><option value="predator">포식자</option></select></label></div><Feedback show={answers.revealed} correct={checks[0]}>A는 피식자, B는 포식자입니다. 피식자의 변화가 먼저 나타나고 포식자가 뒤따릅니다.</Feedback></fieldset>
              <fieldset className="question"><legend><span>2</span>그렇게 판단한 가장 중요한 근거를 고르세요.</legend><RadioCards name="graph-evidence" value={answers.graphEvidence} onChange={(value) => setField('graphEvidence', value)} options={[{value:'A',label:'A',detail:'평균 개체수가 더 많은 집단이 피식자이기 때문이다.'},{value:'B',label:'B',detail:'개체수가 먼저 증가하고 정점에 도달하는 집단이 있기 때문이다.'},{value:'C',label:'C',detail:'그래프 색깔로 판단할 수 있기 때문이다.'},{value:'D',label:'D',detail:'두 집단은 항상 정확히 반대로 변화하기 때문이다.'}]} /><Feedback show={answers.revealed} correct={checks[1]}>핵심 단서는 평균 개체수나 색이 아니라 정점과 최저점의 시간적 선후 관계입니다.</Feedback></fieldset>
              <fieldset className="question"><legend><span>3</span>두 개체군의 정점은 일반적으로 어떤 순서로 나타날까요?</legend><RadioCards name="peak-order" value={answers.peakOrder} onChange={(value) => setField('peakOrder', value)} options={[{value:'same',label:'거의 동시에 나타난다'},{value:'prey-first',label:'피식자의 정점이 먼저 나타난다'},{value:'predator-first',label:'포식자의 정점이 먼저 나타난다'}]} /><label className="text-field"><span>그 이유를 1~2문장으로 작성하세요.</span><textarea rows={3} value={answers.peakReason} onChange={(e) => setField('peakReason', e.target.value)} placeholder="먹이의 양과 포식자의 반응에 주목해 설명해 보세요." /></label><Feedback show={answers.revealed} correct={checks[2]}>피식자가 늘면 먹이가 풍부해지고, 포식자의 생존과 번식이 증가하는 데 시간이 걸리므로 포식자의 정점이 뒤에 나타납니다.</Feedback></fieldset>
            </div>
          </article>

          <article className="activity-card" id="activity-2">
            <ActivityHeader number={2} eyebrow="인과 순환" title="네 사건을 연결해 보자" time="약 4분" />
            <p className="activity-lead">카드를 끌거나 위아래 버튼을 눌러 전형적인 변화 순서로 배열하세요. 이 순서는 모든 순간에 한 집단만 변한다는 뜻은 아닙니다.</p>
            <div className="questions">
              <fieldset className="question"><legend><span>4</span>피식자 증가에서 시작하도록 사건의 순서를 배열하세요.</legend><ol className="sort-list">
                {answers.eventOrder.map((eventId, index) => <li key={eventId} draggable onDragStart={() => setDraggedEvent(eventId)} onDragEnd={() => setDraggedEvent(null)} onDragOver={(e) => e.preventDefault()} onDrop={() => dropEvent(eventId)} className={draggedEvent === eventId ? 'dragging' : ''}><span className="drag-handle" aria-hidden="true">⠿</span><b>{index + 1}</b><span>{eventLabels[eventId]}</span><div><button type="button" onClick={() => moveEvent(index, -1)} disabled={index === 0} aria-label={`${eventLabels[eventId]} 위로 이동`}>↑</button><button type="button" onClick={() => moveEvent(index, 1)} disabled={index === answers.eventOrder.length - 1} aria-label={`${eventLabels[eventId]} 아래로 이동`}>↓</button></div></li>)}
              </ol><Feedback show={answers.revealed} correct={checks[3]}>피식자 증가 → 포식자 증가 → 피식자 감소 → 포식자 감소의 순서로 음성 피드백 순환이 이어집니다.</Feedback></fieldset>
              <fieldset className="question"><legend><span>5</span>문장의 빈칸을 채워 순환을 완성하세요.</legend><div className="fill-story">
                <p>피식자의 수가 증가하면 포식자가 이용할 수 있는 <select aria-label="첫 번째 빈칸" value={answers.blankFood} onChange={(e) => setField('blankFood', e.target.value)}><option value="">선택</option><option>먹이</option><option>공간</option><option>천적</option></select>가 많아진다.</p>
                <p>그 결과 일정 시간이 지나면 포식자의 수가 <select aria-label="두 번째 빈칸" value={answers.blankPredatorUp} onChange={(e) => setField('blankPredatorUp', e.target.value)}><option value="">선택</option><option>증가</option><option>감소</option></select>한다.</p>
                <p>포식자가 많아지면 포식 압력이 증가하여 피식자의 수가 <select aria-label="세 번째 빈칸" value={answers.blankPreyDown} onChange={(e) => setField('blankPreyDown', e.target.value)}><option value="">선택</option><option>증가</option><option>감소</option></select>한다.</p>
                <p>피식자가 부족해지면 다시 포식자의 수가 <select aria-label="네 번째 빈칸" value={answers.blankPredatorDown} onChange={(e) => setField('blankPredatorDown', e.target.value)}><option value="">선택</option><option>증가</option><option>감소</option></select>한다.</p>
              </div><Feedback show={answers.revealed} correct={checks[4]}>먹이의 양이 포식자의 생존과 번식에 영향을 주고, 달라진 포식 압력이 다시 피식자에게 영향을 줍니다.</Feedback></fieldset>
              <fieldset className="question important-question"><legend><span>6</span>왜 포식자의 변화는 피식자의 변화보다 약간 늦게 나타날까요?</legend><label className="text-field"><textarea rows={4} value={answers.delayReason} onChange={(e) => setField('delayReason', e.target.value)} placeholder="개체의 생존과 번식에 필요한 시간을 생각해 보세요." /></label>{answers.revealed && <div className="model-answer"><b>설명에 포함하면 좋은 개념</b><p>먹이가 늘어난 뒤 포식자가 더 잘 생존하고 번식하여 개체수가 증가하기까지 시간이 필요하기 때문에 시간 지연이 나타납니다.</p></div>}</fieldset>
            </div>
          </article>

          <article className="activity-card" id="activity-3">
            <ActivityHeader number={3} eyebrow="변인 탐구" title="한 변인의 변화가 어디까지 퍼질까?" time="약 6분" />
            <div className="experiment-callout"><div><span>예상 → 확인 → 설명</span><h3>먼저 예상한 뒤, 필요하면 실험실을 열어 확인하세요.</h3><p>실험실이 새 탭에서 열립니다. 관찰을 마치면 이 학습지 탭으로 돌아오세요.</p></div><LabLink compact /></div>
            <div className="variable-card"><span>이번에 바꿀 변수</span><b><i>γ</i> 포식자 자연 사망률</b><p>다른 조건은 모두 그대로 두고 <strong>γ만 0.60 → 0.75</strong>로 바꿉니다(약 25% 증가).</p></div>
            <section className="setup-card" aria-labelledby="setup-title">
              <div className="setup-heading"><span aria-hidden="true">⚙</span><div><small>실험 조건 맞추기</small><h3 id="setup-title">모든 학생이 똑같은 조건에서 시작합니다</h3></div></div>
              <ul>
                <li><b>모형</b><span>실험실 오른쪽 위에서 <strong>More realistic model</strong>을 선택합니다. 왼쪽 <em>사용 중인 방정식</em> 카드에 <strong>환경수용력 포함</strong>이라고 표시되고 피식자 식이 <code>dN/dt = αN(1 − N/K) − βNP</code>로 바뀌면 준비된 것입니다.</span></li>
                <li><b>기본값</b><span>왼쪽 패널의 <strong>기본값으로 돌아가기</strong>를 눌러 α 0.80, β 0.040, δ 0.020, <strong>γ 0.60</strong>, K 180, 피식자 40, 포식자 9로 맞춥니다.</span></li>
                <li><b>바꿀 값</b><span>두 번째 실행에서는 <strong>γ만 0.75</strong>로 바꿉니다. 나머지 값과 초기 개체수는 건드리지 않습니다.</span></li>
              </ul>
              <p className="setup-note"><span aria-hidden="true">ⓘ</span> 이 실험실은 같은 모형·같은 값·같은 초기 개체수라면 언제 실행해도 똑같은 그래프가 나옵니다. 결과가 다르게 보인다면 바꾸지 않기로 한 값이 함께 바뀐 것입니다. <strong>Prediction Mode</strong>를 열면 모형이 자동으로 Basic model로 돌아가므로, 이 활동에서는 열지 않습니다.</p>
            </section>
            <div className="questions">
              <fieldset className="question"><legend><span>7</span>γ를 0.60에서 0.75로 높이면 포식자 개체군에 가장 <strong>직접적으로</strong> 나타나는 변화는?</legend><RadioCards name="gamma" value={answers.gammaPrediction} onChange={(value) => setField('gammaPrediction', value)} options={[{value:'A',label:'A',detail:'포식자가 더 오래 산다.'},{value:'B',label:'B',detail:'같은 포식자 수에서도 자연적으로 줄어드는 양이 커져, 포식자가 늘어나기에 불리해진다.'},{value:'C',label:'C',detail:'피식자의 자연 증가율이 직접 감소한다.'},{value:'D',label:'D',detail:'환경수용력이 증가한다.'}]} /><Feedback show={answers.revealed} correct={checks[5]}>γ는 포식자가 자연적으로 줄어드는 정도이므로, γ가 커지면 같은 포식자 수에서도 손실이 커져 포식자의 순증가에 불리하게 작용합니다. 다만 이것은 직접 효과이고, 실제 그래프의 최종 모습은 피식자와의 상호작용까지 함께 계산된 결과입니다.</Feedback></fieldset>
              <section className="protocol" aria-labelledby="protocol-title"><div className="protocol-heading"><span aria-hidden="true">↻</span><div><small>실험 절차</small><h3 id="protocol-title">한 번에 하나의 변수만 바꾸기</h3></div></div><ol><li><b>1</b>More realistic model 선택</li><li><b>2</b>기본값으로 돌아가기(γ = 0.60)</li><li><b>3</b>Run을 눌러 20년 관찰</li><li><b>4</b>γ만 0.75로 변경</li><li><b>5</b>다시 Run</li><li><b>6</b>두 그래프 비교</li></ol><p className="protocol-note">그래프의 <strong>전체 시간 구간</strong>을 함께 보세요. 앞부분만 보고 판단하면 뒤쪽에서 나타나는 변화를 놓칠 수 있습니다.</p></section>
              <fieldset className="question"><legend><span>8</span>γ = 0.60일 때와 γ = 0.75일 때의 그래프를 비교해 기록하세요.</legend><ul className="observe-points" aria-label="비교할 관찰 포인트"><li>두 개체군이 오르내리는 <b>평균적인 수준</b></li><li>각 개체군의 <b>최고점과 최저점</b></li><li><b>진동의 크기</b>(최고점과 최저점의 차이)</li><li><b>정점이 나타나는 시점</b>과 반복되는 간격</li><li>20년 끝부분에서 어느 방향으로 가고 있는지</li></ul><div className="observation-grid"><div className="table-head">관찰 항목</div><div className="table-head">γ = 0.60 → 0.75로 바꾸었을 때</div><label>포식자가 오르내리는 평균 수준</label><select value={answers.predatorObservation} onChange={(e) => setField('predatorObservation', e.target.value)}><option value="">선택</option><option>높아졌다</option><option>낮아졌다</option><option>큰 차이 없다</option></select><label>피식자가 오르내리는 평균 수준</label><select value={answers.preyObservation} onChange={(e) => setField('preyObservation', e.target.value)}><option value="">선택</option><option>높아졌다</option><option>낮아졌다</option><option>큰 차이 없다</option></select><label htmlFor="oscillation">진동의 모습</label><textarea id="oscillation" rows={3} value={answers.oscillationObservation} onChange={(e) => setField('oscillationObservation', e.target.value)} placeholder="최고점·최저점, 진동의 크기, 정점이 나타나는 시점을 두 그래프에서 비교해 적어 보세요." /></div>{answers.revealed && <div className="model-answer"><b>γ = 0.60과 γ = 0.75를 비교하면</b><p>γ는 포식자의 자연 사망률입니다. γ를 키우면 포식자가 늘어나기에 불리한 조건이 되고, 달라진 포식 압력이 피식자 개체군의 변화로 이어집니다. 이 활동의 조건(환경수용력 K가 포함된 확장 모형, 기본값 20년)에서는 피식자가 오르내리는 평균 수준은 높아지고 포식자가 오르내리는 평균 수준은 낮아지는 방향이 나타납니다. 다만 두 그래프가 처음부터 끝까지 단순히 위·아래로 옮겨지는 것은 아닙니다. 진동의 크기와 정점이 나타나는 시점도 함께 달라지므로 한 지점의 값이 아니라 20년 전체를 비교해야 합니다. 이 실험실은 같은 모형·같은 값·같은 초기 개체수에서 항상 같은 결과를 내므로, 두 그래프의 차이는 γ를 바꾼 효과로 해석할 수 있습니다.</p></div>}</fieldset>
              <fieldset className="question core-question"><legend><span>9</span>포식자의 사망률만 변화시켰는데 왜 피식자의 그래프도 변했을까요?</legend><p className="question-hint">이 활동의 핵심 문항입니다. 두 개체군을 서로 연결된 시스템으로 생각해 보세요.</p><label className="text-field"><textarea rows={5} value={answers.indirectReason} onChange={(e) => setField('indirectReason', e.target.value)} placeholder="포식 압력이라는 말을 사용해 설명해 보세요." /></label>{answers.revealed && <div className="model-answer emphasized"><b>핵심 해설</b><p>포식자와 피식자는 독립된 개체군이 아니라 서로 영향을 주는 시스템입니다. 포식자의 자연 사망률 변화는 포식 압력을 변화시키고, 그 결과 피식자의 개체수에도 간접적인 변화가 나타납니다. 이번 활동에서는 γ 외의 변인을 모두 고정했으므로, 두 그래프의 차이를 γ 변화의 효과와 연결해 해석할 수 있습니다.</p></div>}</fieldset>
              <details className="teacher-note">
                <summary><span>심화 · 교사용 해설 — 두 모형은 γ 변화를 다르게 예측합니다</span><i aria-hidden="true">⌄</i></summary>
                <div className="teacher-note-body">
                  <p>실험실에는 두 가지 모형이 있고, γ를 높였을 때의 <strong>장기적인 평형 해석이 서로 다릅니다.</strong> 그래서 활동 3에서는 확장 모형을 사용합니다.</p>
                  <div className="teacher-compare">
                    <div>
                      <b>Basic model (기본 Lotka-Volterra)</b>
                      <code>dN/dt = αN − βNP</code>
                      <code>N* = γ/δ,&nbsp;&nbsp;P* = α/β</code>
                      <p>기본값에서 N* = 0.60/0.02 = 30, P* = 0.8/0.04 = 20입니다. γ를 0.75로 올리면 <strong>N*는 37.5로 커지지만 P*는 20 그대로</strong>입니다. P*가 γ에 직접 의존하지 않기 때문입니다. 따라서 이 모형에서는 “γ가 커지면 포식자가 장기적으로 항상 줄어든다”고 말할 수 없습니다.</p>
                    </div>
                    <div>
                      <b>More realistic model (환경수용력 K 포함)</b>
                      <code>dN/dt = αN(1 − N/K) − βNP</code>
                      <code>N* = γ/δ,&nbsp;&nbsp;P* = (α/β)(1 − γ/(δK))</code>
                      <p>K = 180인 기본값에서 γ = 0.60이면 N* = 30, P* ≈ 16.7이고, γ = 0.75이면 N* = 37.5, P* ≈ 15.8입니다. 공존이 가능한 범위(γ/δ &lt; K)에서 γ가 커지면 <strong>피식자 평형은 올라가고 포식자 평형은 내려갑니다.</strong></p>
                    </div>
                  </div>
                  <p className="teacher-caution"><b>지도 시 유의점</b> 20년 구간에서 학생이 보는 것은 평형값 자체가 아니라 평형 주위의 감쇠 진동입니다. 이 기본값에서는 γ를 0.75로 올렸을 때 두 개체군의 진동 폭이 더 작아지고, 첫 정점은 조금 늦게 나타나지만 진동 주기 자체는 짧아지는 모습이 함께 나타납니다. 그래프가 처음부터 끝까지 단조롭게 오르내린다고 정리하지 말고, 평균 수준·진동의 크기·정점 시점을 각각 비교하도록 안내해 주세요. 또한 이 실험실은 난수를 쓰지 않는 결정론적 미분방정식 모형(RK4 수치 적분)이므로, 같은 조건에서는 반복 실행해도 결과가 달라지지 않습니다.</p>
                </div>
              </details>
            </div>
          </article>

          <article className="activity-card" id="activity-4">
            <ActivityHeader number={4} eyebrow="주장 평가" title="‘즉시 감소’라는 말을 검토해 보자" time="약 3분" />
            <blockquote className="claim">“포식자가 증가하기 시작하면 피식자는 <em>즉시</em> 감소하기 시작한다.”</blockquote>
            <div className="questions">
              <fieldset className="question"><legend><span>10</span>위 주장은 맞을까요?</legend><RadioCards name="instant-claim" value={answers.instantClaim} onChange={(value) => setField('instantClaim', value)} options={[{value:'true',label:'맞다'},{value:'false',label:'틀리다'}]} /><label className="text-field"><span>그래프 또는 개체군의 증가·감소량을 근거로 설명하세요.</span><textarea rows={4} value={answers.claimReason} onChange={(e) => setField('claimReason', e.target.value)} placeholder="두 집단이 동시에 증가하는 구간이 가능한지 생각해 보세요." /></label><button type="button" className="hint-button" aria-expanded={hintOpen} onClick={() => setHintOpen((open) => !open)}>{hintOpen ? '힌트 닫기' : '힌트 보기'} <span aria-hidden="true">{hintOpen ? '↑' : '↓'}</span></button>{hintOpen && <div className="hint-box">그래프에서 두 개체군이 동시에 증가하는 구간이 있는지 찾아보세요.</div>}<Feedback show={answers.revealed} correct={checks[6]}>포식자가 증가하더라도 피식자의 자체 증가량이 포식에 의한 감소량보다 크면 일정 기간 두 개체군이 동시에 증가할 수 있습니다. 따라서 ‘포식자 증가 → 피식자 즉시 감소’로만 해석해서는 안 됩니다.</Feedback></fieldset>
            </div>
          </article>

          <article className="activity-card" id="activity-5">
            <ActivityHeader number={5} eyebrow="개념 종합" title="하나의 설명으로 연결해 보자" time="약 3분" />
            <div className="questions">
              <fieldset className="question"><legend><span>11</span>다섯 단어를 모두 사용하여 개체수 변화를 2~3문장으로 설명하세요.</legend><div className="keyword-row" aria-label="반드시 사용할 단어"><span>피식자</span><span>포식자</span><span>먹이</span><span>시간 지연</span><span>음성 피드백</span></div><label className="text-field"><textarea rows={6} value={answers.synthesis} onChange={(e) => setField('synthesis', e.target.value)} placeholder="다섯 단어 사이의 인과 관계가 드러나도록 작성하세요." /></label>{answers.revealed && <div className="model-answer"><b>설명에 포함하면 좋은 개념</b><p>피식자가 늘면 포식자의 먹이가 풍부해지고, 시간 지연 뒤 포식자가 증가합니다. 늘어난 포식자는 피식자를 줄이고, 먹이가 부족해지면 다시 포식자가 줄어드는 음성 피드백이 나타납니다. 음성 피드백이 항상 일정한 개체수로 되돌아간다는 뜻은 아닙니다.</p></div>}</fieldset>
              <fieldset className="question"><legend><span>12</span>이 시뮬레이션의 그래프가 실제 자연에서도 똑같은 형태로 반복될까요?</legend><RadioCards name="nature" value={answers.natureSame} onChange={(value) => setField('natureSame', value)} options={[{value:'yes',label:'그렇다'},{value:'no',label:'그렇지 않다'}]} /><label className="text-field"><span>그렇게 생각한 이유 한 가지를 작성하세요.</span><textarea rows={3} value={answers.natureReason} onChange={(e) => setField('natureReason', e.target.value)} placeholder="실제 생태계와 단순화된 모델의 차이를 생각해 보세요." /></label>{answers.revealed && <div className="model-answer"><b>과학적 모델의 한계</b><p>실제 자연에는 기후, 질병, 서식지 변화, 다른 종과의 상호작용 등 많은 변수가 있습니다. 따라서 이상적인 모형처럼 완벽한 주기가 똑같이 반복되지는 않을 수 있습니다.</p></div>}</fieldset>
            </div>
          </article>

          <section className="finish-card" id="answer-summary">
            <div><p className="activity-kicker">활동 마무리</p><h2>답안을 확인하고 생각을 다듬어 보세요.</h2><p>버튼을 누르면 객관식·순서 배열·빈칸은 확인 결과를, 서술형은 핵심 개념을 보여줍니다. 작성한 답변은 그대로 유지됩니다.</p></div>
            {!answers.revealed ? <button type="button" className="reveal-button" onClick={revealAnswers}>답안 확인하기 <span aria-hidden="true">→</span></button> : <div className="score-summary"><span>핵심 문항</span><b>7개 중 {score}개 확인</b><small>점수가 아니라 다시 살펴볼 곳을 찾는 안내입니다.</small></div>}
          </section>
          <AdvancedChallenge
            answers={answers}
            checks={advancedChecks}
            open={advancedOpen}
            onToggle={() => setAdvancedOpen((previous) => !previous)}
            onChange={setAdvancedField}
            onReveal={revealAdvancedAnswers}
          />
          <footer><p>이 학습지는 시뮬레이션 결과를 해석하기 위한 활동지입니다. 시뮬레이션은 현실 생태계를 단순화한 수학적 모델입니다.</p><button type="button" onClick={resetWorksheet}>학습지 초기화</button></footer>
        </section>
      </div>
    </main>
  );
}
