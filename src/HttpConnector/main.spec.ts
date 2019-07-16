import { HttpConnectorError } from "./helpers"
import HttpConnector from "./main"

describe("HttpConnector", () => {
  const self: any = {}

  beforeEach(() => {
    self.opts = {}
    self.client = {}
  })

  afterEach(() => {
    self.opts = null
    self.client = null
  })

  it("constructs base options correctly", () => {
    const correlationId = "abc-123-def"

    Object.assign(self.opts, {
      name: "serviceName",
      baseUrl: "https://api.example.com:4200/v2/",
      headers: {},
      timeout: 750,
      correlationId,
    })

    self.client = "MockClient"

    const httpConnector = new HttpConnector(self.opts, self.client)

    const { name, client, correlationId: txId, options } = httpConnector

    expect(name).toEqual("serviceName")
    expect(client).toEqual("MockClient")
    expect(txId).toEqual(correlationId)
    expect(options).toEqual({
      baseUrl: "https://api.example.com:4200/v2/",
      headers: self.opts.headers,
      url: "",
      timeout: 750,
    })
  })

  describe("get", () => {
    it("calls the http client, passing opts", async () => {
      const correlationId = "abc-123-def"

      Object.assign(self.opts, {
        name: "serviceName",
        baseUrl: "https://api.example.com/v2/",
        headers: {
          foo: "bar",
        },
        timeout: 1500,
        correlationId,
      })

      self.client = jest.fn()

      const httpConnector = new HttpConnector(self.opts, self.client)

      await httpConnector.get({
        url: "/users",
        headers: {
          authorization: "Bearer __token",
        },
      })

      expect(self.client).toHaveBeenCalledWith({
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

    it("removes original headers if instructed to do so", async () => {
      const correlationId = "abc-123-def"

      Object.assign(self.opts, {
        name: "serviceName",
        baseUrl: "https://api.example.com/v2/",
        headers: {
          foo: "bar",
        },
        correlationId,
      })

      self.client = jest.fn()

      const httpConnector = new HttpConnector(self.opts, self.client)

      await httpConnector.get(
        {
          url: "/users",
          headers: {
            authorization: "Bearer __token",
          },
        },
        true,
      )

      expect(self.client).toHaveBeenCalledWith({
        baseUrl: "https://api.example.com/v2/",
        url: "/users",
        headers: {
          authorization: "Bearer __token",
        },
        method: "GET",
      })
    })
  })

  describe("post", () => {
    it("calls the http client, passing opts", async () => {
      const correlationId = "abc-123-def"

      Object.assign(self.opts, {
        name: "serviceName",
        baseUrl: "http://api.example.com/v2/",
        headers: {
          foo: "bar",
        },
        timeout: 1500,
        correlationId,
      })

      self.client = jest.fn()

      const httpConnector = new HttpConnector(self.opts, self.client)

      await httpConnector.post({
        url: "/users",
        headers: {
          authorization: "Bearer __token",
        },
        body: {
          name: "John Doe",
        },
      })

      expect(self.client).toHaveBeenCalledWith({
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
        timeout: 1500,
      })
    })

    it("removes original headers if instructed to do so", async () => {
      const correlationId = "abc-123-def"

      Object.assign(self.opts, {
        name: "serviceName",
        baseUrl: "http://api.example.com/v2/",
        headers: {
          foo: "bar",
        },
        correlationId,
      })

      self.client = jest.fn()

      const httpConnector = new HttpConnector(self.opts, self.client)

      await httpConnector.post(
        {
          url: "/users",
          headers: {
            authorization: "Bearer __token",
          },
          body: {
            name: "John Doe",
          },
        },
        true,
      )

      expect(self.client).toHaveBeenCalledWith({
        baseUrl: "http://api.example.com/v2/",
        url: "/users",
        headers: {
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
      const correlationId = "abc-123-def"

      Object.assign(self.opts, {
        name: "serviceName",
        baseUrl: "http://api.example.com/v2/",
        headers: {
          foo: "bar",
        },
        timeout: 300,
        correlationId,
      })

      self.client = jest.fn()

      const httpConnector = new HttpConnector(self.opts, self.client)

      await httpConnector.put({
        url: "/users",
        headers: {
          authorization: "Bearer __token",
        },
        body: {
          name: "John Doe",
        },
      })

      expect(self.client).toHaveBeenCalledWith({
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
        timeout: 300,
      })
    })

    it("removes original headers if instructed to do so", async () => {
      const correlationId = "abc-123-def"

      Object.assign(self.opts, {
        name: "serviceName",
        baseUrl: "http://api.example.com/v2/",
        headers: {
          foo: "bar",
        },
        correlationId,
      })

      self.client = jest.fn()

      const httpConnector = new HttpConnector(self.opts, self.client)

      await httpConnector.put(
        {
          url: "/users",
          headers: {
            authorization: "Bearer __token",
          },
          body: {
            name: "John Doe",
          },
        },
        true,
      )

      expect(self.client).toHaveBeenCalledWith({
        baseUrl: "http://api.example.com/v2/",
        url: "/users",
        headers: {
          authorization: "Bearer __token",
        },
        method: "PUT",
        body: {
          name: "John Doe",
        },
      })
    })
  })

  describe("patch", () => {
    it("calls the http client, passing opts", async () => {
      const correlationId = "abc-123-def"

      Object.assign(self.opts, {
        name: "serviceName",
        baseUrl: "http://api.example.com/v2/",
        headers: {
          foo: "bar",
        },
        timeout: 150,
        correlationId,
      })

      self.client = jest.fn()

      const httpConnector = new HttpConnector(self.opts, self.client)

      await httpConnector.patch({
        url: "/users",
        headers: {
          authorization: "Bearer __token",
        },
        body: {
          name: "John Doe",
        },
      })

      expect(self.client).toHaveBeenCalledWith({
        baseUrl: "http://api.example.com/v2/",
        url: "/users",
        headers: {
          foo: "bar",
          authorization: "Bearer __token",
        },
        method: "PATCH",
        body: {
          name: "John Doe",
        },
        timeout: 150,
      })
    })

    it("removes original headers if instructed to do so", async () => {
      const correlationId = "abc-123-def"

      Object.assign(self.opts, {
        name: "serviceName",
        baseUrl: "http://api.example.com/v2/",
        headers: {
          foo: "bar",
        },
        correlationId,
      })

      self.client = jest.fn()

      const httpConnector = new HttpConnector(self.opts, self.client)

      await httpConnector.patch(
        {
          url: "/users",
          headers: {
            authorization: "Bearer __token",
          },
          body: {
            name: "John Doe",
          },
        },
        true,
      )

      expect(self.client).toHaveBeenCalledWith({
        baseUrl: "http://api.example.com/v2/",
        url: "/users",
        headers: {
          authorization: "Bearer __token",
        },
        method: "PATCH",
        body: {
          name: "John Doe",
        },
      })
    })
  })

  describe("delete", () => {
    it("calls the http client, passing opts", async () => {
      const correlationId = "abc-123-def"

      Object.assign(self.opts, {
        name: "serviceName",
        baseUrl: "http://api.example.com/v2/",
        headers: {
          foo: "bar",
        },
        timeout: 0,
        correlationId,
      })

      self.client = jest.fn()

      const httpConnector = new HttpConnector(self.opts, self.client)

      await httpConnector.delete({
        url: "/users",
        headers: {
          authorization: "Bearer __token",
        },
        body: {
          name: "John Doe",
        },
      })

      expect(self.client).toHaveBeenCalledWith({
        baseUrl: "http://api.example.com/v2/",
        url: "/users",
        headers: {
          foo: "bar",
          authorization: "Bearer __token",
        },
        method: "DELETE",
        body: {
          name: "John Doe",
        },
        timeout: 0,
      })
    })

    it("removes original headers if instructed to do so", async () => {
      const correlationId = "abc-123-def"

      Object.assign(self.opts, {
        name: "serviceName",
        baseUrl: "http://api.example.com/v2/",
        headers: {
          foo: "bar",
        },
        correlationId,
      })

      self.client = jest.fn()

      const httpConnector = new HttpConnector(self.opts, self.client)

      await httpConnector.delete(
        {
          url: "/users",
          headers: {
            authorization: "Bearer __token",
          },
          body: {
            name: "John Doe",
          },
        },
        true,
      )

      expect(self.client).toHaveBeenCalledWith({
        baseUrl: "http://api.example.com/v2/",
        url: "/users",
        headers: {
          authorization: "Bearer __token",
        },
        method: "DELETE",
        body: {
          name: "John Doe",
        },
      })
    })
  })

  describe("http", () => {
    it("throws HttpConnectorError on error, captures the right stacktrace", async () => {
      const correlationId = "abc-123-def"

      Object.assign(self.opts, {
        name: "serviceName",
        baseUrl: "http://api.example.com/",
        headers: {},
        correlationId,
      })

      self.client = jest.fn().mockImplementation(() => {
        throw new Error("Something went wrong")
      })

      const httpConnector = new HttpConnector(self.opts, self.client)

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
