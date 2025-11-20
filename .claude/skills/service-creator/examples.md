# Service Creator Examples

## Base Service Examples

```tsx

import Client from '@models/Client';

import { type CreateClientInput, type CreateClientOutput } from './types';

const createClient = async (input: CreateClientInput): Promise<CreateClientOutput> => {
  const { name } = input;

  // 1. Create client
  const client = await Client.create({ name });

  // 2. Return explicit result
  return { client };
};

export default createClient;

import { type IClient } from '@models/Client';

type CreateClientInput = {
  name: string;
};

type CreateClientOutput = {
  client: IClient;
};

export type { CreateClientInput, CreateClientOutput };

import Client from '@models/Client';
import User from '@models/User';

import throwBadRequestError from '@errors/throwers/throwBadRequestError';
import throwNotFoundError from '@errors/throwers/throwNotFoundError';

import { type DeleteClientInput, type DeleteClientOutput } from './types';

const deleteClient = async (input: DeleteClientInput): Promise<DeleteClientOutput> => {
  const { id } = input;

  // 1. Check if client has associated users
  const usersCount = await User.countDocuments({ clientId: id }).exec();
  if (usersCount > 0) {
    throwBadRequestError({
      message: `Cannot delete client with ${usersCount} associated users`,
      code: 'CLIENT_HAS_USERS',
    });
  }

  // 2. Find and delete client
  const client = await Client.findByIdAndDelete(id).exec();

  // 3. Check if client existed
  if (!client) {
    throwNotFoundError({
      message: `Client with id ${id} not found`,
      code: 'CLIENT_NOT_FOUND',
    });
  }

  // 4. Return explicit result
  return;
};

export default deleteClient;

type DeleteClientInput = {
  id: string;
};

type DeleteClientOutput = {

};

export type { DeleteClientInput, DeleteClientOutput };


```

## Composed Service Example

```tsx
import throwNotFound from "../../../errors/throwers/throwNotFoundError";
import getTransactionById from "../../transactions/get";
import throwBadRequestError from "../../../errors/throwers/throwBadRequestError";
import getSalesInvoicesByIds from "../../invoices/sales/find/byIds";
import { Types } from "mongoose";
import { logger } from "../../../../../log";
import getEnterpriseDefaultValues from "../../enterprise/defaultValues/get";
import { LaudusReceiptClient } from "../../../../../clients/laudus";
import { ITransactionWithPopulatedBank } from "../../../../../database/models/transaction";
import updateTransaction from "../../transactions/update";
import updateManySalesInvoices from "../../invoices/sales/update/many";

const createReceipt = async ({
  params,
}: {
  params: {
    transactionId: string;
    salesInvoicesIds: string[];
    enterpriseId: string;
    documentNumber?: string;
    advanceDescription?: string;
  };
}) => {
  const {
    transactionId,
    salesInvoicesIds,
    enterpriseId,
    documentNumber,
    advanceDescription,
  } = params;

  // Obtener la transacción
  const transaction = (await getTransactionById({
    id: transactionId,
    populate: "bankId",
  })) as unknown as ITransactionWithPopulatedBank;

  if (!transaction) {
    throwNotFound({
      message: `Transaction with ID ${transactionId} not found`,
    });
    return;
  }

  if (transaction.type !== "Ingreso") {
    throwBadRequestError({ message: "Transaction must be of type Ingreso" });
    return;
  }

  if (transaction.conciliated || transaction.laudusEntryNumber) {
    throwBadRequestError({ message: "Transaction already reconciled" });
    return;
  }

  const invoices = await getSalesInvoicesByIds({
    params: {
      enterpriseId: enterpriseId,
      salesInoicesIds: salesInvoicesIds,
    },
    filters: {
      payed: false,
    },
  });

  if (invoices.length !== salesInvoicesIds.length) {
    const foundIds = invoices.map((invoice) =>
      (invoice._id as Types.ObjectId).toString()
    );
    const missingIds = salesInvoicesIds.filter((id) => !foundIds.includes(id));

    logger.error("Some requested invoices were not found or are already paid", {
      enterpriseId,
      requestedCount: salesInvoicesIds.length,
      foundCount: invoices.length,
      missingIds,
    });

    throwBadRequestError({
      message: `Some invoices were not found: ${missingIds.join(", ")}`,
    });
    return;
  }

  const invoiceMap = new Map(
    invoices.map((invoice) => [
      (invoice._id as Types.ObjectId).toString(),
      invoice,
    ])
  );

  // Ordenar los resultados según el orden de los IDs de entrada
  const orderedInvoices = salesInvoicesIds.map((id) => invoiceMap.get(id)!);

  const defaultValues = await getEnterpriseDefaultValues({
    params: {
      id: enterpriseId,
    },
  });

  if (defaultValues === undefined) {
    throwBadRequestError({
      message: "Default values not found, please contact to support.",
    });
    return;
  }

  const salesInvoicesToPay = orderedInvoices.map((invoice) => ({
    salesInvoiceId: invoice.salesInvoiceId,
    enterprise: invoice.enterprise,
    pendingAmount: invoice.pendingAmount,
    payed: false,
    payedDate: new Date(transaction.date),
    laudusEntryNumber: "",
  }));

  const totalInvoiceAmount = orderedInvoices.reduce(
    (acc, invoice) => acc + invoice.pendingAmount,
    0
  );

  const transactionAmount = Math.abs(transaction.amount);

  if (transactionAmount >= totalInvoiceAmount) {
    // Pago completo: pagar todas las facturas
    salesInvoicesToPay.forEach((invoice) => {
      invoice.payed = true;
      invoice.pendingAmount = 0;
    });
  } else {
    // Pago parcial: aplicar lógica de distribución con validación

    // Calcular cuánto se necesita para pagar las facturas anteriores a la última
    const amountForPreviousInvoices = orderedInvoices
      .slice(0, -1)
      .reduce((sum, invoice) => sum + invoice.pendingAmount, 0);

    // VALIDACIÓN: Verificar que el monto alcance para pagar las facturas anteriores
    if (transactionAmount < amountForPreviousInvoices) {
      throwBadRequestError({
        message:
          `Insufficient amount: Transaction amount (${transactionAmount}) is less than ` +
          `the sum of all invoices except the last (${amountForPreviousInvoices}). ` +
          `Please select fewer invoices to reconcile.`,
      });
      return;
    }

    // El resto va a la última factura
    const amountForLastInvoice = transactionAmount - amountForPreviousInvoices;

    // Distribuir los pagos
    salesInvoicesToPay.forEach((invoice, index) => {
      const isLastInvoice = index === orderedInvoices.length - 1;

      if (isLastInvoice) {
        // Última factura: recibe el resto del monto
        orderedInvoices[index].pendingAmount = amountForLastInvoice;
        invoice.pendingAmount -= amountForLastInvoice;
      } else {
        // Facturas anteriores: se pagan completas
        invoice.pendingAmount = 0;
      }

      invoice.payed = invoice.pendingAmount === 0;
    });
  }

  let otherDocuments = [];

  if (transaction.amount > totalInvoiceAmount) {
    if (!defaultValues.allowsReceiptWithAdvance) {
      throwBadRequestError({ message: "Receipt with advance not allowed" });
      return;
    }
    if (!advanceDescription || advanceDescription.trim() === "") {
      throwBadRequestError({
        message: "Advance description is required for receipt with advance",
      });
      return;
    }

    otherDocuments.push({
      document: "",
      description: advanceDescription,
      relatedTo: {
        relatedId: orderedInvoices[0].customerId,
        type: "C",
        name: orderedInvoices[0].customerName,
        VATId: orderedInvoices[0].customerVATId,
      },
      account: {
        accountId: defaultValues.advances.accountId,
      },
      category: {
        code: defaultValues.advances.categoryCode,
      },
      originalAmount: transactionAmount - totalInvoiceAmount,
      currencyCode: "CLP",
      parityToMainCurrency: 1.0,
      amount: transactionAmount - totalInvoiceAmount,
      costCenter: defaultValues.receiptsCostCenterId
        ? {
            costCenterId: defaultValues.receiptsCostCenterId,
          }
        : null,
    });
  }

  logger.info("Creating sales receipt", {
    transactionId,
    transactionAmount,
    salesInvoicesCount: orderedInvoices.length,
    totalInvoiceAmount: totalInvoiceAmount,
    enterpriseId,
  });

  const laudusCLient = new LaudusReceiptClient();

  const receipt = await laudusCLient.createReceipt(
    transaction,
    invoices,
    defaultValues,
    otherDocuments,
    documentNumber
  );

  await updateTransaction({
    params: {
      transactionId: transactionId,
    },
    values: {
      laudusEntryNumber: receipt,
      conciliated: true,
    },
  });

  salesInvoicesToPay.forEach((invoice) => {
    invoice.laudusEntryNumber = receipt;
  });

  // Actualizar facturas para reducir el monto pendiente.
  await updateManySalesInvoices({
    values: { invoices: salesInvoicesToPay },
  });

  logger.info("Sales receipt created successfully", {
    transactionId,
    receipt,
    enterpriseId,
  });

  return;
};

export default createReceipt;

type CreateReceiptInput = {
  params: {
    transactionId: string;
    salesInvoicesIds: string[];
    enterpriseId: string;
    documentNumber?: string;
    advanceDescription?: string;
  };
};

type CreateReceiptOutput = void;   
```

## Another Composed Service Example

```tsx
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type PurchaseInvoice } from '@models/PurchaseInvoice';
import { type SalesInvoice } from '@models/SalesInvoice';
import { type ITransaction } from '@models/transaction';

import findPurchaseInvoices from '@services/documents/invoices/purchase/find';
import findSalesInvoices from '@services/documents/invoices/sales/find';
import findTransactions from '@services/transactions/find';


const getConciliationRecommendations = async (
  input: GetRecommendationsInput
): Promise<RecommendationItem[]> => {
  const { enterpriseRut, bankId, transactionType, limit = 20, page = 1 } = input;

  // Step 1: Obtener transacciones no conciliadas
  // Buscamos más transacciones para compensar las que no tendrán match
  const result = await findTransactions({
    params: {
      enterpriseRut,
      bank: bankId,
      movementType: transactionType,
      conciliated: false,
      limit: limit * 2, // Buffer para compensar transacciones sin match
      page,
    },
  });

  // Extract transactions array from result (handles both return types)
  const transactions = Array.isArray(result) ? result : result.data;

  // Step 2: Buscar facturas en PARALELO para cada transacción
  const recommendationPromises = transactions.map(async (transaction) => {
    let invoices;

    if (transactionType === 'Egreso') {
      // Buscar factura de compra con monto exacto
      invoices = await findPurchaseInvoices({
        enterpriseRut,
        pendingAmountExact: transaction.amount,
        limit: 1, // Solo necesitamos la primera
      });
    } else if (transactionType === 'Ingreso') {
      // Buscar factura de venta con monto exacto
      invoices = await findSalesInvoices({
        enterpriseRut,
        pendingAmountExact: transaction.amount,
        limit: 1, // Solo necesitamos la primera
      });
    }

    // Si encontró match, retornar recomendación
    if (invoices && invoices.length > 0) {
      return {
        transaction,
        invoice: invoices[0],
      };
    }

    // Si no hay match, retornar null
    return null;
  });

  // Esperar TODAS las búsquedas en paralelo
  const results = await Promise.all(recommendationPromises);

  // Filtrar nulls (transacciones sin match) y aplicar limit
  const recommendations = results
    .filter((item): item is RecommendationItem => item !== null)
    .slice(0, limit);

  return recommendations;
};

export default getConciliationRecommendations;


type GetRecommendationsInput = {
  enterpriseRut: string;
  bankId: string;
  transactionType: 'Ingreso' | 'Egreso';
  limit?: number;
  page?: number;
};

type RecommendationItem = {
  transaction: ITransaction;
  invoice: PurchaseInvoice | SalesInvoice;
};

export type { GetRecommendationsInput, RecommendationItem };
```

## Service with pagination

```tsx

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BankModel } from '@models/bank';
import { type ITransaction, TransactionModel } from '@models/transaction';

import throwNotFoundError from '@errors/throwers/throwNotFoundError';

type FindTransactionsInput = {
  enterpriseRut: string;
  bankName?: string;
  bank?: string; // ObjectId
  movementType?: 'Ingreso' | 'Egreso';
  conciliated?: boolean;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

type FindTransactionsWithMetadata = {
  data: ITransaction[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type FindTransactionsOutput = ITransaction[] | FindTransactionsWithMetadata;

const findTransactions = async ({
  params,
}: {
  params: FindTransactionsInput;
}): Promise<FindTransactionsOutput> => {
  const {
    enterpriseRut,
    bankName,
    bank,
    movementType,
    conciliated,
    search,
    dateFrom,
    dateTo,
    page,
    limit,
    sortBy,
    sortOrder,
  } = params;

  // Construir query dinámicamente con filtros opcionales
  const query: any = { enterpriseRut };

  // Handle bankName: find bank ObjectId by name
  if (bankName !== undefined) {
    const bankDoc = await BankModel.findOne({
      enterpriseRut,
      name: bankName,
    }).exec();

    if (!bankDoc) {
      throwNotFoundError({
        message: `Bank with name ${bankName} not found for enterprise ${enterpriseRut}`,
      });
    }

    query.bank = bankDoc!._id;
  }

  // Handle bank ObjectId directly
  if (bank !== undefined) {
    query.bank = bank;
  }

  if (movementType !== undefined) {
    query.movementType = movementType;
  }

  if (conciliated !== undefined) {
    query.conciliated = conciliated;
  }

  // Add search filter for description field
  if (search !== undefined && search.trim() !== '') {
    query.description = { $regex: search, $options: 'i' };
  }

  if (dateFrom || dateTo) {
    query.date = {};
    if (dateFrom) {
      query.date.$gte = dateFrom;
    }
    if (dateTo) {
      query.date.$lte = dateTo;
    }
  }

  // Sorting
  const sortObject: any = {};
  if (sortBy) {
    sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;
  } else {
    sortObject.date = -1; // Default: más recientes primero
  }

  // Check if pagination is requested
  const hasPagination = page !== undefined || limit !== undefined;

  if (hasPagination) {
    // Calculate pagination - ensure values are positive
    const currentPage = Math.max(1, page ?? 1);
    const itemsPerPage = Math.max(1, limit ?? 10);
    const skip = (currentPage - 1) * itemsPerPage;

    // Get total count for pagination metadata
    const total = await TransactionModel.countDocuments(query).exec();

    // Get paginated results
    const transactions = await TransactionModel.find(query)
      .sort(sortObject)
      .skip(skip)
      .limit(itemsPerPage)
      .exec();

    return {
      data: transactions,
      total,
      page: currentPage,
      limit: itemsPerPage,
      totalPages: Math.ceil(total / itemsPerPage),
    };
  }

  // No pagination: return all matching transactions
  const transactions = await TransactionModel.find(query).sort(sortObject).exec();

  return transactions;
};

export default findTransactions;
export type { FindTransactionsInput, FindTransactionsOutput, FindTransactionsWithMetadata };
```
