import { fill, isEqual, isInteger, isNonEmptyString } from "@usefultools/utils"
import ConcurrentQueue from "./main"

describe("ConcurrentQueue", () => {
  it("batches operations", async () => {
    const numberOfItems = 10
    const batchSize = numberOfItems / 2

    const cQ = new ConcurrentQueue<number>({ batchSize })
    const ops = fill(numberOfItems).map((id) => () => Promise.resolve(id))
    const batchIds = new Set()

    const collectResults = new Promise((resolve, _reject) => {
      const _results: Array<number> = []

      cQ.on("complete", ({ result, batchId }) => {
        _results.push(result as number) // @TODO look at conditional types
        batchIds.add(batchId)

        if (isEqual(_results.length, numberOfItems)) {
          resolve(_results)
        }
      })
    })

    ops.forEach((item) => cQ.enqueue(item))

    const results = await collectResults

    expect(batchIds.size).toEqual(numberOfItems / batchSize)
    expect(results).toEqual(fill(numberOfItems))
  })

  it("batches operations, executes the rest after a timeout", async () => {
    const numberOfItems = 32
    const batchSize = 7

    const cQ = new ConcurrentQueue<number>({ batchSize })
    const ops = fill(numberOfItems).map((id) => () => Promise.resolve(id))
    const batchIds = new Set()

    const collectResults = new Promise((resolve, _reject) => {
      const _results: Array<number> = []

      cQ.on("complete", ({ result, batchId }) => {
        _results.push(result as number) // @TODO look at conditional types
        batchIds.add(batchId)

        if (isEqual(_results.length, numberOfItems)) {
          resolve(_results)
        }
      })
    })

    ops.forEach((item) => cQ.enqueue(item))

    const results = await collectResults

    // Because when executeBatch is called for the last time,
    // new batchId is created regardless of the number of remaining items.
    expect(batchIds.size).toEqual(Math.floor(numberOfItems / batchSize) + 1)
    expect(results).toEqual(fill(numberOfItems))
  })

  it("eventually executes after a timeout if not enough items for a batch", async () => {
    const numberOfItems = 7
    const batchSize = 10

    const cQ = new ConcurrentQueue<number>({ batchSize, batchNotFullIntervalMs: 250 })
    const ops = fill(numberOfItems).map((id) => () => Promise.resolve(id))
    const batchIds = new Set()

    const collectResults = new Promise((resolve, _reject) => {
      const _results: Array<number> = []

      cQ.on("complete", ({ result, batchId }) => {
        _results.push(result as number) // @TODO look at conditional types
        batchIds.add(batchId)

        if (isEqual(_results.length, numberOfItems)) {
          resolve(_results)
        }
      })
    })

    ops.forEach((item) => cQ.enqueue(item))

    const results = await collectResults

    // Because when executeBatch is called for the last time,
    // new batchId is created regardless of the number of remaining items.
    expect(batchIds.size).toEqual(Math.floor(numberOfItems / batchSize) + 1)
    expect(results).toEqual(fill(numberOfItems))
  })

  it("captures both successes and errors", async () => {
    interface Result {
      type: "ok" | "err"
      value: any
    }

    const numberOfSuccesses = 13
    const numberOfErrors = 5
    const numberOfItems = numberOfSuccesses + numberOfErrors
    const batchSize = 4

    const cQ = new ConcurrentQueue<number>({ batchSize, batchDelayMs: 250 })
    const opsOk = fill(numberOfSuccesses).map((id) => () => Promise.resolve(id))
    const opsErr = fill(numberOfErrors).map((id) => () => Promise.reject(id.toString()))
    const batchIds = new Set()

    const collectResults: Promise<Array<Result>> = new Promise((resolve, _reject) => {
      const _results: Array<Result> = []

      cQ.on("complete", ({ result, batchId }) => {
        _results.push({ type: "ok", value: result })
        batchIds.add(batchId)

        if (isEqual(_results.length, numberOfItems)) {
          resolve(_results)
        }
      })

      cQ.on("error", ({ error, batchId }) => {
        _results.push({ type: "err", value: error })
        batchIds.add(batchId)

        if (isEqual(_results.length, numberOfItems)) {
          resolve(_results)
        }
      })
    })

    const ops: Array<() => Promise<number>> = [...opsOk, ...opsErr]

    ops.forEach((item) => cQ.enqueue(item))

    const results: Array<Result> = await collectResults

    const okResults = results.filter(
      (result) => isEqual(result.type, "ok") && isInteger(result.value),
    )
    const errResults = results.filter(
      (result) => isEqual(result.type, "err") && isNonEmptyString(result.value),
    )

    expect(results.length).toEqual(numberOfItems)
    expect(okResults.length).toEqual(numberOfSuccesses)
    expect(errResults.length).toEqual(numberOfErrors)
    // Because when executeBatch is called for the last time,
    // new batchId is created regardless of the number of remaining items.
    expect(batchIds.size).toEqual(Math.floor(numberOfItems / batchSize) + 1)
  })
})
