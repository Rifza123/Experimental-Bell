export async function gpt(prompt) {
  try {
    let res = await fetch(
      `${api.xterm.url}/api/chat/gpt?key=${api.xterm.key}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      }
    );
    return await res.json();
  } catch (e) {
    console.error('Error in gpt3.js: ' + e.message);
    return {};
  }
}
