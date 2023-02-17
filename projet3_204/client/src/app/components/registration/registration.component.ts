// tslint:disable: no-magic-numbers
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { User } from './../../../../../common/user/user';
import { UserAuthentificationService } from '@app/services/authentification/UserAuthentification.service';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
    registerForm: FormGroup = this.userAuthentificationService.registerForm;
    constructor(public userAuthentificationService: UserAuthentificationService) {}

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
        // this.registerForm = new FormGroup({
        //     email: new FormControl('', [Validators.required, Validators.email, this.noWhitespaceValidator]),
        //     username: new FormControl('', [
        //         Validators.minLength(6),
        //         Validators.required,
        //         this.noWhitespaceValidator,
        //         Validators.pattern('[a-zA-Z0-9]*'),
        //     ]),
        //     password: new FormControl('', [Validators.minLength(6), Validators.required, this.noWhitespaceValidator]),
        //     passwordConfirmation: new FormControl('', [
        //         Validators.minLength(6),
        //         Validators.required,
        //         this.noWhitespaceValidator,
        //         comparevalidator('password'),
        //     ]),
        // });
    }

    getRegisterdUserFromSigupForm(): User {
        const tempUser: User = {
            userId: '',
            email: (this.registerForm.get('email')?.value as unknown) as string,
            userName: (this.registerForm.get('username')?.value as unknown) as string,
            password: (this.registerForm.get('password')?.value as unknown) as string,
            passwordConfirmation: (this.registerForm.get('passwordConfirmation')?.value as unknown) as string,
            isConnected: false,
        };

        this.userAuthentificationService.user = tempUser;
        return tempUser;
    }

    noWhitespaceValidator(control: FormControl): { whitespace: boolean } | null {
        const isSpace = (control.value || '').match(/\s/g);
        return isSpace ? { whitespace: true } : null;
    }

    async submitOnRegistrationForm(): Promise<void> {
        this.userAuthentificationService.signup(this.getRegisterdUserFromSigupForm());
    }

    get email(): AbstractControl | null {
        return this.registerForm.get('email');
    }
    get username(): AbstractControl | null {
        return this.registerForm.get('username');
    }
    get password(): AbstractControl | null {
        return this.registerForm.get('password');
    }
    get passwordConfirmation(): AbstractControl | null {
        return this.registerForm.get('passwordConfirmation');
    }
}
