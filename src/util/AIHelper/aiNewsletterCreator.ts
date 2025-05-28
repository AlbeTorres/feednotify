import { createUserContent, GoogleGenAI } from '@google/genai';
import { feedResponse } from '../../interfaces/FeedResponse';
import { AiNewsLetterCreatorPrompt } from '../AiPromps/aiNewsletterCreatorPromp';
require('dotenv').config(); // eslint-disable-line @typescript-eslint/no-require-imports

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

export async function getAiNewsLetterCreator(content: feedResponse) {
  const modelName = 'gemini-2.0-flash'; // Specify the model you want to use
  const response = await ai.models.generateContent({
    model: modelName,
    contents: [
      createUserContent([
        AiNewsLetterCreatorPrompt,
        JSON.stringify(content), // 👈 serializa el objeto feedResponse
      ]),
    ],
    config: {
      responseMimeType: 'application/json',
      //   responseSchema: {
      //     type: Type.ARRAY,
      //     items: {
      //       type: Type.OBJECT,
      //       properties: {
      //         recipeName: {
      //           type: Type.STRING,
      //         },
      //         ingredients: {
      //           type: Type.ARRAY,
      //           items: {
      //             type: Type.STRING,
      //           },
      //         },
      //       },
      //       propertyOrdering: ['recipeName', 'ingredients'],
      //     },
      //   },
    },
  });

  if (!response || !response.text) {
    throw new Error('No response received from AI model');
  }

  return response.text; // Assuming the response contains the summary text
}
