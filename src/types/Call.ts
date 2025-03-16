export interface Call {
  id: string;
  phoneNumber: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  transcript: Message[];
  createdAt: Date;
  updatedAt: Date;
  nextFollowUpDate?: Date;
  notes?: string;
}

export interface Message {
  id: string;
  role: 'ai' | 'human';
  content: string;
  timestamp: Date;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface CallResponse {
  message: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  nextAction: 'continue' | 'end-call' | 'schedule-followup';
  suggestedResponse?: string;
}