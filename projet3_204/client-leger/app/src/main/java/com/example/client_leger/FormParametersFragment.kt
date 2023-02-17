package com.example.client_leger

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.SeekBar
import android.widget.TextView
import com.example.client_leger.activity.ELLIPSE_TYPE
import com.example.client_leger.activity.RECTANGLE_TYPE
import com.example.client_leger.tools.Ellipse
import com.example.client_leger.tools.Rectangle
import com.example.client_leger.tools.ToolManager
import java.time.format.DecimalStyle

// TODO: Rename parameter arguments, choose names that match
// the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
private const val ARG_PARAM1 = "param1"
private const val ARG_PARAM2 = "param2"



/**
 * A simple [Fragment] subclass.
 * Use the [FormParametersFragment.newInstance] factory method to
 * create an instance of this fragment.
 */
class FormParametersFragment() : Fragment() {

    private lateinit var seekBar: SeekBar
    private lateinit var textView: TextView

    private lateinit var style1: ImageView
    private lateinit var style2: ImageView
    private lateinit var style3: ImageView


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_rectangle_parameters, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        seekBar = view.findViewById(R.id.seekBar)

        seekBar.setOnSeekBarChangeListener(seekBarChangeListener);

        style1 = view.findViewById(R.id.btnStyle1)
        style2 = view.findViewById(R.id.btnStyle2)
        style3 = view.findViewById(R.id.btnStyle3)


        var progress = seekBar.progress
        textView = view.findViewById(R.id.textView)
        textView.setText("Border Width:  $progress")

        initStylesIcons()

        style1.setOnClickListener{
            if(ToolManager.getCurrentTool() is Ellipse){
                (ToolManager.getCurrentTool() as Ellipse).setCurrentStyle(Style.STYLE1)
            }else if(ToolManager.getCurrentTool() is Rectangle){
                (ToolManager.getCurrentTool() as Rectangle).setCurrentStyle(Style.STYLE1)
            }
        }

        style2.setOnClickListener{
            if(ToolManager.getCurrentTool() is Ellipse){
                (ToolManager.getCurrentTool() as Ellipse).setCurrentStyle(Style.STYLE2)
            }else if (ToolManager.getCurrentTool() is Rectangle){
                (ToolManager.getCurrentTool() as Rectangle).setCurrentStyle(Style.STYLE2)
            }
        }

        style3.setOnClickListener{
            if(ToolManager.getCurrentTool() is Ellipse){
                (ToolManager.getCurrentTool() as Ellipse).setCurrentStyle(Style.STYLE3)
            }else if (ToolManager.getCurrentTool() is Rectangle){
                (ToolManager.getCurrentTool() as Rectangle).setCurrentStyle(Style.STYLE3)
            }
        }


    }

    private fun initStylesIcons() {
        if(ToolManager.getCurrentTool() is Rectangle)
        {
            style1.setImageResource(R.drawable.ic_rectangle)
            style2.setImageResource(R.drawable.ic_rectangle_outline)
            style3.setImageResource(R.drawable.ic_rectangle_outline_2)
        }
        else if(ToolManager.getCurrentTool() is Ellipse){
            style1.setImageResource(R.drawable.ic_ellipse)
            style2.setImageResource(R.drawable.ic_ellipse_outline)
            style3.setImageResource(R.drawable.ic_ellipse_outline_2)
        }
    }

    var seekBarChangeListener: SeekBar.OnSeekBarChangeListener = object :
        SeekBar.OnSeekBarChangeListener {
        override fun onProgressChanged(seekBar: SeekBar, progress: Int, fromUser: Boolean) {
            // updated continuously as the user slides the thumb
            textView.setText("Border Width: $progress")
            if(ToolManager.getCurrentTool() is Ellipse){
                (ToolManager.getCurrentTool() as Ellipse).setStrokeWidth(progress.toFloat())
            }else if (ToolManager.getCurrentTool() is Rectangle){
                (ToolManager.getCurrentTool() as Rectangle).setStrokeWidth(progress.toFloat())
            }
        }

        override fun onStartTrackingTouch(seekBar: SeekBar) {
            // called when the user first touches the SeekBar
        }

        override fun onStopTrackingTouch(seekBar: SeekBar) {
            // called after the user finishes moving the SeekBar
        }
    }

}
