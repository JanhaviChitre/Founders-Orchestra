process.env.TAVILY_API_KEY = 'test';
const { TavilySearch } = require('@langchain/tavily');
const { z } = require('zod');

const tool = new TavilySearch({
  maxResults: 5,
  searchDepth: "advanced",
});

console.log('Original properties:', Object.keys(tool.schema.shape));

tool.schema = z.object({
  query: z.string().describe("The search query to look up information for."),
});

console.log('Overridden properties:', Object.keys(tool.schema.shape));
