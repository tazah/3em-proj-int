package com.example.client_leger

class User {
    var email:String?=null
    var isConnected:Boolean?=null
    var password:String?=null
    var passwordConfirmation:String?=null
    var userId: String?=null
    var userName: String?=null

    constructor(){}

    constructor(
        email: String?,
        isConnected: Boolean?,
        password: String?,
        passwordConfirmation: String?,
        userId: String?,
        userName: String?
    ) {
        this.email = email
        this.isConnected = isConnected
        this.password = password
        this.passwordConfirmation = passwordConfirmation
        this.userId = userId
        this.userName = userName
    }


}
