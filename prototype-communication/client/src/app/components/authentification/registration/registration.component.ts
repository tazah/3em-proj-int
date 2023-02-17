/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@app/Interfaces/user';
import { UserAuthentificationService } from '@app/services/authentification/user-authentification.service';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
    registerForm: FormGroup;
    providerForm: FormGroup;
    // private router : Router;
    isUserSelectProvider: boolean = false;
    constructor(public userAuthentificationService: UserAuthentificationService) {}

    ngOnInit() {
        this.initForm();
    }

    initForm(): void {
        this.registerForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email, this.noWhitespaceValidator]),
            username: new FormControl('', [
                Validators.minLength(6),
                Validators.required,
                this.noWhitespaceValidator,
                Validators.pattern('[a-zA-Z0-9]*'),
            ]),
            password: new FormControl('', [Validators.minLength(6), Validators.required, this.noWhitespaceValidator]),
            passwordConfirmation: new FormControl('', [Validators.minLength(6), Validators.required, this.noWhitespaceValidator]),
        });
        // this.providerForm = new FormGroup({
        //     usernameProvider: new FormControl(''),
        // });
    }

    getRegisterdUserFromSigupForm() {
        const tempUser: User = {
            userId: '',
            email: this.registerForm.get('email')?.value as unknown as string,
            userName: this.registerForm.get('username')?.value as unknown as string,
            password: this.registerForm.get('password')?.value as unknown as string,
            passwordConfirmation: this.registerForm.get('passwordConfirmation')?.value as unknown as string,
            isConnected: false,
        };
        return tempUser;
    }

    noWhitespaceValidator(control: FormControl) {
        const isSpace = (control.value || '').match(/\s/g);
        return isSpace ? { whitespace: true } : null;
    }

    async submitOnRegistrationForm(): Promise<void> {
        this.userAuthentificationService.signup(this.getRegisterdUserFromSigupForm());
    }

    

    // async onSubmitProviderForm() {
    //     const user: User = {
    //         userId: '',
    //         email: '',
    //         userName: '',
    //         password: '',
    //         passwordConfirmation: '',
    //         isConnected: false,
    //     };
    //     user.isConnected = false;
    //     user.userName = this.providerForm.get('usernameProvider')?.value as unknown as string;

    //     await this.userAuthentificationService.signupWithGoogle(user);
    //     console.log(this.providerForm.get('usernameProvider')?.valid as unknown as string);
    // }

    get email() {
        return this.registerForm.get('email');
    }
    get username() {
        return this.registerForm.get('username');
    }
    get password() {
        return this.registerForm.get('password');
    }
    get passwordConfirmation() {
        return this.registerForm.get('passwordConfirmation');
    }
}
