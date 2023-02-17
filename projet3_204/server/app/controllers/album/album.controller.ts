import { Router } from 'express';
import { Service } from 'typedi';
import { Album } from '../../classes/interfaces/album/album';
import { AlbumService } from '../../services/album/album.service';
import { DatabaseConnectionService } from './../../services/database-connection/connection.service';

@Service()
export class AlbumController {
    router: Router;

    constructor(private albumService: AlbumService, private connectionDataBase: DatabaseConnectionService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/addNewAlbum', async (req, res) => {
            this.albumService
                .addNewAlbum(req.body)
                .then((resReturnd: boolean) => {
                    res.json(resReturnd);
                    console.log(resReturnd);

                    res.status(201).send;
                })
                .catch((error: Error) => {
                    res.status(404).send(error.message);
                });
        });

        this.router.get('/getAllAlbum', async (req, res) => {
            this.albumService
                .getAllAlbums()
                .then((albums: Album[]) => {
                    res.json(albums);
                    res.status(200).send;
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

        this.router.put('/updateRequestAlbum/:albumId/:username', async (req, res) => {
            console.log('TETSSTSTSTST');
            this.albumService
                .addNewRequestToArrayRequest(req.params.albumId, req.params.username)
                .then(() => {
                    res.status(201).send('la requete a ete ajoute avec succes');
                })
                .catch((error: Error) => {
                    res.status(404).send(error.message);
                });
        });
        this.router.delete('/deleteAnAlbum/:id', async (req, res) => {
            console.log("le id de l'album :", req.params.id);

            this.albumService
                .deleteAlbumById(req.params.id)
                .then((resX) => {
                    console.log('response from server', resX);

                    res.status(200).send();
                })
                .catch((error: Error) => {
                    res.status(404).send(error.message);
                });
        });

        this.router.put('/updateAnalbum/:id', async (req, res) => {
            console.log("le id de l'album :", req.params.id);
            console.log("le nom de l'album :", req.body.name);

            this.albumService
                .updateAlbumName(req.params.id, req.body.name)
                .then((resX) => {
                    console.log('response from server', resX);

                    res.status(200).send();
                })
                .catch((error: Error) => {
                    res.status(404).send(error.message);
                });
        });

        this.router.get('/getCurrentAlbum/:id', async (req, res) => {
            this.albumService
                .getAlbumById(req.params.id)
                .then((albums: Album[]) => {
                    res.json(albums[0]);
                    res.status(200).send;
                })
                .catch((error: Error) => {
                    res.status(404).send(error.message);
                });
        });
    }
}
