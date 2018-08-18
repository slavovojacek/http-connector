import { RequestAPI, RequiredUriUrl } from "request"
import { RequestPromise, RequestPromiseOptions } from "request-promise-native"

export interface Opts<T> {
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
