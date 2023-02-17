package com.example.client_leger.tools

import android.graphics.Path
import android.util.Log
import android.view.MotionEvent
import android.graphics.Paint
import android.text.style.LineHeightSpan

import com.example.client_leger.*
import com.example.client_leger.drawings.EllipseDrawing
import com.example.client_leger.drawings.Point
import com.example.client_leger.drawings.RectangleDrawing
import com.example.client_leger.drawings.Selection
import com.google.gson.Gson


class Ellipse : Tool() {

    private var paint = Paint().apply {
        color = 0xFF000000.toInt()
        isAntiAlias = true
        isDither = true
        style = Paint.Style.FILL_AND_STROKE
        strokeJoin = Paint.Join.ROUND
        strokeCap = Paint.Cap.ROUND
        strokeWidth = 12f
    }

    private var motionTouchEventX = 0f
    private var motionTouchEventY = 0f
    private var startPointX = 0f
    private var startPointY = 0f
    private var path = Path()


    private var currentX = 0f
    private var currentY = 0f
    private var strokeWidth = 12f;

    private var currentStyle = Style.STYLE2

    override fun onTouch(event : MotionEvent) {
        motionTouchEventX = event.x
        motionTouchEventY = event.y

    }

    override fun onTouchDown(){
        paint.color = ToolManager.getCurrentPrimaryColor()
        currentX = motionTouchEventX
        currentY = motionTouchEventY

        startPointX = motionTouchEventX
        startPointY = motionTouchEventY
    }

    override fun onTouchMove(touchTolerance: Int,view : DrawView) {
        val dx = Math.abs(motionTouchEventX - currentX)
        val dy = Math.abs(motionTouchEventY - currentY)

        if (dx >= touchTolerance || dy >= touchTolerance) {
            path.reset()
            view.resetCurPath()
            when(currentStyle){
                Style.STYLE1 -> {
                    paint.style = Paint.Style.STROKE
                    paint.color = ToolManager.getCurrentSecondaryColor()
                    view.setCurPath(EllipseDrawing(Point(startPointX,startPointY),
                        Point(currentX,currentY),
                        Paint(paint),
                        Style.STYLE1,
                        view.height,
                        view.width))
                }
                Style.STYLE2 -> {
                    paint.style = Paint.Style.FILL_AND_STROKE
                    paint.color = ToolManager.getCurrentPrimaryColor()
                    view.setCurPath(EllipseDrawing(Point(startPointX,startPointY),
                        Point(currentX,currentY),
                        Paint(paint),
                        Style.STYLE2,
                        view.height,
                        view.width))
                }
                Style.STYLE3 -> {
                    paint.style = Paint.Style.FILL_AND_STROKE
                    paint.color = ToolManager.getCurrentPrimaryColor()
                    view.setCurPath(EllipseDrawing(Point(startPointX,startPointY),
                        Point(currentX,currentY),
                        Paint(paint),
                        Style.STYLE3,
                        view.height,
                        view.width))

                    paint.style = Paint.Style.STROKE
                    paint.color = ToolManager.getCurrentSecondaryColor()
                    view.setCurPath(EllipseDrawing(Point(startPointX,startPointY),
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

    override fun onTouchUp(view : DrawView){

        view.addCurrToDrawing()

        var drawing = view.getLastDrawings() as EllipseDrawing

        if(drawing.getStyle() == Style.STYLE3){
            var secondeDarwing = view.getDrawings()[view.getDrawings().indexOf(drawing)-1] as EllipseDrawing
            secondeDarwing.setEnPoint(Point(currentX, currentY))
        }

        drawing.setEnPoint(Point(this.currentX, this.currentY))
        drawing.setIsSelection(true)

        ToolManager.switchToSelection()
        ToolManager.setCurrentSelection(view.getLastDrawings())
        view.resetCurPath()
        view.invalidate()

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

    override fun sendDrawingToSocket(width: Int, height: Int) {
        var movement = Movement(
            SocketService.userName,false, Origin.MOBILE,
            height, width,
            Point(startPointX,startPointY), Point(currentX,currentY),
            null,
            transformColorToRGBA(ToolManager.getCurrentPrimaryColor()),
            transformColorToRGBA(ToolManager.getCurrentSecondaryColor()),
            Type.ELLIPSE,
            paint.strokeWidth,
            currentStyle
        )

        var gson = Gson()
        SocketService.socket.emit("update drawing",0,gson.toJson(movement))
    }

    fun setCurrentStyle(style: Style){
        currentStyle = style
    }

    fun setStrokeWidth(width: Float){
        paint.strokeWidth = width
    }

}
