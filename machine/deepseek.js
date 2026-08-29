export async function deepseek(prompt, options = {}) {
  let body = Array.isArray(prompt)
    ? { messages: prompt, ...options }
    : typeof prompt === 'object' && prompt !== null && prompt.messages
      ? { ...prompt, ...options }
      : {
          messages: [
            {
              role: 'user',
              content: String(prompt),
            },
          ],
          ...options,
        };
  let res = await fetch(
    `${api.xterm.url}/api/chat/deepseek?key=${api.xterm.key}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );
  return await res.json();
}
