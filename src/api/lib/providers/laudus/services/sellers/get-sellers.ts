import { getLaudusClient } from '../../client';
import { parseLaudusError } from '../../errors/parseLaudusError';
import { LaudusConfig } from '../../types';
import { LaudusSeller } from './types';

interface SellersRequestBody {
  options: {
    offset: number;
    limit: number;
  };
  fields: string[];
  filterBy: any[];
  orderBy: any[];
}

export const getSellers = async (
  config: LaudusConfig,
  body: SellersRequestBody = {
    options: {
      offset: 0,
      limit: 0,
    },
    fields: ['salesmanId', 'name'],
    filterBy: [],
    orderBy: [],
  }
): Promise<LaudusSeller[]> => {
  try {
    const client = getLaudusClient(config);
    const response = await client.post<LaudusSeller[]>('/sales/salesmen/list', body, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo vendedores de Laudus:', error);
    const { errorMessage, errorDetails } = parseLaudusError(error);
    throw new Error(`Error al obtener vendedores de Laudus: ${errorMessage}, ${errorDetails} `);
  }
};
