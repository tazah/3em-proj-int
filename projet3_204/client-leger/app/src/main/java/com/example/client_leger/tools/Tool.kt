package com.example.client_leger.tools

import android.graphics.Color
import android.graphics.Paint
import android.view.MotionEvent
import com.example.client_leger.DrawView

abstract class Tool {
    abstract fun onTouch(event : MotionEvent)

    abstract fun onTouchDown()

    abstract fun onTouchMove(touchTolerance: Int, view: DrawView)

    abstract fun onTouchUp(view: DrawView)

    abstract fun resetTool()

    abstract fun getPaint(): Paint

    abstract fun sendDrawingToSocket(width: Int, height: Int)

    fun transformColorToRGBA(color: Int): String {
        return "rgba(" + Color.red(color) + "," + Color.green(color) + "," + Color.blue(color) + "," + (Color.alpha(color)
            .toFloat() / 255F) + ")"
    }

    fun transformColorToARGB(rgba: String): Int {
        var intRange = IntRange(rgba.indexOf("(") + 1, rgba.indexOf(")") - 1)

        var array = rgba.slice(intRange).split(", ")

        return Color.argb(
            (array[3].toFloat() * 255).toInt(),
            array[0].toInt(),
            array[1].toInt(),
            array[2].toInt()
        )
    }



    //abstract fun changeColor(color : Int)
}
