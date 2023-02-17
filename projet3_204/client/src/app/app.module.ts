import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '@app/app-material.module';
import { toolDict } from '@app/constants/tool.constants';
import { AvatarModule } from 'ngx-avatar';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AlbumCenterComponent } from './components/album-center/album-center.component';
import { AlbumListComponent } from './components/album-list/album-list.component';
import { AlbumComponent } from './components/album-page/album.component';
import { AppComponent } from './components/app/app.component';
import { CarrouselComponent } from './components/carrousel/carrousel.component';
import { ChatSearchComponent } from './components/chat-search/chat-search.component';
import { ChatboxComponent } from './components/chatbox/chatbox.component';
import { DrawingGridComponent } from './components/drawing-grid/drawing-grid.component';
import { DrawingInfoComponent } from './components/drawing-info/drawing-info.component';
import { DrawingTileComponent } from './components/drawing-tile/drawing-tile.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { ExportComponent } from './components/export/export.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';
import { LoginComponent } from './components/login/login.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { MemberListComponent } from './components/member-list/member-list.component';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { NewDrawingComponent } from './components/new-drawing/new-drawing.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { RequestListComponent } from './components/request-list/request-list.component';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import { SaveDrawingComponent } from './components/save-drawing/save-drawing.component';
import { SelectionBoxComponent } from './components/selection-box/selection-box.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AttributeBarColorComponent } from './components/tools/attribute-bar-color/attribute-bar-color.component';
import { ColorPaletteComponent } from './components/tools/attribute-bar-color/color-palette/color-palette.component';
import { ColorSliderComponent } from './components/tools/attribute-bar-color/color-slider/color-slider.component';
import { AttributeBarEllipseComponent } from './components/tools/attribute-bar-ellipse/attribute-bar-ellipse.component';
import { AttributeBarEraserComponent } from './components/tools/attribute-bar-eraser/attribute-bar-eraser.component';
import { AttributeBarLineComponent } from './components/tools/attribute-bar-line/attribute-bar-line.component';
import { AttributeBarPencilComponent } from './components/tools/attribute-bar-pencil/attribute-bar-pencil.component';
import { AttributeBarRectangleComponent } from './components/tools/attribute-bar-rectangle/attribute-bar-rectangle.component';
import { AttributeBarSelectionComponent } from './components/tools/attribute-bar-selection/attribute-bar-selection.component';
import { FILE_OPTIONS_DICT, MISCELLANIOUS_ICONS } from './constants/file-options.constants';
import { AlbumModalComponent } from './modals/album-modal/album-modal.component';

@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        SidebarComponent,
        DrawingComponent,
        MainPageComponent,
        AttributeBarPencilComponent,
        AttributeBarLineComponent,
        AttributeBarRectangleComponent,
        AttributeBarEllipseComponent,
        AttributeBarEraserComponent,
        NewDrawingComponent,
        AttributeBarColorComponent,
        ColorPaletteComponent,
        ColorSliderComponent,
        AttributeBarSelectionComponent,
        SelectionBoxComponent,
        ExportComponent,
        SaveDrawingComponent,
        CarrouselComponent,
        LoginComponent,
        RegistrationComponent,
        AlbumComponent,
        NavigationBarComponent,
        AlbumComponent,
        RightSidebarComponent,
        ChatboxComponent,
        ChatSearchComponent,
        DrawingGridComponent,
        DrawingInfoComponent,
        DrawingTileComponent,
        LeftSidebarComponent,
        MemberListComponent,
        RequestListComponent,
        AlbumCenterComponent,
        AlbumModalComponent,
        LandingPageComponent,
        AlbumListComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        AppMaterialModule,
        CommonModule,
        AvatarModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireStorageModule,
    ],
    providers: [
        {
            provide: MatDialogModule,
            useValue: {},
        },
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
    constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
        // Inspired from https://www.digitalocean.com/community/tutorials/angular-custom-svg-icons-angular-material

        for (const entry of toolDict) {
            this.matIconRegistry.addSvgIcon(
                entry.loadedSvg,
                this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/' + entry.loadedSvg + '.svg'),
            );
        }

        for (const entry of FILE_OPTIONS_DICT) {
            this.matIconRegistry.addSvgIcon(
                entry.loadedSvg,
                this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/' + entry.loadedSvg + '.svg'),
            );
        }

        for (const entry of MISCELLANIOUS_ICONS) {
            this.matIconRegistry.addSvgIcon(entry, this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/' + entry + '.svg'));
        }
    }
}
