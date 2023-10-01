import express from "express";
const app = express();
import mongoose from "mongoose";
const Port = 3000;
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "apiCreation",
  })
  .then(() => console.log("Connected to mongodb"))
  .catch((e) => console.log(e));

const schema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const Message = mongoose.model("user", schema);

app.get("/", (req, res) => {
  res.send("Nice working");
});

app.get("/user/all", async (req, res) => {
  const users = await Message.find({});

  res.json({
    success: true,
    users,
  });
});

app.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  const user = await Message.findById(id);

  res.json({
    success: true,
    user,
  });
});

app.post("/user", async (req, res) => {
  const { name, email, password } = req.body;
  await Message.create({
    name,
    email,
    password,
  });

  res.status(201).json({
    success: true,
    message: "Register Successfully",
  });
});


app.delete("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Assuming you have a User model and Mongoose for MongoDB
    const deletedUser = await Message.findByIdAndRemove(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
});


app.put("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, email, password } = req.body;

    // Assuming you have a User model and Mongoose for MongoDB
    const updatedUser = await Message.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        password,
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
});


app.listen(Port, () => {
  console.log(`Server is listening on Port ${Port}`);
});
