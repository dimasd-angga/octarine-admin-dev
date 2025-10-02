import './ProgressTracker.scss';

export default function ProgressTracker({ currentStep }) {
    const steps = [25, 50, 100, 125, 150, 175, 200, 225];
    return (
        <div className="progress-wrapper">
            <div className="progress-tracker">

                {steps.map((step, index) => {
                    const isCompleted = step < currentStep;
                    const isCurrent = step === currentStep;
                    const isLast = index === steps.length - 1;

                    return (
                        <div className="step" key={step}>
                            {/* Leading line only for the first step */}
                            {index === 0 && (
                                <div className={`edge-line start ${step <= currentStep ? 'completed' : 'pending'}`} />
                            )}

                            <div className={`circle ${isCompleted || isCurrent ? 'completed' : 'pending'}`} />

                            {/* Line to next step */}
                            {!isLast && (
                                <div className={`line ${step < currentStep ? 'completed' : 'pending'}`} />
                            )}

                            {/* Trailing line only for the last step */}
                            {isLast && (
                                <div className={`edge-line end ${step < currentStep ? 'completed' : 'pending'}`} />
                            )}

                            <div className="label">{step}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

}