import { RequestAPI, RequiredUriUrl } from "request"
import { RequestPromise, RequestPromiseOptions } from "request-promise-native"

export interface Headers {
  [k: string]: string
}

export interface Opts<T = Headers> {
  name: string
  port?: number
  secure: boolean
  hostname: string
  pathname?: string
  headers: T
  timeout?: number
  transactionId: string
}

export type HttpClient = RequestAPI<
  RequestPromise<any>,
  RequestPromiseOptions,
  RequiredUriUrl
>
