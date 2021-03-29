import API from './api.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

let login_form = document.forms.login;
let signup_form = document.forms.signup;
let myModal = new bootstrap.Modal(document.getElementById('Alert'), {backdrop: true});
const login_button = document.getElementById("login_button");
const signup_button = document.getElementById("signup_button");
const signOut_button =  document.getElementById("signOut_button");

const api = new API('http://localhost:5000');
let user_token = undefined;

/**
 * Follow up page control function
 */

const toLogin = () => {
    login_form.classList.remove("d-none");
    signup_form.classList.add("d-none");
    console.log("toLogin()");
}

const toSignUp = () => {
    signup_form.classList.remove("d-none");
    login_form.classList.add("d-none");
    console.log("toSignUp()");
}

const toSignOut = () => {
    user_token = undefined;

}

const toDashBoard = () => {
    let nav = document.getElementsByName("dashNav")[0];

    nav.classList.remove("d-none");
    document.getElementById("dashBoard").classList.remove("d-none");
    document.getElementById("signPage").classList.add("d-none");
    
    login_button.classList.add("d-none");
    signup_button.classList.add("d-none");
    signOut_button.classList.remove("d-none");
}


login_button.addEventListener("click", (event) => toLogin());
signup_button.addEventListener("click", (event) => toSignUp());


const showAlert = (alertTitle, alertText) => {
    document.getElementById("alertTitle").innerText = alertTitle;
    document.getElementById("alertText").innerText = alertText;

    myModal.show();
}


/**
 * Construct function
 */
const convertTime = (time) => {
    let newTime = new Date(time * 1000);
    return newTime.toLocaleString();
}


/**
 * Follow up sign in/up function
 */


const login = (username, password) => {
    const login_info = {
        "username": username,
        "password": password
    }

    const result = api.sendPostRequest("auth/login", login_info).then((data) => {
        if(data.token === undefined){
            showAlert("Login Error", data.message);
        }
        //login successful
        else{
            console.log(data.token);
            user_token = data.token;
            toDashBoard();
            loadFeed(0, 9);
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

const signup = (username, password, email, name) => {
    const signup_info = {
        "username": username,
        "password": password,
        "email": email,
        "name": name
    }

    const result = api.sendPostRequest("auth/login", signup_info).then((data) => {
        if(data.token === undefined){
            showAlert("SignUp Error", data.message);
        }
        //signup successful
        else{
            console.log(data.token);
            user_token = data.token;
            toDashBoard();
        }
    })
}

signup_form.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = signup_form.elements.username.value;
    const password = signup_form.elements.password.value;
    const con_password = signup_form.elements.confirmPassword.value;
    const email = signup_form.elements.email.value;
    const name = signup_form.elements.name.value;
    
    if (password !== con_password) {
        showAlert("Error", "Confirm password incorrect!");
    }
    // if nothing wrong. sign up
    else{
        signup(username, password, email, name);
    }
})

const getUserNameListById = (id) => {
    const option = {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + user_token,
            'id': id
        }
    }

    let username_list = [];
    

    return username_list
}

const constructLikes = (postId, like_list) => {
    const likeDiv = document.createElement("div");
    likeDiv.className = "row mt-2";
    
    const likeBox = document.createElement("p");
    likeBox.className = "text-sm-start";
    likeDiv.appendChild(likeBox);
    
    likeBox.innerText = "Like by ";

    like_list.map((like_usr_id) => {
        const option = {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + user_token,
                'id': like_usr_id
            }
        }
        
        const result = api.makeAPIRequest('user', option).then((data) => {
            if(data.username !== undefined){
                const spanBox = document.createElement("span");
                spanBox.innerText = data.username;
                spanBox.setAttribute("name", `likeSpan_${postId}_${like_usr_id}`);
                likeBox.appendChild(spanBox);
            }
        })
    })

    return likeDiv;
}

const constructComment = (postId, comment_list) => {
    const commentDiv = document.createElement("div");
}

const constructPost = (postID, author, postTime, image_src, likes_list, desc, comment_num) => {
    
    const postDiv = document.createElement("div");
    postDiv.className = "card";
    postDiv.setAttribute("name", `postId${postID}`);

    // post heading part
    const authorDiv = document.createElement("div");
    authorDiv.className = "card-header";

    const authorBox = document.createElement("h5");
    authorBox.innerText = author;
    authorDiv.appendChild(authorBox)

    const timeBox = document.createElement("p");
    timeBox.className = "text-muted";
    timeBox.innerText = postTime;
    authorDiv.appendChild(timeBox);

    postDiv.appendChild(authorDiv);

    //image
    const imageBox = document.createElement("img");
    imageBox.className = "card-img-top";
    imageBox.setAttribute("src", `data:image/jpeg;base64,${image_src}`);
    postDiv.appendChild(imageBox);

    //body part
    const bodyDiv = document.createElement("div");
    bodyDiv.className = "card-body";

    // description part
    const descBox = document.createElement("p");
    descBox.className = "row card-text text-muted";
    descBox.innerText = desc;
    bodyDiv.appendChild(descBox);

    const buttonDiv = document.createElement("div");
    buttonDiv.className = "d-flex flex-row my-2";

    // for like button and the like numbers
    const likeButton = document.createElement("button");
    likeButton.className = "btn btn-outline-primary";
    likeButton.setAttribute("type", "button");
    likeButton.innerText = "Like ";
    const badgeBox = document.createElement("span");
    badgeBox.className = "badge rounded-pill bg-secondary";
    badgeBox.innerText = likes_list.length;
    likeButton.appendChild(badgeBox);

    buttonDiv.appendChild(likeButton);

    const commentButton = document.createElement("button");
    commentButton.className = "btn btn-outline-primary";
    commentButton.setAttribute("type", "button");
    commentButton.innerText = "Comment";
    buttonDiv.appendChild(commentButton);

    bodyDiv.appendChild(buttonDiv);

    if(likes_list.length !== 0){
        const likeDiv = constructLikes(postID, likes_list);
        bodyDiv.appendChild(likeDiv);
    }
        
    // for comment
    console.log("still skip")
    const commentBox = document.createElement("p");
    commentBox.className = "row mt-2 fw-lighter";
    commentBox.innerText = `There are ${comment_num} comments.`;

    bodyDiv.appendChild(commentBox);

    //final
    postDiv.appendChild(bodyDiv);

    return postDiv;
    
}

const loadFeed = (startPage, postNum) => {
    const option = {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + user_token,
            'p': startPage,
            'n': postNum
        }
    }

    const result = api.makeAPIRequest("user/feed", option).then((data) => {
        if(data.posts === undefined){
            showAlert("Post Error", data.message);
        }
        else{
            const posts = data.posts;
            // if not post, load remind page
            if(posts.length === 0){
                document.getElementById("noFeed").classList.remove("d-none");
                document.getElementById("Feed").classList.add("d-none");
            }

            // if have post
            else{
                const feed_area = document.getElementById("Feed");
                posts.map((post) => {
                    console.log(post);
                    const postCard = constructPost(
                        post.id,
                        post.meta.author,
                        convertTime(post.meta.published),
                        post.src,
                        post.meta.likes,
                        post.meta.description_text,
                        post.comments.length
                    );
                    feed_area.appendChild(postCard);

                    const divider = document.createElement("div");
                    divider.className = "invisible p-2";
                    divider.innerText = "===";
                    feed_area.appendChild(divider);
                })
            }
        }
    })
}

const likePost = (postId) => {
    const option = {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': user_token,
            'id': postId
        }
    }

    const result = api.makeAPIRequest("post/like", option).then((data) => {

    })
}