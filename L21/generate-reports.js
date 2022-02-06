const config = require('./config.json');
const ld = require('lodash');

function getHeapTotal() {
    const used = process.memoryUsage();
    return used.heapUsed;
}

function measureExecutionNanoSec(func) {
    const start = process.hrtime();
    func();
    const stop = process.hrtime(start)
    const endTimeNanos = (stop[0] * 1e9 + stop[1]);

    return endTimeNanos;
}

const stats = [];

for (const configEntry of config) {
    // enforce grabage collection
    gc();

    const Executor = require(configEntry.path).Executor;

    const internalStats = [];

    for (let i = 0; i < 1000; i++) {
        const heapUsedBefore = getHeapTotal();
        const executor = Executor.create();
        executor.init(configEntry.initArg);
        const time = measureExecutionNanoSec(() => executor.exec(configEntry.execArg));

        const heapUsedAfter = getHeapTotal();
        const heapDelta = heapUsedAfter - heapUsedBefore;
        internalStats.push({ time, heapDelta });
    }

    const timeMean = ld.meanBy(internalStats, 'time');
    const heapDeltaMean = ld.meanBy(internalStats, 'heapDelta');

    stats.push({
        size: configEntry.initArg,
        ['time (mean), nanosec']: timeMean,
        ['heap delta (mean), KB']: heapDeltaMean / 1024,
    });
}

console.table(stats);
