import { Action, Controller } from '../../lib/web-api/index.ts';

@Controller()
export class MyApiController {
  /** */
  constructor() {
  }
  /**
   * @returns Returns with HTTP 200, a simple string with `OK` content
   */
  @Action()
  public index() {
    return 'OK';
  }
}
