/*
***************************************
1.addeventlistener , kicks in whenever any button click. 
2.fetch() , default sends a get req -> redirect to routes.js where we have to handle the url i.e. define what should happen whenever a req reaches
to this route i.e. which part of data we will send as response using res.json(expects an array fetched from database)
3.through blog.js (routes file) send back data extracting from DB.
4.recieve data inside the fxn which is sending fetch req.
5.handle and manipulate using dom. 
****************************************8
476
//AJAX?
1.Genrall idea behidthe use of AJAX is  both ,sending http request and then handling the response, solely using browser-side JS.
2.Threre exist two JS built functions which helps us to do so.
    1.XMLHttpReq
    2.Fetch()
3.All the time in our server-side code,we replied by rendering a template or by sending an HTML code snippet or document or by redirecting to 
another page,which then rendered a template.So we all the time sent a request and got a new page,which will stand rendered and displayed by the 
browser.
4.Using AJAX we don't have to relaod the page.Instead, now as response we will only get a packet of data in return which can be displayed
on screen without reloading the whole-page or redirecting to some new route. We will update only that part of the screen for which we have
ordered data request.

477
//CONSTRUCTORS USED BY AJAX
1.XHR
    And this simply is a built-in object, which is available in the browser in JavaScript, just like that, which in the end gives you a bunch of
    utility methods for sending HttP requests and handling responses for those requests.
2.Nowdays, instead of xml which is clunky to use. We use to send and recieve data in JSON format which is more convinient both for humans and machines.
because XML on the hand is actually unstructured way of sending and recieving data and therefore we need to create our own tags.  We can use XML 
tpp 'axios' which does the job easier for us.
3.fetch() - returns a promise.
    The fetch function is also built into the browser and just like XMLHttpRequest, it's a functionality built into browser-side JavaScript code
    that allows you to send HTTP requests from inside your code and to then handle the responses for those requests.


479
//SENDING AND HANDLING A GET AJAX REQUEST
1.lET's add a commmets.js file under public folder where we will deal with fetching and saving comments with those Ajax requests.
2.Initially WE have added a form with a get(this form doesn't submit any data that should be stored.) request to load  our load comments button 
under post-details ejs and another button where we submit comments,this button is wrapped under post request <form>.
3.So now instead of sending a get req and uploading a new page.Let's get rid of the form and then simply add an event listner ro that button.
4.Our fxn will send a xhr by using fetch() method. By default it sends a get req but can be modified to send a post req.It accepts a url which 
should be loaded on execution as parameter.
5.But the way to set postID is totally different from what we have been doing so for long time. We will use data-anyAttributeName of our choice
and add this to <button> and then can be used to extract using drill method.
     <button id="load-comment" class="btn btn-alt" data-postId="<%= post._id %>">Load Comments</button>
     and then = 
        const postId = loadCommentsBtn.dataset.postId;
        fetch(`/posts/${postId}/comments`)
6.This fetch returns us a promise as response which can be then clubbed with response.json() utility function that will eventually also lead to a 
promise of data as response. But since, in routes folder our way to handle that route sends (renders) another HTMl page, thus this will eventually 
failed. So instead of render we will use res.json() there and pass an array as parameter which should be send as response  .

7.*******The two json() we use are totally different from each other. json we use with res.json in our route handling page actually encodes the 
data for us in the json format to send it back as response whereas response.json in JS decodes the encoded json data back into JS data values.



480
//ESCAPING EJS AND USING JS TO SHOW COMMENTS
1.We get rid of previous para and the load comments button if we do find any comments. So we erase our ejs wrapped data amd only keep the HTML
part to proceed further.
2.WE will dothis by manipuating our DOM. We create a lone fxn whihc does so.

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
3.Now we need to call this fxn inside fetch() to execute this on our recived response

                                    const commentListElement = createCommentList(responseData);
                                    commentsSectionElement.innerHTML = " ";
                                    commentsSectionElement.appendChild(commentListElement);



481
//POST REQ WITH AJAX

1.I don't want the browser to submit the form.I would rather handle it with JavaScript myself so that I can send such a behind the scenes request
and our page don't reload and all the comments that previously showed up on the screen doesn't disappear. 
2.WE need to remove extra attributes that we use with form and then we will add a submit event listner to that.
3. first , we need suppression of the default browser behavior. The default browser behavior would be to send the request on its own. So the
browser would automatically send a request. That's how the browser works. Here, we don't want that. We want to prevent that browser default
and instead write our own code for sending our own request. And we can do this with help of this event object, which we get automatically.
                                    event.preventDefault();
4.And then we will parse the value from the obtained response by using .value method like const commentTitle = commentTitleElement.value;
    const commentText = commentTextElement.value;


482
//HAndLING POST REQ POST AJAX REQ
1.We need  a postid so that we can load the comments for each unique post seperately.So, we add data-postid attribute inside form tag.
                                 <form data-postid="<%= post._id %>">
2.fetch('url to which post req send').

3.To manipulate fetch to send a post req. To do so, we need to pass a object as parameter after url where you can set a method property,and this 
has to be named method because browser site JavaScript will look for this key when the fetch function executes. And by default, this is set to 
get so to a string saying, get,but you can also set it to post.

4.Now, a post request then also needs the data that should be sent with method.
    {
      method:'POST',
      body : JSON.stringify(comments) //sending json formatted data
    }
5.Now, after this execution is transfer to blog.js where we have handled the route.But there is a catch. Till now, our browser was handling all the 
requests but for this part we have used event.preventdefault() which stops the browser from it's default ways. and also we have manually specified 
the browser that the body we are sending isn't urlencoded(default) type but we have change it to json type. Thus, we also need an extra middleware 
that should handle that type of incoming datas.
            app.use(express.json()) // instead 0f express.urlencoded

6.Now, as the last step we need to define extra metadata that are actually very important cuz that in the end defines which type of data we are
sending as a response. As side note, this metadata is actually set by the browser by default, but in our case we have prevented it.

7.But how do these parsing middlewares work in the first place? They actually don't try to simply parse all incoming request bodies and see if it
works or not. Instead, what they do is, they look at the headers off the incoming requests. So at some extra metadata, which is attached to them
and that metadata should contain information about the encoding of the request body. And if the metadata says that it's URL encoded,this
middleware will become active. If the metadata says that it's JSON encoded, this middleware will become active. If the metadata doesn't say
either of the two things,no middleware. So none of these two middlewares will become active.In our case none of them activates.

8.WE need to activate/add that header metadata on our own to fetch object parameter whihc defines in the end the type of header.
        headers : {
        'Content-Type' : 'application/json'
      }

483
//ENHANCING UX 


*/
