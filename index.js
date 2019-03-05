const FS = require("fs");

let parser = {
  parseSlides: function(text) {
    let regex = /\-\-\-(\w*)/g;
    return ("<div class='screen'>" + text + "</div>").replace(
      regex,
      "</div><div class='screen'>"
    );
  },

  parseHeadings: function(text) {
    // find all types of headings h1-h6
    let regex = /^\s*(#{1,6}[^#].*)$/gim;
  }
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
