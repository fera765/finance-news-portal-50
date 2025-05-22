
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Polyfill for URLSearchParams if needed
if (!window.URLSearchParams) {
  window.URLSearchParams = class URLSearchParams {
    private params: Map<string, string>;
    
    constructor(init?: string | Record<string, string> | URLSearchParams | string[][]) {
      this.params = new Map();
      
      if (typeof init === 'string') {
        init.replace(/^\?/, '').split('&').forEach(pair => {
          if (!pair) return;
          const [key, value] = pair.split('=');
          if (key) this.params.set(key, value || '');
        });
      } else if (init && typeof init === 'object') {
        if (init instanceof URLSearchParams) {
          // Copy from another URLSearchParams
          init.forEach((value, key) => {
            this.params.set(key, value);
          });
        } else if (Array.isArray(init)) {
          // Handle string[][] format
          init.forEach(pair => {
            if (pair.length === 2) {
              this.params.set(pair[0], pair[1]);
            }
          });
        } else {
          // Handle Record<string, string> format
          Object.entries(init).forEach(([key, value]) => {
            this.params.set(key, value);
          });
        }
      }
    }
    
    // Add size property getter
    get size(): number {
      return this.params.size;
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
    
    // Additional required methods to match the URLSearchParams interface
    forEach(callback: (value: string, key: string, parent: URLSearchParams) => void): void {
      this.params.forEach((value, key) => callback(value, key, this));
    }
    
    keys(): IterableIterator<string> {
      return this.params.keys();
    }
    
    values(): IterableIterator<string> {
      return this.params.values();
    }
    
    entries(): IterableIterator<[string, string]> {
      return this.params.entries();
    }
    
    sort(): void {
      // Sort params alphabetically by keys
      const entries = Array.from(this.params.entries()).sort((a, b) => a[0].localeCompare(b[0]));
      this.params.clear();
      entries.forEach(([key, value]) => this.params.set(key, value));
    }
    
    // Add Symbol.iterator to make it iterable
    [Symbol.iterator](): IterableIterator<[string, string]> {
      return this.entries();
    }
  };
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
