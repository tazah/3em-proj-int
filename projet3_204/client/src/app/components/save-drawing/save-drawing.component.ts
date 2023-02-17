import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { EXPORT_PREVIEW_HEIGHT, EXPORT_PREVIEW_WIDTH } from '@app/constants/file-options.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SaveDrawingService } from '@app/services/file-options/save-drawing.service';

@Component({
    selector: 'app-save-drawing',
    templateUrl: './save-drawing.component.html',
    styleUrls: ['./save-drawing.component.scss'],
})
export class SaveDrawingComponent implements AfterViewInit, AfterViewChecked {
    imgName: FormControl = new FormControl();
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    tags: string[] = [];
    private form: FormGroup = this.formBuilder.group({
        name: this.imgName,
    });

    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;

    constructor(
        public dialogRef: MatDialogRef<SaveDrawingComponent>,
        private drawingService: DrawingService,
        private saveDrawingService: SaveDrawingService,
        private formBuilder: FormBuilder,
    ) {
        this.previewCanvasHeight = EXPORT_PREVIEW_HEIGHT;
        this.previewCanvasWidth = EXPORT_PREVIEW_WIDTH;
        if (this.drawingService.canvas.width / this.drawingService.canvas.height > EXPORT_PREVIEW_WIDTH / EXPORT_PREVIEW_HEIGHT) {
            this.previewCanvasHeight = (this.drawingService.canvas.height * EXPORT_PREVIEW_WIDTH) / this.drawingService.canvas.width;
        } else {
            this.previewCanvasWidth = (this.drawingService.canvas.width * EXPORT_PREVIEW_HEIGHT) / this.drawingService.canvas.height;
        }
    }

    ngAfterViewInit(): void {
        this.saveDrawingService.dialogRef = this.dialogRef;
        this.saveDrawingService.originalCanvas = this.drawingService.canvas;
        this.saveDrawingService.previewCanvas = this.previewCanvas.nativeElement;
        this.saveDrawingService.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    ngAfterViewChecked(): void {
        this.saveDrawingService.previewCtx.drawImage(this.drawingService.canvas, 0, 0, this.previewCanvasWidth, this.previewCanvasHeight);
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if (this.isValidTag(value)) {
            this.tags.push(value.trim());
        }

        if (input) {
            input.value = '';
        }
    }

    remove(tag: string): void {
        const index = this.tags.indexOf(tag);

        if (index >= 0) {
            this.tags.splice(index, 1);
        }
    }

    onCancel(): void {
        this.saveDrawingService.onCancel();
    }

    onSave(savingInPng: boolean): void {
        this.saveDrawingService.onSave(this.name.value, this.tags, savingInPng);
        this.onCancel();
    }

    private isValidTag(tag: string): boolean {
        if (this.tags.includes(tag)) return false;
        if (!tag.match(/(^[0-9A-Za-z]{1,20}$)/)) return false;
        return true;
    }

    get name(): FormControl {
        return this.form.get('name') as FormControl;
    }

    get previewCanvasWidth(): number {
        return this.saveDrawingService.previewCanvasWidth;
    }

    set previewCanvasWidth(value: number) {
        this.saveDrawingService.previewCanvasWidth = value;
    }

    get previewCanvasHeight(): number {
        return this.saveDrawingService.previewCanvasHeight;
    }

    set previewCanvasHeight(value: number) {
        this.saveDrawingService.previewCanvasHeight = value;
    }

    get buttonDisabled(): boolean {
        return !this.name.value;
    }
}
