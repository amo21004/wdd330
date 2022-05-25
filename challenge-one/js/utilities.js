function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return document.querySelectorAll(selector);
}

function ce(tag) {
  return document.createElement(tag);
}

export { qs, qsa, ce };
