import { isNonNegativeInteger, isTrue } from "@openmaths/utils"
import * as request from "request-promise-native"
import * as url from "url"

import { HttpConnectorError } from "./helpers"
import { HttpClient, Opts } from "./types"

const httpClient: HttpClient = request.defaults({
  json: true,
})

class HttpConnector<H> {
  name: string
  client: any
  transactionId: string
  options: request.Options

  constructor(opts: Opts<H>, client: HttpClient = httpClient) {
    const {
      name,
      port,
      secure,
      hostname,
      pathname,
      headers,
      timeout,
      transactionId,
    } = opts

    const baseUrl = url.format({
      port,
      protocol: isTrue(secure) ? "https" : "http",
      hostname,
      pathname,
      slashes: true,
    })

    this.name = name
    this.client = client
    this.transactionId = transactionId
    this.options = {
      baseUrl,
      headers,
      url: "",
    }

    if (isNonNegativeInteger(timeout)) {
      Object.assign(this.options, { timeout })
    }
  }

  healthcheck = async <T = unknown>(): Promise<T> => {
    throw new Error(`Healthcheck endpoint must be configured for ${this.name}`)
  }

  get = <T = unknown>(opts: request.Options): Promise<T> => {
    return this.http<T>({
      method: "GET",
      ...opts,
    })
  }

  post = <T = unknown>(opts: request.Options): Promise<T> => {
    return this.http<T>({
      method: "POST",
      ...opts,
    })
  }

  put = <T = unknown>(opts: request.Options): Promise<T> => {
    return this.http<T>({
      method: "PUT",
      ...opts,
    })
  }

  private http = async <T>(opts: request.Options): Promise<T> => {
    const { headers, ...rest } = opts

    const options: request.Options = {
      ...this.options,
      ...rest,
      headers: {
        ...this.options.headers,
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
