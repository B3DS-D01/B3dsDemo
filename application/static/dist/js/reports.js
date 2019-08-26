var url = "http://localhost:8440"
var myPieChart;
var barChart;
var barData = {
    labels: ["2015-01", "2015-02", "2015-03", "2015-04", "2015-05", "2015-06", "2015-07", "2015-08", "2015-09", "2015-10", "2015-11", "2015-12"],
    datasets: [{
      label: '# of Tomatoes',
      data: [12, 19, 3, 5, 2, 3, 20, 3, 5, 6, 2, 1],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  };

var data = {
    datasets: [{
        data: [50,25]
    }],

    labels: [
        'Red',
        'Yellow',
    ]
}

var surveyInviationFilterData = {
    survey_id: null,
    invitation_from: null,
    invitation_to: null
}

$(document).ready(function(){
    displayDate();
    reportSurveyFilter();
    generateSurveyInvitationReport();
    barTotalSurvey();
});

function surveySelect(e){
    surveyInviationFilterData.survey_id = e.value
}

function displayDate(){
    $('input[name="dates"]').daterangepicker({
        showCustomRangeLabel:false,
        alwaysShowCalendars:false,
        autoApply: true 
    },function(start, end, label){
        surveyInviationFilterData.invitation_from = start.format('YYYY-MM-DD')
        surveyInviationFilterData.invitation_to = end.format('YYYY-MM-DD')
    });
}

function generateSurveyInvitationReport(){
    var options = {
        responsive:true,
        legend:{
            display:true
        },
        title: {
            display: false,
            text: 'Hello'
        },
        plugins:{
            colorschemes:{scheme:'brewer.RdYlGn4'}
        }
    };
    var ctx = document.getElementById('invitationPie').getContext('2d');
    myPieChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });    
    
}

function filterInvitation(){
    
    if ((surveyInviationFilterData.survey_id == null || surveyInviationFilterData < 1) ){
        $("#select-box-1").hasClass('is-invalid') ? "return" : $("#select-box-1").toggleClass('is-invalid');
        return;
    }else{
        $("#select-box-1").hasClass('is-invalid') ? $("#select-box-1").toggleClass('is-invalid') : "return" ;
    }
    $.ajax({
        url: "/applyfilter",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(surveyInviationFilterData),
        success: function(d){
            console.log(d.data.surveytaken)
            barDataGen(d.data.surveytaken, d.data.invitations);
            var total_invitation = d.data.invitations.length
            var total_taken = d.data.surveytaken.length
            var ndata = [total_invitation, total_taken]
            myPieChart.data.labels = ["total_sent", "total_taken"]
            myPieChart.data.datasets.forEach((dataset) => {
                    dataset.data = ndata;
                });
            myPieChart.update();
            
        },
        error: function(e){
            
        }
    })
}

function barDataGen(tk, inv){
    var tmp = []
    var lbl = [];
    var svcount = [];
    inv.forEach(function(item, index){
        tmp.push(moment(item.created_on,'YYYY-MM-DD' ).format('YYYY-MM-DD'));
    });
    tk.forEach(function(item, index){
        tmp.push(moment(item.created_on,'YYYY-MM-DD' ).format('YYYY-MM-DD'));
    });
    
    
    lbl = removeDuplicate(tmp);
    
    lbl.forEach(function(item, index){
        var count = 0;
       tk.forEach(function(itm, ind){
          if(item == moment(itm.created_on,'YYYY-MM-DD' ).format('YYYY-MM-DD')){
              count++;
          }
       });
        svcount.push(count);
        count = 0;
    });
    console.log(svcount)
    svcount.push(inv.length)
    barChart.data.labels = lbl;
    barChart.data.datasets.forEach((dataset) => {
       dataset.data = svcount; 
        dataset.label = "#no. of users taken survey"
    });
    barChart.update();
}

function removeDuplicate(arr){
    var lbl = []
    $.each(arr, function(i, el){
        if($.inArray(el, lbl) === -1) lbl.push(el);
    });    
    
    lbl =   _.sortBy(lbl, function(o){
        return new moment(o)
    });
    return lbl;
}

function barTotalSurvey(){
    var ctx = document.getElementById("invitationbar");
    barChart = new Chart(ctx, {
      type: 'bar',
      data: barData,
      options: {
        responsive: true,
        scales: {
          xAxes: [{
            ticks: {
              maxRotation: 90,
              minRotation: 80
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
}
function reportSurveyFilter() {
    $.ajax({
        url:  "/loadAllSurvey",
        type: "POST",
        dataType: "json",
        contentType: "application/json",
        success: function(data) {
            $("#surveyTypeFilter").tmpl(data.response.data).appendTo("#surveyNameFilter");
            console.log(data.response.data);
        },
        error: function(e) {
            console.log(e);
        }
    });

}
