import { Constructable } from '../../utils/helpers/types.ts';
import { InjectableParameters } from '../parameters/injectable-parameters.model.ts';

export interface InjectableMetadata {
  dependencies: Constructable[];
  options: InjectableParameters;
}
