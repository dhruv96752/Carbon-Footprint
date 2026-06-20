import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage, useTheme, useInViewOnce } from '../hooks';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns initial value when key is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'hello'));
    expect(result.current[0]).toBe('hello');
  });

  it('reads existing value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('stored');
  });

  it('writes value to localStorage on update', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 0));
    act(() => {
      result.current[1](42);
    });
    expect(result.current[0]).toBe(42);
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify(42));
  });

  it('handles complex objects', () => {
    const { result } = renderHook(() => useLocalStorage('obj-key', { a: 1 }));
    act(() => {
      result.current[1]({ a: 1, b: 2 });
    });
    expect(result.current[0]).toEqual({ a: 1, b: 2 });
  });

  it('returns initial when localStorage has corrupted data', () => {
    localStorage.setItem('bad-key', 'not-valid-json{{');
    const { result } = renderHook(() => useLocalStorage('bad-key', 'safe'));
    expect(result.current[0]).toBe('safe');
  });

  it('handles arrays correctly', () => {
    const { result } = renderHook(() => useLocalStorage('arr-key', []));
    act(() => {
      result.current[1]((prev) => [...prev, 'item']);
    });
    expect(result.current[0]).toEqual(['item']);
  });
});

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('returns a theme and toggle function', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current).toHaveProperty('theme');
    expect(result.current).toHaveProperty('toggle');
    expect(['light', 'dark']).toContain(result.current.theme);
  });

  it('toggles between light and dark', () => {
    const { result } = renderHook(() => useTheme());
    const before = result.current.theme;
    act(() => {
      result.current.toggle();
    });
    expect(result.current.theme).not.toBe(before);
  });

  it('applies dark class to document element', () => {
    // Set dark in localStorage BEFORE rendering so useState initializer picks it up
    localStorage.setItem('verdant-theme', JSON.stringify('dark'));
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('defaults to light when system preference matches', () => {
    // The mock matchMedia returns false for dark, so system = light
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
  });
});

describe('useInViewOnce', () => {
  it('returns a ref and inView boolean', () => {
    const { result } = renderHook(() => useInViewOnce());
    expect(result.current).toHaveLength(2);
    expect(result.current[0]).toHaveProperty('current');
    expect(typeof result.current[1]).toBe('boolean');
  });

  it('starts with inView as false', () => {
    const { result } = renderHook(() => useInViewOnce());
    expect(result.current[1]).toBe(false);
  });
});
