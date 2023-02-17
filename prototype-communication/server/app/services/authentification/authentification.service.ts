/* eslint-disable no-unused-vars */
import { USER_COLLECTION_NAME } from '@app/classes/constantes/constantes';
import { User } from '@app/classes/user-interface/user';
import { Db } from 'mongodb';
import { Service } from 'typedi';
// eslint-disable-next-line no-restricted-imports
import { DatabaseConnectionService } from '../database-connection/connection.service';

@Service()
export class AuthentificationService {
    private db: Db;
    constructor(private databaseConnection: DatabaseConnectionService) {
        this.db = this.databaseConnection.database;
    }

    async addNewUserToBd(user: User): Promise<void> {
        this.db.collection(USER_COLLECTION_NAME).insertOne(user);
    }
}
