# Endpoint Creator Examples

## Example Router

```tsx
import schemaCheck from '@middlewares/schemaCheck';

import idSchema from '@utils/schema-validators/idSchema';

import { Router } from 'express';

import createUserHandler from './create/handler';
import createUserSchema from './create/schema';
import createIdRouter from './id';

const createUserRouter = (): Router => {
  const userRouter = Router();

  // POST /users - Create user
  userRouter.post('/', schemaCheck(createUserSchema()), createUserHandler);

  userRouter.use('/:id', schemaCheck(idSchema()), createIdRouter());

  return userRouter;
};

export default createUserRouter;
```

## Example Parameter Router

```tsx
import schemaCheck from '@middlewares/schemaCheck';

import { Router } from 'express';

import deleteUserHandler from './delete/handler';
import deleteUserSchema from './delete/schema';
import updateUserHandler from './update/handler';
import updateUserSchema from './update/schema';

const createIdRouter = (): Router => {
  const idRouter = Router();

  idRouter.put('', schemaCheck(updateUserSchema()), updateUserHandler);

  // DELETE /users/:id - Delete user
  idRouter.delete('', schemaCheck(deleteUserSchema()), deleteUserHandler);

  return idRouter;
};

export default createIdRouter;
```

## Schema Validator for ID Parameter

```tsx
import { Schema } from 'express-validator';
import { DefaultSchemaKeys } from 'express-validator/lib/middlewares/schema';

import isValidUUID from '../validators/isValidUUID';

const idSchema = (): Schema<DefaultSchemaKeys> => ({
  id: {
    in: ['params'],
    custom: {
      options: isValidUUID,
    },
    optional: false,
    errorMessage: 'Fund id must be a uuid',
  },
});

export default idSchema;
```

## Schema Validator for User Creation

```tsx  
import { type Schema } from 'express-validator';
import { DefaultSchemaKeys } from 'express-validator/lib/middlewares/schema';

const createUserSchema: () => Schema<DefaultSchemaKeys> = () => ({
  username: {
    in: ['body'],
    isString: {
      errorMessage: 'username must be a string',
    },
    notEmpty: {
      errorMessage: 'username is required',
    },
    trim: true,
  },
  password: {
    in: ['body'],
    isString: {
      errorMessage: 'password must be a string',
    },
    notEmpty: {
      errorMessage: 'password is required',
    },
    isLength: {
      options: { min: 6 },
      errorMessage: 'password must be at least 6 characters',
    },
  },
  role: {
    in: ['body'],
    isIn: {
      options: [['admin', 'client']],
      errorMessage: 'role must be either admin or client',
    },
    notEmpty: {
      errorMessage: 'role is required',
    },
  },
  clientId: {
    in: ['body'],
    optional: true,
    isMongoId: {
      errorMessage: 'clientId must be a valid MongoDB ObjectId',
    },
  },
});

export default createUserSchema;
```

## Create User DTO Type

```tsx
type CreateUserRequestDTO = {
  username: string;
  password: string;
  role: 'admin' | 'client';
  clientId?: string;
};

export type { CreateUserRequestDTO };
```

## Example User Creation Handler

```tsx
import { type NextFunction, type Request, type Response } from 'express';
import { matchedData } from 'express-validator';

import createUser from '@services/user/create';

import { type CreateUserRequestDTO } from './types';

const createUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Parse input
    const input = matchedData(req) as CreateUserRequestDTO;

    // 2. Call service
    const result = await createUser(input);

    // 3. Return response
    res.status(201).json({
      success: true,
      data: result.user,
    });

    return;
  } catch (error) {
    return next(error);
  }
};

export default createUserHandler;
```

## Paginated with filters Endpoint Example

```tsx
import findTransactions from '@services/transactions/find';

import { type NextFunction, type Request, type Response } from 'express';
import { matchedData } from 'express-validator';

import { type FindTransactionsDTO } from './types';

const findTransactionsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const input = matchedData<FindTransactionsDTO>(req);

    const result = await findTransactions({ params: input });

    res.status(200).json({
      success: true,
      data: result,
    });

    return;
  } catch (error) {
    return next(error);
  }
};

export default findTransactionsHandler;


import { type Schema } from 'express-validator';

const findTransactionsSchema: Schema = {
  enterpriseRut: {
    in: 'query',
    isString: {
      errorMessage: 'enterpriseRut must be a string',
    },
    notEmpty: {
      errorMessage: 'enterpriseRut is required',
    },
  },
  bankName: {
    in: 'query',
    optional: true,
    isString: {
      errorMessage: 'bankName must be a string',
    },
    custom: {
      options: (_value, { req }) => {
        if (req.query!.bankName && req.query!.bank) {
          throw new Error('Cannot provide both bankName and bank');
        }
        if (!req.query!.bankName && !req.query!.bank) {
          throw new Error('Must provide either bankName or bank');
        }
        return true;
      },
    },
  },
  bank: {
    in: 'query',
    optional: true,
    isMongoId: {
      errorMessage: 'bank must be a valid MongoDB ObjectId',
    },
  },
  movementType: {
    in: 'query',
    optional: true,
    isIn: {
      options: [['Ingreso', 'Egreso']],
      errorMessage: 'movementType must be either Ingreso or Egreso',
    },
  },
  conciliated: {
    in: 'query',
    optional: true,
    isBoolean: {
      errorMessage: 'conciliated must be a boolean',
    },
    toBoolean: true,
  },
  search: {
    in: 'query',
    optional: true,
    isString: {
      errorMessage: 'search must be a string',
    },
    trim: true,
  },
  dateFrom: {
    in: 'query',
    optional: true,
    isISO8601: {
      errorMessage: 'dateFrom must be a valid ISO 8601 date',
    },
    toDate: true,
  },
  dateTo: {
    in: 'query',
    optional: true,
    isISO8601: {
      errorMessage: 'dateTo must be a valid ISO 8601 date',
    },
    toDate: true,
  },
  page: {
    in: 'query',
    optional: true,
    isInt: {
      options: { min: 1 },
      errorMessage: 'page must be an integer greater than 0',
    },
    toInt: true,
  },
  limit: {
    in: 'query',
    optional: true,
    isInt: {
      options: { min: 1, max: 10000 },
      errorMessage: 'limit must be an integer between 1 and 100',
    },
    toInt: true,
  },
  sortBy: {
    in: 'query',
    optional: true,
    isString: {
      errorMessage: 'sortBy must be a string',
    },
  },
  sortOrder: {
    in: 'query',
    optional: true,
    isIn: {
      options: [['asc', 'desc']],
      errorMessage: 'sortOrder must be either asc or desc',
    },
  },
};

export default findTransactionsSchema;

type FindTransactionsDTO = {
  enterpriseRut: string;
  bankName?: string;
  bank?: string;
  movementType?: 'Ingreso' | 'Egreso';
  conciliated?: boolean;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type { FindTransactionsDTO };

```
