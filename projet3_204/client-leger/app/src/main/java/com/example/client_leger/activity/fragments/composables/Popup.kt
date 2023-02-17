package com.example.client_leger.activity.fragments.composables

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.rounded.ArrowBack
import androidx.compose.material.icons.rounded.Chat
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.focusModifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.layout.VerticalAlignmentLine
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.text.toUpperCase
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.client_leger.R
import com.example.client_leger.activity.ui.theme.OrangeNet
import com.example.client_leger.activity.ui.theme.bleuMessage
import com.example.client_leger.activity.ui.theme.lightGreyCostum
import com.example.client_leger.model.Chat

@Composable
fun MessageBoxSender(name:String, message: String, time:String, avatar:String){
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.fillMaxWidth()
    ) {

            Image(

                painter = painterResource(R.drawable.avatar6),
                contentDescription = "avatar",
                contentScale = ContentScale.Crop,            // crop the image if it's not a square
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)                       // clip to the circle shape
                    .border(2.dp, Color.Green, CircleShape)   // add a border (optional)
            )
        Spacer(modifier = Modifier.width(8.dp))
            Column() {
                Text(text = name)
                Spacer(modifier = Modifier.height(2.dp))
                Surface(
                    modifier =Modifier.clip(shape = RoundedCornerShape(4.dp)),
                    shape = RoundedCornerShape(10.dp),
                    elevation = 2.dp

                ) {

                    Text(text = message,
                        modifier = Modifier
                            .background(MaterialTheme.colors.secondary)
                            .padding(all = 5.dp)
                    )
                }

                Spacer(modifier = Modifier.height(2.dp))
                Text(text = time)
            }
    }
}

@Composable
fun MessageBoxReciever(name:String, message: String, time:String, avatar:String){
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.End,
        modifier = Modifier
            .fillMaxWidth()
            .padding(4.dp)
            .clip(shape = RoundedCornerShape(4.dp))


    ) {

            Column(
                horizontalAlignment = Alignment.End

            ) {
                Text(text = name)
                Spacer(modifier = Modifier.height(2.dp))
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier
                        .padding(4.dp)
                        .clip(shape = RoundedCornerShape(4.dp)),
                    elevation = 2.dp
                ) {
                    Text(text = message,
                        modifier = Modifier
                            .background(MaterialTheme.colors.primary)
                            .padding(all = 5.dp)
                    )
                }

                Spacer(modifier = Modifier.height(2.dp))
                Text(text = time)
            }
        Spacer(modifier = Modifier.width(8.dp))
        Image(

                painter = painterResource(R.drawable.avatar6),
        contentDescription = "avatar",
        contentScale = ContentScale.Crop,            // crop the image if it's not a square
        modifier = Modifier
            .size(40.dp)
            .clip(CircleShape)                       // clip to the circle shape
            .border(2.dp, Color.Green, CircleShape)   // add a border (optional)
        )
    }
}

@Composable
fun PreviewMessage(){
    MessageBoxReciever(name = "samiHAHA", message = "salut from la tesfsdfsdfsdfsdsdf" +
        "sdfdsfsdfsdfdsfsdfdsrre", time = "10/12/2021 11h50","")
}


@Composable
fun ChatStructureCompose(){

    val textState = remember { mutableStateOf(TextFieldValue("")) }
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .fillMaxHeight(1f)
            .background(lightGreyCostum)
            .clip(shape = RoundedCornerShape(8.dp))
            .border(1.dp, Color.LightGray, shape = RoundedCornerShape(10.dp))
    ) {
//        Spacer(modifier = Modifier
//            .background(Color.Black)
//            .height(7.dp)
//        )
        Row(
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Bottom,
            modifier = Modifier
                .fillMaxHeight(0.10f)
                .fillMaxWidth()
                .background(Color.LightGray)
                .padding(10.dp)
                .clip(shape = RoundedCornerShape(8.dp))

        ) {

//            TextButton(
//                onClick = { /* Do something! */ },
//
//            ) {
//
//            }
            TextButton(onClick = { /* Do something! */ }) {
                Icon(imageVector = Icons.Rounded.ArrowBack, contentDescription = "", modifier = Modifier.width(20.dp))
                Text(text = "Retour")
            }

            Row() {
                Icon(imageVector = Icons.Rounded.Chat, contentDescription = "", modifier = Modifier.width(20.dp))
                Text(text = "Chat name", color = Color(R.color.theme1_blue))
            }


            Text(text = "               ")
        }
        Row(modifier = Modifier
            .fillMaxWidth()
            .fillMaxHeight(0.88f)
            .background(Color.White)
            .padding(5.dp)
            ){
            Column() {
                MessageBoxReciever(name = "sami", message = "salut frefrfer fer rff fr man", time = "20/23/1997 15:30:15", avatar ="sdfsdfs" )
                MessageBoxSender(name = "sami", message = "salut mdsdsfdsfsdfdfdsfdsf dfhdsfhsdbfsd dsfjfkjdshfds skjfhsdjhfkfsdan", time = "20/23/1997 15:30:15", avatar ="sdfsdfs" )
                MessageBoxReciever(name = "sami", message = "salut man", time = "20/23/1997 15:30:15", avatar ="sdfsdfs" )
                MessageBoxSender(name = "sami", message = "salut man", time = "20/23/1997 15:30:15", avatar ="sdfsdfs" )
                MessageBoxReciever(name = "sami", message = "salut man", time = "20/23/1997 15:30:15", avatar ="sdfsdfs" )
            }
//

        }
//        Spacer(modifier = Modifier
//            .background(Color.Black)
//            .height(7.dp))
        Row(modifier = Modifier
            .fillMaxHeight(1f)
            .fillMaxWidth()
            .background(Color.White)
            .padding(5.dp, bottom = 15.dp))
        {
            TextField(
                value = textState.value,
                onValueChange = { value ->

                    textState.value = value
                },
                label = {
                    Text(text = "Ecrivez message...")
                },
                modifier = Modifier
                    .width(500.dp),

                textStyle = TextStyle(color = Color.Black, fontSize = 18.sp),
                leadingIcon = {
                    Icon(
                        Icons.Default.Textsms,
                        contentDescription = "",
                        modifier = Modifier
                            .padding(17.dp)
                            .size(24.dp)
                    )
                },
                trailingIcon = {
                    IconButton(onClick = {

                    }) {
                        Icon(imageVector = Icons.Filled.Send, contentDescription = "")
                    }

                },

                shape = RoundedCornerShape(20.dp),
                colors = TextFieldDefaults.textFieldColors(
                    textColor = Color.White,
                    cursorColor = Color.DarkGray,
                    leadingIconColor = Color(R.color.theme1_blue),
                    trailingIconColor = Color(R.color.theme1_blue),
                    backgroundColor = Color.LightGray,
                    focusedIndicatorColor = Color.Transparent,
                    unfocusedIndicatorColor = Color.Transparent,
                    disabledIndicatorColor = Color.Transparent
                )
            )
        }
        Spacer(modifier = Modifier
            .background(Color.Black)
            .height(15.dp))
    }
}


//@Preview
@Composable
fun ChatComposable(){
    Column(
        modifier = Modifier.fillMaxWidth()
    ) {
        MessageBoxReciever(name = "sami", message = "salut frefrfer fer rff fr man", time = "20/23/1997 15:30:15", avatar ="sdfsdfs" )
        MessageBoxSender(name = "sami", message = "salut man", time = "20/23/1997 15:30:15", avatar ="sdfsdfs" )
        MessageBoxReciever(name = "sami", message = "salut man", time = "20/23/1997 15:30:15", avatar ="sdfsdfs" )
        MessageBoxSender(name = "sami", message = "salut man", time = "20/23/1997 15:30:15", avatar ="sdfsdfs" )
        MessageBoxReciever(name = "sami", message = "salut man", time = "20/23/1997 15:30:15", avatar ="sdfsdfs" )
    }

}
