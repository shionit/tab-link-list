import { describe, it, expect } from 'vitest';
import pkg from '../package.json';
import manifest from '../manifest.json';

describe('version', () => {
  it('matches between package.json and manifest.json', () => {
    expect(manifest.version).toBe(pkg.version);
  });
});
