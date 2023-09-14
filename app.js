import express from 'express';
import PostsRouter from './routes/posts.router.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    return res.json({ message: 'node 3주차 시험' });
});

app.use('/api', PostsRouter);


app.listen(PORT, () => {
  console.log(`Server listen ${PORT}`)
});