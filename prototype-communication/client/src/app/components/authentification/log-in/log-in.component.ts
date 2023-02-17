import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
// import { Router } from '@angular/router';
import { UserAuthentificationService } from '@app/services/authentification/user-authentification.service';
@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.scss'],
})
export class LogInComponent implements OnInit {
    loginForm: FormGroup;
    constructor(public userAuthentificationService: UserAuthentificationService) {}

    ngOnInit() {
        this.initForm();
    }

    initForm(): void {
        this.loginForm = new FormGroup({
            username: new FormControl(''),
            password: new FormControl(''),
        });
    }

    submitOnLogginForm() {
        this.userAuthentificationService.signin(
            this.loginForm.get('username')?.value as unknown as string,
            this.loginForm.get('password')?.value as unknown as string,
        );
        
        console.log(this.loginForm.get('username')?.value as unknown as string);
    }

    
}
