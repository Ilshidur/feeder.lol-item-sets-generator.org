import sprites from './sprites';
import tooltips from './tooltips';

const index = (req, res) => {
  res.send('What the hell are you doing here ?');
};

const routes = {
  index,
  sprites,
  tooltips,
};

export default routes;
