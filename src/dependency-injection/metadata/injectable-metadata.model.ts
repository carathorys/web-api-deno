// deno-lint-ignore-file no-explicit-any
import { Constructable } from "../../utils/helpers/types.ts";
import { InjectableParameters } from "../parameters/injectable-parameters.model.ts";

export interface InjectableMetadata {

  dependencies: Constructable<any>[];
  options: InjectableParameters;
}
