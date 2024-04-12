const { exec } = require("child_process");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const chmodAsync = promisify(fs.chmod);

const scriptName = "create-node-app.sh";
const scriptURL = "https://raw.githubusercontent.com/Sushil2308/create-node-project/main/create-node-app.sh";
const scriptPath = path.join(__dirname, scriptName);

// Download the shell script from GitHub
const file = fs.createWriteStream(scriptPath);
https.get(scriptURL, (response) => {
  response.pipe(file);
  file.on("finish", () => {
    file.close(() => {
      chmodAsync(scriptPath, "755")
        .then(() => {
          let appName = process.argv[2] || "app";
          console.log("Creating Node.js application:", appName);
          exec(`${scriptPath} ${appName}`, (error, stdout, stderr) => {
            if (error) {
              console.error(`Something might be wrong: ${error}`);
              return;
            }
            console.log(`Successfully created Node.js application: ${appName}`);
            fs.unlink(scriptPath, (err) => {
              if (err) {
                console.error("Something might be wrong.");
                return;
              }
            });
          });
        })
        .catch((err) => {
          console.error("Something might be wrong.");
        });
    });
  });
}).on("error", (err) => {
  console.error("Something might be wrong.");
});
