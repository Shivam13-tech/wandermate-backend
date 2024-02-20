import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({path: './Protect/config.env'});

const database: string = process.env.DATABASE_URL || '';


async function connectToDatabase() {
    try {
      if(!database){
          throw new Error('DATABASE_URL is not set');
      }
      await mongoose.connect(database);
      console.log('Connected to database');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      process.exit(1);
    }
}
  

connectToDatabase();

const port = 8080;
app.listen(port, () => {
    console.log(`Server started on port: ${port}`)
})