/* eslint-disable @typescript-eslint/no-useless-constructor */
import { Album } from '@app/classes/interfaces/album/album';
import { Drawing, LightDrawing } from '@app/classes/interfaces/drawing/drawing';
import { Db, MongoClient, ObjectId } from 'mongodb';
import { Service } from 'typedi';
import { Movement } from '../../../../common/classes/movement';
import { User } from '../../../../common/user/user';
const DATABASE_URL = 'mongodb+srv://equipe204:equipe204@clusterprojet3.1owur.mongodb.net/Project3?retryWrites=true&w=majority';
const DATABASE_NAME = 'Project3';

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
            console.log('connection good');
        } catch {
            throw new Error('Database connection error');
        }
        // const drawing: Drawing = {
        //     drawingName: 'dd5555',
        //     owner: 'samihaha',
        //     dateOfCreation: 'fvvdfvfdvfdvfd',
        //     socketIndex: 0,
        //     allMouvements: [],
        // };
        /*  const idDrawing = '623a849ae108733d23b536b7';
        const idAlbum = '623a3038dd16dce14da056a3';

        this.deleteDrawing(idDrawing).then(
            async (res) => {
                console.log(res);
                return await this.database
                    .collection('albums')
                    .findOne({ _id: new ObjectId(idAlbum) })
                    .then(async (album: Album) => {
                        console.log('album: ', album);

                        const newDrawingList = album.drawings?.filter((drawing: LightDrawing) => drawing.drawingId !== idDrawing);
                        const updatedAlbum = {
                            ...album,
                            drawings: newDrawingList,
                        };
                        console.log('izisias', updatedAlbum);

                        await this.database.collection('albums').updateOne(
                            { _id: new ObjectId(idAlbum) },
                            {
                                $set: updatedAlbum,
                                $currentDate: { lastModified: true },
                            },
                        );
                    });
            },
            (err) => {
                console.log(err);
            },
        );

        // this.addNewDrawing(drawing, 'zzzzzzzzzz').then(
        //     (res) => {
        //         console.log(res);
        //     },
        //     (err) => console.log(err),
        // );*/

        return this.client;
    }

    async deleteDrawing(drawingId: string) {
        return await this.database.collection('drawings').findOneAndDelete({ _id: new ObjectId(drawingId) });
    }

    async deleteAlbumById(id: string) {
        return await this.database.collection('albums').findOneAndDelete({ _id: new ObjectId(id) });
    }
    async getMovementsBySocketIndex(socketIndex: number): Promise<Drawing[]> {
        return await this.database.collection('drawings').find({ socketIndex: socketIndex }).toArray();
    }
    async closeConnection(): Promise<void> {
        return this.client.close();
    }

    get database(): Db {
        return this.db;
    }

    async addNewUser(user: User) {
        return await this.db.collection('users').insertOne(user);
    }

    async getAlbumByName(albumName: string): Promise<Album[]> {
        return await this.db.collection('albums').find({ name: albumName }).sort({ dateCreation: -1 }).toArray();
    }
    async getDrawingBySocketIndex(id: number): Promise<Drawing[]> {
        return await this.db.collection('drawings').find({ socketIndex: id }).toArray();
    }
    async addNewDrawing(drawing: Drawing, albumName: string) {
        return await this.db
            .collection('drawings')
            .insertOne(drawing)
            .then(async (ojectAdded) => {
                const drawingToAddToItsAlbum: LightDrawing = {
                    drawingId: ojectAdded.insertedId.toHexString(),
                    drawingName: drawing.drawingName,
                    owner: drawing.owner,
                    dateOfCreation: drawing.dateOfCreation,
                    socketIndex: drawing.socketIndex,
                };
                return await this.db.collection('albums').updateOne({ name: albumName }, { $push: { drawings: drawingToAddToItsAlbum } });
            });
    }

    async getAllDrawings(): Promise<Drawing[]> {
        return await this.db.collection('drawings').find({}).sort({ socketIndex: 1 }).toArray();
    }
    async getAllDrawingsOfSpecificAlbum(drawingsToGet: string): Promise<Drawing[]> {
        return this.db
            .collection('drawings')
            .find({ _id: { $in: [new ObjectId(drawingsToGet)] } })
            .toArray();
    }
    addMovementToDrawing(socketIndex: number, mvts: Movement[]) {
        this.db.collection('drawings').updateOne({ socketIndex: socketIndex }, { $set: { allMouvements: mvts } });
    }
}
