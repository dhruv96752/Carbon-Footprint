import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
const store = {};
const localStorageMock = {
  getItem: (key) => store[key] ?? null,
  setItem: (key, value) => { store[key] = String(value); },
  removeItem: (key) => { delete store[key]; },
  clear: () => Object.keys(store).forEach((k) => delete store[k]),
  get length() { return Object.keys(store).length; },
  key: (i) => Object.keys(store)[i] ?? null,
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock URL.createObjectURL / revokeObjectURL
global.URL.createObjectURL = () => 'blob:test';
global.URL.revokeObjectURL = () => {};

// Mock Blob
global.Blob = class Blob {
  constructor(parts, opts) { this.parts = parts; this.type = opts?.type; }
};

// Mock matchMedia (required by framer-motion in jsdom)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver (for framer-motion layout animations)
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock IntersectionObserver (for framer-motion whileInView)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
};

// We do NOT mock document.createElement globally — it breaks React 19's
// internal vendor prefix detection. Instead, exportAll tests should use
// vi.spyOn(document, 'createElement') locally if needed.
