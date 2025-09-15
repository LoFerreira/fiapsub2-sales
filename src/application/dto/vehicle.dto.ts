import { vehicle } from "../../domain/entities/vehicle.entity";

export type VehicleResponseDTO = {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  price: number;
  sold: boolean;
};

export const vehicleToResponseDTO = (v: vehicle): VehicleResponseDTO => ({
  id: v.id,
  brand: v.brand,
  model: v.model,
  year: v.year,
  color: v.color,
  price: v.price,
  sold: Boolean(v.sold),
});
