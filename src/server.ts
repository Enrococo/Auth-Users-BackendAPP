import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './database/connection.js';
import log from './logger.js';
// Import multer from 'multer';
// import { StorageClient } from '@supabase/storage-js';
dotenv.config();
const port = process.env.PORT ?? 3000;
const mongoUrl = process.env.MONGO_URL ?? '';

// // const upload = multer({ dest: 'uploads/' });

// const supabaseUrl = 'https://lqmjozpcyatulguyifjy.supabase.co';
// const supabaseKey =
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxbWpvenBjeWF0dWxndXlpZmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzc4NDE3NjksImV4cCI6MTk5MzQxNzc2OX0.FEXU6LGvga7EIcCzDejCCzW5fPNVjyaztMrXdT3WDfk';

// const storage = new StorageClient(supabaseUrl, {
//   apikey: supabaseKey,
//   Authorization: `Bearer ${supabaseKey}`,
// });

app.listen(port, async () => {
  await connectDB(mongoUrl);
  log.info(`Server started in port ${port}`);
});
