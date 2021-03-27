import API from './api.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';


let login_form = document.forms.login;
let myModal = new bootstrap.Modal(document.getElementById('Alert'), {backdrop: true});

// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');

// Example usage of makeAPIRequest method.
api.makeAPIRequest('dummy/user')
    .then(r => console.log(r));



const showAlert = (alertTitle, alertText) => {
    document.getElementById("alertTitle").innerText = alertTitle;
    document.getElementById("alertText").innerText = alertText;

    myModal.show();
}

const closeAlert = () => {
    myModal.hide();
}

const login = (username, password) => {

}

login_form.addEventListener('submit', (event)=>{
    
    event.preventDefault();
    
    const username = login_form.elements.username.value;
    const password = login_form.elements.password.value;
    const con_password = login_form.elements.confirmPassword.value;
    
    if (password != con_password) {
        showAlert("Error", "Confirm password incorrect!");
    }

    
})
