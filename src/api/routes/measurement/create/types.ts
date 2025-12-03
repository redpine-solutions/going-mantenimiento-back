type CreateMeasurementRequestDTO = {
  year: number;
  month: number;
  good: number;
  observation: number;
  unsatisfactory: number;
  danger: number;
  unmeasured: number;
  opening: string;
  clientId: string;
};

export type { CreateMeasurementRequestDTO };


