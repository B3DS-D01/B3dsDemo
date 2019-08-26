var year = "";
var month = "";
var rangeInput = {
    "ranges":[]
};

var url = "http://localhost:8440"
var surveyData = {
    "id":"1",
	"name": "demo Survey",
	"sections" : [
	{
		"name" : "Introduction",
		"section_id":"1",
		"questions" : [
		{
			"qid":"1",
			"type" : "multi",
			"name" : "how are you ?",
			"options" : ["Good", "Better", "Tired"]
		},
		{
			"qid":"2",
			"type": "single",
			"name" : "Where do you live ?",
			"options" : ["Noida", "Delhi", "Gurgaon"]
		}
		]
	},
	{
		"section_id":"2",
		"name" : "Professional ",
		"questions" : [
		{
			"qid":"3",
			"type":"single",
			"name" : "What is your occupation ?",
			"options" : ["Vella", "Civil Engineer", "IT & SOftwares"]
		},
		{
			"qid":"4",
			"type" : "range",
			"name" : "how much experience you have ?",
			"options" : {"min":"0", "max":"50"}
		}
		]
	}
	]
};
function yearGenerator(){
    for (var i = 1970;i < 2019;i++){
        $("#yearList").append('<li class="dropdown-item">'+i+'</li>');
    }
    
    for (var i = 1; i <= 12; i++ ){
        $("#monthList").append('<li class="dropdown-item">'+i+'</li>')
    }
    
}

function dayGenerator(month, year){
    if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12){
        return 31;
    }else if((month == 2) && (year%4 == 0) || ((year%100 == 0) &&(year%400 == 0))){
        return 29;
    }else if(month == 2){
        return 28;
    }else{
        return 30;
    }
}

function rangeType(id, data){
    var range = {};
    range['id'] = id;
    range['data'] = data;
    rangeInput.ranges.push(range);
    range = {};
    return ""
}

function displaySurvey(data){
    $("#surveyFormTemplate").tmpl(data).appendTo("#survey-container");
    console.log(rangeInput)
    rangeInput.ranges.forEach(function(element){
/*        var dd = []
        element.data.forEach(function(s){
            dd.push(parseInt(s))
        })*/
        var min = element.min
        var max = element.max
        $("#"+element.id).bootstrapSlider({
            min: min,
            max: max,
            value: 0,
            ticks_snap_bounds:5,
        });
        var ww = $('.form-group').width();
        $('.slider.slider-horizontal').width(ww);
        window.dispatchEvent(new Event('resize'));    
        dd = [];
    });

}

function YearSelect(){
    $("#yearList").on('click','li.dropdown-item', function(e){
        year = e.target.textContent
        $("input#dateofbirth").val("DD/MM/"+year);
        $("button#monthButton").attr("disabled", false);
    });
    
}
function MonthSelect(){
    $("#monthList").on('click','li.dropdown-item', function(e){
        month = e.target.textContent
        console.log(month)
        var date = $("input#dateofbirth").val();
        $("input#dateofbirth").val(date.replace("MM",month));
        $("button#monthButton").attr("disabled", false);
        var days = dayGenerator(month, year);
        
        for (var i = 1;i < days;i++){
            $("#dayList").append('<li class="dropdown-item">'+i+'</li>');
        }
        $("button#dayButton").attr("disabled",false);
    });
    
}
function DaySelect(){
    $("#dayList").on('click','li.dropdown-item', function(e){
        var day = e.target.textContent
        var date = $("input#dateofbirth").val();
        $("input#dateofbirth").val(date.replace("DD",day));
    });
}

$(document).ready(function(){
    $("button#monthButton").attr("disabled", true);
    $("button#dayButton").attr("disabled", true);
    if($('.actives').prev().attr("id") == null){
        $("#btn-prev").css("display","none");
    }
    yearGenerator();
    dayGenerator(2,2016);
    YearSelect();
    MonthSelect();
    DaySelect();
    $.ajax({
        url:"/preview/test/"+$("input#survey-id").val(),
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        success: function(data){
            console.log(data.response.data.sections);
            displaySurvey(data.response.data.sections);
            console.log(data);
        },
        error: function(e){
            console.log(e);
        }        
    });
/*    displaySurvey(surveyData.sections);
    
    $('.slider').bootstrapSlider().on('change', function(e){
        var slider = bootstrapSlider($(this).)
    })*/
});

function nextSection(){
    if($('.actives').next().attr("id")){
        var cid = $('.actives').attr("id");
        var nid = $('.actives').next().attr("id");
/*        if(validatePage(cid) != true){
            return;
        }*/
        if (cid == "intro"){
            $("#btn-prev").css("display","block");
        }
        var w = $('.actives').width();
        $("#"+nid).css("float","right");
        $("#"+nid).css("margin-left","10px");
        $("#"+cid).animate({width: "0px", height: "0px", overflow:"hidden"},{ duration:650, queue:false});
        $("#"+nid).animate({width: w},{ duration:700, queue:false, complete: function(){
            $("#"+nid).css("float","left");        
            $("#"+nid).addClass('actives')
            $("#"+cid).removeClass('actives')
            $("#"+nid).css("margin-left","0px");

            if($("#"+nid).next().attr("id") == null){
                $("#btn-next").css("display","none");
            }
            
        } });

    }
}

function prevSection(){    
    if($('.actives').prev().attr("id")){
        var cid = $('.actives').attr("id");
        var nid = $('.actives').prev().attr("id");
        var w = $('.actives').width();
        $("#"+nid).css("margin-right","30px");
        $("#"+cid).animate({width: "0px",overflow:"hidden"},{ duration:700, queue:false});
        $("#"+nid).animate({width: w},{ duration:700, queue:false, complete: function(){
            $("#"+nid).addClass('actives')
            $("#"+cid).removeClass('actives')
            $("#"+nid).css("margin-right","0px");
            if($("#"+nid).prev().attr("id")){
                $("#btn-next").css("display","block");
            }else{
                $("#btn-prev").css("display","none");
            }
            
        } });

    }
}

function validatePage(id){
    var formId = $("#"+id).find("div.survey-form").attr("id");
    var arr = [];
    $("#"+formId).find("div.form-group").each(function(index, value){
        if($(this).find('input').val() == ""){
		    $(this).find('input').addClass('is-invalid');
            arr[index] = false;
            return false;
        }else{
            if($(this).find('input').attr("id") == "dateofbirth"){
                if(validateDate($(this).find('input').val())){
                } else {
                    $(this).find('input').addClass('is-invalid');
                    arr[index] = false;
                    return false;
                }
            }
            arr[index] = true;
            $(this).find('input').removeClass('is-invalid');
            $(this).find('input').addClass('is-valid');
        }        
    });
    var status = true;
    arr.find(function(e){
        if(e == false){
            status = false;
            return;
        }
    })
    return status;
}

function validateDate(value) {
    var dateRegex = /^(?=\d)(?:(?:31(?!.(?:0?[2469]|11))|(?:30|29)(?!.0?2)|29(?=.0?2.(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(?:\x20|$))|(?:2[0-8]|1\d|0?[1-9]))([-.\/])(?:1[012]|0?[1-9])\1(?:1[6-9]|[2-9]\d)?\d\d(?:(?=\x20\d)\x20|$))?(((0?[1-9]|1[012])(:[0-5]\d){0,2}(\x20[AP]M))|([01]\d|2[0-3])(:[0-5]\d){1,2})?$/;
    
    return dateRegex.test(value)
}