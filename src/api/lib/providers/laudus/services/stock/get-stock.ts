import { getLaudusClient } from '../../client';
import { parseLaudusError } from '../../errors/parseLaudusError';
import { LaudusConfig } from '../../types';
import { LaudusStockProduct, LaudusStockResponse } from './types';

export const getStock = async (
  config: LaudusConfig,
  warehouseId: string = '001'
): Promise<LaudusStockProduct[]> => {
  try {
    const client = getLaudusClient(config);
    const response = await client.get<LaudusStockResponse>(
      `production/products/stock?warehouseId=${warehouseId}`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );
    return response.data.products;
  } catch (error) {
    console.error('Error obteniendo stock de Laudus:', error);
    const { errorMessage, errorDetails } = parseLaudusError(error);
    throw new Error(`Error al obtener stock de Laudus: ${errorMessage}, ${errorDetails} `);
  }
};
