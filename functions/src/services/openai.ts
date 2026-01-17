import OpenAI from 'openai';
import { config } from '../config/env';

const openai = new OpenAI({
  apiKey: config.openai.apiKey,
});

export async function summarizeEmail(
  subject: string,
  snippet: string,
  from: string
): Promise<string> {
  try {
    const prompt = `You are an AI assistant that summarizes emails concisely for busy professionals.

Email Details:
From: ${from}
Subject: ${subject}

Body:
${snippet}

Instructions:
1. Provide a 2-3 sentence summary
2. Highlight any action items or deadlines
3. Use emojis to make it visually appealing
4. Keep it under 150 words

Format your response as a Telegram message.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful email summarization assistant. Be concise and actionable.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || 'Unable to generate summary';
  } catch (error) {
    console.error('OpenAI summarization error:', error);
    throw new Error('Failed to summarize email');
  }
}

export async function generateReply(
  subject: string,
  emailBody: string,
  from: string
): Promise<string> {
  try {
    const prompt = `You are an AI assistant that helps write professional email replies.

Original Email:
From: ${from}
Subject: ${subject}

Body:
${emailBody}

Instructions:
1. Generate a polite, professional reply
2. Address the main points from the original email
3. Keep it concise and clear (under 200 words)
4. Use a friendly but professional tone
5. End with an appropriate sign-off

Generate the reply text only (no "Subject:" or "To:" fields):`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional email writing assistant. Generate polite, concise replies that are helpful and actionable.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 500,
      temperature: 0.8,
    });

    return response.choices[0]?.message?.content || 'Unable to generate reply';
  } catch (error) {
    console.error('OpenAI reply generation error:', error);
    throw new Error('Failed to generate reply');
  }
}