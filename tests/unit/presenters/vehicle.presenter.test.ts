import { VehiclePresenter } from "../../../src/application/presenters/vehicle.presenter";
import { vehicle } from "../../../src/domain/entities/vehicle.entity";

describe("VehiclePresenter", () => {
  it("should map vehicle entity to response DTO hiding buyerCpf and saleDate", () => {
    const entity: vehicle = {
      id: "1",
      brand: "Toyota",
      model: "Corolla",
      year: 2024,
      color: "White",
      price: 50000,
      sold: false,
      buyerCpf: "123",
      saleDate: "2025-01-01",
    };

    const dto = VehiclePresenter.toResponse(entity);
    expect(dto).toEqual({
      id: "1",
      brand: "Toyota",
      model: "Corolla",
      year: 2024,
      color: "White",
      price: 50000,
      sold: false,
    });
    expect((dto as any).buyerCpf).toBeUndefined();
  });
});
