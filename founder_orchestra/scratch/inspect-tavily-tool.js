process.env.TAVILY_API_KEY = 'test';
const { TavilySearch } = require('@langchain/tavily');

const tool = new TavilySearch({
  maxResults: 5,
  searchDepth: "advanced",
});
console.log('Tool name:', tool.name);
console.log('Tool description:', tool.description);
console.log('Tool schema:', tool.schema);
console.log('Properties:', Object.keys(tool.schema?.shape || {}));
if (tool.schema?.shape) {
  console.log('topic schema:', tool.schema.shape.topic);
}
