export class Context {
  private _request: Request;
  private _response: Response;
  /** */
  constructor(request: Request, response: Response) {
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
}
