let signup_form = document.forms.signup;
let myModal = new bootstrap.Modal(document.getElementById('myModal'), {backdrop: true});

const showAlert = (alertTitle, alertText) => {
    document.getElementById("alertTitle").innerText = alertTitle;
    document.getElementById("alertText").innerText = alertText;

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
    
    if (password != con_password) {
        showAlert("Error", "Confirm password incorrect!");
    }
})

