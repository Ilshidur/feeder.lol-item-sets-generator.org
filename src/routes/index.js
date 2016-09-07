import sprites from './sprites';
import tooltips from './tooltips';

const index = (req, res, next) => {
  res.send('What the hell are you doing here ?');
};

const routes = {
  index: index,
  sprites: sprites,
  tooltips: tooltips
};

export default routes;
