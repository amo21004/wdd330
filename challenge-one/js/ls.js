function read(key) {
  return localStorage.getItem(key);
}

function write(key, value) {
  localStorage.setItem(key, value);
}

export { read, write };
