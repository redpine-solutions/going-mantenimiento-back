type CreateMeasurementRequestDTO = {
  date: Date;
  good: number;
  observation: number;
  unsatisfactory: number;
  danger: number;
  unmeasured: number;
  clientId: string;
};

export type { CreateMeasurementRequestDTO };


