import OpenAI from 'openai';
import { modulePrompts } from './prompts';
import { Request } from '../types/requests';
import { extractTextFromPDF } from './documentScanner';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateModuleSummary(
  data: any,
  moduleNumber: number,
  requestType: string = 'personal'
) {
  try {
    let systemPrompt = '';
    let processedData = { ...data };
    
    switch (moduleNumber) {
      case 2:
        systemPrompt = modulePrompts.module2[requestType as keyof typeof modulePrompts.module2];
        break;
      case 3:
        systemPrompt = modulePrompts.module3;
        break;
      case 4:
        systemPrompt = modulePrompts.module4;
        // Ensure documents are properly formatted for module 4
        if (data.documents) {
          processedData = {
            answers: data.answers,
            documents: data.documents.map((doc: any) => ({
              type: doc.type,
              name: doc.name || doc.value,
              content: doc.content || ''
            }))
          };
        }
        break;
      default:
        throw new Error('Invalid module number');
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: JSON.stringify(processedData, null, 2)
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    return completion.choices[0].message.content || 'Failed to generate summary';
  } catch (error) {
    console.error('Error generating summary:', error);
    throw error;
  }
}

export async function generateComprehensiveReport(request: Request) {
  try {
    const systemPrompt = modulePrompts.module5[request.type as keyof typeof modulePrompts.module5];

    const moduleSummaries = {
      module2: request.moduleData.module2?.summary,
      module3: request.moduleData.module3?.summary,
      module4: request.moduleData.module4?.summary
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `${systemPrompt}\n\nCreate a comprehensive yet concise report (maximum 2 pages when written in 14pt font) that synthesizes insights from all assessment modules. Focus on key findings and actionable recommendations.`
        },
        {
          role: "user",
          content: JSON.stringify({
            type: request.type,
            moduleSummaries
          }, null, 2)
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    return completion.choices[0].message.content || 'Failed to generate comprehensive report';
  } catch (error) {
    console.error('Error generating comprehensive report:', error);
    throw error;
  }
}