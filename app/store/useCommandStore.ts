import { create } from 'zustand';
import type { AgentResponse } from '~/services/remoteAgent';

interface CommandStore {
  // last entered command text
  inputText: string;
  // full response from the agent, or null if none yet
  agentResponse: AgentResponse | null;
  setInputText: (input: string) => void;
  /**
   * Store both the input command and the full AgentResponse
   */
  setResponse: (args: { input: string; response: AgentResponse }) => void;
}

export const useCommandStore = create<CommandStore>((set) => ({
  inputText: '',
  agentResponse: null,
  setInputText: (input) => set({ inputText: input }),
  setResponse: ({ input, response }) =>
    set({ inputText: input, agentResponse: response }),
}));