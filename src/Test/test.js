require('dotenv').config();
const request = require("supertest");
const app = require("../app");
const HealthCheck = require("../models");
const sequelize = require('../config/db');

// Mock console methods
console.error = jest.fn();
console.log = jest.fn();

describe("Health Check API (/healthz)", () => {
    
    beforeAll(async () => {
        await sequelize.authenticate(); // Ensure DB is connected before tests
    });

    afterAll(async () => {
        await sequelize.close(); // Close DB connection after tests
    });


     //Test 1: Should return 200 OK when GET request is made without body/query params
     /*   test("Should return 200 OK when called with GET and no body/query params", async () => {
        const res = await request(app).get("/healthz");
        expect(res.status).toBe(200);
        expect(res.headers["x-content-type-options"]).toBe("nosniff");
        expect(res.headers["cache-control"]).toBe("no-cache, no-store, must-revalidate");
      }); */


     /*  test('Valid GET request to /healthz should return 200 OK', async () => {
         const res = await request(app).get('/healthz');
         expect(res.status).toBe(200);
     }); */
    
    test('Valid GET request to /healthz should return 200 OK', async () => {
        // Mock successful database insert
        //jest.spyOn(HealthCheck, 'create').mockResolvedValue({ id: 1, datetime: new Date() });

        const res = await request(app).get('/healthz');
        expect(res.status).toBe(200);
    });
    //Test 2: Should return 400 Bad Request if a body is sent
    test("Should return 400 Bad Request if body is sent", async () => {
        const res = await request(app).get("/healthz").send({ key: "value" });
        expect(res.status).toBe(400);
    });

    //Test 3: Should return 400 Bad Request if query params are included
    test("Should return 400 Bad Request if query params are included", async () => {
        const res = await request(app).get("/healthz?param=value");
        expect(res.status).toBe(400);
    });

    //Test 4: Should return 405 Method Not Allowed if using POST, PUT, DELETE
    test("Should return 405 for non-GET methods (POST)", async () => {
        const res = await request(app).post("/healthz");
        expect(res.status).toBe(405);
    });

    test("Should return 405 for non-GET methods (PUT)", async () => {
        const res = await request(app).put("/healthz");
        expect(res.status).toBe(405);
    });

    test("Should return 405 for non-GET methods (DELETE)", async () => {
        const res = await request(app).delete("/healthz");
        expect(res.status).toBe(405);
    });

    //Test 5: Should return 503 Service Unavailable if HealthCheck DB operation fails
   /*  test("Should return 503 if database operation fails", async () => {
        jest.spyOn(HealthCheck, 'create').mockRejectedValue(new Error("Database error")); // Suppress error logs

        const res = await request(app).get("/healthz");
        expect(res.status).toBe(503);
    }); */
    
});
