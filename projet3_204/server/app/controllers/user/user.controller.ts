import { Router } from 'express';
import { Service } from 'typedi';
import { DatabaseConnectionService } from './../../services/database-connection/connection.service';

@Service()
export class UserController {
    router: Router;

    constructor(private connectionDataBase: DatabaseConnectionService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/addNewUser', async (req, res) => {
            this.connectionDataBase
                .addNewUser(req.body)
                .then((resReturnd) => {
                    res.json(resReturnd);
                    res.status(201);
                })
                .catch((error: Error) => {
                    res.status(404).send(error.message);
                });
        });

        /*this.router.get('/getAllAlbum', async (req, res) => {
            this.albumService
                .getAllAlbums()
                .then((albums: Album[]) => {
                    res.json(albums);
                })
                .catch((error: Error) => {
                    res.status(404).send(error.message);
                });
        });

        this.router.post('/addNewDrawing/:albumName', async (req, res) => {
            console.log('🚀 ~ file: album.controller.ts ~ line 46 ~ AlbumController ~ this.router.post ~ req', req.body);

            this.connectionDataBase
                .addNewDrawing(req.body, req.params.albumName)
                .then(() => {
                    res.status(201).send('Le dessin a été ajouter avec succès !');
                })
                .catch((error: Error) => {
                    res.status(404).send(error.message);
                });
        });

        this.router.post('/deleteDrawing/:drawingId/:albumName', async (req, res) => {
            console.log('🚀 ~ file: album.controller.ts ~ line 46 ~ AlbumController ~ this.router.post ~ req', req.body);

            this.connectionDataBase
                .addNewDrawing(req.body, req.params.albumName)
                .then(() => {
                    res.status(201).send('Le dessin a été ajouter avec succès !');
                })
                .catch((error: Error) => {
                    res.status(404).send(error.message);
                });
        });
    }*/
}
}
