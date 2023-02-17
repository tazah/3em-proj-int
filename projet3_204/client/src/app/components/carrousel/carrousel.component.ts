import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AfterViewInit, Component, HostListener } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { DRAWINGS_NUMBER, DRAWINGS_PER_CARROUSEL_PAGE } from '@app/constants/file-options.constants';
import { KeyboardButton } from '@app/constants/keyboard.constants';
import { CarrouselService } from '@app/services/carrousel/carrousel.service';
import { Drawing } from '@common/classes/drawing';

@Component({
    selector: 'app-carrousel',
    templateUrl: './carrousel.component.html',
    styleUrls: ['./carrousel.component.scss'],
})
export class CarrouselComponent implements AfterViewInit {
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    tags: string[] = [];
    private currentPage: number = 0;
    onlyThreeDrawings: Drawing[] = this.currentThreeDrawings();

    constructor(public dialogRef: MatDialogRef<CarrouselComponent>, private carrouselService: CarrouselService) {
        this.carrouselService.loadImagesFromServer();
    }

    ngAfterViewInit(): void {
        this.carrouselService.dialogRef = this.dialogRef;
    }

    onTagClick(tag: string): void {
        if (!tag) return;
        if (this.tags.includes(tag)) return;
        this.tags.push(tag);
        this.onlyThreeDrawings = this.currentThreeDrawings();
    }

    continueDrawing(imgUrl: string): void {
        this.carrouselService.continueDrawing(imgUrl);
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
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
        this.carrouselService.onCancel();
    }

    onSave(): void {
        this.onCancel();
    }

    getDrawings(): Drawing[] {
        if (this.tags.length === 0) return this.carrouselService.drawings;
        this.carrouselService.filterDrawings(this.tags);
        return this.carrouselService.filteredDrawings;
    }

    currentThreeDrawings(): Drawing[] {
        const drawings: Drawing[] = [];
        const allDrawings = this.getDrawings();
        for (
            let i = this.currentPage * DRAWINGS_PER_CARROUSEL_PAGE;
            i < this.currentPage * DRAWINGS_PER_CARROUSEL_PAGE + DRAWINGS_PER_CARROUSEL_PAGE;
            i++
        ) {
            if (i < allDrawings.length) drawings.push(allDrawings[i]);
            else break;
        }
        return drawings;
    }

    previousPage(): void {
        if (this.drawingsNumber < DRAWINGS_NUMBER) {
            return;
        }

        this.currentPage--;

        if (this.currentPage < 0) this.currentPage = this.lastPage;
        this.onlyThreeDrawings = this.currentThreeDrawings();
    }

    nextPage(): void {
        if (this.drawingsNumber < DRAWINGS_NUMBER) {
            return;
        }

        this.currentPage++;

        if (this.currentPage > this.lastPage) this.currentPage = 0;
        this.onlyThreeDrawings = this.currentThreeDrawings();
    }
    @HostListener('window:keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case KeyboardButton.ArrowLeft as string:
                this.previousPage();
                break;

            case KeyboardButton.ArrowRight as string:
                this.nextPage();
                break;
        }
    }

    get drawingsNumber(): number {
        this.onlyThreeDrawings = this.currentThreeDrawings();
        return this.getDrawings().length;
    }

    get lastPage(): number {
        return Math.trunc(this.getDrawings().length / DRAWINGS_PER_CARROUSEL_PAGE);
    }

    get pageLabelString(): string {
        const firstDisplayedIndex = this.currentPage * DRAWINGS_PER_CARROUSEL_PAGE + 1;
        let secondDisplayedIndex = this.currentPage * DRAWINGS_PER_CARROUSEL_PAGE + DRAWINGS_PER_CARROUSEL_PAGE;
        if (secondDisplayedIndex > this.drawingsNumber) secondDisplayedIndex = this.drawingsNumber;
        return firstDisplayedIndex + ' – ' + secondDisplayedIndex + ' de ' + this.drawingsNumber;
    }

    get isEmpty(): boolean {
        return this.getDrawings().length === 0;
    }

    deleteDrawing(drawing: Drawing): void {
        this.carrouselService.deleteDrawing(drawing);
    }
}
