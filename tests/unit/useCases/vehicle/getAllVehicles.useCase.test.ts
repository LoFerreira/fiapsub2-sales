import { GetAllVehiclesUseCase } from "../../../../src/useCases/vehicle/getAllVehicles.useCase";

jest.mock(
  "../../../../src/infra/repositories/core-vehicle-http.repository",
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
      })),
    };
  }
);

describe("GetAllVehiclesUseCase", () => {
  let useCase: GetAllVehiclesUseCase;

  beforeEach(() => {
    useCase = new GetAllVehiclesUseCase();
  });

  describe("execute", () => {
    it("deve retornar todos os veículos quando sem filtro", async () => {
      const result = await useCase.execute("");
      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ id: "1" });
      expect(result[1]).toMatchObject({ id: "2" });
    });

    it("deve retornar apenas vendidos quando filter='sold'", async () => {
      const result = await useCase.execute("sold");
      expect(result).toHaveLength(1);
      expect(result[0].sold).toBe(true);
    });

    it("deve retornar apenas disponíveis quando filter='available'", async () => {
      const result = await useCase.execute("available");
      expect(result.length).toBeGreaterThanOrEqual(1);
      result.forEach((v) => expect(v.sold).toBe(false));
    });
  });
});
