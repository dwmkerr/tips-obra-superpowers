import {describe, it, expect} from '@jest/globals';
import type {Config, ConfigMeta} from './types.js';

describe('Config types', () => {
  it('allows creating a valid config object', () => {
    const config: Config = {
      mergeTips: true,
      $meta: {
        mergeTips: {value: true, origin: '~/.tipsrc.yaml'},
        $files: ['~/.tipsrc.yaml'],
      },
    };
    expect(config.mergeTips).toBe(true);
    expect(config.$meta.mergeTips.origin).toBe('~/.tipsrc.yaml');
  });
});
