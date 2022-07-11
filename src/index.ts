import express from 'express';
import router from './routes/routes';

const port = 3124;
const app = express();
app.use('/', router);

app.listen(port, () => {
    console.log(`Server started listening on port ${port}`);
});
