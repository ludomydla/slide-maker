const FS = require("fs");
const MDtoHTML = require("./md2html");

(function slideMaker() {
  // Read args for file path
  const fileName = process.argv[2];
  let content = FS.readFileSync(fileName, { encoding: "utf-8" });

  content = MDtoHTML(content);

  FS.writeFileSync("test.html", content, { encoding: "utf-8" });
})();
