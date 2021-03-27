import API from './api.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

let login_form = document.forms.login;
let signup_form = document.forms.signup;
let myModal = new bootstrap.Modal(document.getElementById('Alert'), {backdrop: true});
const login_button = document.getElementById("login_button");
const signup_button = document.getElementById("signup_button");

// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');

// Example usage of makeAPIRequest method.
// api.makeAPIRequest('dummy/user')
//     .then(r => console.log(r));


// const toLogin = () => {
//     login_form.classList.remove("d-none");
//     signup_form.classList.add("d-none");
//     console.log("toLogin()");
// }

// const toSignUp = () => {
//     signup_form.classList.remove("d-none");
//     login_form.classList.add("d-none");
//     console.log("toSignUp()");
//}

function toLogin () {
    login_form.classList.remove("d-none");
    signup_form.classList.add("d-none");
    console.log("toLogin()");
}

function toSignUp () {
    signup_form.classList.remove("d-none");
    login_form.classList.add("d-none");
    console.log("toSignUp()");
}

login_button.addEventListener("click", (event) => toLogin());
signup_button.addEventListener("click", (event) => toSignUp());


const showAlert = (alertTitle, alertText) => {
    document.getElementById("alertTitle").innerText = alertTitle;
    document.getElementById("alertText").innerText = alertText;

    myModal.show();
}


const login = (username, password) => {
    const login_info = {
        "username": username,
        "password": password
    }

    const result = api.sendPostRequest("auth/login", login_info).then((data) => {
        if(data.token === undefined){
            showAlert("Login Error", data.message);
        }
        else{
            console.log(data.token);
        }
    })
}


login_form.addEventListener('submit', (event)=>{
    event.preventDefault();
    
    const username = login_form.elements.username.value;
    const password = login_form.elements.password.value;
    const con_password = login_form.elements.confirmPassword.value;
    
    if (password !== con_password) {
        showAlert("Error", "Confirm password incorrect!");
    }
    // if nothing wrong. login
    else{
        login(username, password);
    }
})
