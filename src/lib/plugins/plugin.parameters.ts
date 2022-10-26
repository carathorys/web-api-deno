import { Constructable } from '../utils/index.ts';

export type PluginParameters = {
  services?: Constructable[];
  exports?: Constructable[];
  config?: () => void;
};
