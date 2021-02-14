var rowsInTable = document.getElementsByTagName('table')[0].rows.length;

var assignmentsTitle = [];
var assignmentsDueDate = [];
var page = window.location.href

if (page.includes("dropbox")) {

for(index=0; index<rowsInTable; index++){

    // filters the assignment name
    var temp1 = document.getElementsByTagName('table')[0]
        .rows[index]   // rows in table
        .childNodes[0]
        .childNodes[0];

    if(temp1.hasChildNodes()){
        var temp2 = temp1.childNodes[0].childNodes[0];
        if(temp2.hasChildNodes()){
            var assignmentTitle = temp2.textContent;
            console.log(assignmentTitle);
            assignmentsTitle.push(assignmentTitle);
        }
    }

    if(index != 0){
        // filters the assignment dates
        var temp3 = document.getElementsByTagName('table')[0]
            .rows[index];   // rows in table
        
        if(temp3.hasChildNodes()){
            if(temp3.childNodes.length >= 4){
                var temp4 = temp3.childNodes[4];
                if(temp4.hasChildNodes()){
                    console.log(temp4.textContent);
                    assignmentsDueDate.push(temp4.textContent);
                }
            }
        }
    }
}
}

// Quiz Scrapping

if(page.includes("quizzes")){

var titleclass = document.getElementsByClassName("d2l-link d2l-link-inline");
var dates = document.getElementsByClassName("ds_b");
var titles = [];
var datesm = [];
var start = [];
var end = [];
var duedates = [];
var times = []
var availabledates = [];

for (i=0; i<titleclass.length; i++){
    if (titleclass[i].outerText != "On Attempt"){
        titles.push(titleclass[i].outerText);
    }
}

for (i=0; i<dates.length; i++){
    datesm.push(dates[i].outerText);
}

for (var i = 0; i < datesm.length; i++) {
    var split = datesm[i].split("\n");
    start.push(split[0]);
    end.push(split[1]);
}

for (var i = 0; i < start.length; i++) {
    var temp = start[i].slice(7, start[i].length - 9);
    duedates.push((temp));
}
assignmentsTitle = titles;
assignmentsDueDate = duedates;
}

chrome.runtime.sendMessage([assignmentsTitle, assignmentsDueDate, assignmentsDueDate.length]);