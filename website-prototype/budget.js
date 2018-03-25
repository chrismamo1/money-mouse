    // Get the modals
    var editModal = document.getElementById('editModal');
    var nessModal = document.getElementById('necessModal');
    var eatOutModal = document.getElementById('eatingOutModal');
    var gasModal = document.getElementById('gasModal');
    var luxModal = document.getElementById('luxModal');

    // Get the button that opens the modal
    var editBtn = document.getElementById("edit");
    var nessBtn = document.getElementById("necess");
    var eatBtn = document.getElementById("eatOut");
    var gasBtn = document.getElementById("gas");
    var luxBtn = document.getElementById("luxury");

    // treat submit button the same as close buttons
    var submit = document.getElementById("submit");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    var span2 = document.getElementsByClassName("close")[1];
    var span3 = document.getElementsByClassName("close")[2];
    var span4 = document.getElementsByClassName("close")[3];
    var span5 = document.getElementsByClassName("close")[4];
    

    // When the user clicks the button, open the modal 
    nessBtn.onclick = function() {
        nessModal.style.display = "block";
    }
    
    eatBtn.onclick = function() {
        eatOutModal.style.display = "block";
    }
    
    gasBtn.onclick = function() {
        gasModal.style.display = "block";
    }

    luxBtn.onclick = function() {
        luxModal.style.display = "block";
    }
    
    editBtn.onclick = function() {
        editModal.style.display = "block";
    }
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        nessModal.style.display = "none";
    }
    span2.onclick = function() {
        eatOutModal.style.display = "none";
    }
    span3.onclick = function() {
        gasModal.style.display = "none";
    }

    span4.onclick = function() {
        luxModal.style.display = "none";
    }
    span5.onclick = function() {
        editModal.style.display = "none";
    }
    submit.onclick = function() {
        editModal.style.display = "none";
    }
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == nessModal) {
            nessModal.style.display = "none";
        }
        if (event.target == eatOutModal) {
            eatOutModal.style.display = "none";
        }
        if (event.target == gasModal) {
            gasModal.style.display = "none";
        }
        if (event.target == luxModal) {
            luxModal.style.display = "none";
        }
        if (event.target == editModal) {
            editModal.style.display = "none";
        }
    }