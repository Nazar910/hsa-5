const config = require('./reports-config.json');
const ld = require('lodash');
const { Executor } = require('./executor');

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

    const internalStats = [];

    for (let i = 0; i < 100; i++) {
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
        ['search duration (mean), nanosec']: timeMean,
        ['heap delta (mean), KB']: Math.round(heapDeltaMean / 1024 * 100) / 100,
    });
}

console.table(stats);
