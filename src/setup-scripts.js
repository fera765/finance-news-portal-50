// This file is just informative and won't be executed directly
// Instructions for setting up scripts manually

/*
To run both the development server and JSON Server concurrently, 
you'll need to add these scripts to your package.json:

"scripts": {
  // ...existing scripts
  "server": "node server.js",
  "dev:full": "concurrently \"npm run dev\" \"npm run server\""
}

And install the concurrently package:
npm install concurrently --save-dev

Then you can run both servers with:
npm run dev:full
*/

console.log('Please add the scripts manually to your package.json as instructed in the comments');
