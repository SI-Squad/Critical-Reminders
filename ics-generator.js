var calendar = ics();
downloadButton = document.getElementById('download-button');
downloadButton.onclick = function(element) {
    calendar.download();
}


calendar.addEvent('Demo Event', 'This is an all day event', 'Nome, AK', '1/21/2021', '1/21/2021');
calendar.addEvent('Demo Event', 'This is thirty minute event', 'Nome, AK', '1/21/2021 5:30 pm', '1/21/2021 6:00 pm');