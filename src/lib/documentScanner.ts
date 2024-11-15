import { OpenAI } from 'openai';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const typedArray = new Uint8Array(arrayBuffer);
    const loadingTask = pdfjsLib.getDocument({ data: typedArray });
    const pdf = await loadingTask.promise;
    
    let text = '';
    const numPages = pdf.numPages;

    for (let i = 1; i <= numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: any) => item.str)
          .join(' ');
        text += pageText + '\n';
      } catch (pageError) {
        console.error(`Error extracting text from page ${i}:`, pageError);
        continue;
      }
    }

    return text.trim();
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw error;
  }
}

export async function generateModuleSummary(
  questionnaireData: Record<string, any>,
  documents: Array<{ type: string; value: string; file?: File }>,
): Promise<string> {
  try {
    // Extract text from all PDF files
    const documentTexts = await Promise.all(
      documents
        .filter(doc => doc.type === 'file' && doc.file)
        .map(async doc => {
          if (!doc.file) return '';
          return extractTextFromPDF(doc.file);
        })
    );

    // Combine all data
    const combinedData = {
      questionnaire: questionnaireData,
      documents: documents.map((doc, index) => ({
        type: doc.type,
        value: doc.value,
        content: doc.type === 'file' ? documentTexts[index] : undefined
      }))
    };

    // Generate summary using ChatGPT
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `Analyze the provided questionnaire responses and document contents. Create a structured summary with bullet points in these categories (skip any that don't apply):

🎯 Current Role & Objectives
💼 Experience & Background
🛠 Technical Skills & Expertise
🎓 Education & Certifications
🗣 Languages & Communication
👥 Soft Skills & Traits

Keep bullet points concise and summary focused on key insights.`
        },
        {
          role: "user",
          content: JSON.stringify(combinedData, null, 2)
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    return completion.choices[0].message.content || 'Failed to generate summary';
  } catch (error) {
    console.error('Error generating module summary:', error);
    throw error;
  }
}