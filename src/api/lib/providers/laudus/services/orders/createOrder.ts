import { getLaudusClient } from '../../client';
import { parseLaudusError } from '../../errors/parseLaudusError';
import { LaudusConfig } from '../../types';
import { OrderData } from './types';

export const createOrder = async (config: LaudusConfig, orderData: OrderData) => {
  // Construir string de comentarios con información de contacto
  let parsedComments = orderData.comments || '';

  if (orderData.contactInfo) {
    const contactParts = [];

    if (orderData.contactInfo.name) {
      contactParts.push(orderData.contactInfo.name);
    }

    if (orderData.contactInfo.phone) {
      contactParts.push(`tel: ${orderData.contactInfo.phone}`);
    }

    if (orderData.contactInfo.email) {
      contactParts.push(`mail: ${orderData.contactInfo.email}`);
    }

    if (contactParts.length > 0) {
      const contactInfo = contactParts.join(' ');
      parsedComments = parsedComments ? `${parsedComments} ${contactInfo}` : contactInfo;
    }
  }

  // prepare order body
  const orderBody = {
    customer: {
      customerId: orderData.laudusCustomerId,
    },
    contact: null,
    salesman: {
      salesmanId: orderData.laudusSellerId,
    },
    dealer: null,
    carrier: null,
    priceList: null,
    term: {
      termId: orderData.customerPaymentFormId,
    },
    branch: null,
    issuedDate: new Date(new Date().setHours(new Date().getHours() - 4)),
    dueDate: new Date(new Date().setHours(new Date().getHours() - 4)),
    nullDoc: false,
    locked: false,
    approved: false,
    approvedBy: null,
    purchaseOrderNumber: '',
    deliveryAddress: orderData.shippingAddressId
      ? {
          addressId: orderData.shippingAddressId,
        }
      : null,
    deliveryDate: '',
    deliveryTimeFrame: '',
    deliveryCost: 0.0,
    deliveryNotes: '',
    bypassCreditLimit: false,
    source: null,
    sourceOrderId: '',
    amountPaid: 0.0,
    amountPaidCurrencyCode: 'CLP',
    invoiceDocType: {
      docTypeId: 0,
      name: 'Otros Documentos de Ventas',
    },
    notes: parsedComments,
    customFields: {},
    items: orderData.items.map(
      (item: { sku: any; quantity: any; unitPrice: any }, index: number) => {
        return {
          product: {
            sku: item.sku,
          },
          itemOrder: index + 1,
          quantity: item.quantity,
          originalUnitPrice: item.unitPrice,
          currencyCode: 'CLP',
          parityToMainCurrency: 1.0,
          unitPrice: item.unitPrice,
          discountPercentage: 0.0,
          lot: null,
          archived: false,
          costCenter: null,
          traceFrom: null,
          customFields: {},
        };
      }
    ),
  };
  try {
    const client = getLaudusClient(config);
    const response = await client.post('sales/orders', orderBody);
    console.log(response.data);
    return response.data.salesOrderId;
  } catch (error) {
    const { errorMessage, errorDetails } = parseLaudusError(error);
    throw new Error(`Falló Laudus: ${errorMessage}, ${errorDetails}`);
  }
};
