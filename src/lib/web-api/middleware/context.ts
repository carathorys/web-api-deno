import { Injector } from '../../dependency-injection/injector.ts';
import { Disposable } from '../../disposable/decorators/disposable-decorator.ts';
import { Constructable } from '../../utils/helpers/index.ts';

@Disposable({ recursive: true })
export class Context {
  private readonly _request: Request;
  private _response: Response;
  /** */
  constructor(private readonly injector: Injector, request: Request, response: Response) {
    this._request = request;
    this._response = response;
  }
  public get request(): Request {
    return this._request;
  }
  public get response(): Response {
    return this._response;
  }
  public set response(value: Response) {
    this._response = value;
  }

  public getInstance<T>(ctor: Constructable<T>): T {
    return this.injector.getInstance(ctor);
  }
}
