import {
  generateId,
  isEqual,
  isFalse,
  isFunction,
  isMissing,
  isPresent,
} from "@openmaths/utils"
import { Opts, QueueItem } from "./types"

class ConcurrentQueue<T> {
  private batchSize: number
  private batchDelayMs: number
  private batchNotFullIntervalMs: number
  private onComplete?: (queueItem: QueueItem<T>) => any
  private onError?: (queueItem: QueueItem<T>) => any
  private processing: boolean
  private queue: Array<QueueItem<T>>
  private timeout: any

  constructor({ batchSize, batchDelayMs = 0, batchNotFullIntervalMs = 0 }: Opts) {
    this.batchSize = batchSize
    this.batchDelayMs = batchDelayMs
    this.batchNotFullIntervalMs = batchNotFullIntervalMs
    this.processing = false
    this.queue = []
    this.timeout = null
  }

  enqueue = (fn: () => Promise<T>): string => {
    const id = generateId()

    this.queue.push({
      batchId: null,
      id,
      error: null,
      fn,
      fulfilled: false,
    })

    if (isEqual(this.queue.length, this.batchSize) && isFalse(this.processing)) {
      this.exectueQueue()
    } else if (isMissing(this.timeout)) {
      this.timeout = setTimeout(() => {
        this.exectueQueue()
      }, this.batchNotFullIntervalMs)
    }

    return id
  }

  on = (type: "complete" | "error", cb: (queueItem: QueueItem<T>) => any) => {
    switch (type) {
      case "complete":
        this.onComplete = cb
        break
      case "error":
        this.onError = cb
        break
      default:
        throw new Error(`Unsupported type ${type}`)
    }
  }

  private exectueQueue = async () => {
    if (this.processing || this.queue.length === 0) {
      return []
    }

    if (isPresent(this.timeout)) {
      clearTimeout(this.timeout)
    }

    this.processing = true

    const queue = this.queue.splice(0, this.batchSize)
    const batchId = generateId()

    const results = await Promise.all(
      queue.map(
        async (item): Promise<QueueItem<T>> => {
          try {
            const result = await item.fn()

            const queueItem: QueueItem<T> = {
              ...item,
              fulfilled: true,
              result,
              batchId,
            }

            if (isFunction(this.onComplete)) {
              this.onComplete(queueItem)
            }

            return queueItem
          } catch (error) {
            const queueItem: QueueItem<T> = {
              ...item,
              fulfilled: true,
              error,
              batchId,
            }

            if (isFunction(this.onError)) {
              this.onError(queueItem)
            }

            return queueItem
          }
        },
      ),
    )

    this.processing = false

    if (this.queue.length >= this.batchSize) {
      this.timeout = setTimeout(() => {
        this.exectueQueue()
      }, this.batchDelayMs)
    } else if (this.queue.length > 0) {
      this.timeout = setTimeout(() => {
        this.exectueQueue()
      }, this.batchNotFullIntervalMs)
    }

    return results
  }
}

export default ConcurrentQueue
