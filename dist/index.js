"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const JWT_SECRET = "aryan123";
const app = (0, express_1.default)();
app.use(express_1.default.json());
const client = new client_1.PrismaClient();
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
        const decodedToken = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Type guard for TypeScript
        if (typeof decodedToken === 'object' && 'id' in decodedToken) {
            req.userID = decodedToken.id;
            next();
        }
        else {
            return res.status(401).json({ msg: "Invalid token structure" });
        }
    }
    catch (error) {
        return res.status(401).json({ msg: "Invalid or expired token" });
    }
}
app.post('/sign-up', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        yield client.userINFO.create({
            data: {
                username: username,
                email: email,
                password: password
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering user" });
    }
}));
// LOGIN ROUTE
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Check if user exists
        const user = yield client.userINFO.findUnique({
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
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({
            message: "You are logged in",
            token: token,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Internal Server Error",
        });
    }
}));
app.get('/newnote', middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        //@ts-ignore
        const userID = req.userID;
        const newnote = yield client.notes.create({
            data: {
                title: title,
                content: content,
                userID: userID,
            }
        });
        res.status(201).json({
            msg: "note added successfullly",
            data_added: newnote
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "Internal Server Error",
        });
    }
}));
app.listen(3000, () => {
    console.log("working on 3000");
});
