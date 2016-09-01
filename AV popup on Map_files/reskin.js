var crMapObj;
var paceLoaded = false;

$(function () {
    if (typeof Pace !== 'undefined') {

        var pdfBtn = $(".generate-pdf");

        Pace.on('hide', function () {
            if (pdfBtn != 'undefined') {
                pdfBtn.prop("disabled", false);
                pdfBtn.attr("style", "opacity: 1");
                paceLoaded = true;
            }
        });

        Pace.on('start', function () {
            if (pdfBtn != 'undefined') {
                if (!paceLoaded) {
                    pdfBtn.prop("disabled", true);
                    pdfBtn.attr("style", "opacity: 0.5");
                }
            }
        });

        Pace.on('restart', function () {
            if (pdfBtn != 'undefined') {
                if (!paceLoaded) {
                    pdfBtn.prop("disabled", true);
                    pdfBtn.attr("style", "opacity: 0.5");
                }
            }
        });
    }

    var pdfButtonCountry = $('.generate-pdf');
    if (pdfButtonCountry.length > 0) {
        pdfButtonCountry.click(function (e) {

            $('#mainForm').removeAttr('target');

            var windowUrl = "";

            if ($(this).hasClass('regional-security-forecast-link')) {
                windowUrl = location.pathname + ".download-pdf?filename=RegionalSecurityForecast&contentonly=true&p=true";
            }
            else {
                windowUrl = "/report.download-pdf?page=" + getQueryStringValue('page') + "&filename=" + getQueryStringValue('filename') + "&o=" + getQueryStringValue('o') + "&c=" + getQueryStringValue('c') + "&sr=" + getQueryStringValue('sr') + "&contentOnly=true&p=true";
            }

            window.open(windowUrl, "_blank");

            return false;
        });
    }

    $('iframe').mouseenter(function () {
        $('.dropdown.open').removeClass('open');
    });

    if (document.URL.indexOf("p=true") !== -1)
    {
        $(".remove-from-pdf").hide();
    }        

    //Code fix for HTML4 browsers using onhashchange event
    if ((location.href.indexOf('mappyCompressed') > -1) && (location.href.indexOf('#map-tab') === -1)) {
        var addressHref = location.href;

        if (addressHref.indexOf('http') !== 0) {
            addressHref = addressHref.substring(addressHref.indexOf('http'));
        }

        addressHref = addressHref.replace(/#(.*)\?/, "?");
        addressHref = addressHref.replace(/mappycompressed(.*)\?/gmi, "");

        addressHref = addressHref.replace('#', '');

        location.href = addressHref + "#map-tab";
    }

    var mapPage = $('#map-page');
    if (mapPage.length > 0) {
        $('#mapDiv').crMap();
    }

    $('#slider').bind('valuesChanged', function (e, data) {

        if (analysisChecked) {
            if ((CalculateDateSliderMonth(data.values.max) > 5) || (CalculateDateSliderMonth(data.values.min) > 5)) {
                if ($.cookie('GRADisclaimer') === undefined) {

                    $('#mapDisclaimer #mapDisclaimerType').val('GRADisclaimer');
                    $('#mapDisclaimer #mainPanel').text(analysisDisclaimerText);
                    $('#mapDisclaimer #subPanel').text(incidentDisclaimerText);

                    $('#mapDisclaimerBlocker').show();
                    $('#mapDisclaimer').show();
                }
            }
        }
    });

    $('#mapDisclaimerDismiss').click(function () {
        $('#mapDisclaimerBlocker').hide();
        $('#mapDisclaimer').hide();
        if ($('#mapDisclaimerAcknowledge').prop('checked') === true)
            $.cookie($('#mapDisclaimerType').val(), 'true', { expires: 365 });
    });

    var close = false;
    $('#dailySummary a').click(function () {
        if (close) {
            $('.toggleHeader, .toggleHeadline').next().toggle('fast');
            var arrow = $('.toggleHeader, .toggleHeadline').find('.show-summary');
            if (arrow.length > 0) arrow.toggleClass('hide-summary');
            close = false;
            return false;
        }
        $('.toggleHeader, .toggleHeadline').each(function (i) {
            if ($(this).next().is(':hidden')) {
                $(this).next().show('fast');
                var arrow = $(this).find('.show-summary');
                if (arrow.length > 0) {
                    arrow.toggleClass('hide-summary');
                }
                close = true;
            }
        })
        return false;
    });

    // expand/contract headlines
    $(".expand").off().on("click", function () {
        var summaryDiv = $(this).parent().next().next();
        if ($(this).hasClass("expanded")) {
            $(this).find("img").attr("src", "/Content/SubscriptionSite/Images/reskin/home/large-grey-arrow.png").attr("alt", "Expand");
            $(this).parent().next(".country-headline-item-summary").hide();
            if (null != summaryDiv && !summaryDiv.hasClass("hidden")) summaryDiv.addClass("hidden");
            $(this).removeClass("expanded").attr("title", "Click here to expand headline summary.");
        }
        else {
            $(this).find("img").attr("src", "/Content/SubscriptionSite/Images/reskin/home/large-grey-arrow-down.png").attr("alt", "Contract");
            $(this).parent().next(".country-headline-item-summary").show();
            if (null != summaryDiv && summaryDiv.hasClass("hidden")) summaryDiv.removeClass("hidden");
            $(this).addClass("expanded").attr("title", "Click here to contract headline summary.");
        }
        return false;
    });

    $('.headlines-by-tab-normal').click(function() {
        $('#date-container').show();
    });

   
    function getSelectedCityOptions() {
        var selCityOptions = "";
        var startSubIndex = 0;
        
        var cityOverviewOptions = $('#createReport > ul > li > ul > li').find('> input[isCity=True]');

        $.each(cityOverviewOptions, function (index) {            
            var cityOverviewOption = $(this);
            var subCityOptions = $(this).parent().find('> ul > li > input');
            var subCityIndexes = "";

            $.each(subCityOptions, function (subIndex) {
                if ($(this).is(':checked')) {
                    subCityIndexes += startSubIndex + subIndex + ":";
                }
            });

            subCityIndexes = subCityIndexes.slice(0, -1);

            // only add city options if either the overview is checked or one of its children            
            if ($(cityOverviewOption).is(":checked") || (subCityIndexes !== "")) {
                selCityOptions += cityOverviewOption.val() + "|" + subCityIndexes + ",";
            }
        });

        if (selCityOptions !== "")
            selCityOptions = selCityOptions.slice(0, -1);        

        return selCityOptions;
    };


    $('.datePicker').on('click', function () {
        if (isInternetExplorer9Version()) {
            window.isDatePickerClick = true;
        }
    });
    $('#mainForm.reportForm #btnCreateHTML').off().on('click', function () {
        var selectedOptions = "";
        var selections = $('input[type=checkbox][isCity=False]');

        $.each(selections, function () {
            if ($(this).is(':checked')) {
                if ($(this).val() !== "")
                selectedOptions += $(this).val() + ",";
            }
        });
        
        var selectedCityOptions = getSelectedCityOptions();

        if ((selectedOptions === "") && (selectedCityOptions === ""))
        {
            $.each($('input[type=checkbox]'), function () {
                if ($(this).is(":checked"))
                {
                    selectedOptions += $(this).attr("data-guid") + ",";
                }
    });
        }

        selectedOptions = selectedOptions.slice(0, -1);
    
        window.open("/report?page=" + getQueryStringValue('page') + "&contentOnly=true&filename=report.pdf&o=" + selectedOptions + "&c=" + selectedCityOptions, "_blank", "width=900,height=600,scrollbars=yes,status=yes,location=0");
    });

    $('#mainForm #btnCreateSearchHTML').off().on('click', function () {
        var selectedOptions = "";
        var selections = $('input[type=checkbox][name=searchResultCheckbox]');

        $.each(selections, function () {
            if ($(this).is(':checked')) {
                if ($(this).val() !== "")
                    selectedOptions += $(this).val() + ",";
            }
        });

        selectedOptions = selectedOptions.slice(0, -1);

        window.open("/report?page=" + getQueryStringValue('page') + "&contentOnly=true&filename=report.pdf&o=" + selectedOptions + "&sr=true", "_blank", "width=900,height=600,scrollbars=yes,status=yes,location=0");
    });

    //  ============== script to toggle the countries section in the countries under a region page ==============     
    $(".toggleHeader").click(function () {
        var toggleHeader = $(this);
        toggleHeader.next().slideToggle('fast');
        applyAfterToggle(toggleHeader);
    });

    $(".toggleHeaderImg img").click(function () {
        var toggleHeader = $(this);
        toggleHeader.parent().parent().next().slideToggle('fast');
        applyAfterToggle(toggleHeader);
    });

    function CalculateDateSliderMonth(dateParam) {
        var today = new Date();
        var fDate = new Date(dateParam);
        var fm = fDate.getMonth();
        var fy = fDate.getFullYear();
        var sm = today.getMonth();
        var sy = today.getFullYear();
        var months = Math.abs(((fy - sy) * 12) + fm - sm);
        var firstBefore = fDate > today;
        fDate.setFullYear(sy);
        fDate.setMonth(sm);
        firstBefore ? fDate < today ? months-- : "" : today < fDate ? months-- : "";
        return months;
    }

    function getQueryStringValue(key) {
        return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    }

    function applyAfterToggle(toggleHeader) {
        var imgCtrl = toggleHeader.find("img").length == 0 ? toggleHeader : toggleHeader.find("img");
        var srcArr = imgCtrl.attr('src').split('/');
        var srcArrLen = srcArr.length;
        var repImg = imgCtrl.attr("toggleSrc");

        var newImgSrc;
        if ((typeof repImg === "undefined") || (repImg.length == 0)) {
            repImg = srcArr[srcArrLen - 1] === "large-grey-arrow.png" ? "large-grey-arrow-down.png" : "large-grey-arrow.png";
            srcArr[srcArrLen - 1] = repImg;
            newImgSrc = srcArr.join("/");
        } else {
            newImgSrc = imgCtrl.attr("toggleSrc");
            imgCtrl.attr("toggleSrc", imgCtrl.attr('src'));
        }


        imgCtrl.attr('src', newImgSrc);
    }

    $(window).resize(function () {
        resizeMapToViewport();
    });

    $(document).ready(function () {
        /*
     * jQuery hashchange event - v1.3 - 7/21/2010
     * http://benalman.com/projects/jquery-hashchange-plugin/
     * 
     * Copyright (c) 2010 "Cowboy" Ben Alman
     * Dual licensed under the MIT and GPL licenses.
     * http://benalman.com/about/license/
     */
        (function ($, e, b) { var c = "hashchange", h = document, f, g = $.event.special, i = h.documentMode, d = "on" + c in e && (i === b || i > 7); function a(j) { j = j || location.href; return "#" + j.replace(/^[^#]*#?(.*)$/, "$1") } $.fn[c] = function (j) { return j ? this.bind(c, j) : this.trigger(c) }; $.fn[c].delay = 50; g[c] = $.extend(g[c], { setup: function () { if (d) { return false } $(f.start) }, teardown: function () { if (d) { return false } $(f.stop) } }); f = (function () { var j = {}, p, m = a(), k = function (q) { return q }, l = k, o = k; j.start = function () { p || n() }; j.stop = function () { p && clearTimeout(p); p = b }; function n() { var r = a(), q = o(m); if (r !== m) { l(m = r, q); $(e).trigger(c) } else { if (q !== m) { location.href = location.href.replace(/#.*/, "") + q } } p = setTimeout(n, $.fn[c].delay) } $.browser.msie && !d && (function () { var q, r; j.start = function () { if (!q) { r = $.fn[c].src; r = r && r + a(); q = $('<iframe tabindex="-1" title="empty"/>').hide().one("load", function () { r || l(a()); n() }).attr("src", r || "javascript:0").insertAfter("body")[0].contentWindow; h.onpropertychange = function () { try { if (event.propertyName === "title") { q.document.title = h.title } } catch (s) { } } } }; j.stop = k; o = function () { return a(q.location.href) }; l = function (v, s) { var u = q.document, t = $.fn[c].domain; if (v !== s) { u.title = h.title; u.open(); t && u.write('<script>document.domain="' + t + '"<\/script>'); u.close(); q.location.hash = v } } })(); return j })() })(jQuery, this);
        // Bind the event.
        $(window).hashchange(function () {
            showHide(location.hash.substring(1));
        });

        if (!(typeof defaultTab === 'undefined')) {
            // Trigger the event (useful on page load).
            var signifier = getParameterByName('page') + "-tab";
            if (!signifierValid(signifier)) {
                if (!signifierValid(window.location.hash.substring(1))) {
                    if ($('#cr-map-btn').length > 0 || $('#analysis-email-alert-btn').length > 0) window.location.hash = defaultTab;
                }
                $(window).hashchange();
            } else {
                window.location.hash = (signifier == "location-tab") ? signifier + "#" + signifier : signifier;
                showHide(signifier);
            }
        }        
      
    });

    $(window).on('beforeunload', function (e) {
        //IN IE9, datepicker click fires unload event. We don't want the compressed string at that point
        //Hack to set global variable
        if (window.isDatePickerClick) { window.isDatePickerClick = false; return; }
        if (!(typeof window.mappy === 'undefined') && !(typeof window.mappy.exportViewToQueryString === 'undefined') && location.hash.substring(1) === "map-tab") {

            window.mappy.exportViewToQueryString(function (hex) {
                History.pushState(null, null, "?mappyCompressed=" + hex);
            });
        }        
    });

    $(document).bind('keydown', function (e) {
        if (e.keyCode == 27) {
            if ($('#mapDiv').hasClass("full-screen-map")) {
                $('#mapDiv').removeClass("full-screen-map");
                $('.escimage , #box').hide();
            }
        }
    });

    function showHide(signifier) {
        if (signifierValid(signifier)) {
            $('.simpleTabsContent').css('display', 'none');
            $($('.simpleTabsContent.' + signifier)[0]).css('display', 'block');
            $(".simpleTabsNavigation li").each(function () {
                var a = $(this).find('a');
                if (a.attr('href') == '#' + signifier) a.addClass('current');
                else a.removeClass('current');
            });
            if (signifier == "map-tab" && ($("#cr-map-btn").length > 0) && mapLoaded != "true") {
                loadMap();
                mapLoaded = "true";
            }
        }
    }

    function signifierValid(signifier) {
        return signifier == "map-tab" || signifier == "location-tab" || signifier == "time-tab" || signifier == "overview-tab" || signifier == "analysis-tab" || signifier == "incidents-tab";
    }

    var mapLoaded;

    function loadMap() {
        $('#date-container').hide();
        //$('#risk-legend-container').show();
        if (crMapObj === undefined) {
            if (!crMapObj) {
                crMapObj = new $("#mapDiv").crMap();
                resizeMapToViewport();
            }
        }
    }

    function getViewPort() {
        var win = $(window);
        var viewport = {
            top: win.scrollTop(),
            left: win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();
        return viewport;
    }

    // TODO: move this into Mappy?
    function resizeMapToViewport() {

        if ($('#map-report').length == 0) {

            if (resizeTimeout != null) clearTimeout(resizeTimeout);
            resizeTimeout = null;

            var viewport = getViewPort();
            var contentWidth = $("#content").width();
            if ($("#mapDiv").length) {


                var top = $("#mapDiv").offset().top;

                var mapDivHeight = (viewport.bottom - top) - 40;
                $("#map").height(mapDivHeight);
                $("#mapDiv").height(mapDivHeight);
            }

            // this is a fix to invalidate the leaflet pane so it sizes correctly on start up.
            if (!invalidateMap()) {
                resizeTimeout = setTimeout(resizeMapToViewport, 1000);
            }
        }
    }


    var resizeTimeout = null;

    function invalidateMap() {
        if (typeof map !== 'undefined') {
            map.invalidateSize();
            return true;
        } else return false;
    }

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.search);
        if (results == null) {
            return "";
        }
        else {
            return decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    }

    function isInternetExplorer9Version() {
        var isIE9Version = false;

        if (navigator.userAgent.indexOf('MSIE') != -1)
            var detectIEregexp = /MSIE (\d+\.\d+);/ //test for MSIE x.x
        else // if no "MSIE" string in userAgent
            var detectIEregexp = /Trident.*rv[ :]*(\d+\.\d+)/ //test for rv:x.x or rv x.x where Trident string exists

        if (detectIEregexp.test(navigator.userAgent)) { //if some form of IE
            var ieversion = new Number(RegExp.$1) // capture x.x portion and store as a number            
            if (ieversion == 9)
            {
                isIE9Version = true;
            }
                
        }
        
        return isIE9Version;
    }

    function getCalendarDateUrl(queryString) {
        var url;
        var locationHref = window.location.href.split("?")[0];
        var hashLocation = locationHref.indexOf('#');
        if (hashLocation > -1) {
            url = locationHref.substring(0, hashLocation) + queryString + locationHref.substring(hashLocation);
        }
        else {
            url = locationHref + queryString;
        }

        return url;
    }

    /* Start Headlines (Home Page) Script */
    var contents = $('p.hidden-content');
    if (contents.length > 0) {
        $('p.hidden-content').hide();
        $('a.show-summary').click(function () {
            $(this).parent().parent().next('p.hidden-content').toggle();
            $(this).toggleClass('hide-summary');
        });
    }

    var calendar = $('#dateInput');
    if (calendar.length > 0) {

        var headlinesDefaultDate = $("#headlinesDefaultDate").val().split("/");
        var headlinesDate = $("#headlinesDate").val().split("/");

        // Setting if the language set is left to right or right to left
        var isRTL = $.datepick._defaults.isRTL;
        if (isRTL) {

            calendar.datepick({
                minDate: new Date(1995, 0, 1),
                maxDate: new Date(headlinesDefaultDate[0], headlinesDefaultDate[1] - 1, headlinesDefaultDate[2]),
                defaultDate: new Date(headlinesDate[0], headlinesDate[1] - 1, headlinesDate[2]),
                isRTL: false,
                showTrigger: '<a id="datepicker" class="date" href="javascript:void(0);"></a>',
                buttonImageOnly: true,
                dateFormat: "dd/mm/yyyy",
                buttonImage: "/Content/SubscriptionSite/Images/cal.jpg",
                buttonText: "Date selector",
                onSelect: function (dates) {
                    var selectedDay = $.datepick.formatDate("dd", dates[0]);
                    var selectedMonth = $.datepick.formatDate("mm", dates[0]);
                    var selectedYear = $.datepick.formatDate("yyyy", dates[0]);
                    var page = getParameterByName("page");
                    var queryString;
                    if (page) {
                        queryString = "?page=" + page + "&day=" + selectedDay + "&month=" + selectedMonth + "&year=" + selectedYear;
                    } else {
                        queryString = "?day=" + selectedDay + "&month=" + selectedMonth + "&year=" + selectedYear;
                    }

                    window.location.href = getCalendarDateUrl(queryString)
                }
            });
        }
        else {
            calendar.datepick({
                minDate: new Date(1995, 0, 1),
                maxDate: new Date(headlinesDefaultDate[2], headlinesDefaultDate[1] - 1, headlinesDefaultDate[0]),
                defaultDate: new Date(headlinesDate[2], headlinesDate[1] - 1, headlinesDate[0]),
                showTrigger: '<a id="datepicker" class="date" href="javascript:void(0);"></a>',
                buttonImageOnly: true,
                dateFormat: "dd/mm/yyyy",
                buttonImage: "/Content/SubscriptionSite/Images/cal.jpg",
                buttonText: "Date selector",
                onSelect: function (dates) {
                    var selectedDay = $.datepick.formatDate("dd", dates[0]);
                    var selectedMonth = $.datepick.formatDate("mm", dates[0]);
                    var selectedYear = $.datepick.formatDate("yyyy", dates[0]);
                    var page = getParameterByName("page");
                    var queryString;
                    if (page) {
                        queryString = "?page=" + page + "&day=" + selectedDay + "&month=" + selectedMonth + "&year=" + selectedYear;
                    } else {
                        queryString = "?day=" + selectedDay + "&month=" + selectedMonth + "&year=" + selectedYear;
                    }

                    window.location.href = getCalendarDateUrl(queryString)
                }
            });
        }
        $('.headlines a.date').text($('#headlinesDateString').val());
    }

    if ($("#headlinesDefaultDate").length > 0) {
        var headlinesDefaultDate = $("#headlinesDefaultDate").val().split("/");
        var headlinesDate = $("#headlinesDate").val().split("/");

        var isRTL = $.datepick._defaults.isRTL;

        if (isRTL) {
            // datepicker on homepage
            $("#headlinesDate").datepick({
                minDate: new Date(1995, 0, 1),
                maxDate: new Date(headlinesDefaultDate[0], headlinesDefaultDate[1] - 1, headlinesDefaultDate[2]),
                defaultDate: new Date(headlinesDate[0], headlinesDate[1] - 1, headlinesDate[2]),
                isRTL: false,
                showTrigger: "#headlinesDateTrigger",
                buttonImageOnly: true,
                dateFormat: "dd/mm/yyyy",
                buttonImage: "/Content/SubscriptionSite/Images/cal.jpg",
                buttonText: "Date selector",
                onSelect: function (dates) {
                    var selectedDay = $.datepick.formatDate("dd", dates[0]);
                    var selectedMonth = $.datepick.formatDate("mm", dates[0]);
                    var selectedYear = $.datepick.formatDate("yyyy", dates[0]);
                    var page = getParameterByName("page");
                    var queryString;
                    if (page) {
                        queryString = "?page=" + page + "&day=" + selectedDay + "&month=" + selectedMonth + "&year=" + selectedYear;
                    } else {
                        queryString = "?day=" + selectedDay + "&month=" + selectedMonth + "&year=" + selectedYear;
                    }
                    //window.location.href = window.location.href.split("?")[0] + queryString;
                    window.location.href = getCalendarDateUrl(queryString)
                }
            });
        }
        else {
            // datepicker on homepage
            $("#headlinesDate").datepick({
                minDate: new Date(1995, 0, 1),
                maxDate: new Date(headlinesDefaultDate[2], headlinesDefaultDate[1] - 1, headlinesDefaultDate[0]),
                defaultDate: new Date(headlinesDate[2], headlinesDate[1] - 1, headlinesDate[0]),
                showTrigger: "#headlinesDateTrigger",
                buttonImageOnly: true,
                dateFormat: "dd/mm/yyyy",
                buttonImage: "/Content/SubscriptionSite/Images/cal.jpg",
                buttonText: "Date selector",
                onSelect: function (dates) {
                    var selectedDay = $.datepick.formatDate("dd", dates[0]);
                    var selectedMonth = $.datepick.formatDate("mm", dates[0]);
                    var selectedYear = $.datepick.formatDate("yyyy", dates[0]);
                    var page = getParameterByName("page");
                    var queryString;
                    if (page) {
                        queryString = "?page=" + page + "&day=" + selectedDay + "&month=" + selectedMonth + "&year=" + selectedYear;
                    } else {
                        queryString = "?day=" + selectedDay + "&month=" + selectedMonth + "&year=" + selectedYear;
                    }
                    //window.location.href = window.location.href.split("?")[0] + queryString;
                    window.location.href = getCalendarDateUrl(queryString)
                }
            });
        }
    }

    // Calendar datepicker code
    if ($("#defaultDate").length > 0) {
        var defaultDate = $("#defaultDate").val().split("/");

        // Setting if the language set is left to right or right to left
        var isRTL = $.datepick._defaults.isRTL;
        // datepickers on advanced search
        if (isRTL) {
            $("#fromDate").datepick({
                minDate: new Date(1995, 0, 1),
                maxDate: new Date(defaultDate[0], defaultDate[1] - 1, defaultDate[2]),
                isTRL: false,
                showTrigger: "#fromDateTrigger",
                buttonImageOnly: true,
                dateFormat: 'dd/mm/yyyy',
                buttonImage: "/Content/SubscriptionSite/Images/cal.jpg",
                buttonText: "Date selector",
                closeText: ""
            });

            $("#toDate").datepick({
                minDate: new Date(1995, 0, 1),
                maxDate: new Date(defaultDate[0], defaultDate[1] - 1, defaultDate[2]),
                isTRL: false,
                showTrigger: "#toDateTrigger",
                buttonImageOnly: true,
                dateFormat: 'dd/mm/yyyy',
                buttonImage: "/Content/SubscriptionSite/Images/cal.jpg",
                buttonText: "Date selector",
                closeText: ""
            });
        }
        else {
            $("#fromDate").datepick({
                minDate: new Date(1995, 0, 1),
                maxDate: new Date(defaultDate[2], defaultDate[1] - 1, defaultDate[1]),
                showTrigger: "#fromDateTrigger",
                buttonImageOnly: true,
                dateFormat: 'dd/mm/yyyy',
                buttonImage: "/Content/SubscriptionSite/Images/cal.jpg",
                buttonText: "Date selector",
                closeText: ""
            });

            $("#toDate").datepick({
                minDate: new Date(1995, 0, 1),
                maxDate: new Date(defaultDate[2], defaultDate[1] - 1, defaultDate[0]),
                showTrigger: "#toDateTrigger",
                buttonImageOnly: true,
                dateFormat: 'dd/mm/yyyy',
                buttonImage: "/Content/SubscriptionSite/Images/cal.jpg",
                buttonText: "Date selector",
                closeText: ""
            });
        }
    }

    // --------------------------------------------------
    // ------------- PRINT functions --------------------
    // --------------------------------------------------

    //Enable PRINT functiion
    if ($('#EnablePrintButton').length > 0) {
        $('#PrimaryNavigationBarPrintBtn').show();
    }

    // Print Initialization
    $.fn.printPreview = function () {
        this.each(function () {
            $(this).bind('click', function (e) {
                e.preventDefault();
                if (!$('#print-modal').length) {
                    $.printPreview.loadPrintPreview();
                }
            });
        });
        return this;
    };

    // Private functions
    var mask, size, printModal, printControls;
    $.printPreview = {
        disableMiddleMouseButtonScrolling: function (e) {
            if (e.which == 2) {
                e.preventDefault();
            }
            return false;
        },

        disableNormalScroll: function (e) {
            e.preventDefault();
            $('html, body').scrollTop(0);
            return false;
        },
        loadPrintPreview: function () {
            // Declare DOM objects
            printModal = $('<div id="print-modal"></div>');
            printControls = $('<div id="print-modal-controls">' +
                '<a href="#" class="printpreview-print" title="Print page">Print page</a>' +
                '<a href="#" class="printpreview-close" title="Close print preview">Close</a>').hide();
            var printFrame = $('<iframe id="print-modal-content" scrolling="no" width="100%" border="0" frameborder="0" name="print-frame" />');

            // Raise print preview window from the dead, zooooooombies
            printModal
                .hide()
                .append(printControls)
                .append(printFrame)
                .appendTo('body');

            // The frame lives
            for (var i = 0; i < window.frames.length; i++) {
                if (window.frames[i].name == "print-frame") {
                    var printFrameRef = window.frames[i].document;
                    break;
                }
            }
            printFrameRef.open();
            printFrameRef.write('<!doctype html>' +
                '<html lang="en">' +
                '<head><title>' + document.title + '</title></head>' +
                '<body></body>' +
                '</html>');
            printFrameRef.close();

            // Grab contents and apply stylesheet
            var $iframeHead = $('head link[media*=print], head link[media=all]').clone(),
                $iframeBody = $('#main-body-content > *:not(#print-modal):not(script)').clone();

            if (!($iframeBody.length)) {
                $iframeBody = $('#content > *:not(#print-modal):not(script)').clone();
            }

            $iframeHead.each(function () {
                $(this).attr('media', 'all');
            });

            if (!$.browser.msie && !($.browser.version < 7)) {
                $('head', printFrameRef).append($iframeHead);
                $($iframeBody).find('script').remove();
                $('body', printFrameRef).append($iframeBody);
            } else if ($.browser.msie && $.browser.version < 9) {
                print();
                return;
            } else if ($.browser.msie && $.browser.version < 11) {
                $('head', printFrameRef).append($iframeHead);
                $('body', printFrameRef).append($iframeBody);
            } else {
                $('body > *:not(#print-modal):not(script)').clone().each(function () {
                    $('body', printFrameRef).append(this.outerHTML);
                });
                $('head link[media*=print], head link[media=all]').each(function () {
                    $('head', printFrameRef).append($(this).clone().attr('media', 'all')[0].outerHTML);
                });
            }


            // Disable all links
            $('a', printFrameRef).bind('click.printPreview', function (e) {
                e.preventDefault();
            });

            // Introduce print styles
            $('head').append('<style type="text/css">' +
                '@media print {' +
                '/* -- Print Preview --*/' +
                '#print-modal-mask,' +
                '#print-modal {' +
                'display: none !important;' +
                '}' +
                '}' +
                '</style>'
            );

            // Disable scrolling
            $(document).bind('mousedown', $.printPreview.disableMiddleMouseButtonScrolling);

            //catch other kinds of scrolling
            $(document).bind('mousewheel DOMMouseScroll wheel', $.printPreview.disableNormalScroll);

            //catch any other kind of scroll (though the event wont be canceled, the scrolling will be undone)
            //IE8 needs this to be 'window'!
            $(window).bind('scroll', $.printPreview.disableNormalScroll);
            $('img', printFrameRef).load(function () {
                printFrame.height($('body', printFrame.contents())[0].scrollHeight);
            });

            // Load mask
            $.printPreview.loadMask();

            // Position modal                        
            var css = {
                top: "0px",
                height: '100%',
                overflowY: 'auto',
                zIndex: 200000,
                display: 'block',
                position: 'absolute',
                width: "80%",
                padding: "10px"
            };
            printModal
                .css(css)
                .animate({ top: $(window).scrollTop() }, 400, 'linear', function () {
                    printControls.fadeIn('slow').focus();
                });
            printFrame.height($('body', printFrame.contents())[0].scrollHeight);

            // Bind closure
            $('a', printControls).bind('click', function (e) {
                e.preventDefault();
                if ($(this).hasClass('printpreview-print')) {
                    $("#print-modal-content").get(0).contentWindow.print();
                } else {
                    $.printPreview.distroyPrintPreview();
                }
            });
        },

        distroyPrintPreview: function () {
            printControls.fadeOut(100);
            printModal.animate({ top: $(window).scrollTop() - $(window).height(), opacity: 1 }, 400, 'linear', function () {
                printModal.remove();
                $('body').css({ overflowY: 'auto', height: 'auto' });
            });
            mask.fadeOut('slow', function () {
                mask.remove();
            });

            $(document).unbind("keydown.printPreview.mask");
            mask.unbind("click.printPreview.mask");
            $(window).unbind("resize.printPreview.mask");
            $(document).unbind('mousedown', $.printPreview.disableMiddleMouseButtonScrolling);
            $(document).unbind('mousewheel DOMMouseScroll wheel', $.printPreview.disableNormalScroll);
            $(window).unbind('scroll', $.printPreview.disableNormalScroll);
        },

        /* -- Mask Functions --*/
        loadMask: function () {
            size = $.printPreview.sizeUpMask();
            mask = $('<div id="print-modal-mask" />').appendTo($('body'));
            mask.css({
                position: 'absolute',
                top: 0,
                left: 0,
                width: size[0],
                height: size[1],
                display: 'none',
                opacity: 1,
                zIndex: 100000,
                backgroundColor: '#000'
            });

            mask.css({ display: 'block' }).fadeTo('400', 0.75);

            $(window).bind("resize.printPreview.mask", function () {
                $.printPreview.updateMaskSize();
            });

            mask.bind("click.printPreview.mask", function () {
                $.printPreview.distroyPrintPreview();
            });

            $(document).bind("keydown.printPreview.mask", function (e) {
                if (e.keyCode == 27) {
                    $.printPreview.distroyPrintPreview();
                }
            });
        },

        sizeUpMask: function () {
            if ($.browser.msie) {
                // if there are no scrollbars then use window.height
                var d = $(document).height(), w = $(window).height();
                return [
                    window.innerWidth || // ie7+
                        document.documentElement.clientWidth || // ie6  
                        document.body.clientWidth, // ie6 quirks mode
                    d - w < 20 ? w : d
                ];
            } else {
                return [$(document).width(), $(document).height()];
            }
        },

        updateMaskSize: function () {
            var size = $.printPreview.sizeUpMask();
            mask.css({ width: size[0], height: size[1] });
        }
    };

    $('a.print').printPreview();
    if ($.browser.msie && ($.browser.version < 8)) {
        $('#mapcontrols').width($('#mapcontainer').width());
    }

    var dailyEmail = $('#daily-email');
    if (dailyEmail.length > 0) {
        dailyEmail.click(function () {
            var checked = $(this).prop('checked')
            $('#daily-send-hour').prop('disabled', !checked);
            if (checked) $('#daily-send-hour').removeClass('restricted');
            else $('#daily-send-hour').addClass('restricted');
        });
    }

    var topNav = $('#TopNavigation');
    if (topNav.length > 0) {
        var button = topNav.find('.dropdown-button');
        button.click(function (e) {
            var items = button.nextAll();
            items.toggle();
            var arrow = button.find('.dropdown-arrow');
            arrow.toggleClass('dropdown-arrow-open');
            return false;
        });
    }
});

(function ($) {

    $.fn.showSimpleMap = function (options) {
        var settings = $.extend({
            baseLayer: '',
            infoControl: false,
            zoomControl: false,
            zoomLevel: 0,
            view: [26.589, 0],
            tileLayer: {
                wmsUrl: '',
                format: 'image/png',
                layers: '',
                opacity: 0.6,
                slug: null,
                version: '',
                transparent: true,
                type: 'wms'
            }
        }, options);

        var id = $(this).attr('id');
        var map = L.mapbox.map(id, settings.baseLayer, {
            infoControl: settings.infoControl,
            zoomControl: settings.zoomControl
        }).setView(settings.view, settings.zoomLevel);

        var overlay = L.tileLayer.wms(settings.tileLayer.wmsUrl, {
            format: settings.tileLayer.format,
            layers: settings.tileLayer.layers,
            opacity: settings.tileLayer.opacity,
            slug: settings.tileLayer.slug,
            version: settings.tileLayer.version,
            transparent: settings.tileLayer.transparent,
            type: settings.tileLayer.type
        });

        overlay.addTo(map);

        return this;
    }

}(jQuery));


