import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BASE_URL } from '@app/constants/networking.constants';
import { Drawing } from '@common/classes/drawing';
import { Message } from '@common/classes/message';

@Injectable({
    providedIn: 'root',
})
// tslint:disable: deprecation <- Does not affect the linter
export class NetworkService {
    constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

    async sendDrawing(drawing: Drawing): Promise<void> {
        return new Promise<void>(async () => {
            this.http.post<Message>(BASE_URL + 'drawings', drawing).subscribe(
                (message) => {
                    this.showSnackbarMessage(message.title + ' ' + message.body);
                },
                (message: HttpErrorResponse) => {
                    this.showSnackbarMessage(message.error.title + ' ' + message.error.body);
                },
            );
        });
    }

    async getAllDrawings(): Promise<Drawing[]> {
        return this.http.get<Drawing[]>(BASE_URL + 'drawings').toPromise();
    }

    private showSnackbarMessage(message: string): void {
        this.snackBar.open(message, undefined, { duration: 3000 });
    }

    async deleteDrawing(drawing: Drawing): Promise<void> {
        return new Promise<void>(async () => {
            this.http.delete<Message>(BASE_URL + 'drawings/' + drawing._id).subscribe(
                () => {
                    this.showSnackbarMessage('Succès! Le dessin a été supprimé.');
                },
                (error: HttpErrorResponse) => {
                    this.showSnackbarMessage(error.message);
                },
            );
        });
    }
}
