const FS = require("fs");

let parser = {
  parseItalics: function(text) {
    let regexUnderscore = /([^_])_([^_|^\s].*[^_|^\s])_([^_])/gim;
    let regexAsterisk = /([^\*])\*([^\*|^\s].*[^\*|^\s])\*([^\*])/gim;
    text = text.replace(regexUnderscore, "$1<i>$2</i>$3");
    text = text.replace(regexAsterisk, "$1<i>$2</i>$3");
    return text;
  },

  parseBold: function(text) {
    let regexUnderscore = /([^_])__([^_|^\s].*[^_|^\s])__([^_])/gim;
    let regexAsterisk = /([^\*])\*\*([^\*|^\s].*[^\*|^\s])\*\*([^\*])/gim;
    text = text.replace(regexUnderscore, "$1<b>$2</b>$3");
    text = text.replace(regexAsterisk, "$1<b>$2</b>$3");
    return text;
  },

  parseHeadings: function(text) {
    // find all types of headings h1-h6
    let regex = /^(\s)\s*(#{1,6})\s*(.*)(\s)$/gim;
    text = text.replace(regex, function(match, p1, p2, p3, p4) {
      let level = p2.length;
      return `${p1}<h${level}>${p3}</h${level}>${p4}`;
    });
    return text;
  },

  parseCodeInline: function(text) {
    let regex = /\`(.*)\`/gim;
    text = text.replace(regex, "<code>$1</code>");
    return text;
  },

  parseCodeBlock: function(text) {
    let regex = /^ {4}(.*)/gim;
    text = text.replace(regex, "<pre>$1</pre>");
    // let regexRemovePres = /<\/pre>(.)<pre>/gims;
    // text = text.replace(regexRemovePres, "$1");
    return text;
  },

  parseLinks: function(text) {},
  parseImages: function(text) {},
  parseListItems: function(text) {},
  parseULs: function(text) {},
  parseOLs: function(text) {},
  parseSlides: function(text) {}
};

function runParser(text, cbParser) {
  return cbParser(text);
}

(function slideMaker() {
  // Read args for file path
  const fileName = process.argv[2];
  let content = FS.readFileSync(fileName, { encoding: "utf-8" });

  content = runParser(content, parser.parseItalics);
  content = runParser(content, parser.parseBold);
  content = runParser(content, parser.parseHeadings);
  content = runParser(content, parser.parseCodeInline);
  content = runParser(content, parser.parseCodeBlock);

  console.log(content);
})();
