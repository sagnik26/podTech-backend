"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
require("./db");
const variables_1 = require("./utils/variables");
const app = (0, express_1.default)();
const port = variables_1.PORT || 8989;
app.listen(port, () => {
    console.log('PORT is listening on port: ', port);
});
