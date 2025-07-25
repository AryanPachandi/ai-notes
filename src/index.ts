import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const JWT_SECRET = "aryan123";
const app = express();
app.use(express.json());

const client = new PrismaClient();

// async function main() {
//   await client.userINFO.create({
//     data: {
//       username: "aryan",
//       email: "aryan@gmail.com",
//       password: "123",
//     },
//   });
// }

//@ts-ignore
function middleware(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ msg: "Token not found" });
    }

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);

        // Type guard for TypeScript
        if (typeof decodedToken === 'object' && 'id' in decodedToken) {
            req.userID = decodedToken.id;
            next();
        } else {
            return res.status(401).json({ msg: "Invalid token structure" });
        }
    } catch (error) {
        return res.status(401).json({ msg: "Invalid or expired token" });
    }
}

app.post('/sign-up', async (req, res) => {
    const { username, email, password } = req.body;

    try {

      await client.userINFO.create({
        data :{
          username : username,
          email : email,
          password : password
        }
      })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering user" });
    }

  });

// LOGIN ROUTE
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await client.userINFO.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        msg: "Invalid email or password",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        msg: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "You are logged in",
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

app.get('/newnote' ,middleware ,  async (req, res) => {

try {
     const {title , content} = req.body;
   //@ts-ignore
  const userID = req.userID;

   const newnote = await client.notes.create({
    data : {
      title : title,
      content :content,
      userID  : userID,
    }
   })
   res.status(201).json({
    msg : "note added successfullly",
    data_added : newnote
   })
} catch (error) {
    res.status(500).json({
      msg: "Internal Server Error",
    });
}
})


app.listen(3000,()=>{
  console.log("working on 3000");

})
