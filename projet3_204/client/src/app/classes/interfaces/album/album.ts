// tslint:disable-next-line:no-relative-imports
import { LightDrawing } from './../../../../../../common/drawing/drawingDb';

// Document interface
export interface Album {
    _id?: string;
    public: boolean;
    name: string;
    avatar?: string;
    owner: string;
    requets?: string[];
    members?: string[];
    drawings?: LightDrawing[];
    exposition?: string[];
    dateCreation: Date;
}

// Todo: Test schemas creation
// Todo: Test schemas get request
// Todo: Test schemas delete request
// Todo: Test schemas update request
// Todo: create rout to the album page
// Todo: implement httprequest from client side
// Todo: make album name unique
