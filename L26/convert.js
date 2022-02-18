const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '/images/example.jpg');
const outputPath = path.join(__dirname, '/images/example-output.png');

function main() {
    fs.createReadStream(inputPath)
        .pipe(fs.createWriteStream(outputPath));
}

main();
