export class GlobalResponseBody {
  code: string
  data: any
  msg: string

  constructor(code: string, data: any, msg: string) {
    this.code = code
    this.data = data
    this.msg = msg
  }

  static success(data: any = '') {
    return {
      code: '200',
      data: data,
      msg: 'success',
    }
  }

  static error(message: string = 'internal error') {
    return {
      code: '400',
      data: '',
      msg: message,
    }
  }

  static neverRegister() {
    return {
      code: '401',
      data: '',
      msg: 'never register',
    }
  }

  static exceedsLimit() {
    return {
      code: '402',
      data: '',
      msg: 'exceeds limit',
    }
  }
}
