export enum FileOptionShortcuts {
    CreateNewDrawing = 'O',
    SaveDrawing = 'S',
    ShowCarousel = 'G',
    ExportDrawing = 'E',
}

export enum SelectionOptionShortcuts {
    Copy = 'C',
    Paste = 'V',
    Cut = 'X',
}

export const FILE_OPTIONS_DICT: { key: FileOptionShortcuts; id: string; name: string; loadedSvg: string }[] = [
    { key: FileOptionShortcuts.CreateNewDrawing, id: 'new-drawing-bouton', name: 'Nouveau dessin', loadedSvg: 'mdi-file-document-outline' },
    { key: FileOptionShortcuts.SaveDrawing, id: 'save-drawing-bouton', name: 'Sauvegarder dessin', loadedSvg: 'mdi-content-save-outline' },
    { key: FileOptionShortcuts.ExportDrawing, id: 'export-drawing-bouton', name: 'Exporter dessin', loadedSvg: 'mdi-file-export-outline' },
];

export const MISCELLANIOUS_ICONS = [
    'mdi-home',
    'mdi-undo',
    'mdi-redo',
    'mdi-arrow-left-right',
    'mdi-image-multiple',
    'mdi-close-circle',
    'mdi-delete',
    'mdi-chevron-left',
    'mdi-chevron-right',
    'mdi-content-copy',
    'mdi-content-cut',
    'mdi-content-paste',
    'mdi-format-align-left',
    'mdi-format-align-center',
    'mdi-format-align-right',
    'mdi-format-bold',
    'mdi-format-italic',
    'mdi-palette',
    'mdi-grid',
    'heart',
    'dog',
    'dodo',
    'dragon',
];

export const EXPORT_PREVIEW_WIDTH = 1000;
export const EXPORT_PREVIEW_HEIGHT = 700;

export const EXPORT_DIALOG_CLASS = 'export-dialog';
export const SAVE_DIALOG_CLASS = 'save-dialog';
export const CARROUSEL_DIALOG_CLASS = 'carrousel-dialog';
export const CREATE_NEW_DRAWING_DIALOG_CLASS = 'new-drawing-dialog';
export const UPLOAD_IMGUR_DIALOG_CLASS = 'upload-drawing-dialog';

export const DRAWINGS_PER_CARROUSEL_PAGE = 3;
export const DRAWINGS_NUMBER = 4;

export const LOCAL_STORAGE_DRAWING_KEY = 'drawingActions';
export const LOCAL_STORAGE_INITIAL_DIMENSIONS = 'drawingActionsDimensions';
