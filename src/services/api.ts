import axios from 'axios';
import type { Call, CallResponse } from '../types/Call';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
  async initiateCall(phoneNumber: string): Promise<Call> {
    const response = await axios.post(`${API_URL}/calls`, { phoneNumber });
    return response.data;
  },

  async getCallHistory(): Promise<Call[]> {
    const response = await axios.get(`${API_URL}/calls`);
    return response.data;
  },

  async updateCall(callId: string, update: Partial<Call>): Promise<Call> {
    const response = await axios.patch(`${API_URL}/calls/${callId}`, update);
    return response.data;
  },

  async processResponse(callId: string, userResponse: string): Promise<CallResponse> {
    const response = await axios.post(`${API_URL}/calls/${callId}/process`, {
      userResponse
    });
    return response.data;
  }
};