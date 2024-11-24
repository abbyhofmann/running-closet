<!-- # ![](client/public/logos/cc-logo.png) -->
# ![](client/public/logos/code-connect-name.png)

Welcome to CodeConnect, a collaborative platform where developers and coding enthusiasts can come together to share knowledge, solve problems, and simply connect.

Initially designed as a basic Q&A application, CodeConnect has been expanded with exciting new features to enhance user interaction and personalization. User profiles, direct messaging, and real-time notifications aim to foster a more engaging and connected community of users.


#### Render Link: https://fall24-project-fall24-team-project-group-3ck6.onrender.com/ 

## Table of Contents
  * [Built With](#built-with)
  * [Features](#features)
    * [User Profiles](#user-profiles)
    * [Messaging](#messaging)
    * [Notifications](#notifications)
  * [Requirements](#requirements)
  * [Running Locally](#running-locally)
  * [Database Architecture](#database-architecture)


## Built With

* Typescript 
* React 
* MongoDB
* Material UI 
* SendGrid API
  

## Features 
CodeConnect contains the following three new features: 

### 1. User Profiles 
A user of CodeConnect must now register with the platform, which creates a personal user profile. Each user has an associated first name, last name, unique username, password, email address, profile graphic, followers list, and following list. There is also a boolean value indicating if a user has been deleted. 

Users can engage with one another in a variety of ways. Each user has their own personal profile page, where they can see all of their profile information and delete their profile. They can view all of the other users that they follow, as well as the users that follow them. Other users have their own profile pages, which the logged-in user can visit to follow/unfollow and view that user's profile information. 

![Class Diagram](readme/registerPage.png)


### 2. Messaging
Users of CodeConnect can also engage in direct and group messaging. Messaging is not restricted to communication between followers - any user can message any other non-deleted user. However, a user can send a blast message, where the message gets sent to each of their followers in a 1:1 conversation with that follower.

![Class Diagram](readme/convo.png)


### 3. Notifications 
When a user sends a message, the recipient(s) of the message will receive a notification. This notification manifests itself in multiple ways. The notification bell in the top right corner of the page will light up and the notification will be added to the dropdown of the icon. On the messaging page, the profile graphic of the conversation to which the message was sent will have a small dot to indicate the new unread message. These two notification indicators will persist until the logged-in user has opened the conversation to read the message. Additionally, the recipient(s) will receive an email informing them of a new message. 

![Class Diagram](readme/notifList.png)
![Class Diagram](readme/emailNotif.png)



## Requirements

This application requires the following to run:

  * [Node.js](https://nodejs.org/) v16.0.0+
  * [MongoDB](https://www.mongodb.com/) v4.0.0+


## Running Locally

  1. Make sure you have all of the software listed in [Requirements](#requirements)

  2. Clone this repository, and `cd` into it:

        ```sh
        git clone git@github.com:neu-cs4530/fall24-project-fall24-team-project-group-505.git; cd fall24-project-fall24-team-project-group-505
        ```

  3. Install the application dependencies in the client, server, and testing directories:

        ```sh 
        npm install
        ```

  4. Configure the necessary environment variables. 

        a. Create a file called .env at the root of the client directory. Add the following line: 
        ```sh
        REACT_APP_SERVER_URL=http://localhost:8000
        ```

        b. Create a file called .env in at the root of the server directory. Add the following lines:
        ```sh
        MONGODB_URI=mongodb://127.0.0.1:27017
        CLIENT_URL=http://localhost:3000
        PORT=8000
        ```
        You will also need to add the SENDGRID_API_KEY variable. You will have to obtain this value by setting up a free SendGrid account here: https://sendgrid.com/en-us/solutions/email-api


  4. Populate the initial database by running the following in the server directory: 
        ```sh
        npx ts-node populate_db.ts mongodb://127.0.0.1:27017/fake_so
        ```

  6. Start the application: 

        Run the following in the server directory to start an HTTP server: 

        ```sh
        npx ts-node server.ts
        ```

        Run the following in the client directory to start a client on port 3000: 

        ```sh
        npm run start
        ```


  7. Visit [localhost:8080](http://localhost:8080/) in your browser. 





## Database Architecture

The schemas for the database are documented in the directory `server/models/schema`.
A class diagram for the schema definition is shown below:

![Class Diagram](readme/dbSchema.png)

