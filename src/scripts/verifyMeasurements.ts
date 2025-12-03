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

// ID del cliente
const CLIENT_ID = '6924acfdfe0e9f6c29d35966';

// Función principal
const verifyMeasurements = async (): Promise<void> => {
  try {
    console.log('Conectando a la base de datos...');
    await mongoose.connect(MONGO_URI);
    console.log('Conexión exitosa a MongoDB');

    console.log(`\nConsultando mediciones del cliente: ${CLIENT_ID}\n`);

    const measurements = await Measurement
      .find({ clientId: new mongoose.Types.ObjectId(CLIENT_ID) })
      .sort({ monthIndex: 1 })
      .exec();

    console.log(`Total de mediciones encontradas: ${measurements.length}\n`);

    if (measurements.length > 0) {
      console.log('Detalle de las mediciones:\n');
      measurements.forEach((measurement, index) => {
        console.log(`${index + 1}. ID: ${measurement._id}`);
        const ym = `${measurement.year}-${String(measurement.month).padStart(2, '0')}`;
        console.log(`   Periodo: ${ym}`);
        console.log(`   Bueno: ${measurement.good}`);
        console.log(`   Observación: ${measurement.observation}`);
        console.log(`   Insatisfactorio: ${measurement.unsatisfactory}`);
        console.log(`   Peligro: ${measurement.danger}`);
        console.log(`   No Medido: ${measurement.unmeasured}`);
        console.log(`   Total: ${measurement.good + measurement.observation + measurement.unsatisfactory + measurement.danger + measurement.unmeasured}`);
        console.log(`   Creado: ${measurement.createdAt}`);
        console.log('');
      });
    } else {
      console.log('No se encontraron mediciones para este cliente.');
    }

  } catch (error) {
    console.error('\n✗ Error al consultar mediciones:', error);
    if (error instanceof Error) {
      console.error('Mensaje de error:', error.message);
    }
  } finally {
    console.log('Cerrando conexión a la base de datos...');
    await mongoose.connection.close();
    console.log('Conexión cerrada correctamente');
    process.exit(0);
  }
};

// Ejecutar el script
verifyMeasurements();
