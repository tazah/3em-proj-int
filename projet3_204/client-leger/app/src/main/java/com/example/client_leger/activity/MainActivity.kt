package com.example.client_leger.activity

import android.app.ActionBar
import android.content.Intent
import android.graphics.Paint
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.FragmentTransaction
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.client_leger.*
import com.example.client_leger.R
import com.example.client_leger.adapter.MessageAdapter
import com.example.client_leger.drawings.*
import com.example.client_leger.model.Message
import com.example.client_leger.tools.Selection
import com.example.client_leger.tools.ToolManager
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.ktx.auth
import com.google.firebase.database.*
import com.google.firebase.ktx.Firebase
import com.google.gson.GsonBuilder
import yuku.ambilwarna.AmbilWarnaDialog

public const val RECTANGLE_TYPE = "rectangle"
public const val ELLIPSE_TYPE = "ellipse"


class MainActivity : AppCompatActivity() {

    private lateinit var messageRecyclerView: RecyclerView
    private lateinit var messageBox: EditText
    private lateinit var logOutButton: Button
    private lateinit var quitButton: Button
    private lateinit var sendButton: ImageView
    private lateinit var MessagesContainer: LinearLayout
    private lateinit var messageAdapter: MessageAdapter
    private lateinit var messageList: ArrayList<Message>
    private lateinit var auth: FirebaseAuth

    //TODO : FRAGMENT
    private lateinit var pencilButton: ImageView
    private lateinit var rectButton: ImageView
    private lateinit var ellipseButton: ImageView
    private lateinit var primaryColorButton: ImageView
    private lateinit var secondaryColor: ImageView
    private lateinit var addButton: ImageView
    private lateinit var joinButton: ImageView
    private lateinit var selectButton : ImageView

    private lateinit var toolParameter: View
    private lateinit var drawView: View

    private var isHidden: Boolean = true

    private var pencilParms: PencilParametersFragment = PencilParametersFragment()
    private var ellipseParms: FormParametersFragment = FormParametersFragment()
    private var rectangleParms: FormParametersFragment = FormParametersFragment()



    override fun onCreate(savedInstanceState: Bundle?){

        auth = Firebase.auth


        SocketService.socket.on("receiveMessage") { (message,time,sender) ->
                    val message = message as String
                    val time = time as String
                    val sender = sender as String


                    messageList.add(Message(message,sender,time)!!)

                    runOnUiThread(Runnable {
                        messageAdapter.notifyDataSetChanged()
                    })

                    messageRecyclerView.getAdapter()?.let { messageRecyclerView.smoothScrollToPosition(it.itemCount) }
        }

        SocketService.socket.on("new update"){(movement) ->
            val gson = GsonBuilder().setPrettyPrinting().create()
            val mvt: Movement = gson.fromJson(movement.toString(), Movement::class.java)
            val drawing: ADrawing

            //if(true){
                var paint = Paint().apply {
                    color = ToolManager.getCurrentTool().transformColorToARGB(mvt.color)
                    isAntiAlias = true
                    isDither = true
                    strokeJoin = Paint.Join.ROUND
                    strokeCap = Paint.Cap.ROUND
                    strokeWidth = mvt.borderWidth
                }
                when(mvt.type){
                    Type.PENCIL -> {
                        //TODO : Modifier le style comme il faut
                        paint.style = Paint.Style.STROKE
                        drawing = mvt.path?.let { PencilDrawing(it,Paint(paint), mvt.originHeight,mvt.originWidth) }!!
                        DrawViewService.view.addToDrawing(drawing)
                    }
                    Type.ELLIPSE -> {
                        //TODO : Modifier le style comme il faut
                        createEllipseDrawings(mvt, paint)
                    }
                    Type.RECTANGLE ->{
                        //TODO : Modifier le style comme il faut
                        createRectancgleDrawings(mvt, paint)
                    }

                }

           // }
            DrawViewService.view.invalidate()

        }



        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        messageRecyclerView = findViewById(R.id.chatRecylerView)
        messageBox = findViewById(R.id.messageBox)
        sendButton = findViewById(R.id.btnSend)
        logOutButton = findViewById(R.id.btnLogOut)
        quitButton = findViewById(R.id.quitButton)
        MessagesContainer = findViewById(R.id.MessagesContainer)
        messageList = ArrayList()
        messageAdapter = MessageAdapter(this,messageList,intent.getStringExtra("userName").toString())

        messageRecyclerView.layoutManager = LinearLayoutManager(this)
        messageRecyclerView.adapter = messageAdapter

        pencilButton = findViewById(R.id.btnBrush)
        rectButton = findViewById(R.id.btnRect)
        ellipseButton = findViewById(R.id.btnEllipse)

        primaryColorButton = findViewById(R.id.btnColorPick)
        secondaryColor = findViewById(R.id.btnSecondaryColorPick)
        addButton = findViewById(R.id.add)
        joinButton = findViewById(R.id.join)
        selectButton = findViewById(R.id.btnSelect)

        toolParameter = findViewById(R.id.toolParameter)

        drawView = findViewById(R.id.drawView)

        DrawViewService.view = drawView as DrawView
        DrawViewService.width = (drawView as DrawView).width
        DrawViewService.height = (drawView as DrawView).height

        setFormParmetersFragmentsArgs()

        logOutButton.setOnClickListener {
            auth.signOut()
            intent.removeExtra("userName")
            val intent = Intent(this@MainActivity, LoginActivity::class.java)
            startActivity(intent)
        }
        quitButton.setOnClickListener {
            SocketService.socket.emit(
                "leave collab",
                SocketService.currentCollabRoom, SocketService.userName
            )
            SocketService.currentCollabRoom = -1
            val intent = Intent(this@MainActivity, AlbumDrawingsActivity::class.java)
            startActivity(intent)

        }
        sendButton.setOnClickListener{
            val messageText = messageBox.text.toString()
            val message = Message(messageText, intent.getStringExtra("userName"))


            SocketService.socket.emit("onSendMessage",message.message,message.senderId)


            messageBox.setText("")
        }

        pencilButton.setOnClickListener {
            toggleToolBar()
            val ft: FragmentTransaction = supportFragmentManager.beginTransaction()
            ft.replace(R.id.toolParameter,pencilParms)
            ft.commit()
            ToolManager.getCurrentTool().resetTool()
            ToolManager.setCurrent(0)
            Toast.makeText(this@MainActivity, "Current Tool is Pencil", Toast.LENGTH_SHORT).show()
        }

        rectButton.setOnClickListener {
            toggleToolBar()
            val ft: FragmentTransaction = supportFragmentManager.beginTransaction()
            ft.replace(R.id.toolParameter, rectangleParms)
            ft.commit()
            ToolManager.getCurrentTool().resetTool()
            ToolManager.setCurrent(1)
            Toast.makeText(this@MainActivity, "Current Tool is Rectangle", Toast.LENGTH_SHORT).show()
        }

        ellipseButton.setOnClickListener {
            toggleToolBar()
            val ft: FragmentTransaction = supportFragmentManager.beginTransaction()
            ft.replace(R.id.toolParameter, ellipseParms)
            ft.commit()
            ToolManager.getCurrentTool().resetTool()
            ToolManager.setCurrent(2)

            Toast.makeText(this@MainActivity, "Current Tool is Ellipse", Toast.LENGTH_SHORT).show()
        }

        selectButton.setOnClickListener {
            ToolManager.getCurrentTool().resetTool()
            ToolManager.setCurrent(3)
            (ToolManager.getCurrentTool() as Selection).setSelectionType(0)

            Toast.makeText(this@MainActivity, "Current Tool is Select", Toast.LENGTH_SHORT).show()
        }

        //SocketService.userName = intent.getStringExtra("userName").toString()

        addButton.setOnClickListener{
            SocketService.socket.emit(
                "create Collaboration Room",
                SocketService.userName)

        }

        joinButton.setOnClickListener{
            SocketService.socket.emit("join collab Room",
                SocketService.userName ,0)
        }

        primaryColorButton.setOnClickListener{
           // object : Colo
            var dialogPrimaryColor = AmbilWarnaDialog(this,ToolManager.getCurrentPrimaryColor(), object :
                AmbilWarnaDialog.OnAmbilWarnaListener {
                override fun onCancel(dialog: AmbilWarnaDialog?) {

                }

                override fun onOk(dialog: AmbilWarnaDialog?, color: Int) {
                    ToolManager.setCurrentPrimaryColor(color)
                    primaryColorButton.setColorFilter(color)
                }

            })

            dialogPrimaryColor.show()
        }

        secondaryColor.setOnClickListener{
            var dialogSecondaryColor = AmbilWarnaDialog(this,ToolManager.getCurrentSecondaryColor(), object :
                AmbilWarnaDialog.OnAmbilWarnaListener {
                override fun onCancel(dialog: AmbilWarnaDialog?) {

                }

                override fun onOk(dialog: AmbilWarnaDialog?, color: Int) {
                    ToolManager.setSecondaryColor(color)
                    secondaryColor.setColorFilter(color)
                }

            })
            dialogSecondaryColor.show()
        }


    }

    private fun createRectancgleDrawings(mvt : Movement, paint : Paint){
        var drawing: ADrawing
        paint.strokeJoin = Paint.Join.MITER
        paint.strokeCap = Paint.Cap.SQUARE
        when(mvt.style){
            Style.STYLE1 -> {
                paint.style = Paint.Style.STROKE
                paint.color = ToolManager.getCurrentTool().transformColorToARGB(mvt.secondaryColor)
                paint.strokeWidth = mvt.borderWidth
                drawing = mvt.startPoint?.let { mvt.endPoint?.let { it1 ->
                    RectangleDrawing(it,
                        it1,Paint(paint),
                        Style.STYLE1,
                        mvt.originHeight,
                        mvt.originWidth)
                } }!!
                DrawViewService.view.addToDrawing(drawing)
            }
            Style.STYLE2 -> {
                paint.style = Paint.Style.FILL_AND_STROKE
                paint.color = ToolManager.getCurrentTool().transformColorToARGB(mvt.color)
                paint.strokeWidth = mvt.borderWidth
                drawing = mvt.startPoint?.let { mvt.endPoint?.let { it1 ->
                    RectangleDrawing(it,
                        it1,Paint(paint),Style.STYLE2, mvt.originHeight,mvt.originWidth)
                } }!!
                DrawViewService.view.addToDrawing(drawing)
            }
            Style.STYLE3 -> {

                paint.style = Paint.Style.FILL_AND_STROKE
                paint.color = ToolManager.getCurrentTool().transformColorToARGB(mvt.color)
                drawing = mvt.startPoint?.let { mvt.endPoint?.let { it1 ->
                    RectangleDrawing(
                        Point(it.x,it.y),
                        Point(it1.x,it1.y),
                        Paint(paint),
                        Style.STYLE3,
                        mvt.originHeight,
                        mvt.originWidth)
                } }!!
                DrawViewService.view.addToDrawing(drawing)

                paint.style = Paint.Style.STROKE
                paint.color = ToolManager.getCurrentTool().transformColorToARGB(mvt.secondaryColor)
                paint.strokeWidth = mvt.borderWidth
                drawing = mvt.startPoint?.let { mvt.endPoint?.let { it1 ->
                    RectangleDrawing(it,
                        it1,Paint(paint),
                        Style.STYLE3,
                        mvt.originHeight,
                        mvt.originWidth)
                } }!!
                DrawViewService.view.addToDrawing(drawing)

            }

        }
    }

    private fun createEllipseDrawings(mvt : Movement, paint : Paint){
        var drawing: ADrawing
        paint.strokeJoin = Paint.Join.ROUND
        paint.strokeCap = Paint.Cap.ROUND
        when(mvt.style){
            Style.STYLE1 -> {
                paint.style = Paint.Style.STROKE
                paint.color = ToolManager.getCurrentTool().transformColorToARGB(mvt.secondaryColor)
                drawing = mvt.startPoint?.let { mvt.endPoint?.let { it1 ->
                    EllipseDrawing(it,
                        it1,Paint(paint),
                        Style.STYLE1,
                        mvt.originHeight,mvt.originWidth)
                } }!!
                DrawViewService.view.addToDrawing(drawing)
            }
            Style.STYLE2 -> {
                paint.style = Paint.Style.FILL_AND_STROKE
                paint.color = ToolManager.getCurrentTool().transformColorToARGB(mvt.color)
                drawing = mvt.startPoint?.let { mvt.endPoint?.let { it1 ->
                    EllipseDrawing(it,
                        it1,Paint(paint),
                        Style.STYLE2,
                        mvt.originHeight,mvt.originWidth)
                } }!!
                DrawViewService.view.addToDrawing(drawing)
            }
            Style.STYLE3 -> {
                paint.color = ToolManager.getCurrentTool().transformColorToARGB(mvt.color)
                paint.style = Paint.Style.FILL_AND_STROKE
                drawing = mvt.startPoint?.let { mvt.endPoint?.let { it1 ->
                    EllipseDrawing(
                        Point(it.x,it.y),
                        Point(it1.x,it1.y),
                        Paint(paint),
                        Style.STYLE3,
                        mvt.originHeight,
                        mvt.originWidth)
                } }!!
                DrawViewService.view.addToDrawing(drawing)

                paint.style = Paint.Style.STROKE
                paint.color = ToolManager.getCurrentTool().transformColorToARGB(mvt.secondaryColor)
                drawing = mvt.startPoint?.let { mvt.endPoint?.let { it1 ->
                    EllipseDrawing(it,
                        it1,Paint(paint),
                        Style.STYLE3,
                        mvt.originHeight,mvt.originWidth)
                } }!!
                DrawViewService.view.addToDrawing(drawing)
            }

        }
    }

    private fun setFormParmetersFragmentsArgs() {
        val args1 = Bundle()
        args1.putString("formType", RECTANGLE_TYPE)
        rectangleParms.setArguments(args1)

        val args2 = Bundle()
        args2.putString("formType", ELLIPSE_TYPE)
        ellipseParms.setArguments(args2)
    }


    fun toggleToolBar(){
        if(isHidden){
            toolParameter.layoutParams = LinearLayout.LayoutParams(0, ActionBar.LayoutParams.MATCH_PARENT,0.15F)
            MessagesContainer.layoutParams = LinearLayout.LayoutParams(0, ActionBar.LayoutParams.MATCH_PARENT,0.10F)
            isHidden = false
        }else{
            toolParameter.layoutParams = LinearLayout.LayoutParams(0, ActionBar.LayoutParams.MATCH_PARENT,0F)
            MessagesContainer.layoutParams = LinearLayout.LayoutParams(0, ActionBar.LayoutParams.MATCH_PARENT,0.25F)
            isHidden = true
        }
    }

    override fun onDestroy() {
        SocketService.disconnectSocket()
        super.onDestroy()
    }

}
