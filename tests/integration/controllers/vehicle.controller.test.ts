import request from "supertest";
import { createTestApp } from "../../helpers/test-app.helper";

jest.mock(
  "../../../src/infra/repositories/core-vehicle-http.repository",
  () => {
    const vehicles = [
      {
        id: "1",
        brand: "Toyota",
        model: "Corolla",
        year: 2022,
        color: "White",
        price: 50000,
        sold: true,
      },
      {
        id: "2",
        brand: "Honda",
        model: "Civic",
        year: 2021,
        color: "Black",
        price: 45000,
        sold: false,
      },
    ];

    return {
      CoreVehicleHttpRepository: jest.fn().mockImplementation(() => ({
        getAll: (filter?: string) => {
          if (filter === "sold")
            return Promise.resolve(vehicles.filter((v) => v.sold));
          if (filter === "available")
            return Promise.resolve(vehicles.filter((v) => !v.sold));
          return Promise.resolve(vehicles);
        },
        sell: jest.fn().mockResolvedValue(null),
      })),
    };
  }
);

describe("VehicleController Integration Tests", () => {
  const app = createTestApp();

  describe("GET /vehicles", () => {
    it("deve retornar todos os veículos quando nenhum filtro é fornecido", async () => {
      const response = await request(app).get("/vehicles").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
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

    it("deve retornar apenas veículos vendidos quando filter='sold'", async () => {
      const response = await request(app)
        .get("/vehicles?filter=sold")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
      response.body.forEach((vehicle: any) => {
        expect(vehicle.sold).toBe(true);
      });
    });

    it("deve retornar apenas veículos disponíveis quando filter='available'", async () => {
      const response = await request(app)
        .get("/vehicles?filter=available")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((vehicle: any) => {
        expect(vehicle.sold).toBe(false);
      });
    });
  });
});
