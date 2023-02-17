/* eslint-disable prefer-const */
/* eslint-disable no-restricted-imports */
/* eslint-disable no-console */
// tslint:disable: no-magic-numbers
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { comparevalidator, noWhitespaceValidator } from '@app/classes/directives/costum.validator';
import { auth } from 'firebase';
import { Observable, of, throwError } from 'rxjs';
import { catchError, first, switchMap } from 'rxjs/operators';
// tslint:disable-next-line: no-relative-imports
import { ProtectedUser, User } from './../../../../../common/user/user';
import { UserRequestService } from './../database/user-request/user-request.service';

@Injectable({
    providedIn: 'root',
})
export class UserAuthentificationService {
    userIsAlreadySubscribed: boolean = true;
    isLogedIn: boolean = false;
    user: User;
    userProtected: ProtectedUser = {};
    usernameUserConnection: User = {
        email: '',
        userName: '',
        password: '',
        passwordConfirmation: '',
        isConnected: false,
    };
    loginForm!: FormGroup;
    registerForm!: FormGroup;
    constructor(
        private router: Router,
        private http: HttpClient,
        public authentification: AngularFireAuth,
        public angularFirestore: AngularFirestore,
        public matsnackBar: MatSnackBar,
        private formBuilder: FormBuilder,
        public userRequest: UserRequestService,
    ) {
        this.loginForm = this.formBuilder.group({
            username: (['', Validators.required] as unknown) as AbstractControl,
            password: (['', Validators.required] as unknown) as AbstractControl,
        });
        this.registerForm = this.formBuilder.group({
            email: new FormControl('', [Validators.required, Validators.email, noWhitespaceValidator]),
            username: new FormControl('', [Validators.minLength(6), Validators.required, noWhitespaceValidator, Validators.pattern('[a-zA-Z0-9]*')]),
            password: new FormControl('', [Validators.minLength(6), Validators.required, noWhitespaceValidator]),
            passwordConfirmation: new FormControl('', [
                Validators.minLength(6),
                Validators.required,
                noWhitespaceValidator,
                comparevalidator('password'),
            ]),
        });
    }

    addNewclientToDb(): Observable<number> {
        const fullUrl = '';
        return this.http.post<number>(fullUrl, 'gfd').pipe(
            catchError((error: HttpErrorResponse) => {
                return of(error.status);
            }),
        );
    }
    signin(email: string, password: string): void {
        this.authentification
            .signInWithEmailAndPassword(email, password)
            .then((res) => {
                this.isLogedIn = true;
                localStorage.setItem('User', JSON.stringify(res.user));
                this.router.navigate(['/home']);

                this.getUserName(res);
                this.matsnackBar.open('Vous vous êtes connecté avec succèes !', 'Fermer', { duration: 3000 });
            })
            .catch((error) => {
                this.errorHandler(error.code);
            });
    }

    signup(user: User): void {
        this.userRequest.addNewUser(user).subscribe(
            (user) => {
                console.log('testst', user);
            },
            (error) => {
                console.log('error', error.code);
            },
        );
        this.isUserNameUnique(user).subscribe(
            (regestredUser: auth.UserCredential) => {
                this.isLogedIn = true;
                this.addUserToFireStoreInSignup(regestredUser, user);

                this.router.navigate(['/home']);
                this.getUserName(regestredUser);
            },
            (error) => {
                this.errorHandler(error.code);
            },
        );
    }

    isUserNameUnique(user: User): Observable<auth.UserCredential> {
        return this.angularFirestore
            .collection<User>('UsersCollection', (ref) => ref.where('userName', '==', user.userName))
            .get()
            .pipe(
                switchMap((data) => {
                    if (data.docs.length === 0) {
                        return this.authentification.createUserWithEmailAndPassword(user.email, user.password);
                    } else {
                        return throwError({
                            code: 'auth/utilisateurExistant',
                        });
                    }
                }),
            );
    }

    addUserToFireStoreInLogin(registredUser: auth.UserCredential): void {
        const user: User = {
            userId: '',
            email: '',
            userName: '',
            password: '',
            passwordConfirmation: '',
            isConnected: false,
        };
        const userRef: AngularFirestoreDocument<User> = this.angularFirestore.collection('UsersCollection').doc(registredUser.user?.uid);
        user.email = (registredUser.user?.email as unknown) as string;
        user.userId = (registredUser.user?.uid as unknown) as string;
        userRef.set(user, { merge: true });
    }

    addUserToFireStoreInSignup(registredUser: auth.UserCredential, user: User): void {
        const userRef: AngularFirestoreDocument<User> = this.angularFirestore.collection('UsersCollection').doc(registredUser.user?.uid);
        user.email = (registredUser.user?.email as unknown) as string;
        user.userId = registredUser.user?.uid;
        userRef.set(user, { merge: true });
    }

    // tslint:disable-next-line:typedef
    async getUserName(registredUser: auth.UserCredential) {
        const userRef: AngularFirestoreDocument<User> = this.angularFirestore.collection('UsersCollection').doc(registredUser.user?.uid);
        userRef.valueChanges().subscribe((res) => {
            this.userProtected.userName = res?.userName;
            this.userProtected.email = res?.email;
            this.userProtected.userId = res?.userId;
            this.userProtected.isConnected = res?.isConnected;
        });
    }
    ConnectWithUserName(uid: string, password: string): void {
        const userRef: AngularFirestoreDocument<User> = this.angularFirestore.collection('UsersCollection').doc(uid);
        userRef.valueChanges().subscribe((res: User | undefined) => {
            this.usernameUserConnection.userName = (res?.userName as unknown) as string;
            this.usernameUserConnection.password = (res?.password as unknown) as string;
            this.usernameUserConnection.passwordConfirmation = (res?.passwordConfirmation as unknown) as string;
            this.usernameUserConnection.email = (res?.email as unknown) as string;
            this.usernameUserConnection.userId = (res?.userId as unknown) as string;
            this.usernameUserConnection.isConnected = (res?.isConnected as unknown) as boolean;
            if (password === this.usernameUserConnection.password)
                this.signin((res?.email as unknown) as string, (res?.password as unknown) as string);
            else this.matsnackBar.open("l'email ou le nom d'utilisateur sont incorrects !!!", 'Fermer', { duration: 3000 });
        });
    }

    getEmailWhenSubscribeWithUsername(username: string, password: string): void {
        this.angularFirestore
            .collection<User>('UsersCollection', (ref) => ref.where('userName', '==', username))
            .get()
            .pipe(first())
            .subscribe((res) => {
                if (res.empty) {
                    this.matsnackBar.open('Les informations entrées sont incorrects !!!', 'Fermer', { duration: 3000 });
                } else
                    res.docChanges().forEach((e) => {
                        this.ConnectWithUserName(e.doc.id, password);
                    });
            });
    }

    errorHandler(messageCode: string): void {
        switch (messageCode) {
            case 'auth/invalid-email':
                this.matsnackBar.open("l'email ou le nom d'utilisateur sont incorrects !!!", 'Fermer', { duration: 3000 });
                break;
            case 'auth/wrong-password':
                this.matsnackBar.open("l'email, le nom d'utilisateur ou le mot de passe sont incorrects !!!", 'Fermer', { duration: 3000 });

                break;
            case 'auth/email-already-in-use':
                this.matsnackBar.open("l'email entré est déjà utilisé ! Choisissez un autre email !!", 'Fermer', { duration: 3000 });

                break;
            case 'auth/user-not-found':
                this.matsnackBar.open("l'email entree n'existe pas!!", 'Fermer', { duration: 3000 });

                break;

            case 'auth/utilisateurExistant':
                this.matsnackBar.open("Ce nom d'utilisateur à déjà été choisi par un autre utilisateur! choisissez un autre !", 'Fermer', {
                    duration: 4000,
                });
                break;

            default:
                break;
        }
    }
    async logout(): Promise<void> {
        this.authentification.signOut();
        this.router.navigate(['/login']);
        localStorage.removeItem('User');
    }
}
