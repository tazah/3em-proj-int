import {
    AfterContentChecked,
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostListener,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { DEFAULT_TOOLTIP_DELAY, DEFAULT_TOOLTIP_POSITION } from '@app/constants/style.constants';
import { ToolKey } from '@app/constants/tool.constants';
import { KeypressHandlerService } from '@app/services/keypress-handler/keypress-handler.service';
import { ToolSwitcherService } from '@app/services/tool-switcher/tool-switcher.service';
@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements AfterViewInit, AfterContentChecked, AfterViewChecked, OnInit {
    @ViewChild('attributeBar', { static: false }) attributeBar: MatSidenav;
    @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;
    @ViewChild('drawingContainer', { static: false }) drawingContainer: MatSidenavContent;

    DEFAULT_TOOLTIP_POSITION: typeof DEFAULT_TOOLTIP_POSITION = DEFAULT_TOOLTIP_POSITION;
    DEFAULT_TOOLTIP_DELAY: typeof DEFAULT_TOOLTIP_DELAY = DEFAULT_TOOLTIP_DELAY;
    ToolKey: typeof ToolKey = ToolKey;

    constructor(
        private keypressHandlerService: KeypressHandlerService,
        private toolSwitcherService: ToolSwitcherService,
        private cdref: ChangeDetectorRef,
    ) {}

    ngAfterViewInit(): void {
        this.toolSwitcherService.attributeBar = this.attributeBar;
        this.sidenav.disableClose = true;
        this.attributeBar.disableClose = true;
    }

    ngAfterContentChecked(): void {
        this.cdref.detectChanges();
    }

    ngAfterViewChecked(): void {
        this.cdref.detectChanges();
    }
    ngOnInit(): void {}

    // Inspired from https://stackoverflow.com/a/37363257
    @HostListener('window:keypress', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
        this.keypressHandlerService.onKeyPress(event);
    }

    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        this.keypressHandlerService.onKeyDown(event);
    }

    @HostListener('window:keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        this.keypressHandlerService.onKeyUp(event);
    }

    get currentTool(): ToolKey {
        return this.toolSwitcherService.currentTool;
    }

    get drawingContainerHeight(): number {
        if (this.drawingContainer) return this.drawingContainer.getElementRef().nativeElement.clientHeight;
        return 1;
    }

    get drawingContainerWidth(): number {
        if (this.drawingContainer) return this.drawingContainer.getElementRef().nativeElement.clientWidth;
        return 1;
    }
}
