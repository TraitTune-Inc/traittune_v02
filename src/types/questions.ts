export interface Question {
  id: string;
  header: string;
  description: string;
  type: 'text' | 'textarea';
  maxLength: number;
}

export interface QuestionSet {
  title: string;
  description: string;
  questions: Question[];
}