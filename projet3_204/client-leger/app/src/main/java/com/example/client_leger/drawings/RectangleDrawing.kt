package com.example.client_leger.drawings

import android.graphics.*
import com.example.client_leger.Style

class RectangleDrawing(start: Point, endPoint: Point, paint: Paint, style: Style, originHeight: Int, originWidth: Int) : ADrawing(originHeight, originWidth) {

    private val paint: Paint = paint
    private var startPoint: Point = Point(start.x,start.y)
    private var endPoint: Point = Point(endPoint.x,endPoint.y)
    private var style: Style = style


    override fun draw(canvas: Canvas?) {
        if(canvas != null){
            if(path.isEmpty) {
                val ratios = calculateScaleRatio(canvas)
                if (endPoint.x < startPoint.x) {
                    val tmp = endPoint.x
                    endPoint.x = startPoint.x
                    startPoint.x = tmp
                }
                if (endPoint.y < startPoint.y) {
                    val tmp = endPoint.y
                    endPoint.y = startPoint.y
                    startPoint.y = tmp
                }

                path.addRect(
                    RectF(
                        startPoint.x * ratios.second,
                        startPoint.y * ratios.first,
                        endPoint.x * ratios.second,
                        endPoint.y * ratios.first
                    ),
                    Path.Direction.CW
                )
            }

            canvas?.drawPath(path, paint)
            if(isSelection){
                var bounds = RectF()
                path.computeBounds(bounds, true)

                val start = Point(bounds.left,bounds.top)
                val end = Point(bounds.right,bounds.bottom)

                setSelection(start, end)

                calculateHandles(getSelection()!!)

                drawSelection(canvas, getSelection()!!)
            }
        }
    }

    fun getStyle(): Style{
        return style;
    }


    fun setEnPoint(endPoint: Point){
        this.endPoint = endPoint
    }
}
