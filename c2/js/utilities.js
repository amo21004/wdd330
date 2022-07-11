function qs(selector) {
  return document.querySelector(selector);
}

function qsa(selector) {
  return document.querySelectorAll(selector);
}

function ce(tag) {
  return document.createElement(tag);
}

function lsr(key) {
  return localStorage.getItem(key);
}

function lsw(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function ael(selector, event, listener) {
  let element;

  if (typeof selector === 'string') {
    element = qs(selector);
  }
  else {
    element = selector;
  }

  element.addEventListener(event, listener);
}

function aela(selector, event, listener) {
  const elements = qsa(selector);

  [...elements].forEach(function (element) {
    element.addEventListener(event, listener);
  });
}

async function get_cached_data(name, url) {
  const storage = await caches.open(name);

  const response = await storage.match(url);

  if (!response || !response.ok) {
    return false;
  }

  return await response.json();
}

async function add_cached_data(name, url) {
  const cache = await caches.open(name);

  await cache.add(url);

  return await get_cached_data(name, url);
}

export { qs, qsa, ce, lsr, lsw, ael, aela, get_cached_data, add_cached_data };