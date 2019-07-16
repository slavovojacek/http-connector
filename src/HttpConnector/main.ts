import { isNonNegativeInteger, isTrue } from "@usefultools/utils"
import * as request from "request-promise-native"

import { HttpConnectorError } from "./helpers"
import { HttpClient, Opts } from "./types"

const httpClient: HttpClient = request.defaults({
  json: true,
})

class HttpConnector<H> {
  name: string
  client: any
  correlationId: string
  options: request.Options

  constructor(opts: Opts<H>, client: HttpClient = httpClient) {
    const { name, baseUrl, headers, timeout, correlationId } = opts

    this.name = name
    this.client = client
    this.correlationId = correlationId
    this.options = {
      baseUrl,
      headers,
      url: "",
    }

    if (isNonNegativeInteger(timeout)) {
      Object.assign(this.options, { timeout })
    }
  }

  healthcheck = async <T>(): Promise<T> => {
    throw new Error(`Healthcheck endpoint must be configured for ${this.name}`)
  }

  get = <T>(
    opts: request.Options,
    removeOriginalHeaders: boolean = false,
  ): Promise<T> => {
    return this.http<T>(
      {
        method: "GET",
        ...opts,
      },
      removeOriginalHeaders,
    )
  }

  post = <T>(
    opts: request.Options,
    removeOriginalHeaders: boolean = false,
  ): Promise<T> => {
    return this.http<T>(
      {
        method: "POST",
        ...opts,
      },
      removeOriginalHeaders,
    )
  }

  put = <T>(
    opts: request.Options,
    removeOriginalHeaders: boolean = false,
  ): Promise<T> => {
    return this.http<T>(
      {
        method: "PUT",
        ...opts,
      },
      removeOriginalHeaders,
    )
  }

  patch = <T>(
    opts: request.Options,
    removeOriginalHeaders: boolean = false,
  ): Promise<T> => {
    return this.http<T>(
      {
        method: "PATCH",
        ...opts,
      },
      removeOriginalHeaders,
    )
  }

  delete = <T>(
    opts: request.Options,
    removeOriginalHeaders: boolean = false,
  ): Promise<T> => {
    return this.http<T>(
      {
        method: "DELETE",
        ...opts,
      },
      removeOriginalHeaders,
    )
  }

  private http = async <T>(
    opts: request.Options,
    removeOriginalHeaders: boolean,
  ): Promise<T> => {
    const { headers, ...rest } = opts

    const options: request.Options = {
      ...this.options,
      ...rest,
      headers: {
        ...(isTrue(removeOriginalHeaders) ? {} : this.options.headers),
        ...headers,
      },
    }

    try {
      return await this.client(options)
    } catch (err) {
      throw new HttpConnectorError(err)
    }
  }
}

export default HttpConnector
