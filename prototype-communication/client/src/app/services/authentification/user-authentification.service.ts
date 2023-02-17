/* eslint-disable prefer-const */
/* eslint-disable no-restricted-imports */
/* eslint-disable no-console */
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { auth } from 'firebase';
import { Observable, of } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { User } from '../../Interfaces/user';

@Injectable({
    providedIn: 'root',
})
export class UserAuthentificationService {
    userIsAlreadySubscribed: boolean = true;
    isLogedIn: boolean = false;
    constructor(
        private router: Router,
        private http: HttpClient,
        private authentification: AngularFireAuth,
        private angularFirestore: AngularFirestore,
    ) {}

    addNewclientToDb(): Observable<number> {
        const fullUrl = '';
        return this.http.post<number>(fullUrl, 'gfd').pipe(
            catchError((error: HttpErrorResponse) => {
                return of(error.status);
            }),
        );
    }
    async signin(email: string, password: string): Promise<void> {
        await this.authentification
            .signInWithEmailAndPassword(email, password)
            .then((res) => {
                this.isLogedIn = true;
                localStorage.setItem('User', JSON.stringify(res.user));
                this.router.navigate(['/album']);
            })
            .catch((error) => {
                console.log(error.code);
            });
            
    }
    async signup(user: User) {
        await this.isUserNameUnique(user).then((res) => {
            console.log('res of this user', res);
            res.pipe(first()).subscribe((data) => {
                console.log(data.docs.length);

                if (data.docs.length === 0) {
                    this.authentification
                        .createUserWithEmailAndPassword(user.email, user.password)
                        .then((regestredUser: auth.UserCredential) => {
                            this.isLogedIn = true;
                            this.addUserToFireStoreInSignup(regestredUser, user);
                            this.router.navigate(['/album']);
                            console.log('enregistrement devrais etre effectuee avec succes');
                        })
                        .catch((error) => {
                            console.log('erreur ;:::', error.code);
                        });
                    return;
                } else console.log('ce nom dutilisateur est deja assigne a un utilisateur');
            });

            // throw new Error("Ce nom d'utilisateur est déjà utilisé !!!");
        });
        // console.log('bool retrunr : ', isUserNameValid);
    }
    async isUserNameUnique(user: User) {
        return this.angularFirestore.collection<User>('UsersCollection', (ref) => ref.where('userName', '==', user.userName)).get();
    }
    // async isEmailUnique(email: string | null | undefined){
    //     console.log('email of provider :', email);

    //     let numberOfUsers = 0;
    //     this.angularFirestore
    //         .collection('UsersCollection', (ref) => ref.where('email', '==', email))
    //         .valueChanges()
    //         .pipe(first())
    //         .subscribe((res) => {
    //             numberOfUsers = res.length;
    //         });
    //     console.log('nombre dutilisateur avec cet email : isEmailAlready used', numberOfUsers);

    //     if (numberOfUsers === 0) return true;
    //     return false;
    // }
    addUserToFireStoreInLogin(registredUser: auth.UserCredential) {
        let user: User = {
            userId: '',
            email: '',
            userName: '',
            password: '',
            passwordConfirmation: '',
            isConnected: false,
        };
        const userRef: AngularFirestoreDocument<User> = this.angularFirestore.collection('UsersCollection').doc(registredUser.user?.uid);
        user.email = registredUser.user?.email as unknown as string;
        user.userId = registredUser.user?.uid as unknown as string;
        userRef.set(user, { merge: true });
    }

    addUserToFireStoreInSignup(registredUser: auth.UserCredential, user: User) {
        const userRef: AngularFirestoreDocument<User> = this.angularFirestore.collection('UsersCollection').doc(registredUser.user?.uid);
        user.email = registredUser.user?.email as unknown as string;
        user.userId = registredUser.user?.uid;
        userRef.set(user, { merge: true });
    }

    // async loginWithGoogle() {
    //         this.createAcountWithGoogle(user);
    //         userCredential
    //             .then(() => {
    //                 console.log('succesfully connected : ');
    //             })
    //             .catch((error) => {
    //                 console.log('error occurs while trying to connect to your account', error.code);
    //             });
    //     }
    // }
    async createAcountWithGoogle() {
        const googleProvider = new auth.GoogleAuthProvider();
        await this.authentification
            .signInWithPopup(googleProvider)
            .then((credential: auth.UserCredential) => {
                this.router.navigate(['/album']);
                this.addUserToFireStoreInLogin(credential);
                console.log('signup with succes', credential.user?.email);
            })
            .catch((error) => {
                console.log('erreur du sign up avec google ', error);
                // return error;
            });
    }

    async createAcountWithFacebook() {
        const googleProvider = new auth.FacebookAuthProvider();
        await this.authentification
            .signInWithPopup(googleProvider)
            .then((credential: auth.UserCredential) => {
                this.addUserToFireStoreInLogin(credential);
                this.router.navigate(['/album']);
                console.log('signup with succes', credential.user?.email);
                return;
            })
            .catch((error) => {
                console.log('erreur du sign up avec google ', error.code);
                return error;
            });
    }
    async createAcountWithGithub() {
        const googleProvider = new auth.GithubAuthProvider();
        await this.authentification
            .signInWithPopup(googleProvider)
            .then((credential: auth.UserCredential) => {
                this.addUserToFireStoreInLogin(credential);
                this.router.navigate(['/album']);
                console.log('signup with succes', credential.user?.email);
                return;
            })
            .catch((error) => {
                console.log('erreur du sign up avec google ', error);
                return error;
            });
    }

    async logout(): Promise<void> {
        this.authentification.signOut();
        console.log('user logout');
        this.router.navigate(['/home']);
        localStorage.removeItem('User');
    }
}
// TODO : verifier que le email du client n'est pas dans firestore

// TODO : si le client se trouve dans firestore le supprimer de l'authentification avec son UID et lui dire qu<un compte exite deja sous cette email
// TODO : il faut le logout/ le desinscrire/ throw une erreur
// TODO : le rammener vers la page de l'inscription

// TODO :  si le client n<existe pas dans la firestore alors
// TODO : connecter le client
// TODO : insrire le user dans firestore bd
// TODO : amener le client a la page des album

//     const userRef: AngularFirestoreDocument<User> = this.angularFirestore.collection('UsersCollection').doc(user?.uid);
//     const dataToUpdate: User = {
//         userId?: user?.uid;
//         email: user?.email;
//         userName: ;
//         password: ;
//         passwordConfirmation: string;
//         isConnected: boolean;
//     };
// }
