so, i am thinking about a structure that will allow me to have a whatsapp-like chat application.

One thing i should keep in mind is that, there shouldn't be specific chatroom that i open and close.

Because when you think about it, when you are on the whatsapp web you are still gettin notifications from all the "chatroom"

So, what i have in my mind is that when you just logged in and go to the home page, you create a connection with the backend. After that when somebody sends a message to the backend, i should catch that message and distribute it to the 
all the users in the chatroom.


FLOW

1. Login

2. Create a connection with the backend.

3. If an message is sent to any chatroom you are in, two options -> 

Option 1 - You are on the same chatroom, so you should just render the message.

Option 2 - You are not on the same chatroom, so you should just render it as notification on the sidebar.

4. I should store all the active users in the backend. Because i cant send all participants of a chatroom, because they just might not be available at that moment.  

5. You sent a message to the chatroom. You should specify which chatroom you are sending the message.

6. Backend gets the content and the chatroom_id. It should fetch the participants of the chatroom and just sends them.



How to handle Notifications

1. So, i think we need an kind of a map structure in order to store the last seen message for all chatrooms for every user.

2. I am not sure if mongodb has such complicated data structures as maps. So first look into it.

3. If we have we need to have a map field in user model that stores the last seen message for all chatrooms

4. When a user enters a chatroom, we need to update this chatrooms last seen message.

5. When a user leaves the chatroom, we again need to update the last seen message.

6. So, in the main page, when a user receives a message, there is two things to be done.

7. By the way, i think we need a structure in the main page that stores the message count and the last message of every chatroom. 

8. First we will initialize this state from the backend. Then every time we encounter a new message, we need to update message count and last message of that chatroom.

9. Lastly, while we render the chatrooms on the sidebar. We will look at the difference between message count and last seen message index if that difference > 0 render with green notification and the last seen message
