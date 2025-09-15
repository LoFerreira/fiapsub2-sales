import { GetAllVehiclesUseCase } from "../../../../src/useCases/vehicle/getAllVehicles.useCase";
import { MockVehicleRepository } from "../../../mocks/vehicle.repository.mock";

jest.mock("../../../../src/infra/repositories/vehicle.repository", () => {
  return {
    VehicleRepository: jest
      .fn()
      .mockImplementation(() => new MockVehicleRepository()),
  };
});

describe("GetAllVehiclesUseCase", () => {
  let useCase: GetAllVehiclesUseCase;
  let mockRepository: MockVehicleRepository;

  beforeEach(() => {
    useCase = new GetAllVehiclesUseCase();

    mockRepository = (useCase as any)
      .vehicleRepository as MockVehicleRepository;
    mockRepository.reset();
  });

  describe("execute", () => {
    it("should return all vehicles when no filter is provided", async () => {
      const result = await useCase.execute("");

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: "1",
        brand: "Toyota",
        model: "Corolla",
        year: 2022,
        color: "White",
        price: 50000,
        sold: false,
      });
      expect(result[1]).toMatchObject({
        id: "2",
        brand: "Honda",
        model: "Civic",
        year: 2021,
        color: "Black",
        price: 45000,
        sold: false,
      });
    });

    it("should return filtered vehicles when filter is provided", async () => {
      const result = await useCase.execute("Toyota");

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        brand: "Toyota",
        model: "Corolla",
      });
    });

    it("should return empty array when filter does not match any vehicle", async () => {
      const result = await useCase.execute("BMW");

      expect(result).toHaveLength(0);
    });

    it("should handle case insensitive filter", async () => {
      const result = await useCase.execute("honda");

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        brand: "Honda",
        model: "Civic",
      });
    });

    it("should filter by model as well as brand", async () => {
      const result = await useCase.execute("Civic");

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        brand: "Honda",
        model: "Civic",
      });
    });
  });
});
