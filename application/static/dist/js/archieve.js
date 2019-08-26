var files;
var url = "";
/*var data = [
    {
        "filename":"2019-08-12T071856.009Z",
        "transcribed": "hello how are you",
        "created_on": "2019-08-12T071856.009Z"
    },
    {
        "filename":"2019-08-12T071856.009Z",
        "transcribed": "hello how are you",
        "created_on": "2019-08-12T071856.009Z"
    },
    {
        "filename":"2019-08-12T071856.009Z",
        "transcribed": "hello how are you",
        "created_on": "2019-08-12T071856.009Z"
    },
    {
        "filename":"2019-08-12T071856.009Z",
        "transcribed": "hello how are you",
        "created_on": "2019-08-12T071856.009Z"
    }
]*/

function createFileExplorer(){
	$.ajax({
		url: "/listAllFiles",
		type: "POST",
		dataType: "json",
		contentType: "application/json",
		success: function(data){
			if(data.response.status == 200){
				$("#fileContainerTemplate").tmpl(data.response.data).appendTo("#file_container");		
			}else{
				alert(data.response.message)
			}
		},
		error: function(e){
			console.log('error caught')
			console.log(e)
		}
	});
}

function playAudio(btn){
    var id = btn.parentNode.parentElement.getAttribute("id");
    console.log(btn.parentNode.parentElement.getAttribute("id"));
    $("#audio-control-body").append('<audio id="audio-control" controls><source src="'+url+'/stream/'+id+'" type="audio/x-wav"><audio>');
    $("#modalPlay").modal('show');
    var x = document.getElementById("audio-control");
    console.log(x);
    x.play();
}

function onCloseAudioModal(){
    $("#modalPlay").on("hide.bs.modal", function(e){
        var x = document.getElementById("audio-control");
        x.pause();
        x.currentTime = 0;
        $("#audio-control-body").empty();
    });
}

function deleteFile(btn){
    var id = btn.parentNode.parentElement.getAttribute("id");
    console.log(btn.parentNode.parentElement.getAttribute("id"));    
    console.log(files);
    var file;
    $.each(files,function(index,value){
        if(value.id == id){
            file = value.filename
        }
    });

	$.ajax({
		url: url+"/delete/"+id+"/"+file,
		type: "POST",
		dataType: "json",
		contentType: "application/json",
		success: function(data){
            console.log(data.response)
			if(data.response.status == 200){
                alert(data.response.message);
			}else{
				alert(data.response.message);
			}
		},
		error: function(e){
			console.log('error caught')
			console.log(e)
		}
	});
    
}

$(document).ready(function(){
    createFileExplorer();
    onCloseAudioModal();
});