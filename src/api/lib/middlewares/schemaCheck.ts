import { checkSchema } from "express-validator";
import validationErrorsHandler from "./validationErrorsHandler";
import {
  DefaultSchemaKeys,
  Schema,
} from "express-validator/lib/middlewares/schema";

const schemaCheck = (schema: Schema<DefaultSchemaKeys>) => [
  ...checkSchema(schema),
  validationErrorsHandler,
];

export default schemaCheck;
