import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-drawing-tile',
    templateUrl: './drawing-tile.component.html',
    styleUrls: ['./drawing-tile.component.scss'],
})
export class DrawingTileComponent implements OnInit {
    name: string;
    // drawing
    constructor() {
        this.name = '';
    }
    ngOnInit(): void {}
}
