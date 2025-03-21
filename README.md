# AI Cold Calling Agent (LangDB AI Buildathon)

🚀 An AI-powered cold calling agent using **Express, React (TypeScript), Node.js, LangChain (Gemini API), and LangDB** to automate sales and customer interactions.

## Features
✅ AI-powered conversations using **LangChain + Gemini API**  
✅ Call transcript storage & retrieval using **a dedicated database**  
✅ Real-time call monitoring with **React + TypeScript UI**  
✅ Sentiment analysis & lead classification  
✅ Twilio integration for voice calls  
✅ Auto follow-up scheduling  

## Tech Stack
- **Frontend**: React + TypeScript
- **Backend**: Express + Node.js
- **AI Layer**: LangChain + Gemini API
- **AI Gateway**: LangDB (for enhanced AI interactions)
- **Database**: MongoDB / PostgreSQL (for call transcript storage)
- **VoIP**: Twilio (for real calls), Coqui TTS - voice training

## Project Structure
```
Backend (server/)

models/Call.js: Defines the call schema (if using a database).
services/:
database.js: Handles database connection.
langchain.js: Manages AI interactions with LangChain + Gemini API.
twilio.js: Integrates Twilio for voice calls.
index.js: Likely the main Express server.
Frontend (src/)

components/CallDashboard.tsx: UI for monitoring live calls.
services/api.ts: Handles API calls to the backend.
types/Call.ts: Defines TypeScript interfaces for calls.
vite-env.d.ts: Vite environment configuration.
Config & Environment Files

.env.example: Example for environment variables.
.gitignore: Ensures sensitive files aren’t pushed to GitHub.
tailwind.config.js: Tailwind CSS setup.
tsconfig.json: TypeScript configuration.
eslint.config.js: Ensures clean coding standards.
```

## Installation
### Backend Setup
```sh
cd backend
npm install
npm start
```

### Frontend Setup
```sh
cd frontend
npm install
npm start
```

## Usage
1. Start the backend server.
2. Start the frontend app.
3. Use the dashboard to monitor AI calls in real-time.

## Future Enhancements
- 🔹 Multi-language support
- 🔹 More AI-driven insights
- 🔹 CRM integration

