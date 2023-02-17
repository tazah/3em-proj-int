// tslint:disable: no-relative-imports
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Album } from '@app/classes/interfaces/album/album';
import { DrawingDb } from '@common/drawing/drawingDb';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ADD_NEW_DRAWING, URL_ADD_NEW_ALBUM, URL_GET_ALL_ALBUM } from './../../../constants/http-request-routs';

@Injectable({
    providedIn: 'root',
})
export class AlbumRequestService {
    albumList: Album[] = [];
    albumListAfterLoad: Promise<boolean>;
    ALBUM_ROUTE: string = 'http://localhost:3000/api/album/';
    constructor(private http: HttpClient) {
        this.albumList = [];
        this.initializeAllAlbums();
    }
    initializeAllAlbums() {
        this.getAllAlbum().subscribe(
            (albums: Album[]) => {
                this.albumList = albums;

                console.log('here is all albums', albums);
            },
            (err: Error) => {
                console.log(err);
            },
        );
    }

    addNewAlbum(album: Album): Observable<number | Album> {
        return this.http.post<number | Album>(URL_ADD_NEW_ALBUM, album).pipe(
            catchError((error: HttpErrorResponse) => {
                return of(error.status);
            }),
        );
    }
    getAllAlbum(): Observable<number | Album[]> {
        return this.http.get<Album[]>(URL_GET_ALL_ALBUM);
    }
    addAlbum(username: string) {
        // this.socket.emit('create album', username);
    }

    joinRequest(username: string, albumId: string): Observable<number> {
        const url: string = this.ALBUM_ROUTE + 'updateRequestAlbum' + '/' + albumId + '/' + username;
        console.log('LE URL ESTTT', url);
        return this.http.put<number>(url, '').pipe(
            catchError((error: HttpErrorResponse) => {
                return of(error.status);
            }),
        );
    }

    addNewDrawing(drawing: DrawingDb, albumName: string): Observable<number> {
        const url: string = this.ALBUM_ROUTE + ADD_NEW_DRAWING + '/' + albumName;
        return this.http.post<number>(url, drawing).pipe(
            catchError((error: HttpErrorResponse) => {
                return of(error.status);
            }),
        );
    }
    deleteDrawing(drawingId: string, albumName: string): Observable<number> {
        const url: string = this.ALBUM_ROUTE + 'deleteDrawing' + '/' + drawingId + '/' + albumName;
        return this.http.delete<number>(url).pipe(
            catchError((error: HttpErrorResponse) => {
                return of(error.status);
            }),
        );
    }
}
