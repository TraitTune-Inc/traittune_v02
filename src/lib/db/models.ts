import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Request {
  _id?: ObjectId;
  userId: ObjectId;
  type: 'personal' | 'pair' | 'group' | 'team' | 'startup';
  status: 'draft' | 'in_progress' | 'completed';
  moduleData: {
    module2?: {
      answers: Record<string, string>;
      documents: Array<{
        type: 'file' | 'url';
        value: string;
        size?: number;
      }>;
      summary?: string;
    };
    module3?: {
      testResults: Array<{
        testId: string;
        responses: Array<{
          questionId: string;
          value: number;
          timestamp: number;
        }>;
        summary?: string;
      }>;
    };
    module4?: {
      answers: Record<string, string>;
      files: Array<{
        name: string;
        url: string;
        size: number;
      }>;
      summary?: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface StaticData {
  _id?: ObjectId;
  type: 'questionnaire' | 'test' | 'interpretation';
  moduleId: number;
  data: any;
  updatedAt: Date;
}