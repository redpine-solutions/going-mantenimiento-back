# [PROJECT NAME] Backend API - Claude Instructions

> Context: This is a Red Pine backend API for [BRIEF PROJECT DESCRIPTION]. You are Claude, an AI assistant helping developers build and maintain this Node.js/Express/TypeScript/Mongoose application following Red Pine standards.
> 

---

## PROJECT OVERVIEW

**Purpose**: [Describe what this API does - e.g., "Manages products, orders, and payments for an e-commerce platform"]

**Domain**: [Business domain - e.g., "E-commerce", "Financial Technology", "Healthcare"]

**Key Entities**: [List main entities - e.g., "Products, Orders, Users, Payments"]

---

## TECH STACK

- **Runtime**: Node.js
- **Language**: TypeScript 5.9+
- **Framework**: Express 5.x
- **Database**: MongoDB 6.5+ with Mongoose 8.3+
- **Validation**: express-validator 7.3+
- **Authentication**: JWT with bcryptjs
- **Email**: Resend API
- **Logging**: Winston

---

## PATH ALIASES

These are configured in `tsconfig.json` and must be used for all imports:

```tsx
@models      → src/database/models
@services    → src/api/services
@errors      → src/api/lib/errors
@middlewares → src/api/lib/middlewares
@logs        → src/api/lib/logs
@envs        → src/api/lib/environment
@utils       → src/api/lib/utils
@cronjobs    → src/api/lib/cronjobs
@clients     → src/api/lib/clients

```

---

## CRITICAL RULES (READ FIRST)

### Absolute Requirements

**YOU MUST ALWAYS:**

1. Use TypeScript with explicit return types
2. Use path aliases for ALL imports
3. Use default exports for handlers, schemas, services, and routers
4. Use named exports for everything in lib/ (errors, middlewares, utils, logs)
5. Follow the three-layer architecture: Routes → Services → Models
6. Throw custom errors from `@errors/throwers` (never mongoose errors)
7. Use `.exec()` with all mongoose queries
8. Validate all inputs with express-validator
9. Use transactions for multi-step database operations
10. Return explicit values (never implicit returns)
11. Use default exports in services, schemas, handlers and models.
12. Use named exports in every src/api/lib file.

**YOU MUST NEVER:**

1. Put business logic in handlers or models (only in services)
2. Access `req` or `res` objects inside services
3. Call multiple services from a handler (create orchestration service instead)
4. Return `null` from services (throw custom error instead)
5. Use `any` type without justification
6. Create circular dependencies between services
7. Skip input validation

---

## ARCHITECTURE OVERVIEW

### Three-Layer Architecture

```
┌─────────────────────────────────────────┐
│  ROUTES (Presentation Layer)           │
│  - Handle HTTP requests/responses       │
│  - Validate input (express-validator)   │
│  - Call ONE service                     │
│  - Return formatted response            │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  SERVICES (Business Logic Layer)        │
│  - Implement business rules             │
│  - Orchestrate multiple operations      │
│  - Call other services as needed        │
│  - Throw custom errors                  │
│  - Manage transactions                  │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  MODELS (Data Layer)                    │
│  - Define schemas and validations       │
│  - No business logic                    │
│  - Just data structure                  │
└─────────────────────────────────────────┘

```

---

## FILE STRUCTURE

```
src/
├── api/
│   ├── lib/
│   │   ├── errors/          # Custom error system
│   │   ├── middlewares/     # Express middlewares
│   │   ├── logs/            # Winston logger
│   │   └── environment/     # Environment variables
│   ├── routes/              # File-based routing (URL structure)
│   │   └── [entity]/
│   │       └── [operation]/
│   │           ├── handler.ts
│   │           ├── schema.ts
│   │           └── types.ts
│   └── services/            # Business logic
│       └── [entity]/
│           └── [operation]/
│               ├── index.ts
│               └── types.ts
└── database/
    ├── models/              # Mongoose models
    ├── migrations/          # Data migrations
    └── db.ts               # Database connection

```

---

## IMPLEMENTATION GUIDE

### When Creating a Model

**Location**: `src/database/models/[ModelName].ts`

**Template**:

```tsx
import { type Document, model, Schema } from 'mongoose';

interface I[ModelName] extends Document {
  // Fields with types
  field1: string;
  field2: number;
  createdAt: Date;
  updatedAt: Date;
}

const [modelName]Schema = new Schema<I[ModelName]>(
  {
    field1: {
      type: String,
      required: [true, 'Field1 is required'],
      trim: true,
    },
    field2: {
      type: Number,
      required: [true, 'Field2 is required'],
      min: [0, 'Field2 cannot be negative'],
    },
  },
  {
    timestamps: true,
    collection: '[modelNames]', // plural, lowercase
  }
);

// Add indexes
[modelName]Schema.index({ field1: 1 });

const [ModelName] = model<I[ModelName]>('[ModelName]', [modelName]Schema);

export default [ModelName];
export type { I[ModelName] };

```

**Checklist**:

- [ ]  Interface with `I` prefix
- [ ]  All required fields have validation messages
- [ ]  `timestamps: true` enabled
- [ ]  Explicit collection name (plural)
- [ ]  Indexes on frequently queried fields
- [ ]  Export both model and interface

---

### When Creating a Service

**Location**: `src/api/services/[entity]/[operation]/index.ts`

**Common Operations**: create, get, find, update, delete

**Template**:

```tsx
import Model from '@models/Model';
import { throwNotFoundError } from '@errors/throwers/throwNotFoundError';

interface OperationInput {
  // Input parameters
}

interface OperationOutput {
  // Return type
}

const operationName = async (input: OperationInput): Promise<OperationOutput> => {
  // 1. Validate business rules
  if (/* condition */) {
    throwBadRequestError({
      message: 'Business rule violated',
      details: { /* relevant data */ },
    });
  }

  // 2. Perform database operations
  const result = await Model.findById(input.id).exec();

  // 3. Check result
  if (!result) {
    throwNotFoundError({
      message: 'Resource not found',
      details: { id: input.id },
    });
  }

  // 4. Return explicit result
  return result;
};

export default operationName;

```

**With Transaction**:

```tsx
import mongoose from 'mongoose';

const operationName = async (input: Input): Promise<Output> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Operations with { session }
    const result1 = await operation1({ session });
    const result2 = await operation2({ session });

    await session.commitTransaction();
    return { result1, result2 };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

```

**Checklist**:

- [ ]  Explicit return type (Promise<Output>)
- [ ]  Named export
- [ ]  Uses `.exec()` on queries
- [ ]  Throws custom errors (never mongoose errors)
- [ ]  No req/res access
- [ ]  Transactions for multi-step operations

---

### When Creating an Endpoint

**Location**: `src/api/routes/[entity]/[operation]/`

**Three Required Files**:

**1. types.ts** - Request DTO

```tsx
interface OperationRequestDTO {
  // Path params
  id: string;

  // Body params
  field1: string;
  field2?: number;
}

export type { OperationRequestDTO };

```

**2. schema.ts** - Validation

```tsx
import { type Schema } from 'express-validator';

export const operationSchema: Schema = {
  id: {
    in: 'params',
    isMongoId: {
      errorMessage: 'id must be a valid MongoDB ObjectId',
    },
  },
  field1: {
    in: 'body',
    isString: {
      errorMessage: 'field1 must be a string',
    },
    notEmpty: {
      errorMessage: 'field1 is required',
    },
  },
};

```

**3. handler.ts** - HTTP Handler

```tsx
import { type NextFunction, type Request, type Response } from 'express';
import { matchedData } from 'express-validator';

import operationService from '@services/entity/operation';

import { type OperationRequestDTO } from './types';

const operationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // 1. Parse input
    const input = matchedData(req) as OperationRequestDTO;

    // 2. Call service (ONE service only)
    const result = await operationService(input);

    // 3. Return response
    res.status(200).json({
      success: true,
      data: result,
    });

    return;
  } catch (error) {
    return next(error);
  }
};

export default operationHandler;

```

**Router Setup**:

```tsx
import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { schemaCheck } from '@middlewares/schemaCheck';

import operationHandler from './operation/handler';
import operationSchema from './operation/schema';

const router = Router();

router.post('/', checkSchema(operationSchema), schemaCheck, operationHandler);

export default router;

```

**Checklist**:

- [ ]  Three files: types.ts, schema.ts, handler.ts
- [ ]  Uses `matchedData()` for parsing
- [ ]  Calls exactly ONE service
- [ ]  Try-catch with `next(error)`
- [ ]  Router uses `checkSchema` + `schemaCheck`

---

### When Handling Errors

**Available Throwers**:

```tsx
import { throwNotFoundError } from '@errors/throwers/throwNotFoundError';
import { throwBadRequestError } from '@errors/throwers/throwBadRequestError';
import { throwUnauthorizedError } from '@errors/throwers/throwUnauthorizedError';

```

**Usage**:

```tsx
// Resource not found
if (!resource) {
  throwNotFoundError({
    message: `Resource with id ${id} not found`,
    details: { resourceId: id },
  });
}

// Business rule violation
if (product.stock < quantity) {
  throwBadRequestError({
    message: 'Insufficient stock',
    details: {
      available: product.stock,
      requested: quantity,
    },
    code: 'INSUFFICIENT_STOCK',
  });
}

// Authorization failure
if (!hasPermission) {
  throwUnauthorizedError({
    message: 'You do not have permission to perform this action',
    details: { userId, action },
  });
}

```

---

## PROJECT-SPECIFIC CONTEXT

### Business Rules

[Document specific business rules for this project]

Example:

- Orders can only be placed if product stock > 0
- Users must be verified before making purchases
- Payments require 3D Secure authentication above $100

### Domain Models

[List and briefly describe the main models]

Example:

- **User**: Authentication, profile, preferences
- **Product**: Catalog items with stock tracking
- **Order**: User purchases with line items
- **Payment**: Transaction records with status tracking

### Common Workflows

[Document common multi-step operations]

Example:

1. **Place Order Flow**:
    - Validate user authentication
    - Check product availability
    - Create order record
    - Process payment
    - Update inventory
    - Send confirmation email
2. **Refund Flow**:
    - Validate refund eligibility
    - Create refund record
    - Update payment status
    - Restore inventory
    - Send refund notification

---

## DEVELOPMENT WORKFLOW

### Starting Development

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with proper values

# Start development server
npm run dev

```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

```

### Code Quality

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format code
npm run format

```

### Building for Production

```bash
# Compile TypeScript
npm run build

# Start production server
npm start

```

---

## COMMON TASKS

### Adding a New Endpoint

1. **Define the model** (if new entity)
2. **Create service** in `services/[entity]/[operation]/`
3. **Create endpoint** in `routes/[entity]/[operation]/`
    - types.ts
    - schema.ts
    - handler.ts
4. **Update router** in parent `index.ts`
5. **Test** the endpoint

### Adding Business Logic

1. **Identify the operation** (create, update, process, etc.)
2. **Create service** if it doesn't exist
3. **Implement validation** and business rules
4. **Use transactions** if modifying multiple documents
5. **Throw appropriate errors** for failures
6. **Return explicit results**

### Connecting External Services

1. **Create client** in `api/lib/clients/[service]/`
2. **Create service wrapper** in `services/[domain]/[operation]/`
3. **Use environment variables** for configuration
4. **Handle external errors** gracefully
5. **Add logging** for monitoring

---

## DEBUGGING TIPS

### Common Issues

**Path aliases not working:**

- Restart TypeScript server
- Check `tsconfig.json` paths
- Verify `jest.config.js` moduleNameMapper

**Validation errors not showing:**

- Ensure `checkSchema` is before handler
- Ensure `schemaCheck` middleware is included
- Check schema field names match DTO

**Database connection issues:**

- Verify `.env` has correct `MONGODB_URI`
- Check MongoDB is running
- Verify network access

**TypeScript errors:**

- Run `npm run build` to see all errors
- Check return types are explicit
- Ensure `.exec()` is on mongoose queries

---

## GETTING HELP

When asking for help, provide:

1. **What you're trying to do** (the goal)
2. **What you've tried** (your approach)
3. **Error messages** (full stack trace)
4. **Relevant code** (the specific files)
5. **Environment info** (Node version, OS)

Remember: I follow Red Pine standards exactly. If something seems non-standard, ask for clarification before implementing.

---

## QUICK REFERENCE

### File Creation Patterns

**Model**: `database/models/[ModelName].ts`

- Interface + Schema + Export

**Service**: `services/[entity]/[operation]/index.ts`

- Input type + Function + Named export

**Endpoint**: `routes/[entity]/[operation]/`

- types.ts + schema.ts + handler.ts

### Import Patterns

```tsx
// Models
import Model from '@models/Model';
import { type IModel } from '@models/Model';

// Services
import serviceOperation from '@services/entity/operation';

// Errors (named exports from lib/)
import { throwNotFoundError } from '@errors/throwers/throwNotFoundError';

// Utilities (named exports from lib/)
import logger from '@logs';

```

### Response Patterns

```tsx
// Success
res.status(200).json({
  success: true,
  data: result,
});

// Created
res.status(201).json({
  success: true,
  data: newResource,
});

// Error (handled by middleware)
return next(error);

```

---

**Remember**: Quality over speed. Follow the patterns exactly. If unsure, ask before implementing.