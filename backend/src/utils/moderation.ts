import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface ModerationResult {
  safe: boolean;
  reason: string;
  category: 'safe' | 'violence' | 'hate' | 'explicit' | 'spam';
  confidence?: number;
}

/**
 * Moderate content using Gemini API
 */
export const moderateContent = async (
  title: string,
  description: string
): Promise<ModerationResult> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Review this social media content for policy violations.
Title: ${title}
Description: ${description}

Analyze for:
- Violence or graphic content
- Hate speech or discrimination
- Explicit or adult content
- Spam or misleading information

Return ONLY a JSON object with this exact format:
{
  "safe": true or false,
  "reason": "brief explanation",
  "category": "safe" or "violence" or "hate" or "explicit" or "spam"
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format from Gemini API');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      safe: parsed.safe === true,
      reason: parsed.reason || 'No reason provided',
      category: parsed.category || 'safe',
    };
  } catch (error: any) {
    console.error('Moderation API error:', error);

    // Default to manual review on error
    return {
      safe: false,
      reason: 'Pending manual review due to moderation system error',
      category: 'safe',
    };
  }
};
