import Replicate from 'replicate';
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key',
});

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || 'demo-token',
});

export interface VideoGenerationOptions {
  prompt: string;
  duration?: number;
  style?: string;
}

export class AIVideoGenerator {
  async enhancePrompt(userPrompt: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a video prompt expert. Enhance the user prompt to create engaging social media videos. Keep it concise but descriptive.',
          },
          {
            role: 'user',
            content: `Enhance this video prompt for social media: ${userPrompt}`,
          },
        ],
        max_tokens: 150,
      });

      return completion.choices[0]?.message?.content || userPrompt;
    } catch (error) {
      console.error('Error enhancing prompt:', error);
      return userPrompt;
    }
  }

  async generateCaption(prompt: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a social media caption expert. Create engaging captions with hashtags for videos.',
          },
          {
            role: 'user',
            content: `Create a catchy social media caption for a video about: ${prompt}`,
          },
        ],
        max_tokens: 100,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating caption:', error);
      return '';
    }
  }

  async generateVideo(options: VideoGenerationOptions): Promise<string> {
    try {
      const enhancedPrompt = await this.enhancePrompt(options.prompt);

      // Using a placeholder for video generation
      // In production, you would use services like:
      // - Runway ML
      // - Synthesia
      // - D-ID
      // - Pictory

      console.log('Generating video with prompt:', enhancedPrompt);

      // Demo: Return a placeholder video URL
      // In production, this would call actual AI video generation APIs
      return 'https://demo-video-url.com/generated.mp4';
    } catch (error) {
      console.error('Error generating video:', error);
      throw error;
    }
  }

  async downloadVideo(url: string, outputPath: string): Promise<string> {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      await fs.writeFile(outputPath, response.data);
      return outputPath;
    } catch (error) {
      console.error('Error downloading video:', error);
      throw error;
    }
  }
}

export const aiVideoGenerator = new AIVideoGenerator();
