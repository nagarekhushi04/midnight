import type { PrivateStateProvider } from '@midnight-ntwrk/midnight-js-types';

export const getMemoryPrivateStateProvider = (): PrivateStateProvider => {
  const stateStore = new Map<string, any>();
  const keyStore = new Map<string, any>();

  return {
    setContractAddress: () => {},
    
    set: async (id, state) => { 
      stateStore.set(id, state); 
    },
    get: async (id) => stateStore.get(id) || null,
    remove: async (id) => { 
      stateStore.delete(id); 
    },
    clear: async () => { 
      stateStore.clear(); 
    },

    setSigningKey: async (addr, key) => { 
      keyStore.set(addr as any, key); 
    },
    getSigningKey: async (addr) => keyStore.get(addr as any) || null,
    removeSigningKey: async (addr) => { 
      keyStore.delete(addr as any); 
    },
    clearSigningKeys: async () => { 
      keyStore.clear(); 
    },

    exportPrivateStates: async () => ({} as any),
    importPrivateStates: async () => ({} as any),
    exportSigningKeys: async () => ({} as any),
    importSigningKeys: async () => ({} as any),
  };
};
