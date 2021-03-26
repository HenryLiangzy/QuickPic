let signup_form = document.forms.signup;
let myModal = new bootstrap.Modal(document.getElementById('myModal'), {backdrop: true});

const showAlert = (alertTitle, alertText) => {
    myModal.modalTitle = alertTitle;
    myModal.modalText = alertText;

    myModal.show();
}

const closeAlert = () => {
    myModal.hide();
}

signup_form.addEventListener('submit', (event)=>{
    
    event.preventDefault();
    
    const username = signup_form.elements.username.value;
    const password = signup_form.elements.password.value;
    const con_password = signup_form.elements.confirmPassword.value;

    console.log("Submit function detect!");
    console.log(`password length ${password.length}`);
    console.log(`confirm password length ${con_password.length}`);
    
    if (password != con_password) {
        showAlert("Error", "Confirm password incorrect!");
        //alert("Confirm password incorrect!");
    }
})

