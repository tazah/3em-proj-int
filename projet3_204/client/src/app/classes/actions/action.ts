// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Action {
    private linkedAction: Action;

    executeAll(): void {
        this.executeResizeAction();
        this.execute();
    }

    execute(): void {
        if (this.linkedAction) this.linkedAction.execute();
    }

    executeResizeAction(): void {
        if (this.linkedAction) this.linkedAction.execute();
    }

    pushLinkedAction(action: Action): void {
        if (this.linkedAction) this.linkedAction.pushLinkedAction(action);
        else {
            this.linkedAction = action;
            this.linkedAction.executeAll();
        }
    }
}
