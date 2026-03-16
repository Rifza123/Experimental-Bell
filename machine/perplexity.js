export async function perplexity(prompt) {
  try {
    // Use the API key from environment variables or configuration
    // The API key should be configured in the bot's environment
    const API_KEY = process.env.PERPLEXITY_API_KEY || api.perplexity?.key;
    
    if (!API_KEY) {
      return {
        response: "Error: Perplexity API key not configured. Please set the PERPLEXITY_API_KEY environment variable or add it to your API configuration.",
      };
    }
    
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "sonar-medium-online",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1024,
        temperature: 0.7,
        stream: false
      })
    });
    
    const data = await response.json();
    return {
      response: data.choices[0].message.content,
      usage: data.usage
    };
  } catch (e) {
    console.error('Error in perplexity.js: ' + e.message);
    return {
      response: "Sorry, I encountered an error while processing your request.",
      error: e.message
    };
  }
}