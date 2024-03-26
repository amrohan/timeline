# TimeLine - A simple timeline of events

## Description

This project is a simple timeline of events. Where user can post a picture with title a description and a date. The timeline will show the events in chronological order. it has a simple authentication system using Firebase Authentication and a simple backend using Firebase Firestore and Firebase Storage. It has a simple form to add a new event and a simple card to show the event.All the events are stored in the Firestore database and the images are stored in the Firebase Storage.

## Technologies

- Angular 17
- Tailwind CSS
- Tailwind animations
- Firebase (Firestore, Storage, Authentication)
- @angular/fire (Angular library for Firebase)
- Cloudflare Pages (Hosting)

## Installation

To install the project you need to clone the repository and run the following command:

```bash
git clone https://github.com/amrohan/timeline.git

```

Then you need to install the dependencies using the following command:

```bash
npm i
```

Then you need to create a Firebase project and enable Firestore, Storage, and Authentication. Then you need to create a web app and copy the configuration object and paste it in the environment.ts file in the environment object.

```typescript
    export const environment = {
      production: false,
      firebaseConfig: {
        apiKey: "YOUR_API KEY",
        authDomain : "YOUR_AUTH_DOMAIN",
        projectId : "YOUR_PROJECT_ID",
        storageBucket : "YOUR_STORAGE
        messaging: "YOUR_MESSEGING",
        appId: "YOUR_APP_ID"
      }
    };
```

Also create .env file in the root directory and add the following:

remove the environment object from the environment.ts file and add the following:

```bash
touch .env
```

```bash
    FIREBASE_API_KEY=YOUR_API_KEY
    FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
    FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
    FIREBASE_STORAGE_BUCKET=YOUR_STORAGE
    FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSEGING
    FIREBASE_APP_ID=YOUR_APP_ID
```

<!-- Alert user that he should have two file environment.development.ts & environment.ts environment.ts will be run while in production also there is config.js that writes reads the .env from folder and copies data into environment.ts file on the time of the produciton-->

> :warning: **Important**: You should have two files: `environment.development.ts` and `environment.ts`. The `environment.ts` file will be run while in production. Additionally, there is a `config.js` file that reads the `.env` from the folder and copies data into the `environment.ts` file at the time of production. you can modify according to your needs.

Then you need to enable the Firestore and Storage rules to allow read and write access to the database and storage.

```json
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /{document=**} {
          allow read, write: if request.auth != null;
        }
      }
    }
```

For the Storage rules:

```json
    rules_version = '2';
    service firebase.storage {
      match /b/{bucket}/o {
        match /{allPaths=**} {
          allow read, write: if request.auth != null;
        }
      }
    }
```

Then you need to enable the email/password authentication in the Firebase Authentication.

Then you need to run the following command to start the project:

```bash
ng serve -o
```

Then you can open the browser and navigate to `http://localhost:4200` to see the project.

## Usage

Details about how to use the project.

User can add a new event by clicking on the add event button and filling the form with the title, description, date, and image. The image should be less than 1MB. The user can also delete the event by clicking on the delete button. The user can also sign in using the email and password. The user can also sign out by clicking on the sign-out button.

<!-- Make this table horizotal -->

page and screenshots

| Page                   | Screenshot                                                     |
| ---------------------- | -------------------------------------------------------------- |
| Login Page             | ![Login Page](./src/assets/images/login.png)                   |
| Home Page              | ![Home Page](./src/assets/images/home.png)                     |
| Add Event Page         | ![Add Event Page](./src/assets/images/add.png)                 |
| Update Event Page      | ![Update Event Page](./src/assets/images/update.png)           |
| After Add Event Page   | ![After Add Event Page](./src/assets/images/after-add.png)     |
| Full Screen Event Page | ![Full Screen Event Page](./src/assets/images/full-screen.png) |

## Contributing

Details about how to contribute to this project.

## Tests

Explain how to run the automated tests for this system.

## License

Information about the license.
