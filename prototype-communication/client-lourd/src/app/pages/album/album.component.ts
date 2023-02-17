import { Component } from '@angular/core';
import { UserAuthentificationService } from '@app/services/authentification/UserAuthentification.service';

@Component({
    selector: 'app-album',
    templateUrl: './album.component.html',
    styleUrls: ['./album.component.scss'],
})
export class AlbumComponent {
    constructor(public userAuthentificationService: UserAuthentificationService) {}
}
