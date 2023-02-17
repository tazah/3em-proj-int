package com.example.client_leger.activity.fragments

import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.Intent
import android.graphics.Bitmap
import android.os.Bundle
import android.provider.MediaStore
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import androidx.fragment.app.FragmentTransaction
import com.example.client_leger.R
import com.example.client_leger.activity.MainActivity
import com.google.android.material.snackbar.Snackbar

// TODO: Rename parameter arguments, choose names that match
// the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
private const val ARG_PARAM1 = "param1"
private const val ARG_PARAM2 = "param2"

/**
 * A simple [Fragment] subclass.
 * Use the [UploadPictureFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class UploadPictureFragment : Fragment() {
    // TODO: Rename and change types of parameters
    private var param1: String? = null
    private var param2: String? = null
    private lateinit var continueBtn: Button
    private lateinit var cancelBtn: Button
    private lateinit var accesToCamera: Button
    private lateinit var pictureTakedWithCamera: ImageView

    private var our_request_code:Int =123
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            param1 = it.getString(ARG_PARAM1)
            param2 = it.getString(ARG_PARAM2)
        }

    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment

        var v: View =inflater.inflate(R.layout.fragment_upload_picture, container, false)
        pictureTakedWithCamera= v.findViewById(R.id.pictureTakedWithCamera)

        continueBtn = v.findViewById(R.id.continueBtn)
        continueBtn.setOnClickListener(){
            val intent = Intent (activity, MainActivity::class.java)
            activity?.startActivity(intent)
        }

        cancelBtn = v.findViewById(R.id.cancelBtn)
        cancelBtn.setOnClickListener(){
            val methodsFragment = MethodsFragment()
            val transaction: FragmentTransaction = parentFragmentManager.beginTransaction()
            transaction.replace(R.id.mainLayout, methodsFragment).commit()
        }
        accesToCamera = v.findViewById(R.id.accesToCamera)
        accesToCamera.setOnClickListener(){
            val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
            try {
                startActivityForResult(intent,our_request_code)
                val snack = Snackbar.make(it,"succes",Snackbar.LENGTH_LONG)
                snack.show()
            }catch (e:ActivityNotFoundException){
                val snack = Snackbar.make(it,"Erreur : "+e.localizedMessage,Snackbar.LENGTH_LONG)
                snack.show()
            }

        }
        return v
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {

        if (requestCode==our_request_code && resultCode== Activity.RESULT_OK){
            val imageBitmap = data?.extras?.get("data") as Bitmap
            pictureTakedWithCamera.setImageBitmap(imageBitmap)
        }
        else super.onActivityResult(requestCode, resultCode, data)
    }

    companion object {
        /**
         * Use this factory method to create a new instance of
         * this fragment using the provided parameters.
         *
         * @param param1 Parameter 1.
         * @param param2 Parameter 2.
         * @return A new instance of fragment chooseBetwenImageFragment.
         */
        // TODO: Rename and change types and number of parameters
        @JvmStatic
        fun newInstance(param1: String, param2: String) =
            UploadPictureFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_PARAM1, param1)
                    putString(ARG_PARAM2, param2)
                }
            }
    }
}
