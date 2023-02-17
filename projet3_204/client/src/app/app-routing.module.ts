import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumComponent } from './components/album-page/album.component';
import { EditorComponent } from './components/editor/editor.component';
import { ExportComponent } from './components/export/export.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
// import { MainPageComponent } from './components/main-page/main-page.component';

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    // { path: 'home', component: MainPageComponent },
    { path: 'editor', component: EditorComponent },
    { path: 'registration', component: RegistrationComponent },
    { path: 'album', component: AlbumComponent },
    { path: 'home', component: LandingPageComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: '/login' },
    { path: 'ExportComponent', component: ExportComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
