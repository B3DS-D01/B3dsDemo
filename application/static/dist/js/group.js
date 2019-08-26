            var global_group = [];
            var groupList = [];
            var selectList = [];
            var invitationGroup = [];
            var url = ""

            $(document).ready(function() {
                $("div#modal").on("click", "td a[data-action='delete']", function() {
                    var id = $(this).closest('tr').attr('id');

                    global_group = global_group.filter(function(user) {
                        if (user.userId == id) {
                            return false;
                        }
                        return true;
                    });
                    $('#' + id).remove();
                    console.log(global_group)
                });

                $("tbody#group-users").on("click", "td a[data-action='delete']", function() {
                    var id = $(this).closest('tr').attr('id');

                    global_group = global_group.filter(function(user) {
                        if (user.userId == id) {
                            return false;
                        }
                        return true;
                    });
                    $('#' + id).remove();
                });

                $("tbody#group-users").on("click", "td a[data-action='edit']", function() {
                    var id = $(this).closest('tr').attr('id');
                    showUserDetail(id);
                });

                $("tbody#group-users").on("change", "td input[type='checkbox']", function() {
                    var id = $(this).closest('tr').attr('id');
                    if($(this).prop("checked")){
                        chooseUsersForMessage(id,true);
                    }else{
                        chooseUsersForMessage(id,false);
                    }
                });

                getAllUsers();
                loadAllGroups();
                loadGroup();
            });

            function sendMessage(id){
                if( selectList.length == 0 ){
                    alert("No user selected. Select atleast one user to send message");
                    return;
                }else{
                    if(id == 'send-message'){
                        data = {}
                        data['userList'] = selectList
                        data['message'] = $.trim($("#message").val());
                        $.ajax({
                            url: url+ "/sendMessage",
                            data: JSON.stringify(data),
                            type: "POST",
                            dataType: "json",
                            contentType: "application/json",
                            success: function(data){
                                console.log(data);
                            },
                            error: function(e){
                                console.log(e);
                            }
                        });
                    }else{
                        $("#modalMessage").modal()
                    }
                }
            }
            
            function sendInvitation(id){
                if(global_group.length != 0){
                    global_group.forEach(function(user){
                        if(user.invitation == 0){
                            invitationGroup.push(user)
                        }
                    });
                }
                console.log(invitationGroup)
                if( invitationGroup.length != 0 ){
                    if( id == 'send-invitation' ){
                        $.ajax({
                            url: url+ "/sendInvitation",
                            data: JSON.stringify(invitationGroup),
                            type: "POST",
                            dataType: "json",
                            contentType: "application/json",
                            success: function(data){
                                console.log(data)
                            },
                            error: function(e){
                                console.log(e)
                            }
                        });
                    }else{
                        $("#modalInvitation").modal();
                    }
                } else {
                    alert("Invitation to all users are already sent.");        
                }
                console.log(invitationGroup);
            }
            
            function chooseUsersForMessage(userId, add){
                if(add){
                    global_group.forEach(function(u) {
                            if (u.userId == userId) {
                                selectList.push(u)
                                return false;
                            }
                    });
                }else{
                    selectList = selectList.filter(function(user){
                        if (user.userId == userId){
                            return false;
                        }
                        return true;
                    });
                }
                
                console.log(selectList)
            }
            
            function deleteGroup(id){
                if(id == 'delete-group'){
                    var gid = $("#gid").val();
                    $("#"+id).attr("disabled", true);
                    $("#"+id).append('<span id="btn-spin" class="spinner-border spinner-border-sm"></span>')
                    $.ajax({
                        url: url+ "/deleteGroup/"+gid,
                        data: JSON.stringify({}),
                        type: "POST",
                        dataType: "json",
                        contentType: "application/json",
                        success: function(data){
                            console.log(data)
                            if(data.status == 200){
                                console.log("reached")
                                $("#delete-response").append('<p id="msg">'+data.response.data+'</p>').addClass('success-message');
                                $("#"+id).attr('disabled', false);
                                $('#btn-spin').remove();
								
                            }else{
                                $("#delete-response").append('<p id="msg">'+data.response.data+'</p>').addClass('error-message');                                
                                $("#"+id).attr('disabled', false);
                                $('#btn-spin').remove();
                            }
                        },
                        error: function(e){
                            
                        }
                    });
                }
                
                $("#modal-delete").on('hidden.bs.modal', function(e){
                    console.log(id)
                    $("#msg").remove()
                    $("#delete-response").removeClass('success-message');
                    $("#delete-response").removeClass('error-message');
					location.reload();
                });
                
            }

            function showGroup(data, group) {
                global_group = [];
                data.forEach(function(user){
                    user.invitation = ( user.invitation == "False" ? 0 : ( user.invitation == "True" ? 1 : user.invitation))
                    console.log(user)
                })
                data.forEach(function(user) {
                    global_group.push(user);
                });
                $("#gname").empty();
                $("#gname").text(group.groupName)
                $("#group-users").remove("#gid");
                $("#group-update").fadeOut(100);
                $("#create-group-final").attr("disabled", true);
                $("#create-group-final").removeClass("btn-primary");
                $("#create-group-final").removeClass("btn-primary");
                $("#create-group-final").addClass("btn-dis");
                $("#g3 .u").attr("disabled", false);
                $("#g3 .u").removeClass("btn-dis");
                /*$("#g3 .u").add("disabled", false);*/
/*                $("#update-btn").attr("disabled", false);*/
                $("#group-users").empty();
                $("#create-group-wrapper").delay(100).fadeIn(100);
                $("#groups-list").delay(100).fadeIn(100);
                $("#groupDetailTemplate").tmpl(data).appendTo("#group-users");
                $("#group-users").append('<input type="hidden" id="gid" name="gid" value="' + group.gid + '">');
                console.log(group.gid)
                console.log(global_group)
            }

            //update existing group
            function updateGroup() {
                var id;
                id = $("#gid").val();
                console.log(id)
                console.log(global_group)
                $.ajax({
                    url: url+ "/updateGroup/" + id,
                    data: JSON.stringify(global_group),
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
                    success: function(data) {
                        if (data.status == 200) {
                            alert("Group updated")
                        } else {
                            alert("internal error. try again after some time")
                        }
                    },
                    error: function(e) {

                    }
                })
            }

            function loadGroup() {
                $("div#groups-bar").on("click", "button", function() {
                    var id = $(this).attr("id");
                    var data = new FormData();
                    $.ajax({
                        url: url+ "/loadGroup/" + id,
                        type: "POST",
                        dataType: "json",
                        success: function(data) {
                            console.log(data)
                            $("#messenger").remove()
                            console.log(data.response.data.group.messenger);
                            $("#m-container").append('<input id="messenger" type="text" class="form-control" name="messenger" value='+data.response.data.group.messenger+' readonly />');
                            showGroup(data.response.data.users, data.response.data.group)
                        },
                        error: function(e) {

                        }
                    })
                });
            };


            function loadAllGroups() {
                var groups;
                $.ajax({
                    url: url+ "/loadAllGroups",
                    type: "POST",
                    dataType: "json",
                    success: function(data) {
						console.log(data)
                        groups = data.response.data
                        $("#groupList").tmpl(groups).appendTo("#groups-bar");
                    },
                    error: function(e) {

                    }
                });
            }

            function validateGroup(name) {
                jQuery.each(global_group, function(i, data) {
                    if ("groupName" in data) {
                        delete global_group[i];
                    }
                });
            }

            function createGroup(btn_id) {
                if (btn_id == "create-group-final") {
                    var name = $("#group-name").val();
                    var messenger = $("#messenger").val();
                    if(name == ''){
                        $("#group-name").addClass("is-invalid");
                        return;
                    }else{
                        $("#group-name").removeClass("is-invalid");
                    }
                    if($("#messenger").children("option:selected").val() == '-1'){
                        $("#messenger").addClass("is-invalid");
                        return;
                    }else{
                        $("#group-name").removeClass("is-invalid");
                    }
                    var gname = {
                        'groupName': name,
                        'messenger': messenger
                    }
                    validateGroup(name);
                    global_group.push(gname)
                    $.ajax({
                        url: url+ "/createGroup",
                        data: JSON.stringify(global_group),
                        type: "POST",
                        dataType: "json",
                        contentType: "application/json",
                        success: function(data) {
                            console.log(data)
                            if (data.status == 200) {
                                alert("Success")
                            } else {
                                alert("internal error.Try again after some time")
                            }
                        },
                        error: function(e) {

                        }
                    })

                } else {
                    global_group = []
                    $("#create-group-final").attr("disabled", false);
                    $("#create-group-final").removeClass("btn-dis");
                    $("#create-group-final").addClass("btn-primary");
                    $("#g3 .u").attr("disabled", true);
                    //$("#g3 .u").removeClass("btn-primary");
                    $("#g3 .u").addClass("btn-dis");
/*                    $("#update-btn").attr("disabled", true);
                    $("#update-btn").removeClass("btn-primary");
                    $("#update-btn").addClass("btn-dis");*/
                    
                    $("#group-update").fadeOut(100);
                    //$("ul#users-list").empty();
                    //$("#users-list").remove("#gid")

                    $("#group-users").empty();
                    $("#create-group-wrapper").delay(100).fadeIn(100);
                    $("#groups-list").delay(100).fadeIn(100);
                    $("#messenger").remove();
                    var str = '<select id="messenger" name="messenger" class="form-control">'+
                                             '<option value="-1" selected>Select Messenger</option>'+
                                            '<option value="Telegram">Telegram</option><option value="WhatsApp">WhatsApp</option>'+
                                            '<option value="Hike">Hike</option><option value="Feish">Feish</option></select>';
                    $("#m-container").append(str);

                    
                }

            }

            function validateList(user, list) {
                var valid = true;
                list.forEach(function(data) {
                    if (data.userId == user.userId) {
                        valid = false;
                        return false;
                    }
                });
                return valid;
            }


            function addToGroup(user) {
                if (validateList(user, global_group)) {
                    user['invitation'] = 0
                    global_group.push(user)
                    $("#groupDetailTemplate").tmpl(user).appendTo("#group-users");
                } else {
                    $("li[id='" + user.userId + "']").append($('<span class="tooltiptext1">User Already in Group</span>').fadeIn().delay(1000).fadeOut())
                }

                console.log(global_group)
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
                                addToGroup(arr[value])
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

            function getAllUsers() {
                $.ajax({
                    url: url+ "/loadAllUsers",
                    type: "POST",
                    dataType: "json",
                    success: function(data) {
                        //            autocomplete(document.getElementById("myInput"), countries);
                        //            console.log(data.response.data)
                        autocomplete(document.getElementById("search"), data.response.data)
                    },
                    error: function(e) {

                    }
                });

            }

            function updateUser() {
                var formdata = {};

                $("#registration").children('div.form-group').each(function() {
                    $(this).children('input').each(function() {
                        formdata[$(this).attr('name')] = $(this).val();
                    });
                });

                $("#registration").children('input').each(function() {
                    formdata[$(this).attr('name')] = ($(this).val() == "/") ? "" : $(this).val();
                });

                console.log(formdata)
                $.ajax({
                    url: url+ "/updateUser",
                    data: JSON.stringify(formdata),
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
                    success: function(data) {
                        console.log(data)
                        if (data.status == 200) {
                            $("#myModal").modal("hide");
                            alert("user updated.")
                        }
                    },
                    error: function(e) {

                    }
                });

                console.log(formdata);
            }

            function showUserDetail(userId) {
                var user;
                global_group.forEach(function(u) {
                    if (u.userId == userId) {
                        user = u;
                        return false;
                    }
                });
                console.log(user)
                $("#modal-d").remove();
                $("#modalTemplate").tmpl(user).appendTo("#myModal");
                $("#myModal").modal();
            }
