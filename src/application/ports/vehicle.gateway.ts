import { vehicle } from "../../domain/entities/vehicle.entity";

// Port/Gateway for vehicle persistence. Implemented in infra layer.
export interface VehicleGateway {
  getAll(filter: string): Promise<vehicle[]>;
}
