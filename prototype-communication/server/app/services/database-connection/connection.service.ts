/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Db, MongoClient } from 'mongodb';
import { Service } from 'typedi';

const DATABASE_URL = 'mongodb+srv://equipe204:equipe204@clusterprojet3.1owur.mongodb.net/Project3?retryWrites=true&w=majority';

const DATABASE_NAME = 'Project3';

export interface Score {
    id: string;
    name: string;
    score: number;
}

@Service()
export class DatabaseConnectionService {
    private db: Db;
    private client: MongoClient;

    constructor() {}

    async start(url: string = DATABASE_URL): Promise<MongoClient | null> {
        try {
            const client = await MongoClient.connect(url);
            this.client = client;
            this.db = client.db(DATABASE_NAME);
            console.log('connexion a la bd avec succes');
        } catch {
            throw new Error('Database connection error');
        }
        await this.fetchDataReturn();
        return this.client;
    }
    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    get database(): Db {
        return this.db;
    }
    async getAllUsers() {
        return this.db
            .collection('Users')
            .find({})
            .toArray()
            .then((Users) => {
                return Users;
            });
    }

    async fetchDataReturn(): Promise<void> {
        const arrayOfScoresPromises = await this.getAllUsers();
        console.log(arrayOfScoresPromises);
    }
}
