import {describe, it, expect} from '@jest/globals';
import type {Config} from './types.js';

describe('Config types', () => {
  it('allows creating a valid config object', () => {
    const config: Config = {
      mergeTips: true,
      $meta: {
        mergeTips: {value: true, source: '~/.tipsrc.yaml'},
        $files: ['~/.tipsrc.yaml'],
      },
    };
    expect(config.mergeTips).toBe(true);
    expect(config.$meta.mergeTips.source).toBe('~/.tipsrc.yaml');
  });
});
