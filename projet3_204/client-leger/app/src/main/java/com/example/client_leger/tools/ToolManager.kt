package com.example.client_leger.tools

import android.graphics.Paint
import com.example.client_leger.drawings.ADrawing


object ToolManager {


    private var currentTool : Tool = Pencil()
    private lateinit var currentSelection : ADrawing
    private lateinit var toolBeforeSelection : Tool


    private var currentPrimaryColor = 0xFF000000.toInt()
    private var currentSecondaryColor = 0xFF000000.toInt()
    private val pencil = Pencil()
    private val circle = Ellipse()
    private val rectangle = Rectangle()
    private val selection = Selection()

    fun setCurrent(number : Int){
        when(number){
            0 -> {
                currentTool = pencil
            }
            1 -> {
                currentTool = rectangle
            }
            2 ->{
                currentTool = circle
            }
            3 -> {
                currentTool = selection
            }
        }
    }

    fun switchToSelection(){
        toolBeforeSelection = currentTool
        currentTool = selection
        (currentTool as Selection).setSelectionType(1)
    }

    fun switchFromSelectionToOldTool(){
        if(toolBeforeSelection != selection) {
            currentTool.resetTool()
            currentTool = toolBeforeSelection
            currentTool.resetTool()
        }
    }

    fun setCurrentPrimaryColor(color : Int) {
        this.currentPrimaryColor = color
    }

    fun setSecondaryColor(color : Int){
        this.currentSecondaryColor = color
    }


    fun getCurrentTool(): Tool {
        return currentTool
    }

    fun getCurrentPaint(): Paint {
        return currentTool.getPaint()
    }

    fun getCurrentPrimaryColor(): Int{
        return currentPrimaryColor
    }

    fun getCurrentSecondaryColor(): Int{
        return currentSecondaryColor
    }

    fun setCurrentSelection(selection: ADrawing){
        currentSelection = selection
    }

    fun getCurrentSelection(): ADrawing{
        return currentSelection
    }


}
