async function ai(body) {
  try {
    let res = await fetch(
      `${api.xterm.url}/api/chat/logic-bell?key=${api.xterm.key}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );
    return await res.json();
  } catch (e) {
    console.error('Error in reasoner.js: ' + e.message);
    return {};
  }
}

export { ai };
