package com.example.client_leger

import android.content.Context
import android.graphics.*
import android.util.AttributeSet
import android.util.Log
import android.view.MotionEvent
import android.view.View
import android.view.ViewConfiguration
import androidx.core.content.res.ResourcesCompat
import com.example.client_leger.drawings.ADrawing
import com.example.client_leger.tools.ToolManager
import kotlin.properties.Delegates


private const val STROKE_WIDTH = 12f

class DrawView @JvmOverloads constructor(context: Context,
                                         attrs: AttributeSet? = null, defStyleAttr: Int = 0)
    : View(context, attrs, defStyleAttr) {

    private val drawColor = ResourcesCompat.getColor(resources, R.color.black, null)
    private val backgroundColor = ResourcesCompat.getColor(resources, R.color.white, null)
    private lateinit var previewCanvas: Canvas
    private lateinit var previewBitmap: Bitmap
    private lateinit var frame: Rect
    private var drawings : ArrayList<ADrawing> = ArrayList()
    private var currentDrawing : ArrayList<ADrawing> = ArrayList()

    private val paint = Paint().apply {
        color = drawColor
        isAntiAlias = true
        isDither = true
        style = Paint.Style.STROKE // default: FILL
        strokeJoin = Paint.Join.ROUND // default: MITER
        strokeCap = Paint.Cap.ROUND // default: BUTT
        strokeWidth = STROKE_WIDTH // default: Hairline-width (really thin)
    }

    private val cleatPaint = Paint().apply {
        xfermode = PorterDuffXfermode(PorterDuff.Mode.CLEAR)
    }

    private val touchTolerance = ViewConfiguration.get(context).scaledTouchSlop

   /* override fun onSizeChanged(width: Int, height: Int, oldWidth: Int, oldHeight: Int) {
        super.onSizeChanged(width, height, oldWidth, oldHeight)

        if (::previewBitmap.isInitialized) previewBitmap.recycle()
        previewBitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)
        previewCanvas = Canvas(previewBitmap)
        previewCanvas.drawColor(backgroundColor)

        // Calculate a rectangular frame around the picture.
        val inset = 0
        frame = Rect(inset, inset, width - inset, height - inset)
    }*/


    // Called when the view should render its content.
    override fun onDraw(canvas: Canvas?) {
        //canvas?.drawBitmap(previewBitmap, 0f, 0f, null)
        for(element in drawings){
            element.draw(canvas)
        }
        for(element in currentDrawing){
            element.draw(canvas)
        }
        //previewCanvas.drawRect(frame, paint)
    }

    override fun onTouchEvent(event: MotionEvent?): Boolean {

        if (event != null) {
            ToolManager.getCurrentTool().onTouch(event)
            when(event.action){
                MotionEvent.ACTION_DOWN -> onTouchDown()
                MotionEvent.ACTION_MOVE -> onTouchMove()
                MotionEvent.ACTION_UP -> onTouchUp()
            }
        }
        return true

    }

    private fun onTouchUp() {
        ToolManager.getCurrentTool().onTouchUp(this)
    }

    private fun onTouchMove() {
        ToolManager.getCurrentTool().onTouchMove(touchTolerance,this)
    }

    private fun onTouchDown() {
        ToolManager.getCurrentTool().onTouchDown()
    }

    fun addToDrawing(drawing: ADrawing){
        drawings.add(drawing)
    }

    fun getLastDrawings(): ADrawing{
        return drawings.get(drawings.size-1)
    }

    fun addCurrToDrawing(){
        for(element in currentDrawing){
            drawings.add(element)
        }
    }

    fun setCurPath(currentDrawing: ADrawing){
        this.currentDrawing.add(currentDrawing)
    }

    fun getDrawings(): ArrayList<ADrawing>{
        return drawings
    }

    fun resetCurPath() {
        currentDrawing.clear()
    }
}
