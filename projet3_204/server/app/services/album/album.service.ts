/* eslint-disable no-unused-vars */
import { Album } from '@app/classes/interfaces/album/album';
import { ObjectId } from 'mongodb';
// import { Db } from 'mongodb';
import { Service } from 'typedi';
// eslint-disable-next-line no-restricted-imports
import { DatabaseConnectionService } from '../database-connection/connection.service';

@Service()
export class AlbumService {
    // private db: Db;
    constructor(private databaseConnection: DatabaseConnectionService) {
        // this.databaseconnection.database = this.databaseConnection.database;
    }
    async getAlbumById(id: string): Promise<Album[]> {
        return await this.databaseConnection.database
            .collection('albums')
            .find({ _id: new ObjectId(id) })
            .sort({ dateCreation: -1 })
            .toArray();
    }
    //create Album
    async addNewAlbum(album: Album): Promise<boolean> {
        return (await this.databaseConnection.database.collection('albums').insertOne(album)).acknowledged;
    }
    // //Todo: Test schemas get request
    async getAllAlbums(): Promise<Album[]> {
        return await this.databaseConnection.database.collection('albums').find({}).sort({ dateCreation: -1 }).toArray();
    }
    // getSpecificAlbum() {}
    async getAlbumByName(albumName: string): Promise<Album[]> {
        return await this.databaseConnection.database.collection('albums').find({ name: albumName }).sort({ dateCreation: -1 }).toArray();
    }
    async getPublicAlbum(): Promise<Album[]> {
        return await this.databaseConnection.database.collection('albums').find({ public: true }).sort({ dateCreation: -1 }).toArray();
    }
    async getPrivateAlbum(): Promise<Album[]> {
        return await this.databaseConnection.database.collection('albums').find({ public: false }).sort({ dateCreation: -1 }).toArray();
    }
    // getSpecificAlbum() {}
    async getAlbumsByOwner(ownerName: string): Promise<Album[]> {
        return await this.databaseConnection.database.collection('albums').find({ owner: ownerName }).sort({ dateCreation: -1 }).toArray();
    }
    // deleteSpecificAlbum() {}
    async deleteAlbumByNameOnly(albumName: string, ownerName: string) {
        return (await this.databaseConnection.database.collection('albums').findOneAndDelete({ name: albumName }, { sort: { dateCreation: -1 } }))
            .value;
    }
    async deleteAlbumByNameAndOwner(albumName: string, ownerName: string) {
        return (
            await this.databaseConnection.database
                .collection('albums')
                .findOneAndDelete({ name: albumName, owner: ownerName }, { sort: { dateCreation: -1 } })
        ).value;
    }
    async deleteAlbumById(id: string) {
        return await this.databaseConnection.database.collection('albums').findOneAndDelete({ _id: new ObjectId(id) });
    }

    // addNewMember() {}  // deleteMember() updateNameMember{}
    async addNewMember(albumName: string, ownerName: string, joinerName: string) {
        return await this.databaseConnection.database
            .collection('albums')
            .updateOne({ name: albumName, owner: ownerName }, { $push: { members: joinerName } });
    }
    async deleteMember(albumName: string, ownerName: string, memeberToDelete: string) {
        return await this.databaseConnection.database
            .collection('albums')
            .updateOne({ name: albumName, owner: ownerName }, { $pull: { members: memeberToDelete } });
    }
    async updateMemberName(albumName: string, ownerName: string, oldName: string, newName: string) {
        const query = { name: albumName, owner: ownerName, members: oldName };
        const updateDocument = {
            $set: { 'members.$': newName },
        };
        return await this.databaseConnection.database.collection('albums').updateOne(query, updateDocument);
    }

    //addRequest() deleteRequest() UpdateReequest{}
    async addNewRequestToArrayRequest(albumId: string, joinerName: string) {
        return await this.databaseConnection.database
            .collection('albums')
            .updateOne({ _id: new ObjectId(albumId) }, { $push: { requests: joinerName } });
    }
    async deleteRequestFromArrayRequest(albumName: string, ownerName: string, joinerName: string) {
        return await this.databaseConnection.database
            .collection('albums')
            .updateOne({ members: albumName, owner: ownerName }, { $pull: { requests: joinerName } });
    }

    async updateNameInArrayRequest(albumName: string, ownerName: string, oldNameOfUser: string, newNameOfUser: string) {
        const query = { name: albumName, owner: ownerName, requests: oldNameOfUser };
        const updateDocument = {
            $set: { 'requests.$': newNameOfUser },
        };
        return await this.databaseConnection.database.collection('albums').updateOne(query, updateDocument);
    }

    // adddrawing() deleteDrawings() updateDrawing{}
    async addNewDrawing(albumName: string, ownerName: string, joinerName: string) {
        return await this.databaseConnection.database
            .collection('albums')
            .updateOne({ members: albumName, owner: ownerName }, { $push: { drawings: joinerName } });
    }
    async deleteDrawingFromAlbum(albumName: string, ownerName: string, drawingToDelete: string) {
        return await this.databaseConnection.database
            .collection('albums')
            .updateOne({ members: albumName, owner: ownerName, drawings: drawingToDelete }, { $pull: { drawings: drawingToDelete } });
    }
    async updateDrawingNameInAlbum(albumName: string, ownerName: string, oldNameOfDrawingToUpdate: string, newNameOfDrawing: string) {
        const query = { name: albumName, owner: ownerName, drawings: oldNameOfDrawingToUpdate };
        const updateDocument = {
            $set: { 'drawings.$': newNameOfDrawing },
        };
        return await this.databaseConnection.database.collection('albums').updateOne(query, updateDocument);
    }
    async addDrawingToExposition(albumName: string, ownerName: string, drawingToAddToExposition: string) {
        return await this.databaseConnection.database
            .collection('albums')
            .updateOne({ members: albumName, owner: ownerName }, { $push: { exposition: drawingToAddToExposition } });
    }

    // owner
    async updateOwnerName(albumName: string, ownerName: string, newOwnerName: string) {
        const query = { name: albumName, owner: ownerName };
        const updateDocument = {
            $set: { owner: newOwnerName },
        };
        return await this.databaseConnection.database.collection('albums').updateOne(query, updateDocument);
    }

    async updateAlbumName(id: string, newAlbumName: string) {
        const updateDocument = {
            $set: { name: newAlbumName },
        };
        return await this.databaseConnection.database.collection('albums').updateOne({ _id: new ObjectId(id) }, updateDocument);
    }
}
