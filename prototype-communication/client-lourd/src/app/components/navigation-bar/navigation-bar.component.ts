import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { UserAuthentificationService } from '@app/services/authentification/user-authentification.service';

@Component({
    selector: 'app-navigation-bar',
    templateUrl: './navigation-bar.component.html',
    styleUrls: ['./navigation-bar.component.scss'],
})
export class NavigationBarComponent implements OnInit {
    isNavBarHidden: boolean = false;
    languageSelected: string = 'Fr';
    constructor(private breakPointObserver: BreakpointObserver, public userAuthentificationService: UserAuthentificationService) {}

    ngOnInit(): void {
        this.observerSmallScreen();
    }

    print(): void {
        console.log('nav bar bool : ' + this.isNavBarHidden);
    }
    // onChange(event: { source: { selected: MatOption } }) {
    //     const optionText = (event.source.selected as MatOption).viewValue; // use .value if you want to get the key of Option
    //     this.languageSelected = optionText;
    //     // console.log('option selected :' + optionText);
    // }
    private observerSmallScreen(): void {
        this.breakPointObserver.observe('(min-width: 600px)').subscribe((result) => {
            console.log(result);
            if (result.matches) {
                this.isNavBarHidden = false;
            }
        });
    }
}
