import { Component } from '@angular/core';
import { SelectionType } from '@app/constants/tool.constants';
import { SelectionService } from '@app/services/tools/selection.service';

@Component({
    selector: 'app-attribute-bar-selection',
    templateUrl: './attribute-bar-selection.component.html',
    styleUrls: ['./attribute-bar-selection.component.scss'],
})
export class AttributeBarSelectionComponent {
    SelectionType: typeof SelectionType = SelectionType;

    constructor(private selectionService: SelectionService) {}

    selectAllCanvas(): void {
        this.selectionService.selectAllCanvas();
    }

    set type(type: SelectionType) {
        this.selectionService.selectionType = type;
    }

    get type(): SelectionType {
        return this.selectionService.selectionType;
    }
}
