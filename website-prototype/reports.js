//Get divs
dayDiv = document.getElementById("dayDiv");
weekDiv = document.getElementById("weekDiv");
monthDiv = document.getElementById("monthDiv");

//Get buttons
dayBtn = document.getElementById('daily')
weekBtn = document.getElementById('weekly');
monthBtn = document.getElementById('monthly');

dayBtn.onclick = function() {
    weekDiv.style.display = "none";
    monthDiv.style.display = "none";
    dayDiv.style.display = "block";
}

weekBtn.onclick = function() {
    dayDiv.style.display = "none";
    monthDiv.style.display = "none";
    weekDiv.style.display = "block";
}

monthBtn.onclick = function() {
    monthDiv.style.display = "block";
    dayDiv.style.display = "none";
    weekDiv.style.display = "none";
}
