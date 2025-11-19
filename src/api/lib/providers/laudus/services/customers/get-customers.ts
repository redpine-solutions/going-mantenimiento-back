import { getLaudusClient } from '../../client';
import { parseLaudusError } from '../../errors/parseLaudusError';
import { LaudusConfig } from '../../types';
import { LaudusCustomer } from './types';

interface CustomersRequestBody {
  options: {
    offset: number;
    limit: number;
  };
  fields: string[];
  filterBy: any[];
  orderBy: any[];
}

export const getCustomers = async (
  config: LaudusConfig,
  body: CustomersRequestBody = {
    options: {
      offset: 0,
      limit: 0,
    },
    fields: [
      'customerId',
      'name',
      'legalName',
      'VATId',
      'address',
      'city',
      'county',
      'state',
      'salesman.name',
      'salesman.salesmanId',
      'term.termId',
    ],
    filterBy: [],
    orderBy: [],
  }
): Promise<LaudusCustomer[]> => {
  try {
    const client = getLaudusClient(config);
    const response = await client.post<LaudusCustomer[]>('/sales/customers/list', body, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo customers de Laudus:', error);
    const { errorMessage, errorDetails } = parseLaudusError(error);
    throw new Error(`Error al obtener customers de Laudus: ${errorMessage}, ${errorDetails} `);
  }
};
