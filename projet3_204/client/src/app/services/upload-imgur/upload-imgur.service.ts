import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
interface ImgurResponse {
    data: { id: string; link: string };
}

@Injectable({
    providedIn: 'root',
})
// tslint:disable: deprecation <- Disabled as it does not affect the linter
export class UploadImgurService {
    private url: string = 'https://api.imgur.com/3/image';
    private clientId: string = 'cb56af841865312';
    imageName: string;
    private imageData: ImgurResponse;

    constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

    async uploadImage(imageFile: Blob): Promise<void> {
        const header = new HttpHeaders({
            Authorization: 'Client-ID ' + this.clientId,
        });
        const formData = new FormData();

        formData.append('image', imageFile, this.imageName);

        return new Promise<void>(async () => {
            this.http
                .post<ImgurResponse>(this.url, formData, { headers: header })
                .subscribe(
                    (message) => {
                        this.showSnackbarMessage('Lien sur Imgur : imgur.com/' + message.data.id, message);
                    },
                    (message: HttpErrorResponse) => {
                        this.showSnackbarMessage('Échec du téléversement: ' + message.error.title + ' ' + message.error.body, this.imageData);
                    },
                );
        });
    }

    private showSnackbarMessage(message: string, response: ImgurResponse): void {
        this.snackBar
            .open(message, 'Voir image', { duration: 10000 })
            .onAction()
            .subscribe(() => {
                window.open(response.data.link, '_blank');
            });
    }
}
