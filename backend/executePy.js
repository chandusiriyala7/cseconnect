const { exec } = require('child_process');

 
const executePy = (filepath) => {

    return new Promise((resolve, reject) => {
        const command = `python3 "${filepath}"`;
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
    executePy
};
