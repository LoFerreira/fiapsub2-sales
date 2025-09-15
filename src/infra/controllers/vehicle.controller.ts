import { Request, Response } from "express";
import { VehiclePresenter } from "../../application/presenters/vehicle.presenter";
import { CoreVehicleHttpRepository } from "../repositories/core-vehicle-http.repository";
import { GetAllVehiclesUseCase } from "../../useCases/vehicle/getAllVehicles.useCase";

export class VehicleController {
  static async getAll(req: Request, res: Response) {
    const { filter } = req.query;

    // Busca veículos no fiapsub2-core
    const getAllVehiclesUseCase = new GetAllVehiclesUseCase(
      new CoreVehicleHttpRepository()
    );
    const vehicles = await getAllVehiclesUseCase.execute(filter as string);
    res.status(200).send(VehiclePresenter.list(vehicles));
  }
}
