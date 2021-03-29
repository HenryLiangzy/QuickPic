import API from './api.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

let login_form = document.forms.login;
let signup_form = document.forms.signup;
let myModal = new bootstrap.Modal(document.getElementById('Alert'), {backdrop: true});
const login_button = document.getElementById("login_button");
const signup_button = document.getElementById("signup_button");
const signOut_button =  document.getElementById("signOut_button");
const home_button = document.querySelector("a[name='homePage'");
const profile_button = document.querySelector("a[name='profilePage'");


const api = new API('http://localhost:5000');
let user_token = undefined;
let user_name = undefined;
let login_user_id = '';

/**
 * Follow up page control function
 */

const toLogin = () => {
    login_form.classList.remove("d-none");
    signup_form.classList.add("d-none");
}

const toSignUp = () => {
    signup_form.classList.remove("d-none");
    login_form.classList.add("d-none");
}

const toSignOut = () => {
    user_token = undefined;
    toLogin();
    console.log("toSignOut")
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

const toProfile = () => {
    document.getElementById("profile").classList.remove("d-none")
    document.getElementById("dashBoard").classList.add("d-none");
}


login_button.addEventListener("click", (event) => toLogin());
signup_button.addEventListener("click", (event) => toSignUp());
signOut_button.addEventListener("click", (event) => toSignOut());
home_button.addEventListener("click", (event) => {
    toDashBoard();
    loadFeed(0, 9);
})
profile_button.addEventListener("click", (event) => {
    toProfile();
})


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
            user_name = username;
            user_token = data.token;

            const option = {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + user_token
                }
            }        

            const getId = api.makeAPIRequest("user", option).then((data) => {
                if(data.message === undefined){
                    login_user_id = data.id;
                }
            })

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
            user_name = username;
            user_token = data.token;

            const option = {
                method: "GET",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Token ' + user_token
                }
            }        

            const getId = api.makeAPIRequest("user", option).then((data) => {
                if(data.message === undefined){
                    login_user_id = data.id;
                }
            })
            toDashBoard();
            loadFeed(0, 9);
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

    const result = api.makeAPIRequest("user", option).then((data) => {
        if(data.username !== undefined){
            return data.username;
        }
    })
    
    return undefined; 
}

const constructLikes = (postId, like_list) => {
    const likeDiv = document.createElement("div");
    likeDiv.className = "row mt-2";
    
    const likeBox = document.createElement("p");
    likeBox.className = "text-sm-start";
    likeBox.setAttribute("name", `LikeBox_${postId}`)
    likeDiv.appendChild(likeBox);
    
    likeBox.innerText = "Like by ";
    
    like_list.map((like_usr_id) => {
        const option = {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + user_token,
            }
        }
        
        const result = api.makeAPIRequest(`user/?id=${like_usr_id}`, option).then((data) => {
            if(data.username !== undefined){
                const spanBox = document.createElement("span");
                spanBox.innerText = data.username+ ", ";
                spanBox.setAttribute("name", `likeSpan_${postId}_${data.username}`);
                likeBox.appendChild(spanBox);
            }
        });
    })

    return likeDiv;
}

const constructComment = (postId, comment_list) => {
    const commentDiv = document.createElement("ol");
    commentDiv.className = "list-group";

    comment_list.map((comment) => {
        const commentLi = document.createElement('li');
        commentLi.className = "list-group-item d-flex justify-content-between align-items-start";

        //text part
        const messageDiv = document.createElement("div");
        messageDiv.className = "ms-2 me-auto";
        const commenter = document.createElement("div");            // author
        commenter.className = "fw-bold";
        commenter.innerText = comment.author;
        messageDiv.appendChild(commenter);
        const commentText = document.createElement("span");         // text
        commentText.innerText = comment.comment;
        messageDiv.appendChild(commentText);
        commentLi.appendChild(messageDiv);

        //timestamp
        const timeStamp = document.createElement("span");
        timeStamp.className = "badge bg-light rounded-pill text-dark";
        timeStamp.innerText = convertTime(comment.published);
        commentLi.appendChild(timeStamp)

        //add to main
        commentDiv.appendChild(commentLi);
    });

    return commentDiv;

}

const clickLike = (postId, button, badge) => {
    const option = {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + user_token
        }
    }

    if(button.value === "Like"){
        const result = api.makeAPIRequest(`post/like?id=${postId}`, option).then((data) => {
            if(data.message === "success"){
                button.innerText = "Unlike";
                button.value = "Unlike";
                badge.innerText = parseInt(badge.innerText) + 1;

                // add to list
                const likeBox = document.querySelector(`p[name='LikeBox_${postId}']`)
                const spanBox = document.createElement("span");
                
                spanBox.innerText = user_name+ ", ";
                spanBox.setAttribute("name", `likeSpan_${postId}_${user_name}`);
                likeBox.appendChild(spanBox);
            }
            else{
                showAlert("Like Error", data.message);
            }
        })
    }
    //dislike
    else{
        const result = api.makeAPIRequest(`post/unlike?id=${postId}`, option).then((data) => {
            if(data.message === "success"){
                button.innerText = "Like";
                button.value = "Like";
                badge.innerText = parseInt(badge.innerText) - 1;

                //remove
                let spanBox = document.querySelector(`span[name='likeSpan_${postId}_${user_name}']`);
                spanBox.remove();
            }
            else{
                showAlert("Like Error", data.message);
            }
        })
    }

    
}

const constructPost = (postID, author, postTime, image_src, likes_list, desc, comment_list) => {
    
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

    const buttonGroup = document.createElement('div');
    buttonGroup.className = "btn-group";

    // for like button and the like numbers
    const likeButton = document.createElement("button");
    likeButton.className = "btn btn-outline-primary";
    likeButton.setAttribute("type", "button");
    likeButton.setAttribute("name", `like_${postID}`);

    if(likes_list.indexOf(login_user_id) == 0){
        likeButton.setAttribute("value", "Unlike");
        likeButton.innerText = "Unlike";
    }
    else{
        likeButton.setAttribute("value", "Like");
        likeButton.innerText = "Like";
    }
    buttonGroup.appendChild(likeButton);

    const badge_button = document.createElement("button")
    badge_button.className = "btn btn-outline-danger"
    badge_button.setAttribute("type", "button");

    const badgeBox = document.createElement("span");
    badgeBox.className = "badge rounded-pill bg-danger";
    badgeBox.setAttribute("name", `badge_${postID}`);
    badgeBox.innerText = likes_list.length;
    badge_button.appendChild(badgeBox)

    buttonGroup.appendChild(badge_button);
    buttonDiv.appendChild(buttonGroup);
    bodyDiv.appendChild(buttonDiv);

    const likeDiv = constructLikes(postID, likes_list);
    bodyDiv.appendChild(likeDiv);
    

    likeButton.addEventListener("click", (event) => {
        clickLike(postID, likeButton, badgeBox);
    })

        
    // for comment
    const comment_num = comment_list.length;
    if(comment_num === 0){
        const commentBox = document.createElement("p");
        commentBox.className = "row mt-2 fw-lighter";
        commentBox.innerText = `There are ${comment_num} comments.`;

        bodyDiv.appendChild(commentBox);
    }
    else{
        const commentBox = constructComment(postID, comment_list);
        bodyDiv.appendChild(commentBox);
    }

    //body append
    postDiv.appendChild(bodyDiv);

    //footer construct
    const footerDiv = document.createElement("div");
    footerDiv.className = "card-footer";
    const formBox = document.createElement("form");
    formBox.className = "row g-2";

    //form component
    const inputBox = document.createElement("input");
    inputBox.className = "col-auto form-control";
    inputBox.setAttribute("type", "text");
    inputBox.setAttribute("name", "comment");
    inputBox.setAttribute('placeholder', 'Leave a comment here');
    formBox.appendChild(inputBox);

    const buttonBox = document.createElement("button");
    buttonBox.className = "col-auto btn btn-outline-primary";
    buttonBox.setAttribute("type", "button");
    buttonBox.innerText = "Send";
    formBox.appendChild(buttonBox);

    //final
    footerDiv.appendChild(formBox);
    postDiv.appendChild(footerDiv);

    return postDiv;
    
}

const loadFeed = (startPage, postNum) => {
    const option = {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + user_token
        }
    }


    const result = api.makeAPIRequest(`user/feed?p=${startPage}&n=${postNum}`, option).then((data) => {
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
                        post.comments
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

// const loadProfile = () => {
//     const option = {
//         method: "GET",
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json',
//             'Authorization': 'Token ' + user_token
//         }
//     }

//     const result = api.makeAPIRequest('user', option).then((data) => {
//         if(data.message === "success"){}
//     })
// }