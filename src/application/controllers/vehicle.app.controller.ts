import { VehicleGateway } from "../ports/vehicle.gateway";
import { GetAllVehiclesUseCase } from "../../useCases/vehicle/getAllVehicles.useCase";
import { VehiclePresenter } from "../presenters/vehicle.presenter";

export class VehicleAppController {
  constructor(private gateway: VehicleGateway) {}

  async list(filter: string) {
    const useCase = new GetAllVehiclesUseCase(this.gateway);
    const result = await useCase.execute(filter);
    return VehiclePresenter.list(result);
  }
}
