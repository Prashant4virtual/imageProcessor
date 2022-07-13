import express from 'express';
import router from './routes/routes';
import {queryParser} from 'express-query-parser';
const port = 3124;
const app = express();
app.use(queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true
  }));
app.use('/', router);


app.listen(port, () => {
    console.log(`Server started listening on port ${port}`);
});

export default app;
