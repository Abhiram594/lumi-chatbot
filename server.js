import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { Resend } from 'resend';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const sessions = {};

function extractName(text) {
  const match = text.match(/(?:i am|i'm|my name is|call me)\s+([a-zA-Z\s]+)/i);
  if (match) return match[1].trim();
  if (text.split(' ').length <= 3) return text.trim();
  return text.split(' ')[0].trim();
}

function extractAge(text) {
  const match = text.match(/\b(\d{1,2}|1[0-1]\d)\b/);
  return match ? match[1] : null;
}

function extractEmail(text) {
  const match = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  return match ? match[0] : null;
}

app.post('/api/chat', async (req, res) => {
  try {
    let { sessionId, message } = req.body;
    
    if (!sessionId || !sessions[sessionId]) {
      sessionId = sessionId || uuidv4();
      sessions[sessionId] = {
        history: [],
        data: { name: null, age: null, location: null, email: null, grievance: null },
        phase: 1,
        completed: false,
        emailSent: false
      };
    }

    const session = sessions[sessionId];

    if (session.completed) {
      return res.json({ 
        sessionId, 
        response: "I've already sent your message. If you need anything else, feel free to refresh and start a new chat!",
        isComplete: true
      });
    }

    session.history.push({ role: 'user', parts: [{ text: message }] });

    let finalResponse = "";

    if (session.phase === 1) {
      const askedName = !session.data.name;
      const askedAge = session.data.name && !session.data.age;
      const askedLocation = session.data.name && session.data.age && !session.data.location;
      const askedEmail = session.data.name && session.data.age && session.data.location && !session.data.email;

      if (!session.data.name) {
        session.data.name = extractName(message);
      }
      if (!session.data.age) {
        const parsedAge = extractAge(message);
        if (parsedAge) {
          session.data.age = parsedAge;
        } else if (askedAge) {
          session.data.age = message.trim();
        }
      }
      if (!session.data.email) {
        const parsedEmail = extractEmail(message);
        if (parsedEmail) {
          session.data.email = parsedEmail;
        } else if (askedEmail) {
          session.data.email = message.trim();
        }
      }
      if (!session.data.location && askedLocation) {
        session.data.location = message.trim();
      }

      if (!session.data.name) {
        finalResponse = "Hey... I'm Lumi. ✨\nYou don't have to figure everything out alone. I'm here to listen.\nBefore we begin, what should I call you?";
      } else if (!session.data.age) {
        finalResponse = `It's really nice to meet you, ${session.data.name}. 🌟\nEveryone carries their own story, and I'd like to understand yours a little better.\nHow old are you?`;
      } else if (!session.data.location) {
        finalResponse = `Thanks for sharing that, ${session.data.name}. 💛\nSometimes knowing a little about where someone is helps me understand their situation better.\nWhere are you from?`;
      } else if (!session.data.email) {
        finalResponse = `Got it... ${session.data.location}. 🌎\nOne last little thing before we talk about what's on your mind.\nIf we need to follow up with you, what's the best email address to reach you?`;
      } else {
        finalResponse = `Thank you, ${session.data.name}. ✨\nNow that I know a little about you, you can just talk to me naturally.\nThere are no forms, no perfect words, and no need to explain everything perfectly.\n\nSo... what's on your mind?`;
        session.phase = 2; 
      }

      session.history.push({ role: 'model', parts: [{ text: finalResponse }] });

      return res.json({
        sessionId,
        response: finalResponse,
        extractedData: session.data,
        isComplete: false
      });
    }

    if (session.phase === 2) {
      const systemInstruction = `You are Lumi, a friendly, calm, empathetic, curious, non-judgmental, slightly playful, helpful, and conversational AI.
You are never robotic and never overly formal. Your purpose is to listen to people and help them take the next step.

The visitor's details are:
Name: ${session.data.name}
Age: ${session.data.age}
Location: ${session.data.location}
Email: ${session.data.email}

IMPORTANT RULES:
1. Converse naturally and empathetically about whatever is on their mind.
2. DO NOT RUSH. You must engage with the visitor, asking at least 2 or 3 thoughtful follow-up questions to deeply understand their feelings and situation before you ever offer to send an email. 
3. Only AFTER you have deeply explored their problem across several conversational turns, ask if they want you to send this request to your hero. Use exactly or similar to: "I understand. 💛 Would you like me to send this request to my hero?"
4. If they say no, continue conversing naturally.
5. If they explicitly confirm (e.g., "Yes", "Please", "Send it", "Yes, please") to your offer, set wants_to_submit to true. Do NOT treat unrelated messages as confirmation.
6. Summarize their entire problem/request in the grievance_summary field.
7. Keep your replies reasonably short and conversational.`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          lumi_response: { type: Type.STRING, description: "Your natural conversational response" },
          wants_to_submit: { type: Type.BOOLEAN, description: "True ONLY if you have asked if they want to submit the request to your hero AND they have explicitly confirmed (e.g. Yes, please, send it). False otherwise." },
          grievance_summary: { type: Type.STRING, description: "A detailed summary of the user's grievance, problem, or request based on the conversation so far." }
        },
        required: ["lumi_response", "wants_to_submit", "grievance_summary"]
      };

      let chatResponse;
      if (process.env.GEMINI_API_KEY) {
        const MAX_RETRIES = 3;
        let lastError = null;
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
          try {
            chatResponse = await ai.models.generateContent({
              model: 'gemini-3.6-flash',
              contents: session.history,
              config: {
                systemInstruction: systemInstruction,
                responseMimeType: 'application/json',
                responseJsonSchema: responseSchema,
              }
            });
            lastError = null;
            break; // Success — exit retry loop
          } catch (apiError) {
            lastError = apiError;
            const status = apiError?.status;
            // Retry on 503 (overloaded) and 429 (rate limited)
            if ((status === 503 || status === 429) && attempt < MAX_RETRIES - 1) {
              const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
              console.warn(`Gemini API returned ${status}, retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})...`);
              await new Promise(resolve => setTimeout(resolve, delay));
              continue;
            }
            // Non-retryable error or final attempt exhausted
            console.error("Gemini API Error:", apiError?.message || apiError);
            break;
          }
        }
        if (lastError) {
          // Remove the user message we pushed to history since the request failed
          session.history.pop();
          return res.json({
            sessionId,
            response: "I'm having a little trouble thinking right now due to a temporary system issue. Give me a moment and try again. 💛",
            extractedData: session.data,
            isComplete: false
          });
        }
      } else {
        return res.json({
          sessionId,
          response: "I'm in offline test mode! Please add your GEMINI_API_KEY to the .env file to enable the real AI.",
          extractedData: session.data,
          isComplete: false
        });
      }

      const resultText = chatResponse.text;
      const resultJson = JSON.parse(resultText);
      
      if (resultJson.grievance_summary) {
        session.data.grievance = resultJson.grievance_summary;
      }

      finalResponse = resultJson.lumi_response;

      if (resultJson.wants_to_submit && !session.emailSent) {
        session.completed = true;
        session.emailSent = true;
        
        try {
          if (resend && process.env.CANDIDATE_EMAIL) {
            const dateStr = new Date().toLocaleDateString();
            const timeStr = new Date().toLocaleTimeString();
            
            const htmlEmail = `
<div style="font-family: Arial, sans-serif; background-color: #0d1321; color: #ffffff; padding: 40px 20px; text-align: center;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1a2238; border-radius: 16px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); text-align: left;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #FFD700; margin: 0; font-size: 28px;">🌟 LUMI</h1>
      <h2 style="color: #ffffff; margin: 10px 0 5px; font-size: 22px;">Someone Needs Your Help!</h2>
      <p style="color: #a0aabf; margin: 0; font-size: 16px;">A visitor reached out because they need someone to listen.</p>
    </div>
    
    <div style="background-color: #242c44; border-left: 4px solid #FFD700; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <h3 style="color: #FFD700; margin-top: 0; margin-bottom: 15px; font-size: 18px;">👤 Visitor Details</h3>
      <p style="margin: 5px 0;"><strong style="color:#a0aabf;">Name:</strong> ${session.data.name}</p>
      <p style="margin: 5px 0;"><strong style="color:#a0aabf;">Age:</strong> ${session.data.age}</p>
      <p style="margin: 5px 0;"><strong style="color:#a0aabf;">Location:</strong> ${session.data.location}</p>
      <p style="margin: 5px 0;"><strong style="color:#a0aabf;">Email:</strong> ${session.data.email}</p>
    </div>

    <div style="background-color: #242c44; border-left: 4px solid #FFD700; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
      <h3 style="color: #FFD700; margin-top: 0; margin-bottom: 15px; font-size: 18px;">💬 Their Message</h3>
      <p style="margin: 0; line-height: 1.6; font-size: 16px; white-space: pre-wrap;">${session.data.grievance}</p>
    </div>

    <div style="background-color: #242c44; border-left: 4px solid #a0aabf; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
      <h3 style="color: #ffffff; margin-top: 0; margin-bottom: 15px; font-size: 18px;">🕐 Submission Details</h3>
      <p style="margin: 5px 0;"><strong style="color:#a0aabf;">Date:</strong> ${dateStr}</p>
      <p style="margin: 5px 0;"><strong style="color:#a0aabf;">Time:</strong> ${timeStr}</p>
    </div>

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #242c44;">
      <p style="color: #FFD700; font-size: 18px; margin: 0 0 10px 0;">✨ Lumi's Signal</p>
      <p style="color: #a0aabf; font-size: 14px; margin: 0 0 5px 0;">Someone trusted Lumi enough to ask for help.</p>
      <p style="color: #a0aabf; font-size: 14px; margin: 0; font-style: italic;">You Talk. Lumi Listens.</p>
    </div>
  </div>
</div>
            `;

            const { data, error } = await resend.emails.send({
              from: 'Lumi <onboarding@resend.dev>',
              to: process.env.CANDIDATE_EMAIL,
              subject: '🌟 Someone Needs Your Help!',
              html: htmlEmail
            });
            
            if (error) {
              throw new Error(JSON.stringify(error));
            }
            
            finalResponse = `Your message has been sent to my hero. 💛 Thank you for trusting me.`;
          } else {
            console.error('Backend configuration error: RESEND_API_KEY or CANDIDATE_EMAIL missing.');
            finalResponse = "I hear you. Thanks for trusting me with that. I tried to send it to the right place, but we're having a temporary system issue. Please try again later.";
            session.completed = false;
            session.emailSent = false;
          }
        } catch (emailError) {
          console.error('Email Error:', emailError?.message || emailError);
          finalResponse = "I hear you. Thanks for trusting me with that. I tried to send it to the right place, but we're having a temporary system issue. Please try again later.";
          session.completed = false;
          session.emailSent = false;
        }
      }

      session.history.push({ role: 'model', parts: [{ text: finalResponse }] });

      return res.json({
        sessionId,
        response: finalResponse,
        extractedData: session.data,
        isComplete: session.completed
      });
    }

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

// Serve static files from the React frontend in production
app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
// Listen on all network interfaces (0.0.0.0) so it works on Render/Heroku
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
});
