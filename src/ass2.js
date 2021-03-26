const signup_form = document.forms.signup;


const checkPassword = (password, confirm_password) => {
    if(password.length != confirm_password.length ){
        return 1;
    }

}


signup_form.addEventListener('submit', (event)=>{
    const username = signup_form.username;
    const password = signup_form.password;
    const con_password = signup_form.con_password;

    event.preventDefault();
    console.log("Submit function detect!");
    if (checkPassword(password, con_password) === 1) {
        alert("Confirm password not match input password!");
    }
})

