import API from './api.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

let login_form = document.forms.login;
let signup_form = document.forms.signup;
let myModal = new bootstrap.Modal(document.getElementById('Alert'), {backdrop: true});
let modal_display = new bootstrap.Modal(document.getElementById('modal_display'), {backdrop: true});
const login_button = document.getElementById("login_button");
const signup_button = document.getElementById("signup_button");
const signOut_button =  document.getElementById("signOut_button");
const home_button = document.querySelector("a[name='homePage'");
const profile_button = document.querySelector("a[name='profilePage'");


const api = new API('http://localhost:5000');
let user_token = undefined;
let user_name = undefined;
let login_user_id = undefined;
let login_user_following = undefined;
let last_page = 0

/**
 * Follow up page control function
 */

const toLogin = () => {
    login_form.classList.remove("d-none");
    signup_form.classList.add("d-none");
    last_page = 0;
}

const toSignUp = () => {
    signup_form.classList.remove("d-none");
    login_form.classList.add("d-none");
    last_page = 0;
}

const toSignPage = () => {
    document.getElementById('signPage').classList.remove('d-none');
    document.getElementById('dashBoard').classList.add('d-none');
    document.getElementById('Feed').classList.add('d-none');
}

const toSignOut = () => {
    user_token = undefined;
    user_name = undefined;
    login_user_id = '';
    last_page = 0;

    if(last_page === 1){
        clearPost();
        toSignPage();
    }
    else if(last_page === 2){
        clearProfilePic();
        toSignPage();
    }
}

const toDashBoard = () => {
    if(last_page === 0){
        let nav = document.getElementsByName("dashNav")[0];

        nav.classList.remove("d-none");
        document.getElementById("dashBoard").classList.remove("d-none");
        document.getElementById("signPage").classList.add("d-none");
        
        login_button.classList.add("d-none");
        signup_button.classList.add("d-none");
        signOut_button.classList.remove("d-none");
    }
    else if(last_page === 2){
        document.getElementById('profile').classList.add('d-none');
        document.getElementById("dashBoard").classList.remove("d-none");
    }

    last_page = 1
}

const toProfile = () => {
    document.getElementById("profile").classList.remove("d-none")
    document.getElementById("dashBoard").classList.add("d-none");
}


const clearPost = () => {
    const dashBoard = document.getElementById('dashBoard');
    let feed = document.getElementById('Feed')

    feed.remove()

    const new_feed = document.createElement('div')
    new_feed.className = "col-lg-8 col-md-6 col-sm-auto"
    new_feed.setAttribute('id', 'Feed');

    dashBoard.appendChild(new_feed)
    
}

const clearProfilePic = () => {
    const pro_pic = document.querySelector("div[name='profile_pic']")
    
    while(pro_pic.firstChild){
        pro_pic.removeChild(pro_pic.firstChild)
    }
}


login_button.addEventListener("click", (event) => toLogin());
signup_button.addEventListener("click", (event) => toSignUp());
signOut_button.addEventListener("click", (event) => toSignOut());
home_button.addEventListener("click", (event) => {
    if(last_page === 0){
        toDashBoard();
        loadFeed(0, 9);
    }
    else if(last_page === 2){
        clearProfilePic();
        toDashBoard();
        loadFeed(0, 9);
    }
})
profile_button.addEventListener("click", (event) => {
    if(last_page === 1){
        clearPost()
        toProfile();
        loadProfile(0);
    }

    else if(last_page === 2){
        clearProfilePic();
        loadProfile(0);
    }
    
    last_page = 2
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
                if(data.id !== undefined){
                    login_user_id = data.id;
                    login_user_following = data.following;
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
                if(data.id !== undefined){
                    login_user_id = data.id;
                    login_user_following = data.following;
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
    postDiv.className = "card ass-post";
    postDiv.setAttribute("name", `postId${postID}`);

    // post heading part
    const authorDiv = document.createElement("div");
    authorDiv.className = "card-header";

    const authorBox = document.createElement("button");
    authorBox.className = "btn btn-light";
    authorBox.innerText = author;
    authorDiv.appendChild(authorBox)

    authorBox.addEventListener('click', (event) => {
        clearPost()
        toProfile();
        loadProfile(1, author);
        last_page = 2;
    })

    const timeBox = document.createElement("p");
    timeBox.className = "fw-light text-muted";
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

const constructProfilePost = (postId, parentNode) => {
    const colDiv = document.createElement("div")
    colDiv.className = 'col ass-pro-pic'

    const shadowDiv = document.createElement('div')
    shadowDiv.className = 'card shadow-sm'

    const option = {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + user_token
        }
    }

    const result = api.makeAPIRequest(`post/?id=${postId}`, option).then((data) => {
        const imgBox = document.createElement('img')
        imgBox.className = 'bd-placeholder-img card-img-top'
        imgBox.setAttribute('src', `data:image/jpeg;base64,${data.thumbnail}`)
        shadowDiv.appendChild(imgBox);

        const descDiv = document.createElement('div')
        descDiv.className = 'card-body'
        const descBox = document.createElement('p')
        descBox.className = 'card-text'
        descBox.innerText = data.meta.description_text
        descDiv.appendChild(descBox)
        shadowDiv.appendChild(descDiv)

        colDiv.appendChild(shadowDiv)

        parentNode.appendChild(colDiv)
    })
}

const loadProfile = (type, user_info) => {
    const pro_name = document.querySelector("h3[name='profile_name']");
    const pro_username = document.querySelector("p[name='profile_username']")
    const pro_follow = document.querySelector("p[name='profile_follow']")
    const pro_email = document.querySelector("a[name='profile_email']")
    const pro_pic = document.querySelector("div[name='profile_pic']")
    const pro_button = document.querySelector("button[name='profile_button']")
    let data_following = undefined;


    const option = {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + user_token
        }
    }

    if(type === 0){
        if(user_info === undefined){
            user_info = login_user_id;
        }

        const result = api.makeAPIRequest(`user/?id=${user_info}`, option).then((data) => {
            if(data.username !== undefined){
                pro_name.innerText = `Hi, ${data.name}`;
                pro_username.innerText = ` @${data.username}`
                pro_follow.innerText = `Following: ${data.following.length} | Follower: ${data.followed_num}`
                pro_email.innerText = data.email;
                data_following = data.following;

                if(login_user_following.indexOf(data.id) === -1 && data.id !== login_user_id){
                    pro_button.className = "col-1 btn btn-sm btn-outline-primary"
                    pro_button.innerText = "+"
                }
                else if(login_user_following.indexOf(data.id) !== -1 && data.id !== login_user_id){
                    pro_button.className = "col-1 btn btn-sm btn-outline-danger"
                    pro_button.innerText = "-"
                }
                else{
                    pro_button.className = "col-1 btn btn-sm btn-outline-light"
                    pro_button.innerText = "x"
                }

                
                //construct the post
                data.posts.map((post) => {
                    constructProfilePost(post, pro_pic)
                })
            }
        })
    }
    else{
        const result = api.makeAPIRequest(`user/?username=${user_info}`, option).then((data) => {
            if(data.username !== undefined){
                pro_name.innerText = `Hi, ${data.name}`;
                pro_username.innerText = ` @${data.username}`;
                pro_follow.innerText = `Following: ${data.following.length} | Follower: ${data.followed_num}`;
                pro_email.innerText = data.email;
                data_following = data.following;

                if(login_user_following.indexOf(data.id) === -1 && data.id !== login_user_id){
                    pro_button.className = "col-1 btn btn-sm btn-outline-primary"
                    pro_button.innerText = "+"
                }
                else if(login_user_following.indexOf(data.id) !== -1 && data.id !== login_user_id){
                    pro_button.className = "col-1 btn btn-sm btn-outline-danger"
                    pro_button.innerText = "-"
                }
                else{
                    pro_button.className = "col-1 btn btn-sm btn-outline-light"
                    pro_button.innerText = "x"
                }

                pro_button.addEventListener('click', (event) => {
                    clickFollow(user_info, pro_button, data.id)
                })


                //construct the post
                data.posts.map((post) => {
                    constructProfilePost(post, pro_pic)
                })
            }
        })
    }

    pro_follow.addEventListener('click', (event) => {
        console.log("listener add 1")
        clickFollowing(data_following);
    }, {once: true})
    
}




const clickFollow = (author, button, author_id) => {
    const option = {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + user_token
        }
    }

    if(button.innerText === '+'){
        const result = api.makeAPIRequest(`user/follow?username=${author}`, option).then((data) => {
            if(data.message === 'success'){
                //refresh page
                login_user_following.push(author_id)
                clearProfilePic();
                loadProfile(1, author);
                // button.innerText = '-'
            }
        })
    }
    else if(button.innerText === '-'){
        const result = api.makeAPIRequest(`user/unfollow?username=${author}`, option).then((data) => {
            if(data.message === 'success'){
                //refresh page
                login_user_following.splice(login_user_following.indexOf(data.id), 1);
                clearProfilePic();
                loadProfile(1, author);
                // button.innerText = '+'
            }
        })
    }
}


const clickFollowing = (follow_list) => {
    console.log("follow list:", follow_list)
    const modal_text = document.getElementById('modalText');
    const modal_title = document.getElementById('modalTitle');

    //clear the modal text
    while(modal_text.firstChild){
        modal_text.removeChild(modal_text.firstChild);
    }

    console.log(modal_text);

    const option = {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token ' + user_token
        }
    }

    modal_title.innerText = "People following";
    follow_list.map((the_follow) => {
        const result = api.makeAPIRequest(`user/?id=${the_follow}`, option).then((data) => {
            if(data.username !== undefined){
                const spanBox = document.createElement('span')
                spanBox.innerText = data.username + ', '
                modal_text.appendChild(spanBox);
            }
        })
    })

    modal_display.show();
}