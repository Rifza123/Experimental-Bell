export async function deepseek(prompt) {
  try {
    let res = await fetch(
      `${api.xterm.url}/api/chat/deepseek?key=${api.xterm.key}`,
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
    console.error('Error in deepseek.js: ' + e.message);
    return {};
  }
}
