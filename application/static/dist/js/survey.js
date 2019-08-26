var counter = 1;
var wrapper = $("#accordion");
var currentSection = "";
var sectionTab = "";
var q_counter = 1;
var sectionNameId = "";
var sectionId = "";
var url = ""
var listofusers = [];

$(document).ready(function() {
    
    $(".left").hide();
    $(".collapse").on('shown.bs.collapse', function(e) {});
    $(".collapse").on('hidden.bs.collapse', function(e) {});
    getAllSurvey();
})

function openSendSurvey(id, _id, sname) {
    $("#survey_id").val(id);
    $("#survey_oid").val(_id);
    $("#survey_name_r").val(sname);
    $("#listofusers").children().remove();
    listofusers = [];
    getAllUsers();
    $("#modal-sendsurvey").modal();
}

function openSurveyEditor() {
    $(".left").show("slide", {
        direction: "left"
    }, 100);
    $(".right").hide("slide", {
        direction: "right"
    }, 1000);
}

function closeSurveyEditor() {
    $(".right").show("slide", {
        direction: "right"
    }, 1000);
    $(".left").hide("slide", {
        direction: "left"
    }, 1000);
}
// function to open section popup when add new section button is clicked
function openSection() {
    $("input#sectionName").val() == "";
    $("#sectionName").removeClass("is-invalid");
    $("#modal-section").modal()

}


$("input[name=section-name]").each(function(e) {

});
// function to close opened section popup when section is added
function addSection() {

    var sectionName = $("input#sectionName").val();
    var id = "section-" + counter;
    var btnid = "btn-" + counter;
    var aria_expanded = true;
    var quest_acc = "section-quest-" + counter
    var accordion_tab = "tab-container-quest-" + quest_acc;
    var sectionContainer = "section-container-" + counter;
    var sectionId = "sInputId-" + counter;
    var sectionTab =
        '<div data-rel="section" id="' + sectionContainer + '">' +
        '<input id="' + sectionId + '" name="section-name" type="hidden" value="' + sectionName + '" />' +
        '<div class="card-header card-tab" role="tab">' +
        '<a class="card-title"  data-toggle="collapse" href="#' + id + '">' + sectionName + '</a>' +
        '<div class="card-header-action">' +
        '<a data-ref="' + sectionContainer + '" class="" href="#" onclick="deleteSection(this.getAttribute(' + '\'data-ref\'' + '));"><i class="material-icons">delete</i></a>' +
        '</div>' +
        '</div>' +
        '<div id="' + id + '" class="card-body collapse show" data-parent="#accordion" >' +
        '<div class="row">' +
        '<div id="' + quest_acc + '" class="accordion quest">' +
        '<div class="card" id="' + accordion_tab + '">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="card-footer">' +
        '<button id="' + btnid + '" data-secid="' + sectionContainer + '" data-name="' + sectionId + '" data-section="' + quest_acc + '" data-tab="' + accordion_tab + '" type="button" class="btn btn-success card-footer-btn" onclick="openQuestion(this.id);">Add Question</button>' +
        '</div>' +
        '</div>';

    if (sectionName == "") {
        $("#sectionName").addClass("is-invalid");
        return;
    }

    $("#sectionName").removeClass("is-invalid");
    $("#modal-section").modal("hide");

    $("#tab-container").append(sectionTab);
    counter++;
    console.log("new section")
    console.log(quest_acc)
    console.log(accordion_tab)
}

// function to open section popup when add new section button is clicked
function openQuestion(id) {
    console.log(id);
    sectionId = $('#' + id).data('secid');
    currentSection = $('#' + id).data('section');
    sectionTab = $('#' + id).data('tab');
    sectionNameId = $('#' + id).data('name');
    console.log(currentSection);
    console.log(sectionTab);
    console.log(sectionNameId);
    $("input#question").val(null);
    $("#question").removeClass("is-invalid");
    $("#modal-question").modal()

}


function addQuestion() {

    var q = $("input#question").val();
    var type = $("input[name=type]:checked").val();
    var quest = "quest_" + q_counter;
    var quest_tab_id = "quest-" + q_counter;
    var quest_form = "quest_form_" + q_counter;
    var quest_container = "quest-container-" + q_counter;

    var str = ''
    if (type == "range") {
        str = '<div data-rel="question" id="' + quest_container + '">' +
            '<div class="card-header card-tab" role="tab">' +
            '<a class="card-title"  data-toggle="collapse" href="#' + quest + '">' + q + '</a>' +
            '<div class="card-header-action">' +
            '<a class="" href="#" data-ref="' + quest_container + '" onclick="deleteSection(this.getAttribute(' + '\'data-ref\'' + '));"><i class="material-icons">delete</i></a>' +
            '</div>' +
            '</div>' +
            '<div id="' + quest + '" class="card-body collapse show" data-parent="#' + currentSection + '" >' +
            '<form data-section="' + sectionId + '" id="' + quest_form + '" class="row">' +
            '<input data-section="' + sectionNameId + '" data-answers="' + quest_form + '" name="question-name" type="hidden" value="' + q + '" />' +
            '<input data-section="' + sectionNameId + '" data-answers="' + quest_form + '" name="question-type" type="hidden" value="' + type + '" />' +
            '<div class="form-group">' +
            '<input name="' + uuidv4() + '" type="text" class="form-control quest-option" placeholder="min value ex. 0"/>' +
            '</div>' +
            '<div class="form-group">' +
            '<input name="' + uuidv4() + '" type="text" class="form-control quest-option" placeholder="max value ex. 100"/>' +
            '</div>' +
            '</form>' +
            '</div>' +
            '</div>';


    } else {
        str = '<div data-rel="question" id="' + quest_container + '">' +
            '<div class="card-header card-tab" role="tab">' +
            '<a class="card-title"  data-toggle="collapse" href="#' + quest + '">' + q + '</a>' +
            '<div class="card-header-action">' +
            '<a class="" href="#" data-ref="' + quest_container + '" onclick="deleteSection(this.getAttribute(' + '\'data-ref\'' + '));"><i class="material-icons">delete</i></a>' +
            '</div>' +
            '</div>' +
            '<div id="' + quest + '" class="card-body collapse show" data-parent="#' + currentSection + '" >' +
            '<form data-section="' + sectionId + '" id="' + quest_form + '" class="row">' +
            '<input data-section="' + sectionNameId + '" data-answers="' + quest_form + '" name="question-name" type="hidden" value="' + q + '" />' +
            '<input data-section="' + sectionNameId + '" data-answers="' + quest_form + '" name="question-type" type="hidden" value="' + type + '" />' +
            '<div class="form-group">' +
            '<input name="' + uuidv4() + '" type="text" class="form-control quest-option"/>' +
            '</div>' +
            '<div class="form-group">' +
            '<input name="' + uuidv4() + '" type="text" class="form-control quest-option"/>' +
            '</div>' +
            '<div class="form-inline">' +
            '<div class="form-group">' +
            '<input name="' + uuidv4() + '" type="text" class="form-control"/>' +
            '</div>' +
            '<div class="form-group">' +
            '<button class="form-control btn-remove" type="button"><i class="material-icons">delete</i></button>' +
            '</div>' +
            '</div>' +
            '</form>' +
            '<div class="card-footer">' +
            '<button type="button" data-quest="' + quest_form + '" class="btn btn-success card-footer-btn" onclick="addOption(this.getAttribute(' + '\'data-quest\'' + '));" >Add Option</button>' +
            '</div>' +
            '</div>' +
            '</div>';
    }

    if (q == "") {
        $("#question").addClass("is-invalid");
        return;
    }
    $("#question").removeClass("is-invalid");
    $("#modal-question").modal("hide");

    $("#" + sectionTab).append(str);
    str = '';
    q_counter++;
}

function addOption(qTab) {
    var option = '<div class="form-inline">' +
        '<div class="form-group">' +
        '<input name="' + uuidv4() + '" type="text" class="form-control quest-option"/>' +
        '</div>' +
        '<div class="form-group">' +
        '<button class="form-control btn-remove" type="button"><i class="material-icons">delete</i></button>' +
        '</div>' +
        '</div>';

    $("#" + qTab).append(option);
}

function deleteSection(id) {
    $("#" + id).remove();
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    )
}

function removeOption() {

}

function saveSurvey() {
    var survey = {};
    var sections = [];
    var section = {};
    var questions = [];
    var question = {};

    $("div[data-rel=section]").each(function(f, e) {
        var id = $(this).attr('id');
        var sectionName = $("#" + id + " > input[name=section-name]").val();

        $("form[data-section=" + id + "]").each(function(a, b) {
            var formId = $(this).attr('id');
            var options = [];
            $("#" + formId).serializeArray().map(function(x) {
                if (x.name == "question-name") {
                    question['name'] = x.value;
                } else if (x.name == "question-type") {
                    question['type'] = x.value;
                } else {
                    options.push(x.value);
                }
            });
            question['options'] = options
            questions.push(question);
            question = {};
            options = [];
            //ok till here
        });

        section['name'] = sectionName;
        section['questions'] = questions;
        sections.push(section);
        section = {}
        questions = [];
    });

    survey['name'] = $("input[name=surveyName]").val();
    survey['sections'] = sections;
    console.log(survey)

    var s = survey.sections;
    s.forEach(function(data, index) {
        var q = data.questions;
        q.forEach(function(d, i) {
            if (d.type == 'range') {
                var min = d.options[0];
                var max = d.options[1]
                d.options = {
                    'min': min,
                    'max': max
                }
            }
        })
    });

    $.ajax({
        url: url+  "/saveSurvey",
        data: JSON.stringify(survey),
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            console.log(data);
            closeSurveyEditor();
            location.reload();
        },
        error: function(e) {
            console.log(e);
        }
    });
}

function getAllSurvey() {
    $.ajax({
        url: url+  "/loadAllSurvey",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            $("#surveyListTemplate").tmpl(data.response.data).appendTo("#survey-list");
            
        },
        error: function(e) {
            console.log(e);
        }
    });

}

function parseDate(dates){
    
    return moment(dates,'YYYY-MM-DD' ).format('YYYY-MM-DD');
}
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/


        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {

                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].name.substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].name.substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + i + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                    //add function here
                    /*insert the value for the autocomplete text field:*/
                    //              inp.value = this.getElementsByTagName("input")[0].value;

                    var value = this.getElementsByTagName("input")[0].value;

                    addUsersForSurvey(arr[value])

                    inp.value = ""
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });

    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function(e) {
        closeAllLists(e.target);
    });
}

function addUsersForSurvey(user) {
    if (checkUserAlreadyInList(user)) {
        $("#messagebox").append('<span class="onerror">User already in the list</span>');
        $("#messagebox").children().first().addClass("not-valid");

    } else {

        listofusers.push(user);
        var elem = '<li class="list-group-item clearfix" id="' + user.id + '">' + user.name +
            '<span class="btn-remove-li">' +
            '<span id="" class="btn btn-xs btn-primary" data-id="' + user.id + '" onclick="removeUserFromSurvey(this.getAttribute(' + '\'data-id\'' + '));">X</span>' +
            '</span>' +
            '</li>';
        $("#listofusers").append(elem);
    }
    console.log(listofusers)
}

function removeUserFromSurvey(id) {
    listofusers = listofusers.filter(function(user) {
        if (user.id == id) {
            $("li#" + id).remove();
            return false;
        }
        return true;
    });

    console.log(listofusers)
}

function checkUserAlreadyInList(user) {
    var isExist = false;
    listofusers.forEach(function(data, index) {
        if (data.id == user.id) {
            isExist = true;
            return;
        }
        console.log("called")
    });

    return isExist;
}

function sendSurveyLink() {
    if (listofusers.length == 0) {
        $("#messagebox").append('<span class="onerror">No user select.</span>');
        $("#messagebox").children().first().addClass("not-valid");
        return;
    } else {
/*        $("#messagebox").children().last().remove();
        $("#messagebox").children().first().removeClass("not-valid");*/
        
        var data = {}
        var sid = $("input#survey_id").val();
        var soid = $("input#survey_oid").val();
        var sname = $("input#survey_name_r").val();
        data['url'] = location.origin;
        data['survey_id'] = sid;
        data['survey_identifier'] = soid;
        data['message'] = $("textarea[name=custom-message]").val();
        data['selected_users'] = listofusers
		data['survey_name'] = sname
        console.log(data);
        
        $.ajax({
            url: url+  "/sendsurvey",
            type: "POST",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            success: function(resp) {
                if(resp.status == 200){
                    alert("Survey link sent to all selected users.");
                }else{
                    alert("Some internal error occured.");
                }
            },
            error: function(e) {

            }
        });
    }    
}

function getAllUsers() {
    $.ajax({
        url: url+  "/loadAllUsers",
        type: "POST",
        dataType: "json",
        success: function(data) {
            console.log(data.response.data)
            autocomplete(document.getElementById("search"), data.response.data)
        },
        error: function(e) {

        }
    });
}

