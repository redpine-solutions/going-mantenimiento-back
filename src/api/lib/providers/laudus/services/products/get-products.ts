import { getLaudusClient } from '../../client';
import { parseLaudusError } from '../../errors/parseLaudusError';
import { LaudusConfig } from '../../types';
import { LaudusProduct } from './types';

interface ProductsRequestBody {
  options: {
    offset: number;
    limit: number;
  };
  fields: string[];
  filterBy: any[];
  orderBy: any[];
}

export const getProducts = async (
  config: LaudusConfig,
  body: ProductsRequestBody = {
    options: {
      offset: 0,
      limit: 0,
    },
    fields: [
      'productId',
      'sku',
      'description',
      'discontinued',
      'unitOfMeasure',
      'customFields.unidades_por_caja_',
    ],
    filterBy: [],
    orderBy: [],
  }
): Promise<LaudusProduct[]> => {
  try {
    const client = getLaudusClient(config);
    const response = await client.post<LaudusProduct[]>('production/products/list', body, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo products de Laudus:', error);
    const { errorMessage, errorDetails } = parseLaudusError(error);
    throw new Error(`Error al obtener products de Laudus: ${errorMessage}, ${errorDetails} `);
  }
};
