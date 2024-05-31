// src/types.ts
export interface Entry {
  id: string;
  type: string;
  nodeType: string;
  message?: string;
  intent?: string;
  nextStepID: string | string[];
}
