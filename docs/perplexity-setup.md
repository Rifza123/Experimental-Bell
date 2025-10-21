# Perplexity AI Command Setup

This document explains how to set up and use the Perplexity AI command in Experimental-Bell.

## Setup Instructions

### 1. Get a Perplexity API Key

You need to obtain an API key from Perplexity AI:

1. Visit [Perplexity AI](https://www.perplexity.ai/)
2. Create an account or log in
3. Navigate to the API section and generate an API key

### 2. Configure the API Key

You have two options to configure the API key:

#### Option 1: Environment Variable

Set the `PERPLEXITY_API_KEY` environment variable before starting the bot:

```bash
export PERPLEXITY_API_KEY="your-api-key-here"
npm start
```

#### Option 2: API Configuration

Add the Perplexity API key to your API configuration file:

```javascript
// In your API configuration file
module.exports = {
  // Other API configurations...
  perplexity: {
    key: "your-api-key-here"
  }
};
```

## Usage

Once configured, you can use the Perplexity AI command with:

```
.perplexity [your question or prompt]
```

or the shorter alias:

```
.pplx [your question or prompt]
```

## Features

- Uses Perplexity's "sonar-medium-online" model
- Provides up-to-date information through Perplexity's search capabilities
- Generates detailed, well-researched responses

## Troubleshooting

If you encounter an error message stating that the API key is not configured, make sure you've correctly set up the API key using one of the methods above.

If you experience other issues, check the console logs for more detailed error messages.