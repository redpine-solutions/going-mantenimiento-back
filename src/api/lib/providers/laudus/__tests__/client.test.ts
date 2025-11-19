import axios from 'axios';

import { __resetLaudusClient, getLaudusClient } from '../client';
import { LaudusConfig } from '../types';

// Mock de axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock de la instancia de axios
const mockAxiosInstance = {
  get: jest.fn().mockResolvedValue({ data: 'ok' }),
  post: jest.fn().mockResolvedValue({ data: 'ok' }),
  interceptors: {
    request: {
      use: jest.fn(),
    },
  },
  request: jest.fn(),
};

describe('Laudus Client', () => {
  const mockConfig: LaudusConfig = {
    baseUrl: 'https://api.laudus.cl',
    username: 'test_user',
    password: 'test_password',
    companyVATId: 'test_vat',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    __resetLaudusClient();
    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
  });

  it('should create a singleton instance', () => {
    const client1 = getLaudusClient(mockConfig);
    const client2 = getLaudusClient(mockConfig);
    expect(client1).toBe(client2);
  });

  it('should configure axios with the correct baseURL', () => {
    getLaudusClient(mockConfig);
    expect(mockedAxios.create).toHaveBeenCalledWith({ baseURL: mockConfig.baseUrl });
  });

  it('should add a request interceptor', () => {
    getLaudusClient(mockConfig);
    expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
  });

  it('should allow making get requests', async () => {
    const client = getLaudusClient(mockConfig);
    const res = await client.get('/test');
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test');
    expect(res.data).toBe('ok');
  });

  it('should allow making post requests', async () => {
    const client = getLaudusClient(mockConfig);
    const res = await client.post('/test', { foo: 'bar' });
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', { foo: 'bar' });
    expect(res.data).toBe('ok');
  });
});
