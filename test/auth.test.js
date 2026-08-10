const {
  expect,
} = require("chai");

const request =
  require("supertest");

// Set test JWT secret before
// loading the application.
process.env.JWT_SECRET =
  "test-jwt-secret";

const app =
  require("../app");

const {
  connectTestDatabase,
  clearTestDatabase,
  closeTestDatabase,
} = require("./setup");


describe(
  "Authentication API",
  function () {

    this.timeout(30000);


    // Start test database
    before(async () => {

      await connectTestDatabase();

    });


    // Clear database before
    // every test
    beforeEach(async () => {

      await clearTestDatabase();

    });


    // Close database
    // after all tests
    after(async () => {

      await closeTestDatabase();

    });


    // =====================================
    // REGISTER
    // =====================================

    describe(
      "POST /api/auth/register",
      () => {

        it(
          "should register a new user",
          async () => {

            const response =
              await request(app)
                .post(
                  "/api/auth/register"
                )
                .send({
                  name:
                    "Test User",

                  email:
                    "test@example.com",

                  password:
                    "password123",
                });


            expect(
              response.status
            ).to.equal(201);


            expect(
              response.body.success
            ).to.equal(true);


            expect(
              response.body.message
            ).to.equal(
              "Registration successful"
            );


            expect(
              response.body
            ).to.have.property(
              "token"
            );


            expect(
              response.body
            ).to.have.property(
              "user"
            );


            expect(
              response.body.user.name
            ).to.equal(
              "Test User"
            );


            expect(
              response.body.user.email
            ).to.equal(
              "test@example.com"
            );


            expect(
              response.body.user
            ).to.not.have.property(
              "password"
            );

          }
        );


        it(
          "should reject missing required fields",
          async () => {

            const response =
              await request(app)
                .post(
                  "/api/auth/register"
                )
                .send({
                  email:
                    "test@example.com",

                  password:
                    "password123",
                });


            expect(
              response.status
            ).to.equal(400);


            expect(
              response.body.success
            ).to.equal(false);


            expect(
              response.body.message
            ).to.equal(
              "Name, email and password are required"
            );

          }
        );


        it(
          "should reject duplicate email",
          async () => {

            await request(app)
              .post(
                "/api/auth/register"
              )
              .send({
                name:
                  "First User",

                email:
                  "duplicate@example.com",

                password:
                  "password123",
              });


            const response =
              await request(app)
                .post(
                  "/api/auth/register"
                )
                .send({
                  name:
                    "Second User",

                  email:
                    "duplicate@example.com",

                  password:
                    "password123",
                });


            expect(
              response.status
            ).to.equal(400);


            expect(
              response.body.success
            ).to.equal(false);


            expect(
              response.body.message
            ).to.equal(
              "Email already exists"
            );

          }
        );

      }
    );


    // =====================================
    // LOGIN
    // =====================================

    describe(
      "POST /api/auth/login",
      () => {

        beforeEach(
          async () => {

            await request(app)
              .post(
                "/api/auth/register"
              )
              .send({
                name:
                  "Login User",

                email:
                  "login@example.com",

                password:
                  "password123",
              });

          }
        );


        it(
          "should login with valid credentials",
          async () => {

            const response =
              await request(app)
                .post(
                  "/api/auth/login"
                )
                .send({
                  email:
                    "login@example.com",

                  password:
                    "password123",
                });


            expect(
              response.status
            ).to.equal(200);


            expect(
              response.body.success
            ).to.equal(true);


            expect(
              response.body.message
            ).to.equal(
              "Login successful"
            );


            expect(
              response.body
            ).to.have.property(
              "token"
            );


            expect(
              response.body
            ).to.have.property(
              "user"
            );


            expect(
              response.body.user.email
            ).to.equal(
              "login@example.com"
            );


            expect(
              response.body.user
            ).to.not.have.property(
              "password"
            );

          }
        );


        it(
          "should reject incorrect password",
          async () => {

            const response =
              await request(app)
                .post(
                  "/api/auth/login"
                )
                .send({
                  email:
                    "login@example.com",

                  password:
                    "wrongpassword",
                });


            expect(
              response.status
            ).to.equal(401);


            expect(
              response.body.success
            ).to.equal(false);


            expect(
              response.body.message
            ).to.equal(
              "Invalid email or password"
            );

          }
        );


        it(
          "should reject unknown email",
          async () => {

            const response =
              await request(app)
                .post(
                  "/api/auth/login"
                )
                .send({
                  email:
                    "unknown@example.com",

                  password:
                    "password123",
                });


            expect(
              response.status
            ).to.equal(401);


            expect(
              response.body.success
            ).to.equal(false);


            expect(
              response.body.message
            ).to.equal(
              "Invalid email or password"
            );

          }
        );


        it(
          "should reject missing password",
          async () => {

            const response =
              await request(app)
                .post(
                  "/api/auth/login"
                )
                .send({
                  email:
                    "login@example.com",
                });


            expect(
              response.status
            ).to.equal(400);


            expect(
              response.body.success
            ).to.equal(false);


            expect(
              response.body.message
            ).to.equal(
              "Email and password are required"
            );

          }
        );

      }
    );

  }
);