import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { Subscription } from 'rxjs';
//
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function comparevalidator(passwordConfirmation: string) {
    const funcCompareTo = (controlAbs: AbstractControl): ValidationErrors | null => {
        const getPasswordConfimationField = controlAbs.root.get(passwordConfirmation);
        if (controlAbs.value === null && controlAbs.value.length) return null;

        if (getPasswordConfimationField) {
            const subscription: Subscription = getPasswordConfimationField.valueChanges.subscribe(() => {
                controlAbs.updateValueAndValidity();
                subscription.unsubscribe();
            });
        }
        return getPasswordConfimationField && getPasswordConfimationField.value !== controlAbs.value ? { doesTheFielMatch: true } : null;
    };
    return funcCompareTo;
}

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function noWhitespaceValidator(control: FormControl) {
    const isSpace = (control.value || '').match(/\s/g);
    return isSpace ? { whitespace: true } : null;
}