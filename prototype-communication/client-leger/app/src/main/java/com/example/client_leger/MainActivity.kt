package com.example.client_leger

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.ImageView
import android.widget.LinearLayout
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.ktx.auth
import com.google.firebase.database.*
import com.google.firebase.ktx.Firebase
import io.socket.client.IO


class MainActivity : AppCompatActivity() {

    var socket = IO.socket("http://ec2-3-98-94-239.ca-central-1.compute.amazonaws.com:3000/")

    private lateinit var messageRecyclerView: RecyclerView
    private lateinit var messageBox: EditText
    private lateinit var logOutButton: Button
    private lateinit var sendButton: ImageView
    private lateinit var messageAdapter: MessageAdapter
    private lateinit var messageList: ArrayList<Message>
    private lateinit var auth: FirebaseAuth
    private lateinit var dataBaseReference: DatabaseReference


    override fun onCreate(savedInstanceState: Bundle?){

        auth = Firebase.auth

        socket.connect()
        socket.on("receiveMessage") { (message,time,sender) ->
                    val message = message as String
                    val time = time as String
                    val sender = sender as String

                    messageList.add(Message(message,sender,time)!!)

                    Log.d("MessageAdapterList",messageList.size.toString())
                    runOnUiThread(Runnable {
                        messageAdapter.notifyDataSetChanged()
                    })

                    messageRecyclerView.getAdapter()?.let { messageRecyclerView.smoothScrollToPosition(it.itemCount) }
                    Log.d("RecievedMessage from server:",message)
        }



        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val senderId = FirebaseAuth.getInstance().currentUser?.uid

       // dataBaseReference = FirebaseDatabase.getInstance().getReference()

        messageRecyclerView = findViewById(R.id.chatRecylerView)
        messageBox = findViewById(R.id.messageBox)
        sendButton = findViewById(R.id.btnSend)
        logOutButton = findViewById(R.id.btnLogOut)
        messageList = ArrayList()
        messageAdapter = MessageAdapter(this,messageList,intent.getStringExtra("userName").toString())

        messageRecyclerView.layoutManager = LinearLayoutManager(this)
        messageRecyclerView.adapter = messageAdapter


        logOutButton.setOnClickListener {
            auth.signOut()
            intent.removeExtra("userName")
            val intent = Intent(this@MainActivity,LoginActivity::class.java)
            startActivity(intent)
        }

        sendButton.setOnClickListener{
            val messageText = messageBox.text.toString()
            val message = Message(messageText, intent.getStringExtra("userName"))

            Log.d("emit sendmessage", message.time.toString())
            Log.d("emit message ", message.senderId.toString())
            socket.emit("onSendMessage",message.message,message.senderId)

          //  dataBaseReference.child("chats").child("publicRoom").child("messages").push()
             //   .setValue(message)

            messageBox.setText("")
        }


    }

    private fun onRecieveMessage(){

    }
}
