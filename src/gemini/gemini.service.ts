import { Injectable, Logger } from '@nestjs/common';
import { ActionableSteps, ILanguageModel } from 'types/types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService implements ILanguageModel {
  private ai: GoogleGenerativeAI;
  private logger = new Logger(GeminiService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('Gemini API key not found in environment variables');
    }
    this.ai = new GoogleGenerativeAI(apiKey);
  }

  async processNotes(notes: string): Promise<ActionableSteps> {
    this.logger.log('Note: ', notes);
    this.logger.log('Processing note...');
    const prompt = `
      Given the following doctor's notes: "${notes}", extract:
      1. A **checklist** of **immediate one-time tasks** (as an array of strings).
      2. A **plan** of scheduled actions where each task includes:
         - task (a description of the action),
         - frequency (must strictly be of type FrequencyType where FrequencyType = ONCE_DAILY | TWICE_DAILY | THREE_TIMES_DAILY | FOUR_TIMES_DAILY),
         - duration (the number of days the task should be performed),
         - reminderMessage (a short message to remind the patient about the task).
         - Only include measurable tasks that can be tracked by the patient such as taking medication but tasks such as "Report any unusual blood pressure spikes" should not be included as they are not quantifiable.
      
      **Output must be in valid JSON format** with keys: "checklist" and "plan".
    `;
    // this.logger.log('Prompt generated', prompt);
    try {
      const model = this.ai.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent(prompt);

      console.log('Result: ', result);
      const response = await result.response;

      const text = response.text();

      console.log('\n\n\nhere: ', text, '\n\n\n');
      const cleanText = text.replace(/```json|```/g, '').trim();
      const actions = JSON.parse(cleanText) as ActionableSteps;
      console.log('Actions: ', actions);

      return actions;
    } catch (error) {
      console.error('Error processing notes with LLM:', error);
      throw new Error('Failed to generate actionable steps');
    }
  }
}
