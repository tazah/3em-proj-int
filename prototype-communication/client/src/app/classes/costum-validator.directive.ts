import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validators } from '@angular/forms';
@Directive({
    selector: '[appMatchCustumValidator]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: MatchCustumValidatorDirective,
            multi: true,
        },
    ],
})
export class MatchCustumValidatorDirective implements Validators {
    @Input() appMatchCustumValidator: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    matchValidation(passwordConfirmationFormControl: AbstractControl): { [key: string]: any } | null {
        const passwordFormcontrol = passwordConfirmationFormControl.parent?.get(this.appMatchCustumValidator);
        if (passwordFormcontrol && passwordConfirmationFormControl.value !== passwordFormcontrol?.value) return { passwordNotMatch: true };
        return null;
    }
}
