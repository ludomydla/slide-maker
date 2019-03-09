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
  },
  makeHtml: function(text) {
    return (
      '<!DOCTYPE html><html><head><meta charset="utf-8">' +
      styles +
      "</head><body>" +
      `<button class="ctrls" id="btnBck">&lt;</button>
      <button class="ctrls" id="btnFwd">&gt;</button>` +
      text +
      scripts +
      "</body></html>"
    );
  }
};

let styles = `
<style>
  body { font-family: "Arial", sans-serif; }
  .screen {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    position: fixed;
    text-align: center;
    display: none;
  }
  
  .screen:first-of-type {
    display:block;
  }

  .ctrls {
    position: fixed;
    bottom: .2em;
    left: 50%;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 0 1.5em;
    line-height: 2em;
    height: 2em;
    background-color: rgba(255,255,255, .3);
    font-weight: bold;
    font-size: .75em;
    cursor: pointer;
    opacity: 0.1;
    transition: opacity .75s;
    z-index: 100;
  }
  
  .ctrls:hover {
    opacity: 1;
  }
  
  button:focus {outline:0;}
  
  #btnBck {
    transform: translateX(-100%);
  }
</style>
`;

let scripts = `
<script>
const $ = function(selector) {
  let result = document.querySelectorAll(selector);
  if (result.length > 1) return result;
  else if (result.length == 1) return result[0];
  else return null;
};

const hide = function(el) {
  el.style.display = "none";
};

const show = function(el) {
  el.style.display = "block";
};

let actualSlide = $(".screen")[0];

function goNext() {
  let next = actualSlide.nextElementSibling;
  if (
    next &&
    next.tagName === "DIV" &&
    next.className.indexOf("screen") != -1
  ) {
    hide(actualSlide);
    show(next);
    actualSlide = next;
  }
}

function goPrev() {
  let prev = actualSlide.previousElementSibling;
  if (
    prev &&
    prev.tagName === "DIV" &&
    prev.className.indexOf("screen") != -1
  ) {
    hide(actualSlide);
    show(prev);
    actualSlide = prev;
  }
}

document.addEventListener("DOMContentLoaded", function() {
  window.addEventListener("keydown", function(ev) {
    switch (ev.which) {
      case 37:
      case 38:
        goPrev();
        break;
      case 39:
      case 40:
        goNext();
        break;
    }
  });

  $("#btnBck").addEventListener("click", goPrev);

  $("#btnFwd").addEventListener("click", goNext);
});
</script>
`;

function runParser(text, cbParser) {
  return cbParser(text);
}

function md2html(content) {
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
  content = runParser(content, parser.makeHtml);
  return content;
}

module.exports = md2html;
