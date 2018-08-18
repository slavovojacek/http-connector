import { HttpConnectorError } from "./helpers"
import HttpConnector from "./main"

describe("HttpConnector", () => {
  beforeEach(() => {
    this.opts = {}
    this.client = {}
  })

  afterEach(() => {
    this.opts = null
    this.client = null
  })

  it("constructs base options correctly", () => {
    const transactionId = "abc-123-def"

    Object.assign(this.opts, {
      name: "serviceName",
      secure: true,
      hostname: "api.example.com",
      port: 4200,
      pathname: "/v2/",
      headers: {},
      timeout: 750,
      transactionId,
    })

    this.client = "MockClient"

    const httpConnector = new HttpConnector(this.opts, this.client)

    const { name, client, transactionId: txId, options } = httpConnector

    expect(name).toEqual("serviceName")
    expect(client).toEqual("MockClient")
    expect(txId).toEqual(transactionId)
    expect(options).toEqual({
      baseUrl: "https://api.example.com:4200/v2/",
      headers: this.opts.headers,
      url: "",
      timeout: 750,
    })
  })

  describe("get", () => {
    it("calls the http client, passing opts", async () => {
      const transactionId = "abc-123-def"

      Object.assign(this.opts, {
        name: "serviceName",
        secure: true,
        hostname: "api.example.com",
        pathname: "/v2/",
        headers: {
          foo: "bar",
        },
        timeout: 1500,
        transactionId,
      })

      this.client = jest.fn()

      const httpConnector = new HttpConnector(this.opts, this.client)

      await httpConnector.get({
        url: "/users",
        headers: {
          authorization: "Bearer __token",
        },
      })

      expect(this.client).toHaveBeenCalledWith({
        baseUrl: "https://api.example.com/v2/",
        url: "/users",
        headers: {
          foo: "bar",
          authorization: "Bearer __token",
        },
        method: "GET",
        timeout: 1500,
      })
    })
  })

  describe("post", () => {
    it("calls the http client, passing opts", async () => {
      const transactionId = "abc-123-def"

      Object.assign(this.opts, {
        name: "serviceName",
        secure: false,
        hostname: "api.example.com",
        pathname: "/v2/",
        headers: {
          foo: "bar",
        },
        transactionId,
      })

      this.client = jest.fn()

      const httpConnector = new HttpConnector(this.opts, this.client)

      await httpConnector.post({
        url: "/users",
        headers: {
          authorization: "Bearer __token",
        },
        body: {
          name: "John Doe",
        },
      })

      expect(this.client).toHaveBeenCalledWith({
        baseUrl: "http://api.example.com/v2/",
        url: "/users",
        headers: {
          foo: "bar",
          authorization: "Bearer __token",
        },
        method: "POST",
        body: {
          name: "John Doe",
        },
      })
    })
  })

  describe("put", () => {
    it("calls the http client, passing opts", async () => {
      const transactionId = "abc-123-def"

      Object.assign(this.opts, {
        name: "serviceName",
        secure: false,
        hostname: "api.example.com",
        pathname: "/v2/",
        headers: {
          foo: "bar",
        },
        transactionId,
      })

      this.client = jest.fn()

      const httpConnector = new HttpConnector(this.opts, this.client)

      await httpConnector.put({
        url: "/users",
        headers: {
          authorization: "Bearer __token",
        },
        body: {
          name: "John Doe",
        },
      })

      expect(this.client).toHaveBeenCalledWith({
        baseUrl: "http://api.example.com/v2/",
        url: "/users",
        headers: {
          foo: "bar",
          authorization: "Bearer __token",
        },
        method: "PUT",
        body: {
          name: "John Doe",
        },
      })
    })
  })

  describe("http", () => {
    it("throws HttpConnectorError on error, captures the right stacktrace", async () => {
      const transactionId = "abc-123-def"

      Object.assign(this.opts, {
        name: "serviceName",
        secure: false,
        hostname: "api.example.com",
        headers: {},
        transactionId,
      })

      this.client = jest.fn().mockImplementation(() => {
        throw new Error("Something went wrong")
      })

      const httpConnector = new HttpConnector(this.opts, this.client)

      try {
        await httpConnector.get({
          url: "/users",
        })
      } catch (err) {
        expect(err instanceof HttpConnectorError).toEqual(true)
        expect(err.name).toEqual("HttpConnectorError")
        expect(err.message).toMatch(/Something went wrong/)
      }
    })
  })
})
