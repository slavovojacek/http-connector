export interface Opts {
  batchSize: number
  batchDelayMs?: number
  batchNotFullIntervalMs?: number
}

export interface QueueItem<T> {
  id: string
  fulfilled: boolean
  fn: () => Promise<T>
  result?: T
  error: Error | null
  batchId: string | null
}
