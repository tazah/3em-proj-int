package com.example.client_leger.drawings

import android.graphics.*

class Point(x: Float, y: Float){
    var x = x
    var y = y
}

class Selection(startPoint: Point, endPoint: Point){
    var start = startPoint
    var end = endPoint
}


class PencilDrawing(points: ArrayList<Point>,paint: Paint,originHeight: Int, originWidth: Int) : ADrawing(originHeight, originWidth) {

    private val paint: Paint = paint
    private var points: ArrayList<Point> = ArrayList(points)


    override fun draw(canvas: Canvas?) {
        if(canvas != null){
            if(path.isEmpty){
                var ratios = calculateScaleRatio(canvas)
                for(i in 0 until points.size-1){
                    if(i==0){
                        path.moveTo(points[0].x*ratios.second, points[0].y*ratios.first)
                    }
                    path.quadTo(points[i].x*ratios.second,
                        points[i].y*ratios.first,
                        (points[i+1].x+points[i].x)*ratios.second/2,
                        (points[i+1].y+points[i].y)*ratios.first/2
                    )
                }
            }
            canvas.drawPath(path, paint)
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

}
