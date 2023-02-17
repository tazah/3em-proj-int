import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ToolActionData } from '@app/classes/actions/tool-action-data';
import { Tool } from '@app/classes/tool';
import { ToolKey } from '@app/constants/tool.constants';
import { EllipseService } from '@app/services/tools/ellipse.service';
import { EraserService } from '@app/services/tools/eraser.service';
import { LineService } from '@app/services/tools/line.service';
import { MouseService } from '@app/services/tools/mouse.service';
import { PencilService } from '@app/services/tools/pencil.service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { SelectionService } from '@app/services/tools/selection.service';

@Injectable({
    providedIn: 'root',
})
export class ToolSwitcherService {
    services: Map<ToolKey, Tool> = new Map<ToolKey, Tool>([
        [ToolKey.Mouse, this.mouseService],
        [ToolKey.Eraser, this.eraserService],
        [ToolKey.Pencil, this.pencilService],
        [ToolKey.Line, this.lineService],
        [ToolKey.Rectangle, this.rectangleService],
        [ToolKey.Ellipse, this.ellipseService],
        [ToolKey.Selection, this.selectionService],
    ]);
    currentTool: ToolKey = ToolKey.Mouse;
    currentService: Tool = this.mouseService;
    attributeBar: MatSidenav;

    constructor(
        private mouseService: MouseService,
        private eraserService: EraserService,
        private pencilService: PencilService,
        private lineService: LineService,
        private rectangleService: RectangleService,
        private ellipseService: EllipseService,
        private selectionService: SelectionService,
    ) {}

    switchTool(newTool: ToolKey, toolActionData?: ToolActionData): void {
        if (newTool === this.currentTool && !toolActionData) return;

        if (newTool === ToolKey.Mouse) {
            this.attributeBar.close();
        } else {
            this.attributeBar.open();
        }

        this.currentTool = newTool;
        const tempService = this.services.get(newTool);
        if (tempService) {
            this.currentService.onSwitchOff();
            this.currentService = tempService;
            this.currentService.onSwitch(toolActionData);
        }
    }
}
