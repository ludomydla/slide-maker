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
    return text;
  },

  parseImages: function(text) {
    let regex = /!\[(.*?)\]\((.+?)\)/gi;
    text = text.replace(regex, '<img href="$2" alt="$1">');
    return text;
  },
  parseLinks: function(text) {
    let regex = /\[(.+?)\]\((.+?)\)/gi;
    text = text.replace(regex, '<a href="$2">$1</a>');
    return text;
  },
  parseListItems: function(text) {
    let regexLi = /^(\d+.|\*|\+|-) (.*)$/gim;
    let regexIsUl = /\*|\+|-/;
    text = text.replace(regexLi, function(match, p1, p2) {
      let wrapperTags = regexIsUl.test(p1)
        ? ["<ul>", "</ul>"]
        : ["<ol>", "</ol>"];
      return `${wrapperTags[0]}<li>${p2}</li>${wrapperTags[1]}`;
    });
    return text;
  },
  parseOLsULs: function(text) {
    let regexRemoveOL = /<\/ol>(\r\n|\n)<ol>/gims;
    let regexRemoveUL = /<\/ul>(\r\n|\n)<ul>/gims;
    text = text.replace(regexRemoveOL, "$1");
    text = text.replace(regexRemoveUL, "$1");
    return text;
  },
  parseParagraphs: function(text) {
    let regex = /^(\w.*$)/gim;
    text = text.replace(regex, "<p>$1</p>");
    return text;
  },
  parsePre: function(text) {
    let regexRemovePre = /<\/pre>(\r\n|\n)<pre>/gims;
    text = text.replace(regexRemovePre, "$1");
    return text;
  },
  parseSlides: function(text) {
    let regex = /^---(.*)/gim;
    text = text.replace(regex, '</div><div class="screen $1">');
    return text;
  },
  cleanHtml: function(text) {
    if (text.indexOf("</div>") == 0) {
      text = text.substring(6);
    } else {
      text = '<div class="screen">\n' + text;
    }

    return text + "</div>";
  }
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
  content = runParser(content, parser.parseImages);
  content = runParser(content, parser.parseLinks);
  content = runParser(content, parser.parseListItems);
  content = runParser(content, parser.parseOLsULs);
  content = runParser(content, parser.parseParagraphs);
  content = runParser(content, parser.parsePre);
  content = runParser(content, parser.parseSlides);
  content = runParser(content, parser.cleanHtml);

  FS.writeFileSync("test.html", content, { encoding: "utf-8" });
})();
