const {
  expect,
} = require("chai");

const request =
  require("supertest");

const jwt =
  require("jsonwebtoken");

const User =
  require("../models/User");

const Note =
  require("../models/Note");

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
  "Notes API",
  function () {

    this.timeout(30000);

    let user;
    let token;


    // =====================================
    // DATABASE
    // =====================================

    before(async () => {

      await connectTestDatabase();

    });


    beforeEach(async () => {

      await clearTestDatabase();


      // Create test user
      user =
        await User.create({
          name:
            "Test User",

          email:
            "notes@example.com",

          password:
            "$2b$10$abcdefghijklmnopqrstuuuuuuuuuuuuuuuuuuuuuuuuuuuu",
        });


      // Generate JWT
      token =
        jwt.sign(
          {
            id:
              user._id,
          },
          process.env.JWT_SECRET
        );

    });


    after(async () => {

      await closeTestDatabase();

    });


    // =====================================
    // GET NOTES
    // =====================================

    describe(
      "GET /api/notes",
      () => {

        it(
          "should return an empty notes list for a new user",
          async () => {

            const response =
              await request(app)
                .get(
                  "/api/notes"
                )
                .set(
                  "Authorization",
                  `Bearer ${token}`
                );


            expect(
              response.status
            ).to.equal(200);


            expect(
              response.body.success
            ).to.equal(true);


            expect(
              response.body.notes
            ).to.be.an("array");


            expect(
              response.body.notes
            ).to.have.lengthOf(0);

          }
        );


        it(
          "should reject request without token",
          async () => {

            const response =
              await request(app)
                .get(
                  "/api/notes"
                );


            expect(
              response.status
            ).to.equal(401);


            expect(
              response.body.success
            ).to.equal(false);


            expect(
              response.body.message
            ).to.equal(
              "Not authorized. Token is missing."
            );

          }
        );

      }
    );


    // =====================================
    // CREATE NOTE
    // =====================================

    describe(
      "POST /api/notes",
      () => {

        it(
          "should create a note",
          async () => {

            const response =
              await request(app)
                .post(
                  "/api/notes"
                )
                .set(
                  "Authorization",
                  `Bearer ${token}`
                )
                .send({
                  title:
                    "My First Note",

                  content:
                    "This is my first note.",
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
              "Note created successfully."
            );


            expect(
              response.body.note
            ).to.have.property(
              "_id"
            );


            expect(
              response.body.note.title
            ).to.equal(
              "My First Note"
            );


            expect(
              response.body.note.content
            ).to.equal(
              "This is my first note."
            );


            expect(
              String(
                response.body.note.user
              )
            ).to.equal(
              String(user._id)
            );

          }
        );


        it(
          "should reject note without title",
          async () => {

            const response =
              await request(app)
                .post(
                  "/api/notes"
                )
                .set(
                  "Authorization",
                  `Bearer ${token}`
                )
                .send({
                  content:
                    "Note content",
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
              "Title and content are required."
            );

          }
        );


        it(
          "should reject note without content",
          async () => {

            const response =
              await request(app)
                .post(
                  "/api/notes"
                )
                .set(
                  "Authorization",
                  `Bearer ${token}`
                )
                .send({
                  title:
                    "Note title",
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
              "Title and content are required."
            );

          }
        );

      }
    );


    // =====================================
    // GET ONE NOTE
    // =====================================

    describe(
      "GET /api/notes/:id",
      () => {

        it(
          "should return a note by id",
          async () => {

            const note =
              await Note.create({
                title:
                  "Test Note",

                content:
                  "Test Content",

                user:
                  user._id,
              });


            const response =
              await request(app)
                .get(
                  `/api/notes/${note._id}`
                )
                .set(
                  "Authorization",
                  `Bearer ${token}`
                );


            expect(
              response.status
            ).to.equal(200);


            expect(
              response.body.success
            ).to.equal(true);


            expect(
              response.body.note.title
            ).to.equal(
              "Test Note"
            );


            expect(
              response.body.note.content
            ).to.equal(
              "Test Content"
            );

          }
        );


        it(
          "should return 404 for a note that does not exist",
          async () => {

            const fakeId =
              new Note()._id;

            const response =
              await request(app)
                .get(
                  `/api/notes/${fakeId}`
                )
                .set(
                  "Authorization",
                  `Bearer ${token}`
                );


            expect(
              response.status
            ).to.equal(404);


            expect(
              response.body.success
            ).to.equal(false);


            expect(
              response.body.message
            ).to.equal(
              "Note not found."
            );

          }
        );

      }
    );


    // =====================================
    // UPDATE NOTE
    // =====================================

    describe(
      "PUT /api/notes/:id",
      () => {

        it(
          "should update a note",
          async () => {

            const note =
              await Note.create({
                title:
                  "Old Title",

                content:
                  "Old Content",

                user:
                  user._id,
              });


            const response =
              await request(app)
                .put(
                  `/api/notes/${note._id}`
                )
                .set(
                  "Authorization",
                  `Bearer ${token}`
                )
                .send({
                  title:
                    "Updated Title",

                  content:
                    "Updated Content",
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
              "Note updated successfully."
            );


            expect(
              response.body.note.title
            ).to.equal(
              "Updated Title"
            );


            expect(
              response.body.note.content
            ).to.equal(
              "Updated Content"
            );

          }
        );


        it(
          "should return 404 when updating a missing note",
          async () => {

            const fakeId =
              new Note()._id;

            const response =
              await request(app)
                .put(
                  `/api/notes/${fakeId}`
                )
                .set(
                  "Authorization",
                  `Bearer ${token}`
                )
                .send({
                  title:
                    "Updated",

                  content:
                    "Updated",
                });


            expect(
              response.status
            ).to.equal(404);


            expect(
              response.body.success
            ).to.equal(false);

          }
        );

      }
    );


    // =====================================
    // DELETE NOTE
    // =====================================

    describe(
      "DELETE /api/notes/:id",
      () => {

        it(
          "should delete a note",
          async () => {

            const note =
              await Note.create({
                title:
                  "Delete Me",

                content:
                  "This note will be deleted.",

                user:
                  user._id,
              });


            const response =
              await request(app)
                .delete(
                  `/api/notes/${note._id}`
                )
                .set(
                  "Authorization",
                  `Bearer ${token}`
                );


            expect(
              response.status
            ).to.equal(200);


            expect(
              response.body.success
            ).to.equal(true);


            expect(
              response.body.message
            ).to.equal(
              "Note deleted successfully."
            );


            const deletedNote =
              await Note.findById(
                note._id
              );


            expect(
              deletedNote
            ).to.equal(null);

          }
        );


        it(
          "should return 404 when deleting a missing note",
          async () => {

            const fakeId =
              new Note()._id;

            const response =
              await request(app)
                .delete(
                  `/api/notes/${fakeId}`
                )
                .set(
                  "Authorization",
                  `Bearer ${token}`
                );


            expect(
              response.status
            ).to.equal(404);


            expect(
              response.body.success
            ).to.equal(false);

          }
        );

      }
    );


    // =====================================
    // PROTECTED ROUTES
    // =====================================

    describe(
      "Protected note routes",
      () => {

        it(
          "should reject creating a note without authentication",
          async () => {

            const response =
              await request(app)
                .post(
                  "/api/notes"
                )
                .send({
                  title:
                    "Unauthorized Note",

                  content:
                    "This should fail.",
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
              "Not authorized. Token is missing."
            );

          }
        );

      }
    );

  }
);