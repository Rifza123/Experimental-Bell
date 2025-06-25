async function EncryptJs(code) {
  try {
    let res = await fetch(
      `${api.xterm.url}/api/tools/js-protector?code=${encodeURIComponent(code)}&key=${api.xterm.key}`
    ).then((response) => response.json());
    return res;
  } catch (e) {
    console.error('Error in encrypt.js :' + e.message);
    return 'Err';
  }
}

export { EncryptJs };
