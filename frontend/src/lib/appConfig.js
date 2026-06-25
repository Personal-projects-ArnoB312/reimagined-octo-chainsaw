export const APP_CONFIG = {
  research: {
    // Max number of distinct Tavily search queries fired per skill.
    maxSearchQueriesPerSkill: 2,
    tavilyMaxResultsPerQuery: 5,
    tavilySearchDepth: "advanced",
  },
  kv: {
    feedKey: "daily_learning_feed",
  },
  anthropic: {
    model: "claude-sonnet-4-6",
    maxTokens: 700,
  },
};
