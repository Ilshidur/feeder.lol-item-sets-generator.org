import express  from 'express';
import config  from './config';
import routes  from './routes';

const app = express();

app.use('/', routes.index);
app.use('/sprites', routes.sprites);
app.use('/tooltips', routes.tooltips);

app.listen(config.port, () => {
  console.log('Listening on port ' + config.port);
});
