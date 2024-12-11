import { MongoClient } from 'mongodb';
class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    const uri = `mongodb://${host}:${port}`;

    this.client = new MongoClient(uri, { useUnifiedTopology: true });
    this.db = null;

    this.client.connect()
      .then(() => {
        this.db = this.client.db(database);
        console.log(`Connected to MongoDB at ${uri}`);
      })
      .catch((error) => {
        console.error(`MongoDB connection error: ${error.message}`);
      });
  }

  isAlive() {
    return this.client.topology && this.client.topology.isConnected();
  }

  async nbUsers() {
    if (!this.db) return 0;
    const usersCollection = this.db.collection('users');
    return usersCollection.countDocuments();
  }

  async nbFiles() {
    if (!this.db) return 0; 
    const filesCollection = this.db.collection('files');
    return filesCollection.countDocuments();
  }

  async close() {
    await this.client.close();
  }
}

const dbClient = new DBClient();

process.on('SIGINT', async () => {
  console.log('Closing MongoDB connection');
  await dbClient.close();
  process.exit(0);
});

export default dbClient;
