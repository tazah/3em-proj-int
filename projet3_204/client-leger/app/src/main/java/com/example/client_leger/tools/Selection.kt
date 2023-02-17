package com.example.client_leger.tools

import android.graphics.Paint
import android.view.MotionEvent
import com.example.client_leger.DrawView
import com.example.client_leger.DrawViewService
import com.example.client_leger.Style
import com.example.client_leger.drawings.*


class Selection : Tool(){
    private var motionTouchEventX = 0f
    private var motionTouchEventY = 0f

    private var currentX = 0f
    private var currentY = 0f

    private var isTranslate = false
    private var isResize = false
    private var isFinish = false
    private var selectionType = 0

    private var indexHandle = -1




    override fun onTouch(event: MotionEvent) {
        motionTouchEventX = event.x
        motionTouchEventY = event.y
    }

    override fun onTouchDown() {
        val drawing = ToolManager.getCurrentSelection()
        val selection = drawing.getSelection()
        val handles = drawing.getHandles()
        if(drawing.getISelection() && selection!=null ){
            if(findOnHandle(handles) != null){
                isResize = true
                isTranslate = false
                isFinish = false
                indexHandle = handles.indexOf(findOnHandle(handles))
            }
            else if(motionTouchEventX > selection.start.x && motionTouchEventX < selection.end.x &&
                motionTouchEventY > selection.start.y && motionTouchEventY < selection.end.y){
                isTranslate = true
                isResize = false
                isFinish = false

            }
            else{
                val foundASelection = findSelection()
                if(foundASelection){
                    isTranslate = false
                    isResize = false
                    isFinish = false
                }
                else{
                    isTranslate = false
                    isResize = false
                    isFinish = true
                }
            }
        }
        else{
            val foundASelection = findSelection()
            if(foundASelection){
                isTranslate = false
                isResize = false
                isFinish = false
            }
            else{
                isTranslate = false
                isResize = false
                isFinish = true
            }
        }

        currentX = motionTouchEventX
        currentY = motionTouchEventY
    }

    override fun onTouchMove(touchTolerance: Int, view: DrawView) {
        val dx = Math.abs(motionTouchEventX - currentX)
        val dy = Math.abs(motionTouchEventY - currentY)

        if(isTranslate)
        {
            if (dx >= touchTolerance || dy >= touchTolerance) {
                var drawing = ToolManager.getCurrentSelection()
                drawing.translateDrawing(motionTouchEventX - currentX,
                        motionTouchEventY - currentY)
                if(drawing is RectangleDrawing){
                    if(drawing.getStyle() == Style.STYLE3){
                        DrawViewService.view
                            .getDrawings()[DrawViewService.view.getDrawings().indexOf(drawing)-1]
                            .translateDrawing(motionTouchEventX - currentX,
                                motionTouchEventY - currentY)
                    }
                }
                else if (drawing is EllipseDrawing){
                    if(drawing.getStyle() == Style.STYLE3){
                        DrawViewService.view
                            .getDrawings()[DrawViewService.view.getDrawings().indexOf(drawing)-1]
                            .translateDrawing(motionTouchEventX - currentX,
                                motionTouchEventY - currentY)
                    }
                }
            }
        }
        else if(isResize){
            when(indexHandle){
                0 -> leftHandleResize(currentX)
                1 -> topHandleResize(currentY)
                2 -> rightHandleResize(currentX)
                3 -> bottomHandleResize(currentY)
            }
        }

        currentX = motionTouchEventX
        currentY = motionTouchEventY

        view.invalidate()

    }

    fun leftHandleResize(currentLeft: Float){

        val selection = ToolManager.getCurrentSelection().getSelection()

        var drawing = ToolManager.getCurrentSelection()

        drawing.resize(currentLeft ,selection!!.start.y, selection!!.end.x, selection!!.end.y)

        if(drawing is RectangleDrawing || drawing is EllipseDrawing){
            var container = DrawViewService.view.getDrawings()[DrawViewService.view.getDrawings().indexOf(drawing)-1]
            container.resize(currentLeft ,selection!!.start.y, selection!!.end.x, selection!!.end.y)
        }

    }

    fun topHandleResize(currentTop: Float){
        val selection = ToolManager.getCurrentSelection().getSelection()

        var drawing = ToolManager.getCurrentSelection()

        drawing.resize(selection!!.start.x , currentTop, selection!!.end.x, selection!!.end.y)

        if(drawing is RectangleDrawing || drawing is EllipseDrawing){
            var container = DrawViewService.view.getDrawings()[DrawViewService.view.getDrawings().indexOf(drawing)-1]
            container.resize(selection!!.start.x , currentTop, selection!!.end.x, selection!!.end.y)
        }
    }

    fun rightHandleResize(currentRight: Float){
        val selection = ToolManager.getCurrentSelection().getSelection()

        var drawing = ToolManager.getCurrentSelection()

        drawing.resize(selection!!.start.x , selection!!.start.y, currentRight, selection!!.end.y)

        if(drawing is RectangleDrawing || drawing is EllipseDrawing){
            var container = DrawViewService.view.getDrawings()[DrawViewService.view.getDrawings().indexOf(drawing)-1]
            container.resize(selection!!.start.x , selection!!.start.y, currentRight, selection!!.end.y)
        }
    }

    fun bottomHandleResize(currentBottom: Float){
        val selection = ToolManager.getCurrentSelection().getSelection()

        var drawing = ToolManager.getCurrentSelection()

        drawing.resize(selection!!.start.x ,selection!!.start.y , selection!!.end.x, currentBottom)

        if(drawing is RectangleDrawing || drawing is EllipseDrawing){
            var container = DrawViewService.view.getDrawings()[DrawViewService.view.getDrawings().indexOf(drawing)-1]
            container.resize(selection!!.start.x ,selection!!.start.y , selection!!.end.x, currentBottom)
        }
    }

    override fun onTouchUp(view: DrawView) {
        if(isFinish){
            ToolManager.getCurrentSelection().setIsSelection(false)
            if(selectionType != 0)
            {
                ToolManager.switchFromSelectionToOldTool()
            }
        }
        resetTool()
        view.invalidate()
    }

    fun setSelectionType(type : Int) {
        selectionType = type
    }

    override fun resetTool() {
        motionTouchEventX = 0f
        motionTouchEventY = 0f

        currentX = 0f
        currentY = 0f

        isTranslate = false
        isResize = false
        isFinish = false
    }

    override fun getPaint(): Paint {
       return Paint()
    }

    override fun sendDrawingToSocket(width: Int, height: Int) {

    }

    fun findSelection(): Boolean {
        val drawings : ArrayList<ADrawing> = DrawViewService.view.getDrawings()
        for( i in drawings.lastIndex downTo  0){
            val selection = drawings[i].getSelection()
            if(selection!=null && motionTouchEventX > selection.start.x && motionTouchEventX < selection.end.x &&
                motionTouchEventY > selection.start.y && motionTouchEventY < selection.end.y){
                ToolManager.setCurrentSelection(drawings[i])
                ToolManager.getCurrentSelection().getSelection()
                ToolManager.getCurrentSelection().setIsSelection(true)
                DrawViewService.view.invalidate()
                return true;

            }
        }
        return false
    }

    fun findOnHandle(handles : ArrayList<Point>): Point? {
        for(point in handles){
            if(motionTouchEventX > point.x - 5F && motionTouchEventY > point.y -5F
                && motionTouchEventX < point.x + 5F && motionTouchEventY < point.y + 5F
            )
                return point
        }
        return null
    }



}
