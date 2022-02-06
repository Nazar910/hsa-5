function trackMemoryUsage() {
    const used = process.memoryUsage();
    for (let key in used) {
        console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
    }
}

function a() {
    trackMemoryUsage();
    const arr = [1, 2, 3, 4, 5, 6, 9, 7, 8, 9, 10];
    trackMemoryUsage();
    arr.reverse();
    trackMemoryUsage();
}


trackMemoryUsage();
