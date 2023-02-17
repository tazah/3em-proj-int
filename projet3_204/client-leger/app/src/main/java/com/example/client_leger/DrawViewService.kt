package com.example.client_leger

import kotlin.properties.Delegates

object DrawViewService {
    lateinit var view : DrawView
    var width by Delegates.notNull<Int>()
    var height by Delegates.notNull<Int>()
}
