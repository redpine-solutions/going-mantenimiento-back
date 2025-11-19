export const getNodeEnv = () => process.env.NODE_ENV;
// ===== CONFIGURACIÓN DEL SERVIDOR =====
export const getPort = () => {
  return process.env.PORT || '3000';
};

// ===== BASE DE DATOS =====
export const getMongoDbUri = () => {
  return process.env.MONGODB_URI || 'mongodb://localhost:27017/vivendi';
};

export const getMongoDb = () => {
  if (!process.env.MONGO_DB) {
    throw new Error('MONGO_DB is not set');
  }
  return process.env.MONGO_DB;
};

export const getMongoUser = () => {
  if (!process.env.MONGO_USER) {
    throw new Error('MONGO_USER is not set');
  }
  return process.env.MONGO_USER;
};

export const getMongoPass = () => {
  if (!process.env.MONGO_PASS) {
    throw new Error('MONGO_PASS is not set');
  }
  return process.env.MONGO_PASS;
};

export const getMongoCluster = () => {
  if (!process.env.MONGO_CLUSTER) {
    throw new Error('MONGO_CLUSTER is not set');
  }
  return process.env.MONGO_CLUSTER;
};

// ===== AUTENTICACIÓN =====
export const getJwtSecret = () => {
  return process.env.JWT_SECRET || 'default_secret';
};

// ===== INTEGRACIÓN LAUDUS ERP =====
export const getLaudusBaseUrl = () => {
  if (!process.env.LAUDUS_BASE_URL) {
    throw new Error('LAUDUS_BASE_URL is not set');
  }
  return process.env.LAUDUS_BASE_URL;
};

export const getLaudusUsername = () => {
  if (!process.env.LAUDUS_USERNAME) {
    throw new Error('LAUDUS_USERNAME is not set');
  }
  return process.env.LAUDUS_USERNAME;
};

export const getLaudusPassword = () => {
  if (!process.env.LAUDUS_PASSWORD) {
    throw new Error('LAUDUS_PASSWORD is not set');
  }
  return process.env.LAUDUS_PASSWORD;
};

export const getLaudusCompanyVatId = () => {
  if (!process.env.LAUDUS_COMPANY_VAT_ID) {
    throw new Error('LAUDUS_COMPANY_VAT_ID is not set');
  }
  return process.env.LAUDUS_COMPANY_VAT_ID;
};

// ===== SERVIDOR DE EMAIL =====
export const getEmailServerUrl = () => {
  if (!process.env.EMAIL_SERVER_URL) {
    throw new Error('EMAIL_SERVER_URL is not set');
  }
  return process.env.EMAIL_SERVER_URL;
};

// ===== INFORMACIÓN DEL PAQUETE =====
export const getPackageVersion = () => {
  return process.env.npm_package_version || '1.0.0';
};
