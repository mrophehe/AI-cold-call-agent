import { LangDB } from 'langdb';

const db = new LangDB({
  apiKey: process.env.LANGDB_API_KEY,
  namespace: 'ai-cold-calling'
});

const CALLS_COLLECTION = 'calls';

export const dbService = {
  async createCall(callData) {
    const call = {
      ...callData,
      createdAt: new Date(),
      updatedAt: new Date(),
      transcript: [],
      status: 'pending'
    };

    const result = await db.add(CALLS_COLLECTION, call);
    return { ...call, id: result.id };
  },

  async getAllCalls() {
    const calls = await db.query(CALLS_COLLECTION, {}, { sortBy: 'createdAt', sortOrder: 'desc' });
    return calls.map(call => ({
      ...call,
      createdAt: new Date(call.createdAt),
      updatedAt: new Date(call.updatedAt)
    }));
  },

  async getCall(id) {
    const call = await db.get(CALLS_COLLECTION, id);
    return call ? {
      ...call,
      createdAt: new Date(call.createdAt),
      updatedAt: new Date(call.updatedAt)
    } : null;
  },

  async updateCall(id, update) {
    const call = await this.getCall(id);
    if (!call) {
      throw new Error('Call not found');
    }

    const updatedCall = {
      ...call,
      ...update,
      updatedAt: new Date()
    };

    await db.update(CALLS_COLLECTION, id, updatedCall);
    return updatedCall;
  },

  async addTranscriptEntry(id, entry) {
    const call = await this.getCall(id);
    if (!call) {
      throw new Error('Call not found');
    }

    const transcript = [...(call.transcript || []), {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date()
    }];

    return this.updateCall(id, { transcript });
  },

  async searchCalls(query) {
    return db.search(CALLS_COLLECTION, query);
  }
};