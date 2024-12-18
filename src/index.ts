import express from 'express';
import 'dotenv/config';
import '#/db';
import { PORT } from '#/utils/variables';
import authRouter from '#/routers/auth';
import audioRouter from '#/routers/audio';
import favouriteRouter from './routers/favourite';
import playlistRouter from './routers/playlist';
import profileRouter from './routers/profile';
import historyRouter from './routers/history';
import "./utils/schedule";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('src/public'));

app.use("/auth", authRouter);
app.use("/audio", audioRouter);
app.use("/favourite", favouriteRouter);
app.use("/playlist", playlistRouter);
app.use("/profile", profileRouter);
app.use("/history", historyRouter);

const port = PORT || 8989;

app.listen(port, () => {
    console.log('PORT is listening on port: ', port);
});

