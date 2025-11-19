import { getEmailServerUrl } from '@envs/vairables';

import axios, { AxiosInstance } from 'axios';

import { SendEmailRequest, SendEmailResponse } from './types';

let instance: AxiosInstance | null = null;

/**
 * @description Crea y configura el cliente HTTP para el servidor de correos
 * @returns {AxiosInstance} Instancia configurada de axios
 */
export const getEmailServerClient = (): AxiosInstance => {
  if (!instance) {
    const baseURL = getEmailServerUrl();
    instance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  return instance;
};

/**
 * @description Envía un email a través del servidor de correos
 * @param {SendEmailRequest} emailData - Datos del email a enviar
 * @returns {Promise<SendEmailResponse>} Respuesta del servidor
 * @throws {Error} Si falla el envío del email
 */
export const sendEmail = async (
  emailData: SendEmailRequest,
  clientId: string
): Promise<SendEmailResponse> => {
  try {
    const client = getEmailServerClient();
    const response = await client.post<SendEmailResponse>(`/api/${clientId}/email/send`, emailData);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to send email: ${error.response?.data?.error || error.message}`);
    }
    if (error instanceof Error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
    throw new Error('Failed to send email: Unknown error');
  }
};
