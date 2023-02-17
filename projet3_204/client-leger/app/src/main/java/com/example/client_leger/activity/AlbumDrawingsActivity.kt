package com.example.client_leger.activity

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.client_leger.AlbumAndDrawing
import com.example.client_leger.Movement
import com.example.client_leger.R
import com.example.client_leger.SocketService
import com.example.client_leger.adapter.AlbumViewModel
import com.example.client_leger.model.Drawing
import com.example.client_leger.model.LightDrawing
import com.example.client_leger.model.OtherAlbum
import com.google.gson.Gson
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class AlbumDrawingsActivity : AppCompatActivity() {
    private val albumViewModel by viewModels<AlbumViewModel>()
    private var currentAlbumId:String by mutableStateOf("")
    private var currentAlbumName:String by mutableStateOf("")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        SocketService.socket.on("sucess join"){(currentCollabRoom) ->
            Log.d("recieves current collab",currentCollabRoom.toString())
            SocketService.currentCollabRoom= currentCollabRoom as Int
            //  Log.d("previousMouvement",previousMouvements.toString())
        }
        AlbumAndDrawing.currentAlbum.id?.let {
            albumViewModel.getCurrentAlbum(
                it
            )
        }
        currentAlbumId = intent.getStringExtra("currentAlbumId").toString()
        setContent{
            AlbumDrawingsPage(albumViewModel.currentAlbumReponse, albumViewModel,currentAlbumName)

            currentAlbumId= albumViewModel.currentAlbumReponse.name.toString()
        }
    }
}



@Composable
fun AlbumDrawingsPage(albumList: OtherAlbum, albumViewModel: AlbumViewModel, currentAlbumName:String) {
    Scaffold(

        topBar = { TopAppBarComposeAlbumDrawing() },
        floatingActionButton = {
            FloatingActionButton(onClick = { /*TODO*/ }) {

                Icon(
                    Icons.Filled.Chat, contentDescription = null,
                )

            }
        },
        content = {ContentScaffoldComposeInDrawingActivity(albumList,albumViewModel, currentAlbumName)},
//        bottomBar ={ BottomAppBarCompose () },

    )
}





@Composable
fun TopAppBarComposeAlbumDrawing () {
    var showMenu by remember { mutableStateOf ( false) }
    val context = LocalContext.current
    TopAppBar(title = {
        Text(
            text="PolyPaint",
            fontSize = 20.sp,
            maxLines=1,
            overflow = TextOverflow.Ellipsis,
        )


    }, actions = {
        Image(

            painter = painterResource(R.drawable.avatar6),
            contentDescription = "avatar",
            contentScale = ContentScale.Crop,            // crop the image if it's not a square
            modifier = Modifier
                .size(40.dp)
                .clip(CircleShape)                       // clip to the circle shape
                .border(2.dp, Color.Green, CircleShape)   // add a border (optional)
        )
        IconButton(onClick = {showMenu=!showMenu}) {
            Icon(Icons.Default.MoreVert, contentDescription = null)
        }

        DropdownMenu(
            expanded = showMenu,
            onDismissRequest = { showMenu= false },
            modifier = Modifier.wrapContentSize()
        ) {
            DropdownMenuItem(onClick = {


            }) {
                Icon(Icons.Default.Home, contentDescription = null)
                Text("Accueil")
            }
            DropdownMenuItem(onClick = {


            }) {
                Icon(Icons.Default.Person, contentDescription = null)
                Text("Profile")
            }
            DropdownMenuItem(onClick = {


            }) {
                Icon(Icons.Default.Settings, contentDescription = null)
                Text("Paramètre")
            }
            DropdownMenuItem(onClick = {

                val intent = Intent(context, LoginActivity::class.java)
                context.startActivity(intent)
            }) {
                Icon(Icons.Default.Logout, contentDescription = null)
                Text("Déconnexion")
            }


        }


    })
}


@Composable
fun ContentScaffoldComposeInDrawingActivity (album: OtherAlbum, albumViewModel: AlbumViewModel, currentAlbumName:String) {

    Row(
        modifier = Modifier
            .fillMaxHeight()
            .fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Column(
            modifier = Modifier
                .width(800.dp)
                .fillMaxHeight()
        ) {
            CrudBarDrawingsActivity(albumViewModel,album,currentAlbumName = currentAlbumName)
            DrawingLazyColum(album,albumViewModel)
        }
        Column(
            modifier = Modifier
                .width(466.66.dp)
                .background(color = Color.Blue)
                .fillMaxHeight()
        ) {
            Text(text = "Column2")

        }
    }
}





@Composable
fun ShowEditDrawingDialag(visible:MutableState<Boolean>, albumViewModel:AlbumViewModel, lightDrawing: LightDrawing){
    var albumName:MutableState<String> = remember { mutableStateOf( "") }
    var enableButton :MutableState<Boolean> = remember { mutableStateOf( false) }
    val context = LocalContext.current
    if (visible.value){
        AlertDialog(
            onDismissRequest = {
                visible.value=false
                enableButton.value=false
                albumName.value =""
            },
            dismissButton = {
                Button(
                    onClick = {
                        enableButton.value=false
                        albumName.value =""
                        visible.value=false
                    },
                    modifier = Modifier
                        .padding(8.dp)
                        .background(
                            color = Color.Green
                        )) {
                    Row {
                        Icon(
                            imageVector = Icons.Default.Cancel,
                            contentDescription = null,
                            modifier = Modifier.padding(end = 4.dp)

                        )
                        Text(text = "Annuler")
                    }

                }
            },
            confirmButton = {

                Button(
                    enabled = enableButton.value,
                    onClick = {
                        enableButton.value=false
                        visible.value=false


//                        albumViewModel.updateAnAlbum(album.id!!,albumName.value)
//                        if (albumViewModel.updateAlbumResponse==200) {
//                            Toast.makeText(context, "L'album a été modifié avec succès !!!!"+albumViewModel.updateAlbumResponse ,Toast.LENGTH_SHORT).show()
//                            albumViewModel.getAlbumList()
//
//                        }else if (albumViewModel.updateAlbumResponse==204){
//                            Toast.makeText(context, "L'album n'a pas été trouvé, car un problème est survenu !!",Toast.LENGTH_SHORT).show()
//                        }else if (albumViewModel.updateAlbumResponse==404){
//                            Toast.makeText(context, "L'album n'a pas été trouvé, car un problème est survenu !!",Toast.LENGTH_SHORT).show()
//                        }

                    },
                    modifier = Modifier
                        .padding(8.dp)
                        .background(
                            color = Color.Green
                        )) {
                    Row {
                        Icon(
                            imageVector = Icons.Default.Save,
                            contentDescription = null,
                            modifier = Modifier.padding(end = 4.dp)
                        )
                        Text(text = "Enregistrer")
                    }
                }
            },
            title = { Text(text = "Modifier un album")},
            text ={
                Column() {
                    Text(text = "Entrez le nouveau nom de l'album ")
                    MyCostumTextFieldDrawings(albumName,enableButton)
                }


            }
        )
    }
}




@Composable
fun CrudBarDrawingsActivity (albumViewModel: AlbumViewModel,album: OtherAlbum, currentAlbumName:String) {
    val textState = remember { mutableStateOf(TextFieldValue("")) }
    val visible:MutableState<Boolean> = remember { mutableStateOf(false)}
    ShowDialagToAddDrawing(visible = visible, albumViewModel)
    Spacer(modifier = Modifier.height(30.dp))
    Column(
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier =Modifier.fillMaxWidth()
    ) {
        Row() {
            SearchDrawingsBar(textState)
            Button(
                onClick = {},

                modifier = Modifier
                    .padding(8.dp)
                    .background(
                        color = Color.Green
                    )) {
                Row {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = null,
                        modifier = Modifier.padding(end = 4.dp)

                    )
                    Text(text = "Chercher")
                }

            }
        }

    }
    Spacer(modifier = Modifier.height(30.dp))

    Column(
        verticalArrangement = Arrangement.Bottom,
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier =Modifier.fillMaxWidth()
    ) {
        Row (
            modifier =Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Bottom

        ){
            Text(text = AlbumAndDrawing.currentAlbum.name.toString(),
                Modifier.padding(start = 24.dp),
                fontWeight = FontWeight.Bold,fontSize = 30.sp
            )
            Button(
                onClick = {
                    visible.value=true
                },

                modifier = Modifier
                    .padding(end = 12.dp)
                    .background(
                        color = Color.Green
                    )) {
                Row {
                    Icon(
                        imageVector = Icons.Default.Add,
                        contentDescription = null,
                        modifier = Modifier.padding(end = 4.dp)

                    )
                    Text(text = "Ajouter")
                }

            }
        }
    }


}


@Composable
fun SearchDrawingsBar(state: MutableState<TextFieldValue>) {
    TextField(
        value = state.value,
        onValueChange = { value ->

            state.value = value
        },
        label = {
            Text(text = "Chercher un album")
        },
        modifier = Modifier
            .width(500.dp),

        textStyle = TextStyle(color = Color.White, fontSize = 18.sp),
        leadingIcon = {
            Icon(
                Icons.Default.Search,
                contentDescription = "",
                modifier = Modifier
                    .padding(15.dp)
                    .size(24.dp)
            )
        },
        trailingIcon = {
            if (state.value != TextFieldValue("")) {
                IconButton(
                    onClick = {
                        state.value =
                            TextFieldValue("")
                    }
                ) {
                    Icon(
                        Icons.Default.Close,
                        contentDescription = "",
                        modifier = Modifier
                            .padding(15.dp)
                            .size(24.dp)
                    )
                }
            }
        },
        singleLine = true,
        shape = RoundedCornerShape(10.dp),
        colors = TextFieldDefaults.textFieldColors(
            textColor = Color.White,
            cursorColor = Color.White,
            leadingIconColor = Color.White,
            trailingIconColor = Color.White,
            backgroundColor = Color.LightGray,
            focusedIndicatorColor = Color.Transparent,
            unfocusedIndicatorColor = Color.Transparent,
            disabledIndicatorColor = Color.Transparent
        )
    )
}




@Composable
fun MyCostumTextFieldDrawings(myAlbumName:MutableState<String>, enableButton:MutableState<Boolean>){

    Spacer(modifier = Modifier
        .padding(4.dp)
        .height(8.dp))
    var text by remember { mutableStateOf( "") }

//    var showError by remember { mutableStateOf(false) }
    OutlinedTextField(
        value= text,
        onValueChange =  { newText ->
            text= newText
//            showError = isValidEmail(text)

            myAlbumName.value=text
            if (text.length>=6 && text.length<=15 ){
                enableButton.value=true
            }else {
                enableButton.value=false
            }
        },

        label = {
            Text(text = "Nom de l'album")
        },
        leadingIcon = {
            IconButton(onClick = { /*TODO*/ }) {
                Icon(imageVector = Icons.Filled.Folder, contentDescription = "AlbumXY")

            }
        },

        keyboardOptions = KeyboardOptions(
            keyboardType = KeyboardType.Text,
            imeAction = ImeAction.Done
        ),
        keyboardActions = KeyboardActions(
            onDone = {

            }
        ),
        singleLine = true
        ,
        trailingIcon = {
            IconButton(onClick = {
                text=""
                enableButton.value=false
                myAlbumName.value=""
            }) {
                Icon(imageVector = Icons.Filled.Cancel, contentDescription = "")
            }

        }

    )
    Spacer(modifier = Modifier.height(4.dp))
    if (text.length>15) {
        Text("Attention!! Le nom de l'album ne doit pas contenir plus de 15 caractère",color=Color.Red)
    }
//    if (showError==true) {
//        Text("Attention!! Le nom de l'album ne doit pas contenir de caractères spéciaux $%*?!...",color=Color.Red)
//    }
}






@Composable
fun DrawingItem(drawingLight: LightDrawing, albumViewModel: AlbumViewModel) {
    val context = LocalContext.current
    val visible:MutableState<Boolean> = remember { mutableStateOf(false)}
    ShowEditDrawingDialag(visible =visible , albumViewModel =albumViewModel, lightDrawing = drawingLight)
    Card(
        elevation=7.dp,
        shape = RoundedCornerShape(10.dp),
    ) {

        Row(
            modifier = Modifier
                .background(Color.LightGray)
                .fillMaxWidth()
                .padding(8.dp)
                .border(0.01.dp, Color.LightGray),


            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
            ) {

                Image(
                    painter = painterResource(R.drawable.avatar1),
                    contentDescription = "avatar",
                    contentScale = ContentScale.Crop,            // crop the image if it's not a square
                    modifier = Modifier
                        .size(60.dp)
                        .clip(RoundedCornerShape(percent = 10))                       // clip to the circle shape
                        .border(1.dp, Color.Green, RoundedCornerShape(percent = 10))   // add a border (optional)
                )
                Column(
                    modifier=Modifier.padding(2.dp)
                ) {
                    Text(
                        text = "${drawingLight.drawingName}",
                        color = Color.Black,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "${drawingLight.dateOfCreation}",
                        color = Color.Black,
                        fontWeight = FontWeight.Normal
                    )
                    Text(
                        text ="${drawingLight.owner}",
                        color = Color.Black,
                        fontWeight = FontWeight.Normal
                    )
                }

            }
            IconButton(onClick = {
                visible.value=true
            }) {
                Icon(Icons.Default.Edit, contentDescription = null)
            }
            IconButton(onClick = {
//                albumViewModel.
//                if (albumViewModel.deltedAlbumResponse) {
//                    Toast.makeText(context, "L'album "+album.name+ " a été  supprimé avec Succèe",
//                        Toast.LENGTH_SHORT).show()
//                    albumViewModel.getAlbumList()
//                }else Toast.makeText(context, "L'album n'a pas été supprimé, car un problème est survenu !!",
//                    Toast.LENGTH_SHORT).show()

            }) {
                Icon(Icons.Default.Delete, contentDescription = null)
            }

            Row{
                Image(

                    painter = painterResource(R.drawable.avatar1),
                    contentDescription = "avatar",
                    contentScale = ContentScale.Crop,            // crop the image if it's not a square
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)                       // clip to the circle shape
                        .border(2.dp, Color.Green, CircleShape)   // add a border (optional)
                )
                Image(

                    painter = painterResource(R.drawable.avatar2),
                    contentDescription = "avatar",
                    contentScale = ContentScale.Crop,            // crop the image if it's not a square
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)                       // clip to the circle shape
                        .border(2.dp, Color.Green, CircleShape)   // add a border (optional)
                )
                Image(

                    painter = painterResource(R.drawable.avatar3),
                    contentDescription = "avatar",
                    contentScale = ContentScale.Crop,            // crop the image if it's not a square
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)                       // clip to the circle shape
                        .border(2.dp, Color.Green, CircleShape)   // add a border (optional)
                )
                Image(

                    painter = painterResource(R.drawable.avatar4),
                    contentDescription = "avatar",
                    contentScale = ContentScale.Crop,            // crop the image if it's not a square
                    modifier = Modifier
                        .size(40.dp)
                        .clip(CircleShape)                       // clip to the circle shape
                        .border(2.dp, Color.Green, CircleShape)   // add a border (optional)
                )
            }

            Button(
                onClick = {
                    val intent = Intent(context, MainActivity::class.java)
                    intent.putExtra("currentSocketIndex", drawingLight.socketIndex)
                    intent.putExtra("currentDrawingName", drawingLight.drawingName)
                    SocketService.currentCollabRoom=drawingLight.socketIndex!!

                    SocketService.socket.emit("join collab Room",
                        SocketService.userName,drawingLight.socketIndex)
                    context.startActivity(intent)
//                    albumViewModel.getCurrentAlbumByIndex(SocketService.currentCollabRoom)
                },

                modifier = Modifier
                    .padding(end = 12.dp)
                    .background(
                        color = Color.Green
                    )) {

                    Text(text = "Rejoindre")
                }

            }



        }
    }





@Composable
fun DrawingLazyColum(albumData: OtherAlbum,albumViewModel: AlbumViewModel) {

    LazyColumn(
        contentPadding = PaddingValues(
            start = 24.dp, end=12.dp,
            top= 20.dp, bottom=45.dp),
        verticalArrangement = Arrangement.spacedBy(6.dp)


    ) {

        albumData.drawings?.let {
            items(it.toList()) { itemLightDrawing ->
                DrawingItem(itemLightDrawing, albumViewModel)
            }
        }
    }

}


@Composable
fun ShowDialagToAddDrawing(visible:MutableState<Boolean>, albumViewModel:AlbumViewModel){
    var albumName:MutableState<String> = remember { mutableStateOf( "") }
    var enableButton :MutableState<Boolean> = remember { mutableStateOf( false) }
    val context = LocalContext.current
    if (visible.value){
        AlertDialog(
            onDismissRequest = {
                visible.value=false
                enableButton.value=false
                albumName.value =""
            },
            dismissButton = {
                Button(
                    onClick = {
                        enableButton.value=false
                        albumName.value =""
                        visible.value=false
                    },
                    modifier = Modifier
                        .padding(8.dp)
                        .background(
                            color = Color.Green
                        )) {
                    Row {
                        Icon(
                            imageVector = Icons.Default.Cancel,
                            contentDescription = null,
                            modifier = Modifier.padding(end = 4.dp)

                        )
                        Text(text = "Annuler")
                    }

                }
            },
            confirmButton = {

                Button(
                    enabled = enableButton.value,
                    onClick = {
                        enableButton.value=false
                        visible.value=false

                        val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS")
                        val current = LocalDateTime.now()
                        val formatted = current.format(formatter).toString()
//                        var albumToAdd=OtherAlbum(false,albumName.value,"avatar","samiHAHA",formatted )
//                        albumViewModel.addNewAlbum(albumToAdd)
//                        if (albumViewModel.addNewAlbumResponse) {
//                            Toast.makeText(context, "L'album "+ albumName.value + " a été  ajouté avec Succèe !!!!" ,Toast.LENGTH_SHORT).show()
//                            albumViewModel.getAlbumList()
//                        }else Toast.makeText(context, "L'album n'a pas été ajouté, un problème est survenu !!",Toast.LENGTH_SHORT).show()
                        var gson = Gson()
                        var drawingToAdd = Drawing(albumName.value,SocketService.userName, formatted,-1, ArrayList<Movement>())
                        SocketService.socket.emit("create Collaboration Room",SocketService.userName,gson.toJson(drawingToAdd),AlbumAndDrawing.currentAlbum.name)

                        val intent = Intent(context, MainActivity::class.java)
                        context.startActivity(intent)

                    },
                    modifier = Modifier
                        .padding(8.dp)
                        .background(
                            color = Color.Green
                        )) {
                    Row {
                        Icon(
                            imageVector = Icons.Default.Save,
                            contentDescription = null,
                            modifier = Modifier.padding(end = 4.dp)

                        )
                        Text(text = "Enregistrer")
                    }

                }


            },
            title = { Text(text = "Créer un nouvel album")},
            text ={
                Column() {
                    Text(text = "Entrez le nom de l'album que vous souhaitez créer")
                    MyCostumTextFieldDrawings(albumName,enableButton)
                }


            }
        )
    }
}
