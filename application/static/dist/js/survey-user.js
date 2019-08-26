var year = "";
var month = "";
var rangeInput = {
    "ranges":[]
};
var url = "http://localhost:8440"
var surveyData = null;
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
    console.log(rangeInput)
    var range = {};
    range['id'] = id;
    range['data'] = data;
    rangeInput.ranges.push(range);
    range = {};
    return ""
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

function cacheSurveyData(data){
    surveyData = data;
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
    loadSurvey()    
    rangeTypeInput();
});

function radioTypeClick(e, name){
        console.log(name)
        var value = $('input[name='+name+']:checked').val()
        console.log(value)
        $("input#"+name).val(value);
}

function displaySurvey(data){
    $("#surveyFormTemplate").tmpl(data).appendTo("#survey-container");
    $("#survey-container").children().first().addClass('actives');
    $("#survey-container").children().last()
    .append('<div class="card-footer justify-content-right border-info bg-transparent">'+
            '<button type="button" onclick="submitSurvey(this);" class="btn btn-primary pull-right">Submit</button>'+
            '</div>')
    rangeInput.ranges.forEach(function(element){
        var dd = []
        var min = 0;
        var max = 0;
        if( Array.isArray(element.data) ){
            element.data.forEach(function(s){
                dd.push(parseInt(s))
            });            
        }else{
            min = element.data.min
            max = element.data.max
            console.log(element.data)
            $("#"+element.id).bootstrapSlider({
/*                ticks: max/5,
                ticks_labels: dd,*/
                min: min,
                max: max,
                value: 0,
                ticks_snap_bounds:5,
                step:1
            });
        }
        
        document.getElementById(element.id).addEventListener('input', this.rangeTypeInput);
        
        var ww = $('.form-group').width();
        $('.slider.slider-horizontal').width(ww);
        window.dispatchEvent(new Event('resize'));    
        dd = [];
    })

}

function loadSurvey(){
    var sid = location.pathname.split("/")[2]
    $.ajax({
        url: "/loadsurvey/"+sid,
        type: "POST",
        dataType: "json",
        success: function(data){
            displaySurvey(data.response.data.sections);
            cacheSurveyData(data.response.data)
        },
        error: function(e){
            
        }
        
    })
}

function rangeTypeInput(){
}

function nextSection(){
    if($('.actives').next().attr("id")){
        var cid = $('.actives').attr("id");
        var nid = $('.actives').next().attr("id");
/*        if(validatePage(cid) != true){
            return;
        }*/
        
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
          
            if ($("#"+nid).prev().attr("id") != null){
                $("#btn-prev").css("display","block");
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
            if($("#"+cid).prev().attr("id")){
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

function multiType(id, btnVal, e){
    var multiValue = $("input#"+id).val();
    if($(e).attr('aria-pressed') == "true"){
        var ss = multiValue.split(";")
        ss = $.grep(ss, function(value){
            return value != $(e).text();
        });
        
        multiValue = ss.join(";");
        $("input#"+id).val(multiValue);
    }else{
        //add
        console.log("pressed")
        if(multiValue == ""){
            $("input#"+id).val($(e).text());
        }else{
            multiValue = multiValue+";"+$(e).text();
            $("input#"+id).val(multiValue);
        }
    }

}

var sections = []
var questions = []
var survey = {};

function submitSurvey(){
    survey['survey_name'] = $("input[name=surveyname]").val();
    survey['user_id'] = $("input[name=userId]").val();
    survey['survey_id'] = surveyData.id
    $(".survey-user-panel").each(function(index, element){
        var sec_id = $(element).attr("id");
        var childs = $("#"+sec_id).children();
        childs.each(function (i,e){
            if($(e).hasClass('card-body')){
                var section_child = $(e).children();
                var section = {};
                section_child.each(function(a,b){
                   if($(b).prop('nodeName') == "INPUT" && $(b).prop('name') == "section-name"){
                       section['section_name'] = $(b).prop('defaultValue');
                   }else if($(b).hasClass('survey-form')){
                       //childrens of survey section form which contains section questions
                       var forms = $(b).children();
                       var question = {}
                       forms.each(function(x,y){                           
                           question['question_name'] = $(y).find('label').first().text();
                           question['answer'] = $(y).find('input[type=hidden]').first().val();
                           questions.push(question)
                           question = {}
                       });
                   }
                    section['questions'] = questions;
                    questions = [];
                });
                sections.push(section);
                section = {};
            }
        });
    })
    
    survey['sections'] = sections;
    console.log(survey);
    console.log(surveyData);

    $.ajax({
        url: "/saveresponse",
        type: "POST",
        data:  JSON.stringify(survey),
        dataType: "json",
        contentType: "application/json",
        success: function(resp){
            console.log(resp.response)
            window.history.pushState(null, "", window.location.href);        
            window.onpopstate = function() {
                window.history.pushState(null, "", window.location.href);
            };
            if(resp.status == 200){
                var form = document.createElement('form');
                form.method = 'post';
                form.action = '/success'
                var input = document.createElement('input');
                input.setAttribute("name","data");
                input.setAttribute("type","hidden");
                input.setAttribute("value",resp.response.message);
                form.append(input);
                //add form data here
                $(document.body).append(form)
                form.submit();
            }else{
                alert(resp.response.message);
            }
        },
        error: function(e){
            console.log(e)
        }
    });
}

function validateDate(value) {
    var dateRegex = /^(?=\d)(?:(?:31(?!.(?:0?[2469]|11))|(?:30|29)(?!.0?2)|29(?=.0?2.(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(?:\x20|$))|(?:2[0-8]|1\d|0?[1-9]))([-.\/])(?:1[012]|0?[1-9])\1(?:1[6-9]|[2-9]\d)?\d\d(?:(?=\x20\d)\x20|$))?(((0?[1-9]|1[012])(:[0-5]\d){0,2}(\x20[AP]M))|([01]\d|2[0-3])(:[0-5]\d){1,2})?$/;
    
    return dateRegex.test(value)
}