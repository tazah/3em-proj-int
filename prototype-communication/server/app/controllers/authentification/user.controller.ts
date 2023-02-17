import { CREATED_HTTP_STATUS, NOT_ACCEPTABLE, NOT_ADDED_ERROR, USER1 } from '@app/classes/constantes/constantes';
import { AuthentificationService } from '@app/services/authentification/authentification.service';
import { Router } from 'express';
import { Service } from 'typedi';

@Service()
export class DatabaseController {
    router: Router;

    constructor(private authentificationService: AuthentificationService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/addNewUserToDB', (req, res) => {
            this.authentificationService
                .addNewUserToBd(USER1)
                .then(() => {
                    res.sendStatus(CREATED_HTTP_STATUS).send();
                })
                .catch((error: Error) => {
                    error.message = NOT_ADDED_ERROR;
                    res.status(NOT_ACCEPTABLE).send(error.message);
                });
        });
    }
}
