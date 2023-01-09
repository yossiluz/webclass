class NewError {
  code = 0;
  message = null;
  constructor(code: any, message: any) {
    this.code = code;
    this.message = message;
  }
}

export = NewError;