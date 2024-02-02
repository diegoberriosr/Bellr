
const CircleProgressBar = ({ percentage, circleWidth}) => {

    const radius = circleWidth * 0.50;
    const circumference  = 2 * radius * Math.PI;
    const strokeWidth = 2;
    const width = circleWidth+strokeWidth;

    let progressColor;

    if (percentage < 75) {
        progressColor = '#1D9BF0';
    }
    else if (percentage >= 75 && percentage < 90) {
        progressColor = 'yellow';
    }
    else if (percentage>=90 && percentage < 100) {
        progressColor = 'orange';
    }
    else {
        progressColor = 'red';
    }

    return <div className='transition-all transition-colors'>
        <svg width={circleWidth} height={circleWidth} viewBox={`0 0 ${width} ${width}`}>
            <circle cx={width/2} cy={width/2} r={radius} fill='none' stroke='#536471' stroke-width={strokeWidth}/>
            <circle cx={width/2} cy={width/2} r={radius} fill='none' stroke={progressColor} stroke-dasharray={circumference} stroke-dashoffset={circumference * ((100 - percentage)/100)}/>
        </svg>
        
    </div>
};

export default CircleProgressBar