# Redis chat application

This is a simple chat application using Redis as a message broker. It is a simple chat application that allows users to
send messages to each other.

For me, it's a way to learn how to use Socket.io and Redis as a message broker and how to use it with node.js.

## How to run the application

**_You need to have Docker and Node.js with NPM installed on your machine to run this application._**

1. Clone the repository
2. Run `docker run --name docker-redis -p 6379:6379 -d redis`

   _This will dowload the Redis image and create a Redis container running on your machine with the name `docker-redis`
   and the port `6379` exposed_
3. Run `npm install` to install the dependencies
4. Run `npm run dev` to start the application and `npm run watch-css` (optional) to start the tailwind watcher
5. Open your browser and go to `http://localhost:3001` or another port if you changed it.
6. Enjoy the chat application

## How to use the chat application

1. Select the user in top right corner (John Doe or Jane Doe)
2. Write a message in the input field and click on the send button

   _If you use multiple tabs, you can see the messages being broadcasted to the other user_
3. The message will be sent to the backend and then added to the Redis list

