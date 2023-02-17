package com.example.client_leger.drawings

import android.graphics.*

abstract class ADrawing(originHeight: Int, originWidth: Int)  {
    private var originHeight: Int = originHeight;
    private var originWidth: Int = originWidth;
    private var handles:ArrayList<Point> = ArrayList()
    private lateinit var selection : Selection
    protected var isSelection: Boolean = false
    protected var path: Path = Path()

    fun calculateScaleRatio(canvas: Canvas): Pair<Float, Float>{
        var ratioH = canvas.height.toFloat()/originHeight.toFloat()
        var ratioW = canvas.width.toFloat()/originWidth.toFloat()

        return Pair(ratioH,ratioW)

    }

    fun getHandles(): ArrayList<Point> {
        return handles
    }

    fun calculateHandles(selection: Selection){
        if(!handles.isEmpty()){
            handles.clear()
        }

        //right
        var center : Point = Point(selection!!.start.x, (selection!!.start.y+ selection!!.end.y)/2F)

        handles.add(Point(center.x, center.y))

        //top
        center = Point((selection!!.start.x+ selection!!.end.x)/2F, selection!!.start.y)

        handles.add(Point(center.x, center.y))

        //left
        center = Point(selection!!.end.x, (selection!!.start.y+ selection!!.end.y)/2F)

        handles.add(Point(center.x, center.y))

        //bottom
        center = Point((selection!!.start.x+ selection!!.end.x)/2F, selection!!.end.y)

        handles.add(Point(center.x, center.y))
    }

    fun drawHandlesSelection(canvas: Canvas, selection: Selection) {

        for(point in handles){
            drawAhandle(Point(point.x, point.y), canvas)
        }
    }

    fun drawSelection(canvas: Canvas, selection: Selection) {

        var selectPaint: Paint = Paint().apply {
            color = 0xFF000000.toInt()
            isAntiAlias = true
            isDither = true
            style = Paint.Style.STROKE
            strokeJoin = Paint.Join.ROUND
            strokeCap = Paint.Cap.ROUND
            strokeWidth = 1F
        }

        var path = Path()

        path.addRect(RectF(
            selection!!.start.x,
            selection!!.start.y,
            selection!!.end.x ,
            selection!!.end.y),
            Path.Direction.CW)
        canvas.drawPath(path, selectPaint)
        path.reset()

        drawHandlesSelection(canvas, selection)

    }

    private fun drawAhandle(
        center: Point,
        canvas: Canvas,
    ) {

        var selectHandles: Paint = Paint().apply {
            color = 0xFFFFFFFF.toInt()
            isAntiAlias = true
            isDither = true
            style = Paint.Style.FILL_AND_STROKE
            strokeJoin = Paint.Join.ROUND
            strokeCap = Paint.Cap.ROUND
            strokeWidth = 5F
        }

        var path = Path()

        path.addRect(
            RectF(
                center.x - selectHandles.strokeWidth,
                center.y - selectHandles.strokeWidth,
                center.x + selectHandles.strokeWidth,
                center.y + selectHandles.strokeWidth
            ),
            Path.Direction.CW
        )
        canvas.drawPath(path, selectHandles)

        selectHandles.color = 0xFF000000.toInt()
        selectHandles.style = Paint.Style.STROKE

        path.reset()

        path.addRect(
            RectF(
                center.x - selectHandles.strokeWidth,
                center.y - selectHandles.strokeWidth,
                center.x + selectHandles.strokeWidth,
                center.y + selectHandles.strokeWidth
            ),
            Path.Direction.CW
        )
        canvas.drawPath(path, selectHandles)

        path.reset()
    }

   fun translateDrawing(dx: Float, dy: Float) {
        var matrix = Matrix()

        matrix.postTranslate(dx, dy)
        path.transform(matrix)
    }

    fun resize(left: Float, top: Float, right: Float, bottom: Float) {

        var newBounds = RectF(left, top, right ,bottom)
        var srcBounds = RectF()

        path.computeBounds(srcBounds, true)

        var matrix = Matrix()
        matrix.setRectToRect(srcBounds, newBounds, Matrix.ScaleToFit.FILL)

        path.transform(matrix)
    }

    fun getSelection(): Selection?{
        if(this::selection.isInitialized){
            return selection!!
        }
        return null
    }

    fun setSelection(start : Point, end: Point){
        selection = Selection(start, end)
    }


    fun setIsSelection(isSelection:Boolean){
        this.isSelection = isSelection
    }

    fun getISelection(): Boolean{
        return isSelection
    }


    abstract fun draw(canvas: Canvas?)



}
