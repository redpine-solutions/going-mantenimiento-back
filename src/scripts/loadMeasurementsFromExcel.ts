import * as dotenv from 'dotenv';
import * as ExcelJS from 'exceljs';
import mongoose from 'mongoose';

import Measurement from '../api/models/Measurement';
import {
  getMongoCluster,
  getMongoDb,
  getMongoPass,
  getMongoUser,
} from '../api/lib/environment/vairables';

// Configurar dotenv
dotenv.config();

// Configuracion de la base de datos
const db = getMongoDb();
const dbUser = getMongoUser();
const dbPassword = getMongoPass();
const dbCluster = getMongoCluster();

const MONGO_URI = `mongodb+srv://${dbUser}:${dbPassword}@${dbCluster}.mongodb.net/${db}`;

// Obtener el clientId desde los argumentos de la linea de comandos
const CLIENT_ID = process.argv[2];

if (!CLIENT_ID) {
  console.error('Error: Debe proporcionar el clientId como argumento');
  console.error('Uso: npm run load:measurements <clientId>');
  console.error('Ejemplo: npm run load:measurements 6924acfdfe0e9f6c29d35966');
  process.exit(1);
}

// Validar que el clientId sea un ObjectId valido
if (!mongoose.Types.ObjectId.isValid(CLIENT_ID)) {
  console.error('Error: El clientId proporcionado no es un ObjectId valido');
  process.exit(1);
}

// Ruta al archivo Excel
const EXCEL_FILE_PATH = 'FTL - TABLA RESUMEN.xlsx';

// Mapeo de tipos de falla del Excel a campos del modelo
const FAULT_TYPE_MAPPING: Record<string, string> = {
  ACOPLAMIENTO: 'coupling',
  ANCLAJE: 'mounting',
  'CAUSA EXTERNA': 'externalCause',
  CAVITACIÓN: 'cavitation',
  'CAVITACION': 'cavitation',
  COJINETE: 'bearing',
  'COJINETES PLANOS': 'plainBearing',
  'COMPONENTES BOMBA': 'pumpComponents',
  CORREAS: 'belts',
  'DEFIC. ESTRUCTURAL': 'structuralDeficiency',
  DESALINEACIÓN: 'misalignment',
  'DESALINEACION': 'misalignment',
  DESBALANCEO: 'unbalance',
  'DESGASTE COMPONENTES': 'componentWear',
  EJE: 'shaft',
  ELÉCTRICO: 'electrical',
  'ELECTRICO': 'electrical',
  ENGRANE: 'gear',
  'FUERZAS AERODINÁMICAS': 'aerodynamicForces',
  'FUERZAS AERODINAMICAS': 'aerodynamicForces',
  'FUERZAS HIDRAULICAS': 'hydraulicForces',
  'FUERZAS HIDRÁULICAS': 'hydraulicForces',
  LUBRICACIÓN: 'lubrication',
  'LUBRICACION': 'lubrication',
  'MOTOR ELÉCTRICO': 'electricMotor',
  'MOTOR ELECTRICO': 'electricMotor',
  OPERACIONAL: 'operational',
  'PERDIDA DE PRODUCTO': 'productLoss',
  'PÉRDIDA DE PRODUCTO': 'productLoss',
  RESONANCIA: 'resonance',
  ROCE: 'friction',
  RODAMIENTO: 'rollingBearing',
  SEGURIDAD: 'safety',
  'SIN INFO. TÉCNICA': 'noTechnicalInfo',
  'SIN INFO. TECNICA': 'noTechnicalInfo',
  'SOLTURA MECÁNICA': 'mechanicalLooseness',
  'SOLTURA MECANICA': 'mechanicalLooseness',
  'TRANSMISIÓN DE POTENCIA': 'powerTransmission',
  'TRANSMISION DE POTENCIA': 'powerTransmission',
};

// Campos de tipos de falla que no se mapean (se ignoran)
const IGNORED_FAULT_TYPES = ['SENSOR SIN SEÑAL'];

interface PeriodData {
  year: number;
  month: number;
  good: number;
  observation: number;
  unsatisfactory: number;
  danger: number;
  unmeasured: number;
}

interface FaultData {
  [fieldName: string]: number;
}

interface MeasurementData {
  year: number;
  month: number;
  monthIndex: number;
  opening: string;
  good: number;
  observation: number;
  unsatisfactory: number;
  danger: number;
  unmeasured: number;
  coupling: number;
  mounting: number;
  externalCause: number;
  cavitation: number;
  bearing: number;
  plainBearing: number;
  belts: number;
  structuralDeficiency: number;
  misalignment: number;
  unbalance: number;
  componentWear: number;
  shaft: number;
  electrical: number;
  gear: number;
  aerodynamicForces: number;
  hydraulicForces: number;
  lubrication: number;
  operational: number;
  productLoss: number;
  resonance: number;
  friction: number;
  rollingBearing: number;
  sensorNoSignal: number;
  safety: number;
  noTechnicalInfo: number;
  mechanicalLooseness: number;
  powerTransmission: number;
  pumpComponents: number;
  electricMotor: number;
  clientId: mongoose.Types.ObjectId;
}

// Funcion para extraer anio y mes de una fecha de Excel
const extractYearMonth = (dateValue: unknown): { year: number; month: number } | null => {
  if (!dateValue) return null;

  let date: Date;
  if (dateValue instanceof Date) {
    date = dateValue;
  } else if (typeof dateValue === 'string') {
    date = new Date(dateValue);
  } else {
    return null;
  }

  if (isNaN(date.getTime())) return null;

  // La fecha en el Excel es el ultimo dia del mes, pero necesitamos el mes real
  // Ejemplo: 2023-03-01 (por timezone) realmente es febrero 2023
  // Restamos un dia para obtener el mes correcto
  const adjustedDate = new Date(date);
  adjustedDate.setDate(adjustedDate.getDate() - 1);

  return {
    year: adjustedDate.getFullYear(),
    month: adjustedDate.getMonth() + 1, // 1-12
  };
};

// Funcion para leer datos de estado de una hoja de ruta
const readRouteData = (
  worksheet: ExcelJS.Worksheet,
): Map<string, PeriodData> => {
  const dataMap = new Map<string, PeriodData>();

  // Los datos empiezan en la fila 3, columna B es PERIODO
  for (let rowNum = 3; rowNum <= worksheet.rowCount; rowNum++) {
    const row = worksheet.getRow(rowNum);
    const dateCell = row.getCell(2).value;
    const yearMonth = extractYearMonth(dateCell);

    if (!yearMonth) continue;

    const key = `${yearMonth.year}-${yearMonth.month}`;
    const good = Number(row.getCell(3).value) || 0;
    const observation = Number(row.getCell(4).value) || 0;
    const unsatisfactory = Number(row.getCell(5).value) || 0;
    const danger = Number(row.getCell(6).value) || 0;
    const unmeasured = Number(row.getCell(7).value) || 0;

    dataMap.set(key, {
      year: yearMonth.year,
      month: yearMonth.month,
      good,
      observation,
      unsatisfactory,
      danger,
      unmeasured,
    });
  }

  return dataMap;
};

// Funcion para leer datos de tipos de falla
const readFaultData = (
  worksheet: ExcelJS.Worksheet,
): Map<string, FaultData> => {
  const dataMap = new Map<string, FaultData>();

  // La fila 2 contiene las fechas (columnas 3 en adelante)
  const headerRow = worksheet.getRow(2);
  const dateColumns: { colNum: number; year: number; month: number }[] = [];

  // Leer fechas de las columnas
  for (let colNum = 3; colNum <= worksheet.columnCount; colNum++) {
    const dateCell = headerRow.getCell(colNum).value;
    const yearMonth = extractYearMonth(dateCell);
    if (yearMonth) {
      dateColumns.push({ colNum, ...yearMonth });
    }
  }

  // Inicializar el mapa con datos vacios para cada periodo
  dateColumns.forEach(({ year, month }) => {
    const key = `${year}-${month}`;
    if (!dataMap.has(key)) {
      dataMap.set(key, {});
    }
  });

  // Leer tipos de falla (filas 3 en adelante)
  for (let rowNum = 3; rowNum <= worksheet.rowCount; rowNum++) {
    const row = worksheet.getRow(rowNum);
    const faultType = String(row.getCell(2).value || '').trim().toUpperCase();

    if (!faultType) continue;

    // Verificar si el tipo de falla esta en el mapeo
    const fieldName = FAULT_TYPE_MAPPING[faultType];
    if (!fieldName) {
      if (!IGNORED_FAULT_TYPES.includes(faultType)) {
        console.warn(`  Advertencia: Tipo de falla no mapeado: "${faultType}"`);
      }
      continue;
    }

    // Leer valores para cada columna de fecha
    dateColumns.forEach(({ colNum, year, month }) => {
      const key = `${year}-${month}`;
      const value = Number(row.getCell(colNum).value) || 0;
      const faultData = dataMap.get(key)!;
      faultData[fieldName] = value;
    });
  }

  return dataMap;
};

// Funcion para crear un objeto de medicion con valores por defecto
const createMeasurementData = (
  periodData: PeriodData,
  faultData: FaultData,
  opening: string,
  clientId: mongoose.Types.ObjectId,
): MeasurementData => {
  const monthIndex = periodData.year * 12 + (periodData.month - 1);

  return {
    year: periodData.year,
    month: periodData.month,
    monthIndex,
    opening,
    good: periodData.good,
    observation: periodData.observation,
    unsatisfactory: periodData.unsatisfactory,
    danger: periodData.danger,
    unmeasured: periodData.unmeasured,
    coupling: faultData.coupling || 0,
    mounting: faultData.mounting || 0,
    externalCause: faultData.externalCause || 0,
    cavitation: faultData.cavitation || 0,
    bearing: faultData.bearing || 0,
    plainBearing: faultData.plainBearing || 0,
    belts: faultData.belts || 0,
    structuralDeficiency: faultData.structuralDeficiency || 0,
    misalignment: faultData.misalignment || 0,
    unbalance: faultData.unbalance || 0,
    componentWear: faultData.componentWear || 0,
    shaft: faultData.shaft || 0,
    electrical: faultData.electrical || 0,
    gear: faultData.gear || 0,
    aerodynamicForces: faultData.aerodynamicForces || 0,
    hydraulicForces: faultData.hydraulicForces || 0,
    lubrication: faultData.lubrication || 0,
    operational: faultData.operational || 0,
    productLoss: faultData.productLoss || 0,
    resonance: faultData.resonance || 0,
    friction: faultData.friction || 0,
    rollingBearing: faultData.rollingBearing || 0,
    sensorNoSignal: 0, // No existe en el Excel
    safety: faultData.safety || 0,
    noTechnicalInfo: faultData.noTechnicalInfo || 0,
    mechanicalLooseness: faultData.mechanicalLooseness || 0,
    powerTransmission: faultData.powerTransmission || 0,
    pumpComponents: faultData.pumpComponents || 0,
    electricMotor: faultData.electricMotor || 0,
    clientId,
  };
};

// Funcion principal
const loadMeasurementsFromExcel = async (): Promise<void> => {
  try {
    console.log('='.repeat(60));
    console.log('CARGA DE MEDICIONES DESDE EXCEL');
    console.log('='.repeat(60));
    console.log(`\nCliente ID: ${CLIENT_ID}`);
    console.log(`Archivo: ${EXCEL_FILE_PATH}`);

    // Leer archivo Excel
    console.log('\n1. Leyendo archivo Excel...');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(EXCEL_FILE_PATH);

    // Obtener hojas
    const sheetCriticosA = workbook.getWorksheet('RUTA CRÍTICOS A');
    const sheetFallasA = workbook.getWorksheet('CRÍTICOA A - TIPO DE FALLA');
    const sheetCriticosB = workbook.getWorksheet('RUTA CRÍTICOS B');
    const sheetFallasB = workbook.getWorksheet('CRÍTICOS B - TIPO DE FALLA');

    if (!sheetCriticosA || !sheetFallasA || !sheetCriticosB || !sheetFallasB) {
      throw new Error('No se encontraron todas las hojas necesarias en el archivo Excel');
    }

    console.log('   Hojas encontradas correctamente');

    // Leer datos de cada hoja
    console.log('\n2. Procesando datos de CRITICOS A...');
    const routeDataA = readRouteData(sheetCriticosA);
    const faultDataA = readFaultData(sheetFallasA);
    console.log(`   Periodos encontrados: ${routeDataA.size}`);

    console.log('\n3. Procesando datos de CRITICOS B...');
    const routeDataB = readRouteData(sheetCriticosB);
    const faultDataB = readFaultData(sheetFallasB);
    console.log(`   Periodos encontrados: ${routeDataB.size}`);

    // Crear mediciones
    console.log('\n4. Creando objetos de medicion...');
    const clientObjectId = new mongoose.Types.ObjectId(CLIENT_ID);
    const measurements: MeasurementData[] = [];

    // Procesar CRITICOS A
    routeDataA.forEach((periodData, key) => {
      const faultData = faultDataA.get(key) || {};
      measurements.push(
        createMeasurementData(periodData, faultData, 'CRITICOS A', clientObjectId)
      );
    });

    // Procesar CRITICOS B
    routeDataB.forEach((periodData, key) => {
      const faultData = faultDataB.get(key) || {};
      measurements.push(
        createMeasurementData(periodData, faultData, 'CRITICOS B', clientObjectId)
      );
    });

    // Ordenar por opening y monthIndex
    measurements.sort((a, b) => {
      if (a.opening !== b.opening) return a.opening.localeCompare(b.opening);
      return a.monthIndex - b.monthIndex;
    });

    console.log(`   Total de mediciones a procesar: ${measurements.length}`);

    // Mostrar resumen de datos
    console.log('\n5. Resumen de datos a cargar:');
    console.log('-'.repeat(60));
    measurements.forEach((m, index) => {
      const ym = `${m.year}-${String(m.month).padStart(2, '0')}`;
      console.log(
        `${index + 1}. ${m.opening} | ${ym} | B:${m.good} O:${m.observation} I:${m.unsatisfactory} P:${m.danger} NM:${m.unmeasured}`
      );
    });

    // Conectar a la base de datos
    console.log('\n6. Conectando a la base de datos...');
    await mongoose.connect(MONGO_URI);
    console.log('   Conexion exitosa a MongoDB');

    // Realizar upsert para cada medicion
    console.log('\n7. Ejecutando upsert de mediciones...');
    let insertedCount = 0;
    let updatedCount = 0;

    for (const measurement of measurements) {
      const filter = {
        clientId: measurement.clientId,
        year: measurement.year,
        month: measurement.month,
        opening: measurement.opening,
      };

      // Verificar si existe antes del upsert
      const existing = await Measurement.findOne(filter);
      const wasUpdate = !!existing;

      await Measurement.findOneAndUpdate(
        filter,
        { $set: measurement },
        { upsert: true, new: true }
      );

      if (wasUpdate) {
        updatedCount++;
      } else {
        insertedCount++;
      }

      const ym = `${measurement.year}-${String(measurement.month).padStart(2, '0')}`;
      const action = wasUpdate ? 'Actualizado' : 'Insertado';
      console.log(`   ${action}: ${measurement.opening} - ${ym}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('RESUMEN DE LA OPERACION');
    console.log('='.repeat(60));
    console.log(`Mediciones insertadas: ${insertedCount}`);
    console.log(`Mediciones actualizadas: ${updatedCount}`);
    console.log(`Total procesadas: ${measurements.length}`);
    console.log('='.repeat(60));

  } catch (error) {
    console.error('\nError al procesar el archivo:', error);
    if (error instanceof Error) {
      console.error('Mensaje:', error.message);
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  } finally {
    console.log('\nCerrando conexion a la base de datos...');
    await mongoose.connection.close();
    console.log('Conexion cerrada correctamente');
    process.exit(0);
  }
};

// Ejecutar el script
loadMeasurementsFromExcel();
