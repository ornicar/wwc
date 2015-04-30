/**
ui.control.js
Created by Pitch Interactive
Created on 6/26/2012
This code will control the primary functions of the UI in the ArmsGlobe app
**/
d3.selection.prototype.moveToFront = function() { 
    return this.each(function() { 
        this.parentNode.appendChild(this); 
    }); 
}; 

var d3Graphs = {
    barGraphWidth: 300,
	barGraphHeight: 800,
    barWidth: 14,
	barGraphTopPadding: 20,
	barGraphBottomPadding: 50,
	histogramWidth: 686,
	histogramHeight: 160,
	histogramLeftPadding:31,
	histogramRightPadding: 31,
	histogramVertPadding:20,
	barGraphSVG: d3.select("#wrapper").append("svg").attr('id','barGraph'),
	histogramSVG: null,
	histogramYScale: null,
	histogramXScale: null,
	cumImportY: 0,cumExportY: 0,
    cumImportLblY: 0,cumExportLblY: 0,
    inited: false,
    histogramOpen: false,
    handleLeftOffset: 12,
    handleInterval: 35,
    windowResizeTimeout: -1,
    histogramImports: null,
    histogramExports: null,
    histogramAbsMax: 0,
    previousImportLabelTranslateY: -1,
    previousExportLabelTranslateY: -1,
    zoomBtnInterval: -1,


    setCountry: function(country) {
        d3Graphs.updateViz();
    },
    zoomBtnMouseup: function() {
        clearInterval(d3Graphs.zoomBtnInterval);
    },
    zoomBtnClick:function() {
        var delta;
        if($(this).hasClass('zoomOutBtn')) {
            delta = -0.5;
        } else {
            delta = 0.5;
        }
        d3Graphs.doZoom(delta);
        d3Graphs.zoomBtnInterval = setInterval(d3Graphs.doZoom,50,delta);
    },
    doZoom:function(delta) {
        camera.scale.z += delta * 0.1;
        camera.scale.z = constrain( camera.scale.z, 0.8, 5.0 );
    },
    toggleAboutBox:function() {
        $("#aboutContainer").toggle();
    },
    clickTimeline:function() {
        var year = $(this).html();
        if(year < 10) {
            year = (year * 1) + 2000;
        }
        if(year < 100) {
            year = (year * 1) + 1900
        }
        var index = year - 1992;
        var leftPos = d3Graphs.handleLeftOffset + d3Graphs.handleInterval * index;
        $("#handle").css('left',leftPos+"px");
        d3Graphs.updateViz();
    },
    windowResizeCB:function() {
        clearTimeout(d3Graphs.windowResizeTimeout);
        d3Graphs.windowResizeTimeout = setTimeout(d3Graphs.windowResize, 50);
    },
    windowResize: function() {
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        d3Graphs.positionHistory(windowWidth);
        var minWidth = 1280;
        var minHeight = 860;
        var w = windowWidth < minWidth ? minWidth : windowWidth;
        var hudButtonWidth = 489;
        $('#hudButtons').css('left',w - hudButtonWidth-20);        
        var importExportButtonWidth = $("#importExportBtns").width();
        $("#importExportBtns").css('left',w-importExportButtonWidth - 20);
        var barGraphHeight = 800;
        var barGraphBottomPadding = 10;
        console.log(windowHeight+ " " + barGraphHeight + " " + barGraphBottomPadding);
        var barGraphTopPos = (windowHeight < minHeight ? minHeight : windowHeight) - barGraphHeight - barGraphBottomPadding;
        console.log(barGraphTopPos);
        
        $("#barGraph").css('top',barGraphTopPos+'px');
        /*
        var hudHeaderLeft = $("#hudHeader").css('left');
        hudHeaderLeft = hudHeaderLeft.substr(0,hudHeaderLeft.length-2)
        console.log(hudHeaderLeft);
        var hudPaddingRight = 30;
        $("#hudHeader").width(w-hudHeaderLeft - hudPaddingRight);
        */
    },
    positionHistory: function(windowWidth) {
        var graphIconPadding = 20;
        var historyWidth = $("#history").width();
        var totalWidth = historyWidth + $("#graphIcon").width() + graphIconPadding;
//        var windowWidth = $(window).width();
        var historyLeftPos = (windowWidth - totalWidth) / 2.0;
        var minLeftPos = 280;
        if(historyLeftPos < minLeftPos) {
            historyLeftPos = minLeftPos;
        }
        $("#history").css('left',historyLeftPos+"px");
        $("#graphIcon").css('left',historyLeftPos + historyWidth + graphIconPadding+'px');
    },
    countryFocus:function(event) {
        //console.log("focus");
        setTimeout(function() { $('#hudButtons .countryTextInput').select() },50);
    },
    menuItemClick:function(event) {
        d3Graphs.updateViz();
    },
    countryKeyUp: function(event) {
        if(event.keyCode == 13 /*ENTER */) {
            d3Graphs.updateViz();
        }
    },
    
    updateViz:function() {
        var yearOffset = $("#handle").css('left');
        yearOffset = yearOffset.substr(0,yearOffset.length-2);
        yearOffset -= d3Graphs.handleLeftOffset;
        yearOffset /= d3Graphs.handleInterval;
        var year = yearOffset + 1992;
        
        var country = $("#hudButtons .countryTextInput").val().toUpperCase();
        if(typeof countryData[country] == 'undefined') {
            return;
        }
        
        //exports first
        var exportArray = []
        var exportBtns = $("#importExportBtns .exports>div").not(".label");
        for(var i = 0; i < exportBtns.length; i++) {
            var btn = $(exportBtns[i]);
            var weaponTypeKey = btn.attr('class');
            var weaponName = reverseWeaponLookup[weaponTypeKey];

            if(btn.find('.inactive').length == 0) {
                exportArray.push(weaponName);
                selectionData.exportCategories[weaponName] = true;
            } else {
                selectionData.exportCategories[weaponName] = false;
            }
        }
        //imports esecond
        var importArray = []
        var importBtns = $("#importExportBtns .imports>div").not(".label");
        for(var i = 0; i < importBtns.length; i++) {
            var btn = $(importBtns[i]);
            var weaponTypeKey = btn.attr('class');
            var weaponName = reverseWeaponLookup[weaponTypeKey];
            if(btn.find('.inactive').length == 0) {
                importArray.push(weaponName);
                selectionData.importCategories[weaponName] = true;
            } else {
                selectionData.importCategories[weaponName] = false;
            }
        }
        selectVisualization(moves, year,[country],exportArray, importArray);
    },
    dropHandle:function() {
        d3Graphs.updateViz();
    },
    importExportLabelClick: function() {
        var btns = $(this).prevAll();
        var numInactive = 0;
        for(var i = 0; i < btns.length; i++) {
            if($(btns[i]).find('.inactive').length > 0) {
                numInactive++;
            }
        }
        if(numInactive <= 1) {
            //add inactive
            $(btns).find('.check').addClass('inactive');
        } else {
            //remove inactive
            $(btns).find('.check').removeClass('inactive');
        }
        d3Graphs.updateViz();
    },
    importExportBtnClick:function() { 
        var check = $(this).find('.check');
        if(check.hasClass('inactive')) {
            check.removeClass('inactive');
        } else {
            check.addClass('inactive');
        }
        d3Graphs.updateViz();
    },
    graphIconClick: function() {
        if(!d3Graphs.histogramOpen) {
            d3Graphs.histogramOpen = true;
            $("#history .graph").slideDown();
        } else {
            d3Graphs.closeHistogram();
        }
    },
    closeHistogram: function() {
        d3Graphs.histogramOpen = false;
        $("#history .graph").slideUp();
    },
    line: d3.svg.line()
        // assign the X function to plot our line as we wish
    .x(function(d,i) { 
        if(d == null) {
            return null;
        }
        return d3Graphs.histogramXScale(d.x) + d3Graphs.histogramLeftPadding; 
     })
    .y(function(d) { 
        if(d == null) {
            return null;
        }
        return d3Graphs.histogramYScale(d.y) + d3Graphs.histogramVertPadding; 
    }),
    dragHandleStart: function(event) {
        console.log('start');
        event.dataTransfer.setData('text/uri-list','yearHandle.png');
        event.dataTransfer.setDragImage(document.getElementById('handle'),0,0);
        event.dataTransfer.effectAllowed='move';
    }
}

/*
This is going to be a number formatter. Example of use:

var bigNumber = 57028715;
var formated = abbreviateNumber(57028715);
return formated; //should show 57B for 57 Billion

*/
function abbreviateNumber(value) {
    
    var newValue = value;
    if (value >= 1000) {
        var suffixes = ["", "K", "M", "B","T"];
        var suffixNum = Math.floor( (""+value).length/3 );
        var shortValue = '';
        for (var precision = 3; precision >= 1; precision--) {
            shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 3) { break; }
        }
        if (shortValue % 1 != 0)  shortNum = shortValue.toFixed(1);
        newValue = shortValue+suffixes[suffixNum];
    }
    return '$' + newValue;
}

