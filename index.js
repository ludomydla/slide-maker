const FS = require("fs");

let parser = {
  parseSlides: function(text) {
    let regex = /\-\-\-/g;
    return ("<div class='screen'>" + text + "</div>").replace(
      regex,
      "</div><div class='screen'>"
    );
  },

  parseHeadings: function(text) {}
};

function runParser(text, cbParser) {
  return cbParser(text);
}

(function slideMaker() {
  // Read args for file path
  const fileName = process.argv[2];
  let content = FS.readFileSync(fileName, { encoding: "utf-8" });

  content = runParser(content, parser.parseSlides);
  console.log(content);
})();
