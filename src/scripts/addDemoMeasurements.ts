import dotenv from 'dotenv';
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

// Configuración de la base de datos
const db = getMongoDb();
const dbUser = getMongoUser();
const dbPassword = getMongoPass();
const dbCluster = getMongoCluster();

const MONGO_URI = `mongodb+srv://${dbUser}:${dbPassword}@${dbCluster}.mongodb.net/${db}`;

// ID del cliente al que se le agregarán las mediciones
const CLIENT_ID = '6924acfdfe0e9f6c29d35966';

// Función para generar datos de mediciones de demostración
const generateDemoMeasurements = () => {
  const measurements = [];
  const today = new Date();

  // Generar mediciones para los últimos 12 meses (máximo 4 por mes)
  for (let i = 11; i >= 0; i--) {
    // Número aleatorio de mediciones por mes (1-4)
    const measurementsPerMonth = 1 + Math.floor(Math.random() * 4);

    // Generar días únicos para cada medición del mes
    const usedDays = new Set<number>();

    for (let j = 0; j < measurementsPerMonth; j++) {
      const measurementDate = new Date(today);
      measurementDate.setMonth(today.getMonth() - i);

      // Obtener el último día del mes
      const lastDayOfMonth = new Date(
        measurementDate.getFullYear(),
        measurementDate.getMonth() + 1,
        0
      ).getDate();

      // Generar un día único dentro del mes
      let day: number;
      do {
        day = 1 + Math.floor(Math.random() * lastDayOfMonth);
      } while (usedDays.has(day));
      usedDays.add(day);

      measurementDate.setDate(day);
      measurementDate.setHours(0, 0, 0, 0);

      // Generar valores con distribución aleatoria y variada
      // Algunos escenarios pueden tener danger > good, observation > good, etc.
      const scenario = Math.random();

      let baseGood: number;
      let baseObservation: number;
      let baseUnsatisfactory: number;
      let baseDanger: number;
      let baseUnmeasured: number;

      if (scenario < 0.3) {
        // Escenario normal: good es el más alto
        baseGood = 40 + Math.floor(Math.random() * 50); // 40-90
        baseObservation = 10 + Math.floor(Math.random() * 30); // 10-40
        baseUnsatisfactory = 5 + Math.floor(Math.random() * 25); // 5-30
        baseDanger = Math.floor(Math.random() * 20); // 0-20
        baseUnmeasured = Math.floor(Math.random() * 15); // 0-15
      } else if (scenario < 0.5) {
        // Escenario crítico: danger es alto
        baseGood = 10 + Math.floor(Math.random() * 30); // 10-40
        baseObservation = 15 + Math.floor(Math.random() * 25); // 15-40
        baseUnsatisfactory = 20 + Math.floor(Math.random() * 30); // 20-50
        baseDanger = 30 + Math.floor(Math.random() * 40); // 30-70
        baseUnmeasured = 5 + Math.floor(Math.random() * 20); // 5-25
      } else if (scenario < 0.7) {
        // Escenario de observación: observation domina
        baseGood = 15 + Math.floor(Math.random() * 25); // 15-40
        baseObservation = 40 + Math.floor(Math.random() * 40); // 40-80
        baseUnsatisfactory = 10 + Math.floor(Math.random() * 30); // 10-40
        baseDanger = 5 + Math.floor(Math.random() * 20); // 5-25
        baseUnmeasured = Math.floor(Math.random() * 15); // 0-15
      } else if (scenario < 0.85) {
        // Escenario mixto: valores cercanos entre sí
        const base = 20 + Math.floor(Math.random() * 20); // 20-40
        baseGood = base + Math.floor(Math.random() * 15) - 7;
        baseObservation = base + Math.floor(Math.random() * 15) - 7;
        baseUnsatisfactory = base + Math.floor(Math.random() * 15) - 7;
        baseDanger = base + Math.floor(Math.random() * 15) - 7;
        baseUnmeasured = Math.floor(Math.random() * 20);
      } else {
        // Escenario caótico: completamente aleatorio
        baseGood = Math.floor(Math.random() * 80); // 0-80
        baseObservation = Math.floor(Math.random() * 80); // 0-80
        baseUnsatisfactory = Math.floor(Math.random() * 80); // 0-80
        baseDanger = Math.floor(Math.random() * 80); // 0-80
        baseUnmeasured = Math.floor(Math.random() * 40); // 0-40
      }

      // Asegurar valores mínimos de 0
      baseGood = Math.max(0, baseGood);
      baseObservation = Math.max(0, baseObservation);
      baseUnsatisfactory = Math.max(0, baseUnsatisfactory);
      baseDanger = Math.max(0, baseDanger);
      baseUnmeasured = Math.max(0, baseUnmeasured);

      // Generar valores aleatorios para los nuevos campos de causas/condiciones (0-30)
      const coupling = Math.floor(Math.random() * 31);
      const mounting = Math.floor(Math.random() * 31);
      const externalCause = Math.floor(Math.random() * 31);
      const cavitation = Math.floor(Math.random() * 31);
      const bearing = Math.floor(Math.random() * 31);
      const plainBearing = Math.floor(Math.random() * 31);
      const belts = Math.floor(Math.random() * 31);
      const structuralDeficiency = Math.floor(Math.random() * 31);
      const misalignment = Math.floor(Math.random() * 31);
      const unbalance = Math.floor(Math.random() * 31);
      const componentWear = Math.floor(Math.random() * 31);
      const shaft = Math.floor(Math.random() * 31);
      const electrical = Math.floor(Math.random() * 31);
      const gear = Math.floor(Math.random() * 31);
      const aerodynamicForces = Math.floor(Math.random() * 31);
      const hydraulicForces = Math.floor(Math.random() * 31);
      const lubrication = Math.floor(Math.random() * 31);
      const operational = Math.floor(Math.random() * 31);
      const productLoss = Math.floor(Math.random() * 31);
      const resonance = Math.floor(Math.random() * 31);
      const friction = Math.floor(Math.random() * 31);
      const rollingBearing = Math.floor(Math.random() * 31);
      const sensorNoSignal = Math.floor(Math.random() * 31);
      const safety = Math.floor(Math.random() * 31);
      const noTechnicalInfo = Math.floor(Math.random() * 31);
      const mechanicalLooseness = Math.floor(Math.random() * 31);
      const powerTransmission = Math.floor(Math.random() * 31);

      const year = measurementDate.getUTCFullYear();
      const month = measurementDate.getUTCMonth() + 1; // 1-12
      const monthIndex = year * 12 + (month - 1);

      measurements.push({
        year,
        month,
        monthIndex,
        opening: 'Ruta 2',
        good: baseGood,
        observation: baseObservation,
        unsatisfactory: baseUnsatisfactory,
        danger: baseDanger,
        unmeasured: baseUnmeasured,
        coupling,
        mounting,
        externalCause,
        cavitation,
        bearing,
        plainBearing,
        belts,
        structuralDeficiency,
        misalignment,
        unbalance,
        componentWear,
        shaft,
        electrical,
        gear,
        aerodynamicForces,
        hydraulicForces,
        lubrication,
        operational,
        productLoss,
        resonance,
        friction,
        rollingBearing,
        sensorNoSignal,
        safety,
        noTechnicalInfo,
        mechanicalLooseness,
        powerTransmission,
        clientId: new mongoose.Types.ObjectId(CLIENT_ID),
      });
    }
  }

  // Ordenar por periodo (año/mes)
  measurements.sort((a, b) => a.monthIndex - b.monthIndex);

  return measurements;
};

// Función principal
const addDemoMeasurements = async (): Promise<void> => {
  try {
    console.log('Conectando a la base de datos...');
    await mongoose.connect(MONGO_URI);
    console.log('Conexión exitosa a MongoDB');

    // Eliminar mediciones existentes del cliente
    console.log(`\nEliminando mediciones existentes del cliente: ${CLIENT_ID}`);
  //  const deleteResult = await Measurement.deleteMany({
 //     clientId: new mongoose.Types.ObjectId(CLIENT_ID),
 //   });
 //   console.log(`✓ Se eliminaron ${deleteResult.deletedCount} mediciones existentes`);

    console.log(`\nGenerando mediciones de demostración para el cliente: ${CLIENT_ID}`);
    const demoMeasurements = generateDemoMeasurements();

    console.log(`\nTotal de mediciones a insertar: ${demoMeasurements.length}`);
    console.log('\nDetalle de las mediciones (YYYY-MM):');
    demoMeasurements.forEach((measurement, index) => {
      const ym = `${measurement.year}-${String(measurement.month).padStart(2, '0')}`;
      console.log(`\n${index + 1}. Periodo: ${ym}`);
      console.log(`   - Bueno: ${measurement.good}`);
      console.log(`   - Observación: ${measurement.observation}`);
      console.log(`   - Insatisfactorio: ${measurement.unsatisfactory}`);
      console.log(`   - Peligro: ${measurement.danger}`);
      console.log(`   - No Medido: ${measurement.unmeasured}`);
      console.log(`   - Total: ${measurement.good + measurement.observation + measurement.unsatisfactory + measurement.danger + measurement.unmeasured}`);
    });

    console.log('\n\nInsertando mediciones en la base de datos...');
    const result = await Measurement.insertMany(demoMeasurements);

    console.log(`\n✓ Éxito: Se insertaron ${result.length} mediciones correctamente`);
    console.log('\nIDs de las mediciones insertadas (YYYY-MM):');
    result.forEach((measurement, index) => {
      const ym = `${measurement.year}-${String(measurement.month).padStart(2, '0')}`;
      console.log(`${index + 1}. ${measurement._id} - ${ym}`);
    });

  } catch (error) {
    console.error('\n✗ Error al insertar mediciones:', error);
    if (error instanceof Error) {
      console.error('Mensaje de error:', error.message);
      console.error('Stack trace:', error.stack);
    }
  } finally {
    console.log('\nCerrando conexión a la base de datos...');
    await mongoose.connection.close();
    console.log('Conexión cerrada correctamente');
    process.exit(0);
  }
};

// Ejecutar el script
addDemoMeasurements();
