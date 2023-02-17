package com.example.client_leger.tools

import android.graphics.Color
import android.graphics.Paint
import android.util.Log
import android.view.MotionEvent
import androidx.core.graphics.alpha
import androidx.core.graphics.blue
import androidx.core.graphics.red
import com.example.client_leger.*
import com.example.client_leger.drawings.EllipseDrawing
import com.example.client_leger.drawings.Point
import com.example.client_leger.drawings.RectangleDrawing
import com.example.client_leger.drawings.Selection
import com.google.gson.Gson

class Rectangle : Tool() {

    private var motionTouchEventX = 0f
    private var motionTouchEventY = 0f
    private var startPointX = 0f
    private var startPointY = 0f

    private var currentX = 0f
    private var currentY = 0f
    private var currentStyle = Style.STYLE2


    private var paint = Paint().apply {
        color =  ToolManager.getCurrentPrimaryColor()
        isAntiAlias = true
        isDither = true
        style = Paint.Style.FILL_AND_STROKE
        strokeJoin = Paint.Join.MITER
        strokeCap = Paint.Cap.SQUARE
        strokeWidth = 12f
    }


    override fun onTouch(event : MotionEvent) {
        motionTouchEventX =  event.x
        motionTouchEventY = event.y

    }

    override fun onTouchDown(){
        paint.color = ToolManager.getCurrentPrimaryColor()
        currentX = motionTouchEventX
        currentY = motionTouchEventY

        startPointX = motionTouchEventX
        startPointY = motionTouchEventY
    }

    override fun onTouchMove(touchTolerance: Int, view: DrawView) {
        val dx = Math.abs(motionTouchEventX - currentX)
        val dy = Math.abs(motionTouchEventY - currentY)

        if (dx >= touchTolerance || dy >= touchTolerance) {

            view.resetCurPath()
            when(currentStyle){
                Style.STYLE1 -> {
                    paint.style = Paint.Style.STROKE
                    paint.color = ToolManager.getCurrentSecondaryColor()
                    view.setCurPath(RectangleDrawing(Point(startPointX,startPointY),
                        Point(currentX,currentY),
                        Paint(paint),
                        Style.STYLE1,
                        view.height,
                        view.width))
                }
                Style.STYLE2 -> {
                    paint.style = Paint.Style.FILL
                    paint.color = ToolManager.getCurrentPrimaryColor()
                    view.setCurPath(RectangleDrawing(Point(startPointX,startPointY),
                        Point(currentX,currentY),
                        Paint(paint),
                        Style.STYLE2,
                        view.height,
                        view.width))
                }
                Style.STYLE3 -> {
                    paint.style = Paint.Style.FILL_AND_STROKE
                    paint.color = ToolManager.getCurrentPrimaryColor()
                    view.setCurPath(RectangleDrawing(Point(startPointX,startPointY),
                        Point(currentX,currentY),
                        Paint(paint),
                        Style.STYLE3,
                        view.height,
                        view.width))

                    paint.style = Paint.Style.STROKE
                    paint.color = ToolManager.getCurrentSecondaryColor()
                    view.setCurPath(RectangleDrawing(Point(startPointX,startPointY),
                        Point(currentX,currentY),
                        Paint(paint),
                        Style.STYLE3,
                        view.height,
                        view.width))
                }
            }

            currentX = motionTouchEventX
            currentY = motionTouchEventY
            view.invalidate()
        }
    }

    override fun onTouchUp(view: DrawView) {

        view.addCurrToDrawing()
        var drawing = view.getLastDrawings() as RectangleDrawing

        if(drawing.getStyle() == Style.STYLE3){
            var secondeDarwing = view.getDrawings()[view.getDrawings().indexOf(drawing)-1] as RectangleDrawing
            secondeDarwing.setEnPoint(Point(currentX, currentY))
        }

        drawing.setEnPoint(Point(currentX, currentY))
        drawing.setIsSelection(true)

        view.resetCurPath()
        view.invalidate()

        ToolManager.switchToSelection()
        ToolManager.setCurrentSelection(view.getLastDrawings())

        sendDrawingToSocket(view.height, view.width)

        resetTool()
    }

    override fun resetTool() {
        motionTouchEventX = 0f
        motionTouchEventY = 0f
        startPointX = 0f
        startPointY = 0f

        currentX = 0f
        currentY = 0f
    }

    override fun getPaint(): Paint {
        return paint
    }

    override fun sendDrawingToSocket(height : Int, width : Int) {
        var movement = Movement(
            SocketService.userName,false, Origin.MOBILE,
            height, width,
            Point(startPointX,startPointY), Point(currentX,currentY),
            null,
            transformColorToRGBA(ToolManager.getCurrentPrimaryColor()),
            transformColorToRGBA(ToolManager.getCurrentSecondaryColor()),
            Type.RECTANGLE,
            paint.strokeWidth,
            currentStyle
        )
        Color.argb(0,0,0,0)

        var gson = Gson()
        SocketService.socket.emit("update drawing",0,gson.toJson(movement))
    }

    fun setCurrentStyle(style: Style){
        //currentStyle = style
        currentStyle = style
    }

    fun setStrokeWidth(width: Float){
        paint.strokeWidth = width
    }


}
