package com.example.client_leger

import android.util.Log
import io.socket.client.IO
import io.socket.client.Socket

object SocketService {
    lateinit var socket: Socket
    lateinit var userName: String
    var currentCollabRoom: Int =-1
//    lateinit var previousMouvements: Array<Movement>

    @Synchronized
    fun connectSocket(){
        socket = IO.socket("http://10.0.2.2:3000/")
        socket.connect()

    }

    @Synchronized
    fun disconnectSocket(){
        socket.disconnect()
    }

}
