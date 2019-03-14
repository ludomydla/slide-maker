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
