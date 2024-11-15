import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Request } from '../types/requests';

interface RequestProgress {
  requestId: string;
  lastModule: number;
  lastPath: string;
  timestamp: string;
}

interface TestCompletion {
  testId: string;
  userId: string;
  completedAt: number;
  score?: number;
}

interface RequestsState {
  requests: Request[];
  requestProgress: RequestProgress[];
  testCompletions: TestCompletion[];
  isLoading: boolean;
  error: string | null;
  createRequest: (data: Partial<Request>) => Promise<Request>;
  updateRequest: (request: Request) => Promise<void>;
  deleteRequest: (requestId: string) => Promise<void>;
  updateRequestCounts: () => void;
  updateRequestProgress: (requestId: string, moduleNumber: number, path: string) => void;
  getRequestProgress: (requestId: string) => RequestProgress | undefined;
  addTestCompletion: (completion: TestCompletion) => void;
  getTestCompletions: (userId: string) => TestCompletion[];
  requestCounts: Record<string, number>;
}

export const useRequests = create<RequestsState>()(
  persist(
    (set, get) => ({
      requests: [],
      requestProgress: [],
      testCompletions: [],
      isLoading: false,
      error: null,
      requestCounts: {
        personal: 0,
        pair: 0,
        group: 0,
        team: 0,
        startup: 0
      },

      createRequest: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const request: Request = {
            id: `request-${Date.now()}`,
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'in_progress',
            moduleData: data.moduleData || {}
          };

          set(state => ({
            requests: [request, ...state.requests],
            isLoading: false
          }));

          get().updateRequestCounts();
          return request;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create request',
            isLoading: false 
          });
          throw error;
        }
      },

      updateRequest: async (request) => {
        set({ isLoading: true, error: null });
        try {
          set(state => ({
            requests: state.requests.map(r => 
              r.id === request.id ? { ...request, updatedAt: new Date().toISOString() } : r
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update request',
            isLoading: false 
          });
          throw error;
        }
      },

      deleteRequest: async (requestId) => {
        set({ isLoading: true, error: null });
        try {
          set(state => ({
            requests: state.requests.filter(r => r.id !== requestId),
            requestProgress: state.requestProgress.filter(p => p.requestId !== requestId),
            isLoading: false
          }));
          get().updateRequestCounts();
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete request',
            isLoading: false 
          });
          throw error;
        }
      },

      updateRequestProgress: (requestId: string, moduleNumber: number, path: string) => {
        set(state => {
          const progress: RequestProgress = {
            requestId,
            lastModule: moduleNumber,
            lastPath: path,
            timestamp: new Date().toISOString()
          };

          const existingIndex = state.requestProgress.findIndex(
            p => p.requestId === requestId
          );

          const newProgress = existingIndex >= 0
            ? state.requestProgress.map((p, i) => 
                i === existingIndex ? progress : p
              )
            : [...state.requestProgress, progress];

          return { requestProgress: newProgress };
        });
      },

      getRequestProgress: (requestId: string) => {
        return get().requestProgress.find(p => p.requestId === requestId);
      },

      addTestCompletion: (completion: TestCompletion) => {
        set(state => ({
          testCompletions: [...state.testCompletions, completion]
        }));
      },

      getTestCompletions: (userId: string) => {
        return get().testCompletions.filter(c => c.userId === userId);
      },

      updateRequestCounts: () => {
        const { requests } = get();
        const counts = requests.reduce((acc, request) => ({
          ...acc,
          [request.type]: (acc[request.type] || 0) + 1
        }), {
          personal: 0,
          pair: 0,
          group: 0,
          team: 0,
          startup: 0
        });
        set({ requestCounts: counts });
      }
    }),
    {
      name: 'requests-storage'
    }
  )
);