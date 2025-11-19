import { getLaudusClient } from '../../client';
import { parseLaudusError } from '../../errors/parseLaudusError';
import { LaudusConfig } from '../../types';
import { LaudusPurchaseOrder } from './types';

interface PurchaseOrdersRequestBody {
  options: {
    offset: number;
    limit: number;
  };
  fields: string[];
  filterBy: any[];
  orderBy: any[];
}

export const getPurchaseOrdersWithProducts = async (
  config: LaudusConfig
): Promise<LaudusPurchaseOrder[]> => {
  try {
    const client = getLaudusClient(config);
    const currentDate = new Date();
    // restar los dias que sean necesarios para que se sincronice correctamente (180 dias)
    const startSyncDate = new Date(currentDate.getTime() - 1000 * 60 * 60 * 24 * 180);
    const body: PurchaseOrdersRequestBody = {
      options: {
        offset: 0,
        limit: 0,
      },
      fields: ['purchaseOrderId', 'items.product.productId', 'items.unitCost', 'issuedDate'],
      filterBy: [
        {
          field: 'issuedDate',
          operator: '>',
          value: startSyncDate.toISOString(),
        },
      ],
      orderBy: [
        {
          field: 'issuedDate',
          direction: 'DESC',
        },
      ],
    };
    const response = await client.post<LaudusPurchaseOrder[]>('purchases/orders/list', body, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo purchase orders de Laudus:', error);
    const { errorMessage, errorDetails } = parseLaudusError(error);
    throw new Error(
      `Error al obtener purchase orders de Laudus: ${errorMessage}, ${errorDetails} `
    );
  }
};
