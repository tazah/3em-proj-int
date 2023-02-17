import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AppComponent } from '@app/pages/app/app.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { GravatarModule } from 'ngx-gravatar';
import { environment } from 'src/environments/environment';
import { LogInComponent } from './components/authentification/log-in/log-in.component';
import { RegistrationComponent } from './components/authentification/registration/registration.component';
import { ChatboxComponent } from './components/chatbox/chatbox.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import { AlbumComponent } from './pages/album/album.component';
import { ChatCommunicatioService } from './services/chat-communication-service/chat-communicatio-service.service';

// import { AvatarModule } from 'ngx-avatar';

// import { AvatarModule } from 'ngx-avatar';
@NgModule({
    declarations: [
        AppComponent,
        GamePageComponent,
        MainPageComponent,
        MaterialPageComponent,
        PlayAreaComponent,
        SidebarComponent,
        LogInComponent,
        RegistrationComponent,
        NavigationBarComponent,
        AlbumComponent,
        RightSidebarComponent,
        ChatboxComponent,
    ],
    imports: [
        AppMaterialModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        FormsModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireStorageModule,
        GravatarModule,
        ReactiveFormsModule,
        // SignUpComponent,
        // AvatarModule,
    ],
    providers: [ChatCommunicatioService],
    bootstrap: [AppComponent],
})
export class AppModule {}
