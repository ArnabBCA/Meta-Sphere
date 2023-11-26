
# Meta Sphere

A Facebook/Instagram clone build on MERN Stack.

## Live Demo 🍿
[Meta Sphere](https://meta-sphere.onrender.com/)

### Important Note about live demo 📝
```txt
  Because the project in deployed in render.com in free tier.
  The backend will spin down if the site is not in use for 15 minutes.
  As a result there might be a delay of about 1 minute when visiting the site.
  The fontend will display a spinner loading for 1 minute max please be paitent.
```

## Authors 🧑‍💻

- [@ArnabBCA](https://github.com/ArnabBCA)

## Tech Stack ⚙️
[![My Skills](https://skillicons.dev/icons?i=mongo,express,react,nodejs)](https://skillicons.dev)

## Run Locally 💻

Clone the project

```bash
git clone https://github.com/ArnabBCA/Meta-Sphere.git
```

Go to the project directory

## For Backend 🛠️
```bash
cd api
```

Install dependencies

```bash
npm install
```

To run the `backend`, you will need to add the following environment variables to your `.env` file

```
MONGO_URL='XXXXXXXXXXXXXXXXXX'      # Connect MondoDB Atlas Database         
JWT_SECRET='XXXXXXXXXXXX'           # JWT Secret for both Access and Refresh Token example 'anyKey'
PORT=XXXX                           # specify the Port no in which the backend will run example 5000 

CLIENT_URL='http://localhost:5173'  # Frontend Default URL
                                    
CLOUD_NAME='XXXXXXXXXXXX'           # Cloudinary Cloud Name
API_KEY='XXXXXXXXXXXXX'             # Cloudinary API Key
API_SECRET='XXXXXXXXXXXXX'          # Cloudinary API Secret

EMAIL='XXXXXXXXXXXXXXXXX'           # Your Gamil Id test@gmail.com     (IMPORTANT see below)
PASS='XXXXXXXXXXXX'                 # Googe account 2FA App password   (IMPORTANT see below)
```

`( Optional )` Don't know what `Google App Passwords` is or want to learn more? https://support.google.com/accounts/answer/185833?hl=en 

`( Optional )` If you dont want to give your `Google 2FA App Password Credentials` or having problem login in with `OTP verification` then `navigate` to `controllers folders` then `open auth-controllers.js file` and `comment out` the following lines in the `login function`. After `running` the `frontend` if asked to `verify OTP` simply ignore and go `login page`. You can now login.

```js
// Login a user
const login = async(req, res) => {
    const { email, password } = req.body;
    try {
        const user=await User.findOne({email:email});
        if(!user){
            return res.status(401).json({ message: 'Invalid credentials, could not log you in.' });
        }
        /*if(!user.verified){              //Comment Out These lines if you dont want to verify user after login
            return res.status(401).json({ message: 'Email not Verified' });
        }*/
        const validPassword = await bcrypt.compare(password,user.password);
        if(validPassword){
            const { password, ...userWithoutPassword } = user._doc;
            const token=jwt.sign({email:user.email},'secret',{expiresIn:"1h"});
            const refreshToken=jwt.sign({email:user.email},'secret',{expiresIn:"1d"});

            await user.updateOne({refreshToken:refreshToken});
            res.cookie('jwt',refreshToken,{httpOnly:true ,sameSite:'none',secure:true,maxAge: 24*60*60*1000});
            res.status(200).json({currentUser:userWithoutPassword,token:token});
        }
        else{
            return res.status(401).json({ message: 'Invalid credentials, could not log you in.' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Logging in failed, please try again.' });
    }
}
```
Start the server

```bash
npm run start
```
Your `backend` should give the below output with the `PORT` nunber you mentioned in the `.env` file. 🎊

```bash
[nodemon] starting `node app.js`
Listening on port 5000
```

## For Frontend
```bash
cd web-client
```

Install dependencies

```bash
npm install
```

To run the `frontend`, you will need to add the following environment variables to your `.env` file

```
VITE_BASE_URL='XXXXXXXX'    # The URL in which the backend is running example 'http://localhost:5000/' 
```
Start the frontend 🎨

```bash
npm run dev
```
Your `frontend` should start. Now you can go to the `URL` below 🎉

```bash
http://localhost:5173
```

