import axios from 'axios';

export const parseLaudusError = (error: unknown) => {
  let errorMessage = '';
  let errorDetails = '';

  if (axios.isAxiosError(error)) {
    errorMessage = error.response?.data?.message || error.message;
    errorDetails = JSON.stringify(
      {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
      },
      null,
      2
    );
  } else {
    errorMessage = error instanceof Error ? error.message : 'Unknown error';
    errorDetails = JSON.stringify(error, null, 2);
  }
  return { errorMessage, errorDetails };
};
