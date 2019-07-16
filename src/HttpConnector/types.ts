import { RequestAPI, RequiredUriUrl } from "request"
import { RequestPromise, RequestPromiseOptions } from "request-promise-native"

export interface Opts<T> {
  name: string
  baseUrl: string
  headers: T
  timeout?: number
  correlationId: string
}

export type HttpClient = RequestAPI<
  RequestPromise<any>,
  RequestPromiseOptions,
  RequiredUriUrl
>
