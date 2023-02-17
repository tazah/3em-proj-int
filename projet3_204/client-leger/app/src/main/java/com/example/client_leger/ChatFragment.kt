package com.example.client_leger

import android.content.Context
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.ImageView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.client_leger.adapter.MessageAdapter
import com.example.client_leger.model.Message

/**
 * A simple [Fragment] subclass.
 * Use the [ChatFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class ChatFragment : Fragment() {
    private lateinit var messageRecyclerView: RecyclerView
    private lateinit var sendButton: ImageView
    private lateinit var messageBox: EditText
    private lateinit var messageAdapter: MessageAdapter
    private lateinit var messageList: ArrayList<Message>

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
       return inflater.inflate(R.layout.fragment_chat, container, false)

    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)


        var userName = arguments?.getString("userName")
        messageAdapter = MessageAdapter(context,messageList,userName.toString())

        messageRecyclerView.layoutManager = LinearLayoutManager(context)
        messageRecyclerView.adapter = messageAdapter

        messageRecyclerView.layoutManager = LinearLayoutManager(context)
        messageRecyclerView.adapter = messageAdapter
    }

    override fun onAttach(context: Context) {
        super.onAttach(context)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        messageRecyclerView = view.findViewById(R.id.chatRecylerView)
        sendButton = view.findViewById(R.id.btnSend)
        messageBox = view.findViewById(R.id.messageBox)
        messageList = ArrayList()

        var userName = arguments?.getString("userName")

        SocketService.socket.on("receiveMessage") { (message,time,sender) ->
            val message = message as String
            val time = time as String
            val sender = sender as String

            messageList.add(Message(message,sender,time)!!)

            //runOnUiThread(Runnable {
                messageAdapter.notifyDataSetChanged()
            //})

            messageRecyclerView.getAdapter()?.let { messageRecyclerView.smoothScrollToPosition(it.itemCount) }
        }

        sendButton.setOnClickListener{
            val messageText = messageBox.text.toString()
            val message = Message(messageText, userName)


            SocketService.socket.emit("onSendMessage",message.message,message.senderId)

            messageBox.setText("")
        }

    }


}
