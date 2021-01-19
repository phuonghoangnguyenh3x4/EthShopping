A shopping app based on Ethereum blockchain

### Require ###
  1. node js
  2. npm
  3. Ganache
  4. Metamask wallet
  5. Xampp (installed mysql)
  6. go-ipfs (config to port 5001)
  
### How to run ###
  1. run: 
```
npm i
```
to install node modules

  2. run:
```
ipfs daemon
```
on Command Prompt or Terminal
  
  3. run:
```
rm -r uploads/*
```
to remove all uploaded images on server

  4. Create a new workspace on Ganache
  
  5. Connect Metamask to Ganache (localhost:7545)
  
  6. Import accounts to Metamask
  
  7. run:
```
node migrate.js
```
to migrate database.

  8. run:
```
node main.js
```
to start server (localhost:3000).
  
  
