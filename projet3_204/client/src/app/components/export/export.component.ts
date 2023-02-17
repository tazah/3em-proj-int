import { AfterViewChecked, AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { EXPORT_PREVIEW_HEIGHT, EXPORT_PREVIEW_WIDTH } from '@app/constants/file-options.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportService } from '@app/services/file-options/export.service';
import { UploadImgurService } from '@app/services/upload-imgur/upload-imgur.service';

@Component({
    selector: 'app-export',
    templateUrl: './export.component.html',
    styleUrls: ['./export.component.scss'],
})
export class ExportComponent implements AfterViewInit, AfterViewChecked {
    imgName: FormControl = new FormControl();
    filtre: string;
    type: string;
    filterName: FormControl = new FormControl();
    private form: FormGroup = this.formBuilder.group({
        name: this.imgName,
        filter: this.filterName,
    });

    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('exportElement', { static: false }) exportElement: ElementRef<HTMLAnchorElement>;
    constructor(
        public dialogRef: MatDialogRef<ExportComponent>,
        private drawingService: DrawingService,
        private exportService: ExportService,
        private formBuilder: FormBuilder,
        private uploadImageService: UploadImgurService,
    ) {
        this.previewCanvasHeight = EXPORT_PREVIEW_HEIGHT;
        this.previewCanvasWidth = EXPORT_PREVIEW_WIDTH;
        if (this.drawingService.canvas.width / this.drawingService.canvas.height > EXPORT_PREVIEW_WIDTH / EXPORT_PREVIEW_HEIGHT) {
            this.previewCanvasHeight = (this.drawingService.canvas.height * EXPORT_PREVIEW_WIDTH) / this.drawingService.canvas.width;
        } else {
            this.previewCanvasWidth = (this.drawingService.canvas.width * EXPORT_PREVIEW_HEIGHT) / this.drawingService.canvas.height;
        }
        this.type = 'png';
        this.filtre = 'Aucun filtre';
    }
    ngAfterViewInit(): void {
        this.exportService.dialogRef = this.dialogRef;
        this.exportService.originalCanvas = this.drawingService.canvas;
        this.exportService.previewCanvas = this.previewCanvas.nativeElement;
        this.exportService.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    ngAfterViewChecked(): void {
        this.exportService.previewCtx.drawImage(this.drawingService.canvas, 0, 0, this.previewCanvasWidth, this.previewCanvasHeight);
    }

    get name(): FormControl {
        return this.form.get('name') as FormControl;
    }

    private setfinalName(): string {
        if (this.name.value == null) {
            return 'default_name';
        }
        return this.name.value;
    }

    applyFilter(): void {
        this.exportService.applyFilter(this.filtre);
    }

    // Inspired from https://www.digitalocean.com/community/tutorials/js-canvas-toblob
    downloadImg(): void {
        this.exportService.configureDownloadImage();
        let extension: string;
        if (this.type === 'jpeg') {
            extension = '.jpg';
        } else {
            extension = '.png';
        }
        this.exportElement.nativeElement.href = this.exportService.downloadCanvas.toDataURL('image/' + this.type, 1.0);
        this.exportElement.nativeElement.download = this.setfinalName() + extension;
        this.exportElement.nativeElement.click();
    }

    uploadToImgur(): void {
        this.canvasToImage(this.type);
        this.onCancel();
    }

    private async canvasToImage(type: string): Promise<void> {
        this.exportService.configureDownloadImage();
        let extension: string;
        if (this.type === 'jpeg') {
            extension = '.jpg';
        } else {
            extension = '.png';
        }
        this.uploadImageService.imageName = this.setfinalName() + extension;
        this.exportService.downloadCanvas.toBlob((blob) => {
            this.uploadImageService.uploadImage(blob as Blob);
        }, 'image/' + type);
    }

    onCancel(): void {
        this.exportService.onCancel();
    }

    get previewCanvasWidth(): number {
        return this.exportService.previewCanvasWidth;
    }

    set previewCanvasWidth(value: number) {
        this.exportService.previewCanvasWidth = value;
    }

    get previewCanvasHeight(): number {
        return this.exportService.previewCanvasHeight;
    }

    set previewCanvasHeight(value: number) {
        this.exportService.previewCanvasHeight = value;
    }

    get buttonsDisabled(): boolean {
        return !this.name.value || !this.filtre;
    }
}
