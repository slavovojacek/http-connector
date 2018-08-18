class HttpConnectorError extends Error {
  constructor(...args: any[]) {
    super(...args)
    Error.captureStackTrace(this, HttpConnectorError)
  }
}

HttpConnectorError.prototype.name = "HttpConnectorError"

export { HttpConnectorError }
