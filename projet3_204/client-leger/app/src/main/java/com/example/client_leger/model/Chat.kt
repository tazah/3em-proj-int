package com.example.client_leger.model



import com.google.gson.annotations.SerializedName

class Chat
{



    @SerializedName("_id"         ) var Id          : String?                 = null
    @SerializedName("chatIndex"   ) var chatIndex   : Int?          = 0
    @SerializedName("chatName"    ) var chatName    : String?             = null
    @SerializedName("chatCreator" ) var chatCreator : String?             = null
    @SerializedName("messages"    ) var messages    : ArrayList<Message>? = arrayListOf()
    @SerializedName("public"      ) var public      : Boolean?            = null
    @SerializedName("members"     ) var members     : ArrayList<String>?   = arrayListOf()
    @SerializedName("isBotActive" ) var isBotActive : Boolean?            = null


    constructor(
        Id: String?,
        chatIndex: Int?,
        chatName: String?,
        chatCreator: String?,
        messages: ArrayList<Message>?,
        public: Boolean?,
        members: ArrayList<String>?,
        isBotActive: Boolean?,

    ) {
        this.Id = Id
        this.chatIndex = chatIndex
        this.chatName = chatName
        this.chatCreator = chatCreator
        this.messages = messages
        this.public = public
        this.members = members
        this.isBotActive = isBotActive

    }

    constructor()
    constructor(
        chatIndex: Int?,
        chatName: String?,
        chatCreator: String?,
        messages: ArrayList<Message>?,
        public: Boolean?,
        members: ArrayList<String>?,
        isBotActive: Boolean?,

    ) {
        this.chatIndex = chatIndex
        this.chatName = chatName
        this.chatCreator = chatCreator
        this.messages = messages
        this.public = public
        this.members = members
        this.isBotActive = isBotActive

    }

    constructor(
        chatIndex: Int?,
        chatName: String?,
        chatCreator: String?,
        messages: ArrayList<Message>?,
        public: Boolean?,
        members: ArrayList<String>?,
        memebers: ArrayList<String>?
    ) {
        this.chatIndex = chatIndex
        this.chatName = chatName
        this.chatCreator = chatCreator
        this.messages = messages
        this.public = public
        this.members = members

    }






}
