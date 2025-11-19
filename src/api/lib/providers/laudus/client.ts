import {
  getLaudusBaseUrl,
  getLaudusCompanyVatId,
  getLaudusPassword,
  getLaudusUsername,
} from '@envs/vairables';

import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

import { LaudusConfig, Token } from './types';

let instance: AxiosInstance | null = null;
let token: Token | null = null;

const isTokenValid = (): boolean => {
  if (!token?.expiration) return false;
  return new Date(token.expiration) > new Date();
};

const refreshToken = async (config: LaudusConfig): Promise<Token> => {
  try {
    const response = await axios.post<Token>(`${config.baseUrl}/security/login`, {
      userName: config.username,
      password: config.password,
      companyVATId: config.companyVATId,
    });

    token = response.data;
    return token;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get Laudus token: ${error.message}`);
    }
    throw new Error('Failed to get Laudus token: Unknown error');
  }
};

const getValidToken = async (config: LaudusConfig): Promise<Token> => {
  if (isTokenValid()) {
    return token!;
  }
  return refreshToken(config);
};

export const getLaudusClient = (config: LaudusConfig): AxiosInstance => {
  if (!instance) {
    instance = axios.create({
      baseURL: config.baseUrl,
    });

    instance.interceptors.request.use(async (axiosConfig: InternalAxiosRequestConfig) => {
      const validToken = await getValidToken(config);
      axiosConfig.headers.Authorization = `Bearer ${validToken.token}`;
      return axiosConfig;
    });
  }

  return instance;
};

export const getLaudusConfig = (): LaudusConfig => {
  return {
    baseUrl: getLaudusBaseUrl(),
    username: getLaudusUsername(),
    password: getLaudusPassword(),
    companyVATId: getLaudusCompanyVatId(),
  };
};

// SOLO PARA TESTS
export const __resetLaudusClient = () => {
  instance = null;
  token = null;
};
