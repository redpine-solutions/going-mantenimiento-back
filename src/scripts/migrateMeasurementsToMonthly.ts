import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { getMongoCluster, getMongoDb, getMongoPass, getMongoUser } from '../api/lib/environment/vairables';

dotenv.config();

const db = getMongoDb();
const dbUser = getMongoUser();
const dbPassword = getMongoPass();
const dbCluster = getMongoCluster();

const MONGO_URI = `mongodb+srv://${dbUser}:${dbPassword}@${dbCluster}.mongodb.net/${db}`;

// Tipos locales para evitar dependencias de tipos con el modelo
type LegacyMeasurementDoc = {
  _id: unknown;
  date?: Date | string;
  year?: number;
  month?: number; // 1-12
  monthIndex?: number;
};

const migrate = async (): Promise<void> => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected');

    // Usar colección nativa para evitar conflictos de tipos con el schema actual
    const col = mongoose.connection.collection('measurements');

    // Buscar documentos que tengan `date` legacy o que les falte monthIndex/year/month
    const cursor = col.find({
      $or: [
        { date: { $exists: true } },
        { monthIndex: { $exists: false } },
        { year: { $exists: false } },
        { month: { $exists: false } },
      ],
    });

    const ops: any[] = [];
    let processed = 0;

    for await (const raw of cursor as AsyncIterable<unknown>) {
      const doc = raw as LegacyMeasurementDoc;
      let year: number | undefined = undefined;
      let month: number | undefined = undefined;

      if (doc.date) {
        const d = new Date(doc.date);
        year = d.getUTCFullYear();
        month = d.getUTCMonth() + 1; // 1-12
      } else if (typeof doc.year === 'number' && typeof doc.month === 'number') {
        year = doc.year;
        month = doc.month;
      }

      if (typeof year !== 'number' || typeof month !== 'number') {
        console.warn(`Skipping _id=${doc._id} - missing date/year+month`);
        continue;
      }

      const monthIndex = year * 12 + (month - 1);

      const update: Record<string, unknown> = {
        year,
        month,
        monthIndex,
      };

      const unset: Record<string, unknown> = {};
      if (doc.date) unset.date = '';

      ops.push({
        updateOne: {
          filter: { _id: doc._id },
          update: {
            $set: update,
            ...(Object.keys(unset).length ? { $unset: unset } : {}),
          },
          upsert: false,
        },
      });

      processed++;

      // Flush in batches
      if (ops.length >= 1000) {
        await col.bulkWrite(ops, { ordered: false });
        console.log(`Migrated ${processed} documents...`);
        ops.length = 0;
      }
    }

    if (ops.length > 0) {
      await col.bulkWrite(ops, { ordered: false });
    }

    console.log(`Migration complete. Total processed: ${processed}`);
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed.');
    process.exit(0);
  }
};

migrate();


