// alert('Scrapidy scrape');

var rowsInTable = document.getElementsByTagName('table')[0].rows.length;

var assignmentsTitle = [];
var assignmentsDueDate = [];

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

// console.log("Titles: " + assignmentsTitle);
// console.log("Due Dates: " + assignmentsDueDate);

// returning the assignments to the extension via message
chrome.runtime.sendMessage([assignmentsTitle, assignmentsDueDate, assignmentsDueDate.length]);