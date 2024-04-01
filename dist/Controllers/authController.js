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
exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authModel_1 = __importDefault(require("../Models/authModel"));
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
const createJWTToken = (userData, statusCode, res) => {
    const Token = signToken(userData._id);
    userData.password = undefined;
    res.status(statusCode).json({
        status: "Success",
        Token,
        Result: userData,
    });
};
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, gender, password, confirmPassword } = req.body;
        if (!name || !email || !gender || !password || !confirmPassword) {
            return res.status(400).json({
                status: "Signup Failed",
                message: "All fields are required.",
            });
        }
        const newUser = yield authModel_1.default.create({
            name,
            email,
            gender,
            password,
            confirmPassword,
        });
        createJWTToken(newUser, 201, res);
        // res.status(201).json({
        //   status: "Signup successful",
        //   user: newUser,
        // });
    }
    catch (error) {
        return res.status(400).json({
            status: "Signup Failed",
            message: error,
        });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: "Login Failed",
                message: "Please provide required email and password",
            });
        }
        const user = yield authModel_1.default.findOne({ email });
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            return res.status(400).json({
                status: "Login Failed",
                message: "Please provide valid email and password",
            });
        }
        createJWTToken(user, 200, res);
        // res.status(201).json({
        //   status: "Login successful",
        //   user,
        // });
    }
    catch (error) {
        return res.status(400).json({
            status: "Login Failed",
            message: error,
        });
    }
});
exports.login = login;
