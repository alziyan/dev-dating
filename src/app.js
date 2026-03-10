const express = require('express');
const app = express();
const connectDB = require('./config/database');
const User = require('./models/user');
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());


// POST API to create user
app.post("/signup", async (req, res) => {
    try {
        // Validation of data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);

        //   Creating a new instance of the User model
        const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
        });

        await user.save();
        res.send("User created successfully");
    } catch (error) {
        res.status(400).send("ERROR : " + error.message);
    }
});

// POST API for user login
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.send("Login Successful!!!");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//GET API to fetch user by emailId
app.get("/user", async (req, res)=>{
    const emailId = req.body.emailId;
    try{
        const users = await User.find({emailId: emailId});      
        res.send(users);
    } catch (error) {
        res.status(404).send("something went wrong", error.msg);
    }
})

// GET API to fetch all users
app.get("/feed", async (req, res)=>{
    try{
        const users = await User.find({});      
        res.send(users);
    } catch (error) {
        res.status(404).send("something went wrong", error.msg);
    }
})

// Delete the User by ID
app.delete("/user", async (req,res)=>{
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
    // const user = await User.findByIdAndDelete(_id: userId);

        res.send(user, "User deleted successfully");
    } catch (error) {
        res.status(404).send("something went wrong", error.msg);
    }
})


// Update the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
    const data= req.body;
    try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {returnDocument: "after",runValidators: true,});
        res.send(user, "User updated successfully");
    } catch (error) {
    res.status(400).send("UPDATE FAILED:" + error.message);
    }
})

connectDB().then(() => {
    console.log('Connected to MongoDB');
    app.listen(3010, () => {
    console.log('Server is running on port 3010');
});
}).catch((err) => {
    console.error('Error connecting to MongoDB', err);
});

