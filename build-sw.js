const fs = require("fs");

fs.readFile("src/sw.js", { encoding: "utf8" }, (err, data) => {
  if (err) throw err;
  // append data to file
  const newData = `\n${data}`;
  fs.appendFile("build/service-worker.js", newData, "utf8", function (err) {
    if (err) throw err;
  });
});
