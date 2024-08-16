async function EncryptJs(code) {
  let res = await fetch(`${api.xterm.url}/api/tools/js-protector?code=${encodeURIComponent(code)}&key=${api.xterm.key}`)
  .then(response => response.json());
  return res
}

export { EncryptJs }