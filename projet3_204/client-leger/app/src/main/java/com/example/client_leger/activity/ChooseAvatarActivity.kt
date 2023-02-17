package com.example.client_leger.activity

//import android.net.Uri
import android.os.Bundle
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import com.example.client_leger.R
import com.example.client_leger.activity.fragments.MethodsFragment


//import android.content.Intent as Intent
//const val AVATAR1= "https://firebasestorage.googleapis.com/v0/b/projet3-98eba.appspot.com/o/avatar1.jpg?alt=media&token=aff2e4dd-dc86-4726-bb03-2044378197a6"
//const val AVATAR2= "https://firebasestorage.googleapis.com/v0/b/projet3-98eba.appspot.com/o/avatar2.jpg?alt=media&token=97549b21-67ae-4f0e-900b-453cf6f7bbe2"
//const val AVATAR3= "https://firebasestorage.googleapis.com/v0/b/projet3-98eba.appspot.com/o/avatar3.jpg?alt=media&token=d6458050-ffb0-4e66-a261-06804f1fcd66"
//const val AVATAR4= "https://firebasestorage.googleapis.com/v0/b/projet3-98eba.appspot.com/o/avatar4.jpg?alt=media&token=2f84d938-ab3f-4812-9437-51b718f0f971"
//const val AVATAR5= "https://firebasestorage.googleapis.com/v0/b/projet3-98eba.appspot.com/o/avatar5.jpg?alt=media&token=0215aa92-f9be-4e5f-834f-9fcfa310272b"
//const val AVATAR6= "https://firebasestorage.googleapis.com/v0/b/projet3-98eba.appspot.com/o/avatar6.jpg?alt=media&token=f65c129d-6f79-4816-b1f1-7dcd1b1c41dc"
class ChooseAvatar : AppCompatActivity() {


    private lateinit var takePictureButton: Button
    private lateinit var chooseFromImage: Button
//    private var mStorageRef: StorageReference? = null


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_choose_avatar)

//        mStorageRef = FirebaseStorage.getInstance().reference;
//        takePictureButton = findViewById(R.id.takePictureF)
//        chooseFromImage = findViewById(R.id.chooseFromImage)
        val methodsFragment = MethodsFragment()
        val manager = supportFragmentManager
        manager.beginTransaction().add(R.id.mainLayout, methodsFragment).commit()

    }

//    private fun replaceFragment(fragment: Fragment) {
//        val transaction = supportFragmentManager.beginTransaction()
//        transaction.replace(R.id.fragment_container_view_tag, fragment)
//        transaction.commit()
//    }


//    fun showMyFragment(fragment: Fragment) {
//
//        supportFragmentManager.commit {
//            replace(R.id.fragment_container, fragment)
//        }
//    }

//    private fun goToNextActivity(){
//        val intent = Intent(this@ChooseAvatar, MainActivity::class.java)
//        startActivity(intent)
//    }
}
//    private lateinit var mainAvatar: ImageView
//    private lateinit var avatar1: ImageView
//    private lateinit var avatar2: ImageView
//    private lateinit var avatar3: ImageView
//    private lateinit var avatar4: ImageView
//    private lateinit var avatar5: ImageView
//    private lateinit var avatar6: ImageView
//        mainAvatar = findViewById(R.id.imageView0)
//        avatar1 = findViewById(R.id.imageView1)
//        avatar2 = findViewById(R.id.imageView2)
//        avatar3 = findViewById(R.id.imageView3)
//        avatar4 = findViewById(R.id.imageView4)
//        avatar5 = findViewById(R.id.imageView5)
//        avatar6 = findViewById(R.id.imageView6)
//        takePictureButton = findViewById(R.id.takePicture)
//        continueButton = findViewById(R.id.continueBtn)
//        cancelButton = findViewById(R.id.cancelBtn)
