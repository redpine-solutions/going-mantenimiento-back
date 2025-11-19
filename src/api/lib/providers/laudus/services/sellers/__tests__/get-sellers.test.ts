import axios from 'axios';

import { __resetLaudusClient } from '../../../client';
import { LaudusConfig } from '../../../types';
import { getSellers } from '../get-sellers';
import { LaudusSeller } from '../types';

// Mock de axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock de la instancia de axios
const mockAxiosInstance = {
  post: jest.fn(),
  request: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(),
    },
  },
};

describe('Laudus Sellers Service', () => {
  const mockConfig: LaudusConfig = {
    baseUrl: 'https://api.laudus.cl',
    username: 'test_user',
    password: 'test_password',
    companyVATId: 'test_vat',
  };

  const mockSellers: LaudusSeller[] = [
    { salesmanId: '1', name: 'Vendedor 1' },
    { salesmanId: '2', name: 'Vendedor 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    __resetLaudusClient();
    mockAxiosInstance.post.mockResolvedValue({ data: mockSellers });
    mockAxiosInstance.request.mockResolvedValue({ data: mockSellers });
    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
  });

  it('should get sellers with default parameters', async () => {
    const sellers = await getSellers(mockConfig);

    expect(sellers).toEqual(mockSellers);
    expect(mockAxiosInstance.post).toHaveBeenCalledWith(
      '/sales/salesmen/list',
      {
        options: {
          offset: 0,
          limit: 0,
        },
        fields: ['salesmanId', 'name'],
        filterBy: [],
        orderBy: [],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
  });

  it('should get sellers with custom parameters', async () => {
    const customBody = {
      options: {
        offset: 10,
        limit: 20,
      },
      fields: ['salesmanId', 'name'],
      filterBy: [],
      orderBy: [],
    };

    await getSellers(mockConfig, customBody);

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/sales/salesmen/list', customBody, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  });

  it('should handle errors when getting sellers', async () => {
    mockAxiosInstance.post.mockRejectedValueOnce(new Error('API Error'));

    await expect(getSellers(mockConfig)).rejects.toThrow('Error al obtener vendedores de Laudus');
  });
});
