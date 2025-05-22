
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Polyfill for URLSearchParams if needed
if (!window.URLSearchParams) {
  window.URLSearchParams = class URLSearchParams {
    private params: Map<string, string>;
    
    constructor(init?: string | Record<string, string>) {
      this.params = new Map();
      
      if (typeof init === 'string') {
        init.replace(/^\?/, '').split('&').forEach(pair => {
          const [key, value] = pair.split('=');
          if (key) this.params.set(key, value || '');
        });
      } else if (init) {
        Object.entries(init).forEach(([key, value]) => {
          this.params.set(key, value);
        });
      }
    }
    
    append(name: string, value: string): void {
      this.params.set(name, value);
    }
    
    delete(name: string): void {
      this.params.delete(name);
    }
    
    get(name: string): string | null {
      return this.params.has(name) ? this.params.get(name) || null : null;
    }
    
    getAll(name: string): string[] {
      return this.params.has(name) ? [this.params.get(name) || ''] : [];
    }
    
    has(name: string): boolean {
      return this.params.has(name);
    }
    
    set(name: string, value: string): void {
      this.params.set(name, value);
    }
    
    toString(): string {
      const pairs: string[] = [];
      this.params.forEach((value, key) => {
        pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      });
      return pairs.join('&');
    }
  };
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
