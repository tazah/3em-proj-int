package com.example.client_leger.model

import com.google.gson.annotations.SerializedName


class LightDrawing {

    var drawingId      : String?      = null;
    var drawingName    : String?      = null;
    var owner          : String?      = null;
    var dateOfCreation : String?      = null;
    var socketIndex    : Int? = 0;
    constructor(
        drawingId: String?,
        drawingName: String?,
        owner: String?,
        dateOfCreation: String?,
        socketIndex: Int?
    ) {
        this.drawingId = drawingId
        this.drawingName = drawingName
        this.owner = owner
        this.dateOfCreation = dateOfCreation
        this.socketIndex = socketIndex
    }

    constructor()


}
