# Chat Challenge

- ### Instructions
   To execute the code you should have Nodejs and npm installed on your PC

   This is a monorepo that holds 3 projects:
   
   - **chat_api**: Chat server (REST API) (listening port 8000)
   - **chat_front**: Chat page (Listening port 3000)
   - **chat_bot**:  Stock chat bot (Listening rabbitmq queues)

   First of all you should create the environment files for the `chat_api` and `chat_bot` projects following the examples located in:

   > chat_bot/src/config/env/.env.example
   > chat_api/src/config/env/.env.example

  To serve all the artifacts follow the steps below:

  1. Serve the database and message broker running the following command
    ```
    $ docker compose up db message_broker
    ```
  2. cd into `chat_api` folder and execute the following command `$ npm start`
  3. cd into `chat_front` folder and execute the following command `$ npm start`
  4. cd into `chat_bot` folder and execute the following command `$ npm start`

  To access the front go to `http://localhost:3000/`.


  # Usage

  1. Register an user, the system will join the user in 3 default chatrooms (Work, Friends and General).
  2. Log in to the system with the user created
  3. In order to chat you **must** click in one of the available rooms.
  4. Enjoy chatting!:)
  5. To ask for a stock qoute to the stock bot type `/stock={your_stock_code}.{country}`. 

    > Example: `/stock=msft.us`



## WIP

- Complete docker-compose setup to wait message-broker start before api and bot.
