// eslint-disable no-restricted-imports
import { Drawing } from '@app/classes/interfaces/drawing/drawing';
import { Service } from 'typedi';
import { DatabaseConnectionService } from '../database-connection/connection.service';

@Service()
export class AlbumService {
    // private db: Db;
    constructor(private databaseConnection: DatabaseConnectionService) {}

    async createDrawing(drawing: Drawing): Promise<any> {
        return await this.databaseConnection.database.collection('drawings').insertOne(drawing);
    }
    async getDrawingsByCreator(creatorName: string) {
        return await this.databaseConnection.database.collection('drawings').find({}).sort({ dateOfCreation: -1 }).toArray();
    }

    async getAllDrawings(): Promise<Drawing[]> {
        return await this.databaseConnection.database.collection('drawings').find({}).sort({ dateOfCreation: -1 }).toArray();
    }
    async getAllDrawingsWithId(drawingsToGet: string[]): Promise<Drawing[]> {
        return this.databaseConnection.database
            .collection('drawings')
            .find({ _id: { $in: drawingsToGet } })
            .sort({ dateOfCreation: -1 })
            .toArray();
    }
}
