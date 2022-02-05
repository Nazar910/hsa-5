const { execSync } = require('child_process');

function gnuPlotCmd(testCase, maxTimeRange) {
    execSync(`gnuplot -e 'set term png; set xlabel "Dataset size"; set ylabel "Time, nanosec"; set yrange [0:${maxTimeRange}]; plot "./results/${testCase}.dat" with l' > ./results/${testCase}.png`);
}

function measureExecutionNanoSec(func) {
    const start = process.hrtime();
    func();
    const stop = process.hrtime(start)
    const endTimeNanos = (stop[0] * 1e9 + stop[1]);

    return endTimeNanos;
}

function clearFile(file) {
    execSync(`echo '' > ${file}`);
}

function randomNumber(size) {
    return Math.floor(Math.random() * size + 1);
}

module.exports = {
    gnuPlotCmd,
    measureExecutionNanoSec,
    clearFile,
    randomNumber
};
