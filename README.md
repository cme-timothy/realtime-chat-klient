# Realtime chat klient in react with socket.io library

This is a simple realtime chatt klient built for for my last web server and database assignment. This project was built with [React](https://reactjs.org/), [Socket.io](https://socket.io/) library and [Create React App](https://create-react-app.dev/) as its starting template.

## Things to do

### Priority

- restrict one username for each socket.id "crash"
- restrict inroom unique username "crash"
- create more components in home and chatroom

### Logic

- more error handling
- create new guest username if it already exists

### Design

### Logic and Design

- ability to change name - change button from "create name" to "change name" + update name in api
- show if creating room name is empty + send error response from api
- fix send private message to two or more bug - add a recoil toggle true/false
- show who is typing at start when joining room - in db add{ typing: true/false }

## Pre-requisites

Before you proceed to install, you need to have the following tools installed:

- [Node](https://nodejs.org/en/)

## How to install

In order to install you need to run:

```
npm install
```

## How to run project locally

To setup a local development server, run:

```
npm run start
```

## How to build a production bundle

To build the webpage for production, run:

```
npm run build
```

## Other available Scripts

```
npm run test
```

Launches the test runner in the interactive watch mode.

```
npm run eject
```

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.
