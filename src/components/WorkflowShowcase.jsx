import { useEffect, useMemo, useState } from 'react';
import { PauseIcon, PlayIcon } from './WorkspaceIcons';

const STEP_DURATION = 5000;

export default function WorkflowShowcase({ t }) {
  const steps = useMemo(() => Array.isArray(t.flowSteps) ? t.flowSteps : [], [t.flowSteps]);
  const [activeStep, setActiveStep] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycleKey, setCycleKey] = useState(0);
  const current = steps[activeStep] || steps[0];

  useEffect(() => {
    if (!steps.length || paused) return undefined;
    const timer = window.setTimeout(() => {
      setActiveStep((index) => (index + 1) % steps.length);
      setCycleKey((value) => value + 1);
    }, STEP_DURATION);
    return () => window.clearTimeout(timer);
  }, [activeStep, paused, steps.length, cycleKey]);

  if (!current) return null;

  const selectStep = (index) => {
    setActiveStep(index);
    setCycleKey((value) => value + 1);
  };

  return (
    <section id="workflow-demo" className="section workflow-showcase-section">
      <div className="container workflow-showcase-container">
        <div className="workflow-showcase-copy workflow-showcase-copy-centered">
          <h2>{t.flowTitle}</h2>
          {t.flowDesc && <p>{t.flowDesc}</p>}
        </div>

        <div className="workflow-demo-shell animate-on-scroll">
          <button
            type="button"
            className="workflow-play-toggle"
            aria-label={paused ? t.flowPlay : t.flowPause}
            title={paused ? t.flowPlay : t.flowPause}
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? <PlayIcon size={18} /> : <PauseIcon size={18} />}
          </button>

          <div className="workflow-demo-tabs" role="tablist" aria-label={t.flowTitle}>
            {steps.map((step, index) => (
              <button
                key={`${step.time}-${step.title}`}
                type="button"
                className={index === activeStep ? 'workflow-demo-tab active' : 'workflow-demo-tab'}
                onClick={() => selectStep(index)}
                role="tab"
                aria-selected={index === activeStep}
              >
                <span>{step.time}</span>
                <strong>{step.title}</strong>
                {index === activeStep && !paused && <i key={`${cycleKey}-${index}`} className="workflow-tab-progress" aria-hidden="true" />}
              </button>
            ))}
          </div>

          <div className="workflow-demo-stage workflow-demo-stage-minimal" key={`${activeStep}-${cycleKey}`}>
            <span className="workflow-stage-kicker">{current.kicker}</span>
            <h3>{current.heading}</h3>
            <strong className="workflow-stage-primary">{current.primary}</strong>
            <p>{current.description}</p>
            {(current.facts || []).length > 0 && (
              <div className="workflow-stage-facts">
                {(current.facts || []).slice(0, 2).map((fact) => (
                  <span key={`${fact.label}-${fact.value}`}><b>{fact.label}</b>{fact.value}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
