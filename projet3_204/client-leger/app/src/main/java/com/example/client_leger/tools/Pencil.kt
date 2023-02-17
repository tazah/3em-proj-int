package com.example.client_leger.tools

import android.graphics.Paint
import android.util.Log
import android.view.MotionEvent
import com.example.client_leger.*
import com.example.client_leger.drawings.PencilDrawing
import com.example.client_leger.drawings.Point
import com.example.client_leger.drawings.Selection
import com.google.gson.Gson
import kotlin.math.min


private const val STROKE_WIDTH = 12f

class Pencil : Tool() {

    private var paint = Paint().apply {
        color = 0xFF000000.toInt()
        isAntiAlias = true
        isDither = true
        style = Paint.Style.STROKE
        strokeJoin = Paint.Join.ROUND
        strokeCap = Paint.Cap.ROUND
        strokeWidth = 12f
    }

    private var motionTouchEventX = 0f
    private var motionTouchEventY = 0f

    private var currentX = 0f
    private var currentY = 0f

    private var points: ArrayList<Point> = ArrayList()



    override fun onTouch(event : MotionEvent) {
        motionTouchEventX = event.x
        motionTouchEventY = event.y
        points.add(Point(event.x,event.y))
    }

    override fun onTouchDown(){
        paint.color = ToolManager.getCurrentPrimaryColor()
            currentX = motionTouchEventX
            currentY = motionTouchEventY
    }

    override fun onTouchMove(touchTolerance: Int, view: DrawView) {

        val dx = Math.abs(motionTouchEventX - currentX)
        val dy = Math.abs(motionTouchEventY - currentY)

        if (dx >= touchTolerance || dy >= touchTolerance) {
            view.resetCurPath()
            view.setCurPath(PencilDrawing(ArrayList(points),
                Paint(paint),
                view.height,
                view.width))
            view.invalidate()
        }
    }

    override fun onTouchUp(view: DrawView){
        view.resetCurPath()

        if(points.size > 1){
            view.addToDrawing(PencilDrawing(ArrayList(points),
                Paint(paint),
                view.height,
                view.width))

            var drawing = view.getLastDrawings()

            drawing.setIsSelection(true)

            sendDrawingToSocket(view.height, view.width)
            view.invalidate()
            ToolManager.switchToSelection()
            ToolManager.setCurrentSelection(view.getLastDrawings())
            points.clear()
        }
    }

    override fun resetTool() {
        motionTouchEventX = 0f
        motionTouchEventY = 0f

        currentX = 0f
        currentY = 0f
    }

    fun selectTool(): Selection {
        var minPoint :Point = Point(points[0].x,points[0].y)
        var maxPoint :Point = Point(points[0].x,points[0].y)

        for(element in points){
            if(element.x < minPoint.x){
                minPoint.x  = element.x
            }
            if(element.y < minPoint.y){
                minPoint.y  = element.y
            }
            if(element.x > maxPoint.x){
                maxPoint.x  = element.x
            }
            if(element.y > maxPoint.y){
                maxPoint.y  = element.y
            }
        }

       return Selection(minPoint, maxPoint)

    }

    override fun sendDrawingToSocket(height : Int, width : Int) {
        var movement = Movement(SocketService.userName,false,Origin.MOBILE,
            height, width,
            null,null,
            points,
            transformColorToRGBA(ToolManager.getCurrentPrimaryColor()),
            transformColorToRGBA(ToolManager.getCurrentSecondaryColor()),
            Type.PENCIL,
            paint.strokeWidth,
            Style.STYLE1
        )
        var gson = Gson()
        SocketService.socket.emit("update drawing",SocketService.currentCollabRoom,gson.toJson(movement))
        Log.d("envoi",SocketService.currentCollabRoom.toString())
    }
    override fun getPaint(): Paint {
        return paint
    }

}
