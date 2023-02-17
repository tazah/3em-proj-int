package com.example.client_leger.activity

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import com.example.client_leger.R
import com.example.client_leger.model.User
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.ktx.auth
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.firestore.ktx.toObject
import com.google.firebase.ktx.Firebase
import com.wajahatkarim3.easyvalidation.core.view_ktx.validator

class SignUpActivity : AppCompatActivity() {

    private lateinit var edtEmail: EditText
    private lateinit var edtPassword: EditText
    private lateinit var edtNickname: EditText
    private lateinit var edtPasswordConfirmation: EditText
    private lateinit var btnSignUp: Button

    private lateinit var auth: FirebaseAuth;


    val db = Firebase.firestore

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sign_up)


        edtEmail = findViewById(R.id.edtEmail)
        edtPasswordConfirmation = findViewById(R.id.edtPasswordConfirmation)
        edtPassword = findViewById(R.id.edtPassword)
        edtNickname = findViewById(R.id.edtNickname)
        btnSignUp = findViewById(R.id.btnSignUp)

        edtPassword.validator()
            .nonEmpty()
            .minLength(6)
            .atleastOneUpperCase()
            .atleastOneNumber()
            .addErrorCallback {
                edtPassword.error = it
            }

        auth = Firebase.auth

        btnSignUp.setOnClickListener {
            val email = edtEmail.text.toString()
            val password = edtPassword.text.toString()
            val userName = edtNickname.text.toString()

            signUp(email,userName,password)
        }

    }

    private fun getCurrentUser():String{
        val docRef = db.collection("UsersCollection").document(auth.currentUser?.uid.toString())
        var userName=""

        docRef.get()
            .addOnSuccessListener{user ->
                val userObject = user.toObject<User>()
                userName = userObject?.userName.toString()
                val intent = Intent(this@SignUpActivity, ChooseAvatar::class.java)
                intent.putExtra("userName",userName);
                startActivity(intent)
            }
        return userName;
    }

    private fun signUp(email:String,userName:String,password:String){

        if(!validateInput().contains(false))
        {
            db.collection("UsersCollection").whereEqualTo("userName",userName).get().addOnSuccessListener{ user ->
                if(!user.isEmpty)
                {
                    edtNickname.error = "Le nom d'utilisateur n'est pas disponible"
                    Toast.makeText(this@SignUpActivity,"Le nom d'utilisateur n'est pas disponible",Toast.LENGTH_SHORT).show();
                }
                else{
                    auth.createUserWithEmailAndPassword(email, password)
                        .addOnCompleteListener(this) { task ->
                            if (task.isSuccessful) {
                                db.collection("UsersCollection")
                                    .document(auth.currentUser?.uid.toString())
                                    .set(User(email,true,password,password,auth.currentUser?.uid,edtNickname.text.toString()))
                                    .addOnSuccessListener { user ->
                                    }
                                // Sign in success, update UI with the signed-in user's information
                                getCurrentUser()
                            } else {
                                edtEmail.error = "Un comtpe exist déjà avec cet email"
                                Toast.makeText(this@SignUpActivity,"Un comtpe exist déjà avec cet email",Toast.LENGTH_SHORT).show();
                            }
                        }
                }

            }
        }
    }


    private fun validateInput():ArrayList<Boolean>{
        val validation:ArrayList<Boolean> = ArrayList()

        edtEmail.validator()
            .nonEmpty()
            .validEmail()
            .addErrorCallback {
                edtEmail.error = "Email incorrecte"
                validation.add(false)
            }
            .check()

        edtPassword.validator()
            .nonEmpty()
            .minLength(6)
            .atleastOneUpperCase()
            .atleastOneNumber()
            .addErrorCallback {
                edtPassword.error = ("Un mot de passe doit contenir : "+"\n"+"au moins 6 charactères " +
                     "\n"+"au moins une lettre majuscule "+ "\n"+"au moins un charactère special")
                validation.add(false)
            }
            .check()

        if(edtPassword.text.toString()!=edtPasswordConfirmation.text.toString()){
            edtPasswordConfirmation.error = "Mauvaise confirmation du mot de passe"
            validation.add(false);
        }

        return validation

    }




}
