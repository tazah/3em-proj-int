package com.example.client_leger

import com.example.client_leger.drawings.Point

enum class Origin {
    WEB,
    MOBILE
}
enum class Type {
    PENCIL,
    RECTANGLE,
    ELLIPSE,
}
enum class Style {
    STYLE1,
    STYLE2,
    STYLE3,
}


class Movement {
    constructor(
        author: String,
        isSelected: Boolean,
        origin: Origin,
        originHeight: Int,
        originWidth: Int,
        startPoint: Point?,
        endPoint: Point?,
        path: ArrayList<Point>?,
        color: String,
        secondaryColor: String,
        type: Type,
        borderWidth: Float,
        style: Style,
    ) {
        this.author = author
        this.isSelected = isSelected
        this.origin = origin
        this.originHeight = originHeight
        this.originWidth = originWidth
        this.startPoint = startPoint
        this.endPoint = endPoint
        this.path = path
        this.color = color
        this.secondaryColor = secondaryColor
        this.type = type
        this.borderWidth = borderWidth
        this.style = style
    }



    var author: String;
    var isSelected: Boolean;
    var origin: Origin;
    var originHeight: Int;
    var originWidth: Int;
    var startPoint: Point?;
    var endPoint: Point?;
    var path: ArrayList<Point>?;
    var color: String;
    var secondaryColor: String;
    var type: Type;
    var borderWidth: Float;
    var style: Style;
}
