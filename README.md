
# Meta Sphere

A Facebook/Instagram clone build on MERN Stack.


## Authors

- [@ArnabBCA](https://github.com/ArnabBCA)



## Run Locally

Clone the project

```bash
git clone https://github.com/ArnabBCA/Meta-Sphere.git
```

Go to the project directory

## For Backend
```bash
  cd api
```

Install dependencies

```bash
  npm install
```

To run the backend server, you will need to add the following environment variables to your .env file

```
MONGO_URL='XXXXXXXXXXXXXXXXXX'      # Connect MondoDB Atlas Database         
JWT_SECRET='XXXXXXXXXXXX'           # JWT Secret for both Access and Refresh Token example 'anyKey'
PORT=XXXX                           # specify the Port no in which the backend will run example 5000 

CLIENT_URL='XXXXXXXXXXXXXXXX'       # Frontend URL example 'http://localhost:5173'
                                    
CLOUD_NAME='XXXXXXXXXXXX'           # Cloudinary Cloud Name
API_KEY='XXXXXXXXXXXXX'             # Cloudinary API Key
API_SECRET='XXXXXXXXXXXXX'          # Cloudinary API Secret

EMAIL='XXXXXXXXXXXXXXXXx'           # Your Gamil Id test@gmail.com     (IMPORTANT see below)
PASS='XXXXXXXXXXXX'                 # Googe account 2FA App password   (IMPORTANT see below)
```

Start the server

```bash
  npm run start
```

## For Frontend
```bash
  cd web-client
```

Install dependencies

```bash
npm install
```

To run the backend server, you will need to add the following environment variables to your .env file

```
VITE_BASE_URL='XXXXXXXX'    # The URL in which the backend is running example 'http://localhost:5000/' 
```



