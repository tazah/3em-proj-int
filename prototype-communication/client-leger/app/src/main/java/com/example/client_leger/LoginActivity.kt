package com.example.client_leger

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.api.ApiException
import com.google.firebase.auth.AuthCredential
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import com.google.firebase.auth.ktx.auth
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.firestore.ktx.toObject
import com.google.firebase.ktx.Firebase
import com.wajahatkarim3.easyvalidation.core.view_ktx.validator

class LoginActivity : AppCompatActivity() {
    private val TAG = "LoginActivite"
    private lateinit var edtEmail: EditText
    private lateinit var edtPassword: EditText
    private lateinit var btnLogin: Button
    private lateinit var btnSignUp: Button

    private lateinit var auth: FirebaseAuth
    val db = Firebase.firestore

    override fun onRestart() {
        super.onRestart()
        auth.signOut()
        Log.d(TAG,"USER IS DISCONNECTED");
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        edtEmail = findViewById(R.id.edtEmail)
        edtPassword = findViewById(R.id.edtPassword)
        btnLogin = findViewById(R.id.btnLogin)
        btnSignUp = findViewById(R.id.btnSignUp)

        auth = Firebase.auth

        btnSignUp.setOnClickListener {
            val intent = Intent(this,SignUpActivity::class.java)
            startActivity(intent)
        }

        btnLogin.setOnClickListener {
            val email = edtEmail.text.toString()
            val password = edtPassword.text.toString()

            login(email,password)
        }
    }

    private fun login(userName: String,password:String){
        //logic to login the user

        if(!validateInput().contains(false))
        {
            db.collection("UsersCollection").whereEqualTo("userName",userName).get().addOnSuccessListener { user ->
                if(user.isEmpty){
                    edtEmail.error = "Le nom d'utilisateur n'est pas disponible"
                    Toast.makeText(this@LoginActivity,"Le nom d'utilisateur n'est pas disponible", Toast.LENGTH_SHORT).show()
                }
                else{
                    val userObject = user.toObjects(User::class.java)
                    auth.signInWithEmailAndPassword(userObject[0].email.toString(), password)
                        .addOnCompleteListener(this) { task ->
                            if (task.isSuccessful) {
                                edtEmail.text.clear()
                                edtPassword.text.clear()
                                // Sign in success, update UI with the signed-in user's information
                                getCurrentUser()
                            } else {
                                // If sign in fails, display a message to the user.
                                Toast.makeText(this@LoginActivity,"Mot de passe incorrect", Toast.LENGTH_SHORT).show()
                            }
                        }
                }
            }
        }

    }

    private fun getCurrentUser():String{
        val docRef = db.collection("UsersCollection").document(auth.currentUser?.uid.toString())
        var userName=""

        docRef.get()
            .addOnSuccessListener{user ->
                val userObject = user.toObject<User>()
                userName = userObject?.userName.toString()
                val intent = Intent(this@LoginActivity,MainActivity::class.java)
                intent.putExtra("userName",userName);
                startActivity(intent)
            }
        return userName;
    }


    private fun validateInput():ArrayList<Boolean>{
        val validation:ArrayList<Boolean> = ArrayList()

        edtEmail.validator()
            .nonEmpty()
            .noSpecialCharacters()
            .addErrorCallback {
                edtEmail.error = "Les caractères spéciaux ne sont pas autorisés"
                validation.add(false)
            }
            .check()

        edtPassword.validator()
            .nonEmpty()
            .addErrorCallback {
                edtPassword.error = "Veuillez remplir votre mot de passe"
                validation.add(false)
            }
            .check()

        return validation

    }

}
