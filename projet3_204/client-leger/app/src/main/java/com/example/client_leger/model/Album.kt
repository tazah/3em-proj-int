package com.example.client_leger.model

import com.google.gson.annotations.SerializedName
import java.text.SimpleDateFormat
import java.time.LocalDateTime
import java.util.*

class Album {

    var name:String?=null
    var dateOfCreation:String?=null
    var owner: String?=null
    var avatar: String?=null
//    var mouvements:Mouvements

    constructor(){}

    constructor(name: String?,dateOfCreation:String?, owner:String?, avatar:String?){

        this.name=name
        this.dateOfCreation=dateOfCreation
        this.owner =owner
        this.avatar = avatar
    }
    constructor(name: String?, owner:String?, avatar:String?){
        val sdf = SimpleDateFormat("dd/M/yyyy hh:mm:ss")
        val currentDate = sdf.format(Date())
        this.name=name
        this.dateOfCreation=currentDate
        this.owner =owner
        this.avatar = avatar
    }


}


class OtherAlbum {


//    val sdf = SimpleDateFormat("dd/M/yyyy hh:mm:ss")
//    val currentDate = sdf.format(Date())
    @SerializedName("_id"          ) var id           : String?             = null
    @SerializedName("public"       ) var public       : Boolean?            = null
    @SerializedName("name"         ) var name         : String?             = null
    @SerializedName("avatar"       ) var avatar       : String?             = null
    @SerializedName("owner"        ) var owner        : String?             = null
    @SerializedName("requets"      ) var requets      : ArrayList<String>?   = arrayListOf()
    @SerializedName("members"      ) var members      : ArrayList<String>?   = arrayListOf()
    @SerializedName("drawings"     ) var drawings     : ArrayList<LightDrawing>? = arrayListOf()
    @SerializedName("exposition"   ) var exposition   : ArrayList<String>?   = arrayListOf()
    @SerializedName("dateCreation" ) var dateCreation : String?       = null
    constructor(
        public: Boolean?,
        name: String?,
        avatar: String?,
        owner: String?,
        members: ArrayList<String>,
        dateCreation: String?
    ) {
        this.public = public
        this.name = name
        this.avatar = avatar
        this.owner = owner
        this.members = members
        this.dateCreation = dateCreation
    }

    constructor(
        id: String?,
        public: Boolean?,
        name: String?,
        avatar: String?,
        owner: String?,
        requets: ArrayList<String>?,
        members: ArrayList<String>?,
        drawings: ArrayList<LightDrawing>?,
        exposition: ArrayList<String>?,
        dateCreation: String?
    ) {
        this.id = id
        this.public = public
        this.name = name
        this.avatar = avatar
        this.owner = owner
        this.requets = requets
        this.members = members
        this.drawings = drawings
        this.exposition = exposition
        this.dateCreation = dateCreation
    }

    constructor()

    constructor(
        public: Boolean?,
        name: String?,
        avatar: String?,
        owner: String?,
        dateCreation: String?
    ) {
        this.public = public
        this.name = name
        this.avatar = avatar
        this.owner = owner
        this.dateCreation = dateCreation
    }
}
