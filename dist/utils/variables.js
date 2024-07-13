"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.MONGO_URI = void 0;
const { env } = process;
exports.MONGO_URI = env.MONGO_URI;
exports.PORT = env.PORT;
