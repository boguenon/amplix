var ClusterMarker_ = function(latlng, count, styles, padding) {
    var index = 0,
        dv = count,
        me = this,
        pstyle;
        
    while (dv !== 0) 
    {
        dv = parseInt(dv / 10, 10);
        index ++;
    }
    
    if (styles.length < index) 
    {
        index = styles.length;
    }
    
    pstyle = styles[index - 1];
    me.url_ = pstyle.url;
    me.height_ = pstyle.height;
    me.width_ = pstyle.width;
    me.textColor_ = pstyle.opt_textColor;
    me.anchor_ = pstyle.opt_anchor;
    me.latlng_ = latlng;
    me.index_ = index;
    me.styles_ = styles;
    me.text_ = count;
    me.padding_ = padding;
};

ClusterMarker_.prototype = new google.maps.OverlayView();

/**
 * Initialize cluster marker.
 * @private
 */
ClusterMarker_.prototype.onAdd = function () {
    var me = this,
        div = document.createElement("div"),
        latlng = me.latlng_,
        txtColor = me.textColor_ ? me.textColor_ : 'black',
        panes,
        padding;
    
    div.style.cssText = 'cursor:pointer;color:' + txtColor +  ';position:absolute;font-size:11px;' +
      'font-family:Arial,sans-serif;font-weight:bold';
    div.innerHTML = me.text_;
    
    panes = me.getPanes();
    panes.overlayLayer.appendChild(div);
    
    padding = me.padding_;
    me.div_ = div;
};


ClusterMarker_.prototype.draw = function() {
    var me = this,
        overlayProjection = me.getProjection(),
        div = me.div_,
        pos = overlayProjection.fromLatLngToDivPixel(me.latlng_),
        mstyle = "";
        
    pos.x -= parseInt(me.width_ / 2, 10);
    pos.y -= parseInt(me.height_ / 2, 10);

    if (document.all) 
    {
        mstyle = 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="' + me.url_ + '");overflow:hidden;';
    } 
    else 
    {
        mstyle = "background:url(" + me.url_ + ");overflow:hidden;background-repeat:no-repeat;";
    }
    
    mstyle += 'height:' + me.height_ + 'px;line-height:' + me.height_ + 'px;';
    mstyle += 'width:' + me.width_ + 'px;text-align:center';
    mstyle += "max-width:66px;max-height:65px;white-space:no-wrap;text-overflow:ellipsis;";
    
    div.style.cssText = mstyle + 'cursor:pointer;top:' + pos.y + "px;left:" +
    pos.x + "px;position:absolute;font-size:11px;" + 'font-family:Arial,sans-serif;font-weight:bold';
}

ClusterMarker_.prototype.onRemove = function() {
    var me = this;
    me.div_.parentNode.removeChild(me.div_);
    me.div_ = null;
};
