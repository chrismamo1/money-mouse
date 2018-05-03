    var billModal = document.getElementById('billModal');
    var addBillModal = document.getElementById('addBillModal');

    var addBillBtn = document.getElementById('addBill');
    var submit = document.getElementById('submit');

    function modalBillDue() {
        billModal.style.display = "block";
    }

    addBillBtn.onclick = function() {
        addBillModal.style.display = "block";
    }

    var span = document.getElementsByClassName("close")[0];
    var span2 = document.getElementsByClassName("close")[1];

    span.onclick = function() {
        nessModal.style.display = "none";
    }
    
    span2.onclick = function() {
        addBillModal.style.display = "none";
    }
    
    submit.onclick = function() {
        addBillModal.style.display = "none";
    }
    
    window.onclick = function(event) {
        if (event.target == billModal) {
            billModal.style.display = "none";
        }
        if (event.target == addBillModal) {
            addBillModal.style.display = "none";
        }
    }