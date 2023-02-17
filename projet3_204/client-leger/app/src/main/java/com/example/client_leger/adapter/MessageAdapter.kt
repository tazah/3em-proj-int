package com.example.client_leger.adapter

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.client_leger.R
import com.example.client_leger.model.Message

class MessageAdapter(val context:Context?, val messageList:ArrayList<Message>, val currentUser:String): RecyclerView.Adapter<RecyclerView.ViewHolder>() {

    val ITEM_RECEIVE=1
    val ITEM_SENT=2

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        if(viewType == 1){
            val view: View = LayoutInflater.from(context).inflate(R.layout.recieve,parent,false)
            return RecieveViewHolder(view)
        }
        else{
            val view: View = LayoutInflater.from(context).inflate(R.layout.sent,parent,false)
            return SentViewHolder(view)
        }
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        if(holder.javaClass == SentViewHolder::class.java){
            val currentMessage = messageList[position]
            val viewHolder = holder as SentViewHolder
            holder.sentMessage.text = currentMessage.message
            holder.senderName.text = "Moi :"
            holder.time.text = currentMessage.time


        }
        else{
            val currentMessage = messageList[position]
            val viewHolder = holder as RecieveViewHolder
            holder.receiveMessage.text = currentMessage.message
            holder.senderName.text = currentMessage.senderId
            holder.time.text = currentMessage.time
        }
    }

    override fun getItemViewType(position: Int): Int {
        val currentMessage = messageList[position]

        if(currentUser.equals(currentMessage.senderId)){
            return ITEM_SENT
        }
        else{
            return ITEM_RECEIVE
        }
    }

    override fun getItemCount(): Int {
        return messageList.size
    }
    fun getSize(): Int{
        return messageList.size
    }


    class SentViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){
        val sentMessage = itemView.findViewById<TextView>(R.id.txt_sent_message)
        val senderName = itemView.findViewById<TextView>(R.id.senderName)
        val time = itemView.findViewById<TextView>(R.id.txt_time_message)
    }

    class RecieveViewHolder(itemView: View): RecyclerView.ViewHolder(itemView){
        val receiveMessage = itemView.findViewById<TextView>(R.id.txt_receive_message)
        val senderName = itemView.findViewById<TextView>(R.id.senderName)
        val time = itemView.findViewById<TextView>(R.id.txt_time_message)
    }
}
