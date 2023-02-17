package com.example.client_leger.activity.fragments

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import androidx.cardview.widget.CardView
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
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
 * Use the [ImageChoiceFragment.newIns
 * tance] factory method to
 * create an instance of this fragment.
 */
class ImageChoiceFragment : Fragment() {
    // TODO: Rename and change types of parameters
    private var param1: String? = null
    private var param2: String? = null
    private lateinit var continueBtn: Button
    private lateinit var cancelBtn: Button
    private lateinit var catCardView1: CardView
    private lateinit var sangokuCardView2: CardView
    private lateinit var momoCardView3: CardView
    private lateinit var pepeCardView4: CardView
    private lateinit var onizukaCardView5: CardView
    private lateinit var luffyCardView6: CardView
    private var cliqueCounter =0;

//    android:id="@+id/cardViewCat"

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
        var v:View= inflater.inflate(R.layout.fragment_choice_picture, container, false)

        catCardView1 = v.findViewById(R.id.cardView1)
        sangokuCardView2 = v.findViewById(R.id.cardView2)
        momoCardView3 = v.findViewById(R.id.cardView3)
        pepeCardView4 = v.findViewById(R.id.cardView4)
        onizukaCardView5 = v.findViewById(R.id.cardView5)
        luffyCardView6 = v.findViewById(R.id.cardView6)

        catCardView1.setOnClickListener(){
            Snackbar.make(it,"L'avatar est enregisté avec succès ! ", Snackbar.LENGTH_LONG).show()
            catCardView1.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_green));
            sangokuCardView2.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            momoCardView3.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            pepeCardView4.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            onizukaCardView5.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            luffyCardView6.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            cliqueCounter=1

        }
        sangokuCardView2.setOnClickListener(){
            Snackbar.make(it,"L'avatar est enregisté avec succès ! ", Snackbar.LENGTH_LONG).show()
            catCardView1.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            sangokuCardView2.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_green));
            momoCardView3.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            pepeCardView4.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            onizukaCardView5.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            luffyCardView6.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            cliqueCounter=2

        }
        momoCardView3.setOnClickListener(){
            Snackbar.make(it,"L'avatar est enregisté avec succès ! ", Snackbar.LENGTH_LONG).show()
            catCardView1.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            sangokuCardView2.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            momoCardView3.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_green));
            pepeCardView4.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            onizukaCardView5.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            luffyCardView6.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            cliqueCounter=3

        }
        pepeCardView4.setOnClickListener(){
            Snackbar.make(it,"L'avatar est enregisté avec succès ! ", Snackbar.LENGTH_LONG).show()
            catCardView1.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            sangokuCardView2.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            momoCardView3.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            pepeCardView4.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_green));
            onizukaCardView5.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            luffyCardView6.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            cliqueCounter=4

        }
        onizukaCardView5.setOnClickListener(){
            Snackbar.make(it,"L'avatar est enregisté avec succès ! ", Snackbar.LENGTH_LONG).show()
            catCardView1.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            sangokuCardView2.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            momoCardView3.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            pepeCardView4.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            onizukaCardView5.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_green));
            luffyCardView6.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            cliqueCounter=5

        }
        luffyCardView6.setOnClickListener(){
            Snackbar.make(it,"L'avatar est enregisté avec succès ! ", Snackbar.LENGTH_LONG).show()
            catCardView1.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            sangokuCardView2.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            momoCardView3.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            pepeCardView4.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            onizukaCardView5.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_blue));
            luffyCardView6.setCardBackgroundColor(ContextCompat.getColor(v.context, R.color.theme1_green));
            cliqueCounter=6

        }


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
        return v
    }

    companion object {
        /**
         * Use this factory method to create a new instance of
         * this fragment using the provided parameters.
         *
         * @param param1 Parameter 1.
         * @param param2 Parameter 2.
         * @return A new instance of fragment uploadPictureFragment.
         */
        // TODO: Rename and change types and number of parameters
        @JvmStatic
        fun newInstance(param1: String, param2: String) =
            ImageChoiceFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_PARAM1, param1)
                    putString(ARG_PARAM2, param2)
                }
            }
    }
}

//private fun Drawable.setStroke(convertDpToPx: Any, red: Int) {
//
//}
