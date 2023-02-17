package com.example.client_leger.model

import com.example.client_leger.Movement
import com.google.gson.annotations.SerializedName

class Drawing {
    constructor()
    constructor(
        drawingName: String?,
        owner: String?,
        dateOfCreation: String?,
        socketIndex: Int?,
        allMouvements: ArrayList<Movement>
    ) {
        this.drawingName = drawingName
        this.owner = owner
        this.dateOfCreation = dateOfCreation
        this.socketIndex = socketIndex
        this.allMouvements = allMouvements
    }

    constructor(drawingName: String?, owner: String?, dateOfCreation: String?, socketIndex: Int?) {
        this.drawingName = drawingName
        this.owner = owner
        this.dateOfCreation = dateOfCreation
        this.socketIndex = socketIndex
    }

    @SerializedName("_id"            ) var Id             : String?                      = null
    @SerializedName("drawingName"    ) var drawingName    : String?                  = null
    @SerializedName("owner"          ) var owner          : String?                  = null
    @SerializedName("dateOfCreation" ) var dateOfCreation : String?                  = null
    @SerializedName("socketIndex"    ) var socketIndex    : Int?                     =-2
    @SerializedName("allMouvements"  ) var allMouvements  : ArrayList<Movement> = arrayListOf()

}
