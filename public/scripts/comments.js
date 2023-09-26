const loadCommentsBtn = document.getElementById("load-comment");
const commentsSectionElement = document.getElementById("comments");
const commentsFormElement = document.querySelector("#comments-form form");
const commentTitleElement = document.getElementById("title");
const commentTextElement = document.getElementById("text");

function createCommentList(comments) {
  const commentListElement = document.createElement("ol"); //creates an element in HTML using DOM

  for (const commentloop of comments) {
    const commentElement = document.createElement("li");
    commentElement.innerHTML = `
        <article class="comment-item">
        <h2>${commentloop.title}</h2>
        <p>${commentloop.text}</p>
      </article>
      `;

    commentListElement.appendChild(commentElement);
  }
  return commentListElement;
}

async function fetchCommentsforPost() {
  const postId = loadCommentsBtn.dataset.postid;

  //fetch returns us a promise which we get as response to our req
  const response = await fetch(
    `/posts/${postId}/comments`
  ); /*sends a get http req to this url but the key difference between this req and node req is that now this req
    is not sent by the browser. Thus, the response won't be handled by the browser. Instead it's sent manually and therefore now, we as a developer 
    also have to define the exact code that should be executed once we get a response. And that's why we're doing this,because now we'll have full 
    control over what we do with the response. We don't automatically load a new page,we can instead just update the existing page.*/

  const responseData = await response.json(); //JSON doesn't give us the data like this. Instead, it actually also yields a promise to decode the
  //incoming encoded data into JS data values.

  //   console.log(responseData);
  if(responseData && responseData.length > 0){
  const commentListElement = createCommentList(responseData);
  commentsSectionElement.innerHTML = " ";
  commentsSectionElement.appendChild(commentListElement);
  }else {
    commentsSectionElement.firstElementChild.textContent = `we couldn't find any. Maybe add one comment?`
  }
}

async function saveComment(event) {
  event.preventDefault();

  const commentTitle = commentTitleElement.value;
  const commentText = commentTextElement.value;

  const postid = commentsFormElement.dataset.postid;
  const comments = { title: commentTitle, text: commentText };
  //manipulate fetch to send apist req. To do so, we need to pass a object
  const response = await fetch(`/posts/${postid}/comments`, {
    method: "POST",
    body: JSON.stringify(comments), // converting to json format
    headers: {
      "Content-Type": "application/json",
    },
  }); //after this execution is transfer to blog.js where we have handled the route.

  fetchCommentsforPost();
}

loadCommentsBtn.addEventListener("click", fetchCommentsforPost);
commentsFormElement.addEventListener("submit", saveComment);
