const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'outputs');

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath) => {
    const jobId = path.basename(filepath).split('.')[0];
    const outPath = path.join(outputPath, `${jobId}.out`);

    return new Promise((resolve, reject) => {
        const command = `g++ "${filepath}" -o "${outPath}" && cd "${outputPath}" && ./${jobId}.out`;
        exec(command, 
            (error, stdout, stderr) => {
                if (error) {
                    console.error("Execution error:", error); // Log error
                    return reject({ error, stderr });
                }

                if (stderr) {
                    console.warn("Execution warning:", stderr); // Log warnings
                }

                resolve(stdout);
            }
        );
    });
};

module.exports = {
    executeCpp
};
