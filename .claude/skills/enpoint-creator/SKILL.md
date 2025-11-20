---
name: endpoint-creator
description:API endpoint creator for Express/TypeScript applications using three-layer architecture. Automatically scaffolds complete endpoints by generating: types.ts (TypeScript interfaces for request/response), schema.ts (express-validator validation schemas), and handler.ts (async request handlers with error handling). Supports simple routes (/products, /orders) and nested URL parameters (/orders/:orderId/items/:itemId/cancel). Creates folder structure mirroring URL paths (e.g., GET /products/:id → src/api/routes/products/id/get/). Registers endpoints in routers with proper HTTP methods (GET, POST, PUT, DELETE, PATCH). Includes validation middleware, TypeScript type safety, and follows conventions for error responses and status codes. Use when: adding new API endpoints, creating CRUD operations, building REST APIs with parameters, or scaffolding validated routes. Ensures codebase consistency by enforcing standard patterns for validation, types, and handlers.
---
# Endpoint Creator Skill

You are an expert Express/TypeScript API endpoint architect specializing in the Red Pine backend architecture patterns. Your role is to create well-structured, validated, and properly organized API endpoints that follow the project's strict three-layer architecture.

## Core Responsibilities

You create API endpoints by generating three required files in `src/api/routes/[entity]/[operation]/`:

1. **types.ts** - Request DTO with explicit type definitions
2. **schema.ts** - express-validator schema for input validation
3. **handler.ts** - HTTP handler that calls exactly ONE service

You also update or create the necessary router files to register the endpoint.

## File Templates

### types.ts (DTO)

```tsx
type [Operation]RequestDTO = {
  // Path params (if any)
  id?: string;
  
  // Query params (if any)
  
  // Body params
  field1: string;
  field2?: number;
};

export type { [Operation]RequestDTO };
```

### schema.ts (Validation)

```tsx
import { type Schema } from 'express-validator';

const [operation]Schema: () => Schema = () => ({
  // Validate each field with appropriate validators
  field1: {
    in: ['body'],
    isString: {
      errorMessage: 'field1 must be a string',
    },
    notEmpty: {
      errorMessage: 'field1 is required',
    },
  },
});

export default [operation]Schema;
```

### handler.ts

```tsx
import { type NextFunction, type Request, type Response } from 'express';
import { matchedData } from 'express-validator';

import [operation]Service from '@services/[entity]/[operation]';

import { type [Operation]RequestDTO } from './types';

const [operation]Handler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input = matchedData(req) as [Operation]RequestDTO;
    
    const result = await [operation]Service(input);
    
    res.status([statusCode]).json({
      success: true,
      data: result,
    });
    
    return;
  } catch (error) {
    return next(error);
  }
};

export default [operation]Handler;
```

## Folder Structure Rules

### URL Parameters

When an endpoint requires URL parameters (like `:id`), create a folder named after the parameter:

``` text
routes/
└── [entity]/
    ├── create/           # POST /entity
    ├── find/             # GET /entity
    ├── [paramName]/      # Routes with :paramName
    │   ├── index.ts      # Router for this parameter level
    │   ├── get/          # GET /entity/:paramName
    │   ├── update/       # PUT /entity/:paramName
    │   └── delete/       # DELETE /entity/:paramName
    └── index.ts          # Main entity router
```

### Nested Parameters

For multiple parameters, nest the folders:

``` text
routes/orders/orderId/items/itemId/cancel/
```

This reflects: `POST /orders/:orderId/items/:itemId/cancel`

## Router Configuration

### Main Entity Router (index.ts)

```tsx
import { Router } from 'express';
import { schemaCheck } from '@middlewares/schemaCheck';

import createHandler from './create/handler';
import createSchema from './create/schema';
import findHandler from './find/handler';
import findSchema from './find/schema';
import idRouter from './id';

const create[operation]Router = () => {
  const router = Router();

  router.post('/', schemaCheck(createSchema()), createHandler);
  router.get('/', schemaCheck(findSchema()), findHandler);
  router.use('/:id', schemaCheck(idSchema()) idRouter());

  return router;
};

export default router;
```

### Parameter Router (id/index.ts)

```tsx
import { Router } from 'express';

import getHandler from './get/handler';
import getSchema from './get/schema';
import updateHandler from './update/handler';
import updateSchema from './update/schema';
import deleteHandler from './delete/handler';
import deleteSchema from './delete/schema';

// Common ID validation applied to all routes
const idSchema = (): Schema<DefaultSchemaKeys> => ({
  id: {
    in: ['params'],
    custom: {
      options: isValidMongoId,
    },
    optional: false,
    errorMessage: 'Id must be a uuid',
  },
});

const createIdRouter = (): Router => {

  const router = Router({ mergeParams: true });

  router.get('/', schemaCheck(getSchema()), getHandler);
  router.put('/', schemaCheck(updateSchema()), updateHandler);
  router.delete('/', schemaCheck(deleteSchema()), deleteHandler);

  return router;
};

export default createIdRouter;
```

## Critical Rules

1. **Default Exports**: All handlers, schemas (in handler files), and routers use default export
2. **Type Exports**: DTOs use named type export
3. **One Service Per Handler**: Handlers call exactly ONE service - never multiple
4. **Use matchedData()**: Always parse input with `matchedData(req)`
5. **Path Aliases**: Use `@services`, `@middlewares`, etc. for all imports
6. **Explicit Returns**: Always include explicit `return` statements
7. **Error Handling**: Use try-catch with `return next(error)`
8. **mergeParams**: Use `Router({ mergeParams: true })` for nested parameter routers
9. **Schema Spreading**: Use schemaCheck (express-validator wrapper) to validate any schema.

## HTTP Status Codes

- **200**: Successful GET, PUT, DELETE
- **201**: Successful POST (resource created)
- **204**: Successful operation with no content to return

## Validation Best Practices

1. Always specify the `in` property: `'params'`, `'query'`, `'body'`
2. Provide clear, specific error messages using custom errors from `src/api/lib/errors/throwers`
3. Use appropriate validators: `isValidMongoId`, `isString`, `isInt`, `isEmail`, etc.
4. Mark optional fields appropriately
5. Add custom validators for business rules when needed

## Workflow

When asked to create an endpoint:

1. **Analyze the request**: Determine entity, operation, HTTP method, and URL structure
2. **Plan folder structure**: Map URL path to folder hierarchy
3. **Create types.ts**: Define the request DTO with all parameters
4. **Create schema.ts**: Build validation schema for all inputs
5. **Create handler.ts**: Implement handler calling the appropriate service
6. **Update routers**: Register the endpoint in the appropriate router(s)
7. **Verify imports**: Ensure all path aliases are correct

_*If service are required, use Service Creator skill*_

Always confirm the service exists or note that it needs to be created. If the service doesn't exist, inform the user that the service at `@services/[entity]/[operation]` needs to be implemented.

## Quality Checklist

Before completing, verify:

- [ ] All three files created (types.ts, schema.ts, handler.ts)
- [ ] Default exports used correctly
- [ ] Path aliases used for all imports
- [ ] Validation schema covers all inputs
- [ ] Handler calls exactly one service
- [ ] Router updated with schemaCheck
- [ ] Folder structure reflects URL path
- [ ] mergeParams used for parameter routers
- [ ] Explicit return types on handler function
- [ ] Typescript and Lint checks pass

For advanced usage, see [reference.md](reference.md).
