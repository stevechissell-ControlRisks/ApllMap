/// <reference path="../jquery-1.11.1.min.js"/>
/// <reference path="datepick-min.js"/>
$(function () {
    // noJS
    $("body.noJS").removeClass("noJS");

    // get querystring value function
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

    // view by location/time/map toggle
    $("#viewBy > li > a").on("click", function () {
        var queryString = $(this).attr("href");
        var day = getParameterByName("day");
        if (day) {
            queryString += "&day=" + day + "&month=" + getParameterByName("month") + "&year=" + getParameterByName("year");
        }
        window.location.href = window.location.href.split("?")[0] + queryString;
        return false;
    });
   
    $("#dailySummary").off().on("click", function () {
        if ($(this).hasClass("allExpanded")) {
            $('.expand').each(function () {
                if ($(this).hasClass("expanded")) {
                    $(this).find("img").attr("src", "/Content/SubscriptionSite/Images/small_right_arrow.gif").attr("alt", "Expand");
                    $(this).parent().next(".hidden").fadeOut();
                    $(this).removeClass("expanded").attr("title", "Click here to expand headline summary.");
                }
            });
            $(this).removeClass("allExpanded");
            $('.summaryContainer').each(function () {
                $(this).addClass("hidden");
            });
        }
        else {
            $('.expand').each(function () {
                if (!$(this).hasClass("expanded")) {
                    $(this).find("img").attr("src", "/Content/SubscriptionSite/Images/small_down_arrow.gif").attr("alt", "Contract");
                    $(this).parent().next(".hidden").fadeIn();
                    $(this).addClass("expanded").attr("title", "Click here to contract headline summary.");
                }
            });
            $(this).addClass("allExpanded");
            $('.summaryContainer').each(function () {
                $(this).removeClass("hidden");
            });
        }
        return false;
    });


    // show/hide the report link on search results page
    $('#searchResults').prev().find('a.report').addClass('hidden');
    $('#searchResults input:checkbox').off().on('click', function () {
        if ($("#searchResults input:checkbox:checked").length > 0) {
            $('#topLinks a.report').removeClass('hidden');
        }
        else {
            $('#topLinks a.report').addClass('hidden');
        }
    });


    //get the selected checkbox values

    $('#searchResults').prev().find('a.report').on('click', function () {
        var selectedPageIds = [];
        $('#searchResults').find(':checkbox').each(function () {
            if (this.checked) {
                selectedPageIds.push(this.value);
            }
        });
        if (selectedPageIds.length > 0) {
            submit('/report?contentonly=true', 'POST', [
            { name: 'pageIds', value: selectedPageIds }
            ]);
            return false;
        }
        return false;
    });

    function submit(action, method, values) {
        var form = $('<form/>', {
            action: action,
            method: method
        });
        $.each(values, function () {
            form.append($('<input/>', {
                type: 'hidden',
                name: this.name,
                value: this.value
            }));
        });
        form.appendTo('body').submit();
    }



    // toggle child checkboxes when parent is checked on the create report pages
    $('#createReport :checkbox').change(function () {
        $(this).siblings('ul').find(':checkbox').attr('checked', this.checked);
        if (!this.checked) {
            $(this).parentsUntil('#createReport', 'ul').siblings(':checkbox').attr('checked', false);
        } else {
            $(this).parentsUntil('#createReport', 'ul').each(function () {
                var $this = $(this);                
                var childSelected = $this.find(':checkbox:checked').length;
                if (!childSelected) {
                    $this.prev(':checkbox').attr('checked', true);
                }
            });
        }
    });

    //  ============== =========================================================================== ============== 
});