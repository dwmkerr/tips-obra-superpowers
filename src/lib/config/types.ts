export interface ConfigMeta {
  value: boolean;
  source: string;
}

export interface ConfigMetaBlock {
  mergeTips: ConfigMeta;
  $files: string[];
}

export interface Config {
  mergeTips: boolean;
  $meta: ConfigMetaBlock;
}

export interface RawConfig {
  mergeTips?: boolean;
}

export const DEFAULT_CONFIG: RawConfig = {
  mergeTips: true,
};
