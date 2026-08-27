const request = require("supertest");
const app = require("../app");

describe("App Tests", () => {
  describe("GET /", () => {
    it("should return Notes API running message", async () => {
      const res = await request(app).get("/");

      if (res.statusCode !== 200) {
        throw new Error(`Expected 200 but got ${res.statusCode}`);
      }

      if (res.body.success !== true) {
        throw new Error("Expected success to be true");
      }

      if (res.body.message !== "Notes API Running") {
        throw new Error("Unexpected API message");
      }
    });
  });

  describe("404 Route", () => {
    it("should return 404 for an unknown route", async () => {
      const res = await request(app).get("/this-route-does-not-exist");

      if (res.statusCode !== 404) {
        throw new Error(`Expected 404 but got ${res.statusCode}`);
      }

      if (res.body.success !== false) {
        throw new Error("Expected success to be false");
      }

      if (res.body.message !== "API Route Not Found") {
        throw new Error("Unexpected 404 message");
      }
    });
  });
});