transModal = document.getElementById("transModal");

addBtn = document.getElementById("addTrans");
submit = document.getElementById("submit");

span = document.getElementsByClassName("close")[0];

addBtn.onclick = function() {
    transModal.style.display = "block";
}

span.onclick = function() {
    transModal.style.display = "none";
}

submit.onclick = function() {
    transModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == transModal) {
        transModal.style.display = "none";
    }
}
