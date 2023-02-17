package com.example.client_leger.Api.Api

import android.util.Log
import android.widget.Toast
import com.example.client_leger.model.OtherAlbum
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

public interface AlbumInterface {

    @GET("getAllAlbum")
    suspend fun getAllAlbums(): Response<List<OtherAlbum>>

    @GET("getCurrentAlbum/{id}")
    suspend fun getCurrentAlbumWithId(
        @Path("id") id:String
    ): Response<OtherAlbum>

    @GET("getCurrentAlbum/{socketIndex}")
    suspend fun getCurrentAlbumWithSocketIndex(
        @Path("socketIndex") socketIndex:Int
    ): Response<OtherAlbum>

    @POST("addNewAlbum")
    suspend fun addNewAlbum(
        @Body album: OtherAlbum
    ):Response<Boolean>

    @DELETE("deleteAnAlbum/{id}")
    suspend fun deleteAnAlbum(
        @Path("id") id:String
    ):Response<Unit>

    @FormUrlEncoded
    @PUT("updateAnAlbum/{id}")
    suspend fun updateAnAlbum(
        @Path("id") id:String,
        @Field("name") name: String
    ):Response<Unit>

    @FormUrlEncoded
    @DELETE("delteADrawing/{drawingId}")
    suspend fun deleteADrawing(
        @Path("drawingId") drawingId:String,
        @Field("AlbumId") AlbumId: String
    ):Response<Unit>

    companion object {
        var apiAlbum :AlbumInterface?= null
        fun getAlbumApiInstance():AlbumInterface{
            if (apiAlbum==null){
                apiAlbum= Retrofit.Builder().addConverterFactory(GsonConverterFactory.create()).baseUrl("http://10.0.2.2:3000/api/album/")
            .build()
            .create(AlbumInterface::class.java)
            }
            return apiAlbum!!
        }
    }

}

