import { LightDrawing } from '../drawing/drawing';

// Document interface
export interface Album {
    public: boolean;
    name: string;
    avatar?: string;
    owner: string;
    requets?: string[];
    members?: string[];
    drawings?: LightDrawing[];
    exposition?: string[];
    dateCreation?: String;
}
