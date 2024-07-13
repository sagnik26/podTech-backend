import express from 'express';
import 'dotenv/config';
import '#/db';
import { PORT } from '#/utils/variables';
import authRouter from '#/routers/auth';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRouter);

const port = PORT || 8989;

app.listen(port, () => {
    console.log('PORT is listening on port: ', port);
});


