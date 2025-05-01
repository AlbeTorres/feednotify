import { GoogleGenerativeAI } from '@google/generative-ai';
require('dotenv').config(); // eslint-disable-line @typescript-eslint/no-require-imports

const ai = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function getYoutubeVideoResume(url: string) {
  const model = ai.getGenerativeModel({ model: 'gemini-1.5-pro' }); // Specify the model you want to use

  const youtubeSummaryPrompt = `
        Summarize the following YouTube video clearly and concisely. Extract the main points, key ideas, and any important conclusions. 
        If the video covers multiple sections or topics, organize the summary into sections or bullet points.

        Additional instructions:
        - If the video is longer than 20 minutes, first provide a general overview, then a brief summary for each major section.
        - Keep the language simple and straightforward.
        - Include any important quotes or numerical data if mentioned in the video.
        - Avoid personal opinions or interpretations, stick to the content of the video.`;

  const response = await model.generateContent([
    youtubeSummaryPrompt,
    {
      fileData: {
        mimeType: '', // Specify the MIME type of the video
        fileUri: url,
      },
    },
  ]);

  console.log('Response:', response.response.text()); // Log the response for debugging

  return response.response.text(); // Assuming the response contains the summary text
}
