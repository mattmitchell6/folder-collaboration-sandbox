## Prerequisites
[Node.js (v9)](https://nodejs.org/en/)

## Instructions

Follow the steps below to get the app running on your local machine.

First, clone the repository and install dependencies.
```bash
$ git clone https://github.com/mattmitchell6/folder-collaboration-sandbox.git
$ cd folder-collaboration-sandbox
$ npm install
```

Create a new [Box application](https://developer.box.com/docs/configuring-service-accounts) and add the generated configuration variables (with generated private key) to the local.js file in the config folder (rename local.sample.js to local.js).

Add the domain, http://localhost:3000 to the list of "Allowed Origins" in the Box Developer Console.


Start the server.

```bash
$ npm start
```

Open a web browser and navigate to [http://localhost:3000/create-users](http://127.0.0.1:3000/create-users) to create 2 dummy users. Copy the 2 unique user IDs from the console and add them to the A_ID, B_ID variables in the index.js file.

Navigate to [http://localhost:3000/](http://127.0.0.1:3000/)
to see the example in action.
