var calendar = ics();
downloadButton = document.getElementById('download-button');
downloadButton.onclick = function(element) {
    calendar.download();
    const helpLinks = document.getElementById("help-links");
    helpLinks.style.display = "block";
}
