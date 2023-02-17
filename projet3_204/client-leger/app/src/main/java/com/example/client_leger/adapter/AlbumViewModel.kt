package com.example.client_leger.adapter

import androidx.compose.runtime.*
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.client_leger.Api.Api.AlbumInterface
import com.example.client_leger.model.OtherAlbum
import kotlinx.coroutines.launch
import java.lang.Exception

class AlbumViewModel: ViewModel(){
//    private lateinit var auth: FirebaseAuth
//    val db = Firebase.firestore

    var albumListResponse:List<OtherAlbum> by mutableStateOf(listOf())
    var currentAlbumReponse:OtherAlbum by mutableStateOf(OtherAlbum())
    var addNewAlbumResponse:Boolean by mutableStateOf(false)
    var deltedAlbumResponse:Boolean by mutableStateOf(false)
    var updateAlbumResponse:Int by mutableStateOf(0)
    var deleteDrawingResponse:Int by mutableStateOf(0)
    fun getAlbumList(){
        viewModelScope.launch {
            val apiAlbum =AlbumInterface.getAlbumApiInstance()
            try {

                val albumList= apiAlbum.getAllAlbums().body()!!
                albumListResponse = albumList

            }
            catch (e:Exception){
                errerMessage=e.message.toString()
            }
        }
    }
    var errerMessage: String by mutableStateOf("")

    fun addNewAlbum(newAlbum: OtherAlbum) {

        viewModelScope.launch {
            val apiAlbum =AlbumInterface.getAlbumApiInstance()
            try {

                addNewAlbumResponse= apiAlbum.addNewAlbum(newAlbum).body()!!

            }
            catch (e:Exception){
                errerMessage=e.message.toString()
            }
        }
    }
    fun deleteAnAlbum(id: String) {

        viewModelScope.launch {
            val apiAlbum =AlbumInterface.getAlbumApiInstance()
            try {

                deltedAlbumResponse= apiAlbum.deleteAnAlbum(id).isSuccessful

            }
            catch (e:Exception){
                errerMessage=e.message.toString()
            }
        }
    }
    fun updateAnAlbum(id: String, name:String) {

        viewModelScope.launch {
            val apiAlbum =AlbumInterface.getAlbumApiInstance()
            try {

                updateAlbumResponse= apiAlbum.updateAnAlbum(id,name).code()

            }
            catch (e:Exception){
                errerMessage=e.message.toString()
            }
        }
    }
    fun getCurrentAlbum(id:String){
        viewModelScope.launch {
            val apiAlbum =AlbumInterface.getAlbumApiInstance()
            try {
                currentAlbumReponse=apiAlbum.getCurrentAlbumWithId(id).body()!!
            }catch (e:Exception){
                errerMessage=e.message.toString()
            }
        }
    }

    fun getCurrentAlbumByIndex(socketIndex:Int){
        viewModelScope.launch {
            val apiAlbum =AlbumInterface.getAlbumApiInstance()
            try {
                currentAlbumReponse=apiAlbum.getCurrentAlbumWithSocketIndex(socketIndex).body()!!
            }catch (e:Exception){
                errerMessage=e.message.toString()
            }
        }
    }


    fun deleteADrawing(drawingId: String, albumId:String ) {

        viewModelScope.launch {
            val apiAlbum =AlbumInterface.getAlbumApiInstance()
            try {
                deleteDrawingResponse= apiAlbum.deleteADrawing(drawingId,albumId).code()
            }
            catch (e:Exception){
                errerMessage=e.message.toString()
            }
        }
    }



//    fun getCurrentUserFromFireBase(){
//        auth = Firebase.auth
//        viewModelScope.launch {
//            val userEmail = auth.currentUser?.email
//            if (userEmail!= null){
//                db.collection("UsersCollection").whereEqualTo("email",userEmail).get().addOnSuccessListener { user ->
//                    println("ici le bon utilisateur de firebase "+user.toObjects(User::class.java)[0])
//                    currentUser= user.toObjects(User::class.java)[0]
//                }
//            }else currentUser.userName=null
//
//        }
//    }

}
