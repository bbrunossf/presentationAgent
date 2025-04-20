import {create} from 'zustand';

interface CommandStore {
  inputText: string;
  outputText: string;
  setInputText: (input: string) => void;
  setOutputText: (output: string) => void;
  setResponse: (args: { input: string; output: string }) => void;
}

export const useCommandStore = create<CommandStore>((set) => ({
  inputText: '',
  outputText: '',
  setInputText: (input) => set({ inputText: input }),
  setOutputText: (output) => set({ outputText: output }),
  setResponse: ({ input, output }) => set({ inputText: input, outputText: output }),
}));