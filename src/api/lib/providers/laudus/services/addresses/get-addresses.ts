import { getLaudusClient } from '../../client';
import { parseLaudusError } from '../../errors/parseLaudusError';
import { LaudusConfig } from '../../types';
import { LaudusAddress } from './types';

export const getAddresses = async (
  config: LaudusConfig,
  customerId: string
): Promise<LaudusAddress[]> => {
  try {
    const client = getLaudusClient(config);
    const response = await client.get<LaudusAddress[]>(`sales/customers/${customerId}/addresses`, {
      headers: {
        Accept: 'application/json',
      },
    });
    // Si hay data, retornar las direcciones
    if (response.data) {
      return response.data;
    }

    // Si no hay data, retornar array vacío
    return [];
  } catch (error) {
    console.error('Error obteniendo direcciones de Laudus:', error);
    const { errorMessage, errorDetails } = parseLaudusError(error);
    throw new Error(`Error al obtener direcciones de Laudus: ${errorMessage}, ${errorDetails} `);
  }
};
