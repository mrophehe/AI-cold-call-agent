import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const llm = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4',
  temperature: 0.7
});

const coldCallPrompt = PromptTemplate.fromTemplate(`
You are an AI sales agent making a cold call. Based on the conversation history and the prospect's latest response, generate an appropriate response.

Conversation History:
{history}

Prospect's Latest Response: {latestResponse}

Generate a natural, professional response that:
1. Acknowledges the prospect's input
2. Addresses any concerns
3. Moves the conversation forward
4. Maintains a friendly but professional tone

Response:
`);

const sentimentPrompt = PromptTemplate.fromTemplate(`
Analyze the following response for sentiment and next actions:

Response: {response}

Provide a JSON object with:
1. sentiment: "positive", "negative", or "neutral"
2. nextAction: "continue", "end-call", or "schedule-followup"
3. reason: Brief explanation for the classification
`);

export const langchainService = {
  async generateResponse(history, latestResponse) {
    const chain = coldCallPrompt
      .pipe(llm)
      .pipe(new StringOutputParser());

    const response = await chain.invoke({
      history: history.map(m => `${m.role}: ${m.content}`).join('\n'),
      latestResponse
    });

    return response;
  },

  async analyzeSentiment(response) {
    const chain = sentimentPrompt
      .pipe(llm)
      .pipe(new StringOutputParser());

    const analysis = await chain.invoke({ response });
    return JSON.parse(analysis);
  }
};