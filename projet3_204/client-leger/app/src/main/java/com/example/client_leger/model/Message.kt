package com.example.client_leger.model

import java.time.LocalDateTime

class Message {
    var message:String?=null
    var time:String?=null
    var senderId: String?=null

    constructor(){}

    constructor(message: String?,sender:String?){
        this.message=message
        this.senderId=sender
        this.time = LocalDateTime.now().toString()
    }

    constructor(message: String?,sender:String?,time:String?){
        this.message=message
        this.senderId=sender
        this.time = time
    }
}
