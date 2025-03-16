import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbService } from './services/database.js';
import { twilioService } from './services/twilio.js';
import { langchainService } from './services/langchain.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/calls', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const call = await dbService.createCall({ phoneNumber });

    const callbackUrl = `${process.env.BASE_URL}/api/calls/${call.id}/webhook`;
    await twilioService.makeCall(phoneNumber, callbackUrl);

    res.json(call);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/calls', async (req, res) => {
  try {
    const calls = await dbService.getAllCalls();
    res.json(calls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/calls/:id', async (req, res) => {
  try {
    const call = await dbService.getCall(req.params.id);
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }
    res.json(call);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/calls/:id/process', async (req, res) => {
  try {
    const { id } = req.params;
    const { userResponse } = req.body;
    
    const call = await dbService.getCall(id);
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    // Analyze sentiment
    const analysis = await langchainService.analyzeSentiment(userResponse);
    
    // Add user response to transcript
    await dbService.addTranscriptEntry(id, {
      role: 'human',
      content: userResponse,
      sentiment: analysis.sentiment
    });

    // Generate AI response
    const aiResponse = await langchainService.generateResponse(
      call.transcript,
      userResponse
    );

    // Add AI response to transcript
    await dbService.addTranscriptEntry(id, {
      role: 'ai',
      content: aiResponse
    });

    // Handle follow-up if needed
    if (analysis.nextAction === 'schedule-followup') {
      const followUpDate = new Date();
      followUpDate.setDate(followUpDate.getDate() + 3);
      await dbService.updateCall(id, {
        nextFollowUpDate: followUpDate
      });
    }

    res.json({
      message: aiResponse,
      sentiment: analysis.sentiment,
      nextAction: analysis.nextAction
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/calls/:id/webhook', async (req, res) => {
  try {
    const { id } = req.params;
    const { CallStatus } = req.body;

    let status;
    switch (CallStatus) {
      case 'initiated':
        status = 'pending';
        break;
      case 'ringing':
      case 'in-progress':
        status = 'in-progress';
        break;
      case 'completed':
        status = 'completed';
        break;
      default:
        status = 'failed';
    }

    await dbService.updateCall(id, { status });

    const twiml = new twilio.twiml.VoiceResponse();
    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send();
  }
});

app.post('/calls/search', async (req, res) => {
  try {
    const { query } = req.body;
    const results = await dbService.searchCalls(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});