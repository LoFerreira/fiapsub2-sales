import request from "supertest";
import { createTestApp } from "../../helpers/test-app.helper";
import { MockVehicleRepository } from "../../mocks/vehicle.repository.mock";

jest.mock("../../../src/infra/repositories/vehicle.repository", () => {
  return {
    VehicleRepository: jest
      .fn()
      .mockImplementation(() => new MockVehicleRepository()),
  };
});

describe("VehicleController Integration Tests", () => {
  const app = createTestApp();
  let mockRepository: MockVehicleRepository;

  beforeEach(() => {
    mockRepository = new MockVehicleRepository();
    mockRepository.reset();
  });

  describe("GET /vehicles", () => {
    it("should return all vehicles when no filter is provided", async () => {
      const response = await request(app).get("/vehicles").expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject({
        id: "1",
        brand: "Toyota",
        model: "Corolla",
      });
      expect(response.body[1]).toMatchObject({
        id: "2",
        brand: "Honda",
        model: "Civic",
      });
    });

    it("should return only sold vehicles when filter is 'sold'", async () => {
      await request(app)
        .put("/vehicles/1")
        .send({
          sold: true,
          brand: "Toyota",
          model: "Corolla",
          year: 2020,
          color: "White",
          price: 40000,
        })
        .expect(200);

      const response = await request(app)
        .get("/vehicles?filter=sold")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((vehicle: any) => {
        expect(vehicle.sold).toBe(true);
      });
    });

    it("should return only available vehicles when filter is 'available'", async () => {
      await request(app)
        .put("/vehicles/2")
        .send({
          sold: true,
          brand: "Honda",
          model: "Civic",
          year: 2021,
          color: "Black",
          price: 45000,
        })
        .expect(200);

      const response = await request(app)
        .get("/vehicles?filter=available")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((vehicle: any) => {
        expect(vehicle.sold).toBe(false);
      });
    });
  });

  describe("POST /vehicles", () => {
    it("should create a new vehicle successfully", async () => {
      const vehicleData = {
        brand: "Volkswagen",
        model: "Golf",
        year: 2023,
        color: "Blue",
        price: 35000,
        sold: false,
      };

      const response = await request(app)
        .post("/vehicles")
        .send(vehicleData)
        .expect(201);

      expect(response.body).toMatchObject({
        message: "Vehicle created successfully",
        vehicle: expect.objectContaining({
          brand: "Volkswagen",
          model: "Golf",
          year: 2023,
          color: "Blue",
          price: 35000,
          sold: false,
        }),
      });
    });

    it("should return 400 for invalid vehicle data", async () => {
      const invalidVehicleData = {
        brand: "Ford",
      };

      const response = await request(app)
        .post("/vehicles")
        .send(invalidVehicleData)
        .expect(400);

      expect(response.body).toHaveProperty("message");
    });
  });

  describe("PUT /vehicles/:id", () => {
    it("should update an existing vehicle successfully", async () => {
      const updateData = {
        brand: "Toyota",
        model: "Corolla",
        year: 2023,
        color: "Silver",
        price: 52000,
        sold: false,
      };

      const response = await request(app)
        .put("/vehicles/1")
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject({
        message: "Vehicle with id 1 updated successfully",
        vehicle: expect.objectContaining({
          id: "1",
          year: 2023,
          color: "Silver",
          price: 52000,
        }),
      });
    });

    it("should return 404 for non-existent vehicle", async () => {
      const updateData = {
        brand: "Toyota",
        model: "Corolla",
        year: 2023,
        color: "Silver",
        price: 52000,
        sold: false,
      };

      const response = await request(app)
        .put("/vehicles/999")
        .send(updateData)
        .expect(404);

      expect(response.body).toHaveProperty("message");
    });
  });
});
