import { vehicle } from "../../src/domain/entities/vehicle.entity";

const sharedVehicles: vehicle[] = [
  {
    id: "1",
    brand: "Toyota",
    model: "Corolla",
    year: 2022,
    color: "White",
    price: 50000,
    sold: false,
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

export class MockVehicleRepository {
  private vehicles: vehicle[] = sharedVehicles;

  async getAll(filter?: string): Promise<vehicle[]> {
    if (filter) {
      return this.vehicles.filter(
        (v) =>
          v.brand.toLowerCase().includes(filter.toLowerCase()) ||
          v.model.toLowerCase().includes(filter.toLowerCase())
      );
    }
    return this.vehicles;
  }

  async create(vehicleData: Omit<vehicle, "id">): Promise<vehicle> {
    const newVehicle: vehicle = {
      id: (this.vehicles.length + 1).toString(),
      ...vehicleData,
      sold: vehicleData.sold ?? false,
    };
    this.vehicles.push(newVehicle);
    return newVehicle;
  }

  async update(
    id: string,
    vehicleData: Partial<vehicle>
  ): Promise<vehicle | null> {
    const vehicleIndex = this.vehicles.findIndex((v) => v.id === id);
    if (vehicleIndex === -1) return null;

    this.vehicles[vehicleIndex] = {
      ...this.vehicles[vehicleIndex],
      ...vehicleData,
    };
    return this.vehicles[vehicleIndex];
  }

  async findById(id: string): Promise<vehicle | null> {
    return this.vehicles.find((v) => v.id === id) || null;
  }

  async getById(id: string): Promise<vehicle | null> {
    return this.vehicles.find((v) => v.id === id) || null;
  }

  async sell(id: string, buyerCpf: string): Promise<vehicle | null> {
    const vehicleIndex = this.vehicles.findIndex((v) => v.id === id);
    if (vehicleIndex === -1) return null;

    this.vehicles[vehicleIndex] = {
      ...this.vehicles[vehicleIndex],
      sold: true,
    };
    return this.vehicles[vehicleIndex];
  }

  clear(): void {
    this.vehicles = [];
  }

  reset(): void {
    this.vehicles = [
      {
        id: "1",
        brand: "Toyota",
        model: "Corolla",
        year: 2022,
        color: "White",
        price: 50000,
        sold: false,
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
  }
}
