# [feeder.lol-item-sets-generator.org](https://feeder.lol-item-sets-generator.org)

[![Slack Status](https://slack.lol-item-sets-generator.org/badge.svg)](https://slack.lol-item-sets-generator.org/)

The https://lol-item-sets-generator.org/ sets builder.

This project builds the best League of Legends recommended items for the website LoL Item Sets Generator.

## What does this code does

* generates the item sets regularly with a cron task and store them in a MongoDB database
* saves the item sets to a given location
* imports the champions and items in a MongoDB database
* generates the champions/items sprites using [league-sprites](https://www.npmjs.com/package/league-sprites) and serves them with [express](https://github.com/expressjs/express)
* provides the tooltips API to lol-item-sets-generator.org using [league-tooltips](https://www.npmjs.com/package/league-tooltips) and [express](https://github.com/expressjs/express)

## Contribute

* Installing :

**REQUIRED** : This project uses [node-canvas](https://github.com/Automattic/node-canvas) (from [node-sprite-generator](https://github.com/selaux/node-sprite-generator)).

Installation instructions [**here**](https://github.com/Automattic/node-canvas/wiki/_pages).

```bash
git clone https://github.com/Ilshidur/feeder.lol-item-sets-generator.org feeder.lol-item-sets-generator.org
cd $_
```

* Running the tool :

 * Build : `npm run build`
 * Set the required env variables as shown in the ecosystem.samle.json5
 * Start : `npm start`

## License

Copyright (c) 2016 Ilshidur

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

**"LoL item sets generator" isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends.
League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.**

## Contact

Contact me at [ilshidur@lol-item-sets-generator.org](mailto:ilshidur@lol-item-sets-generator.org) or [ilshidur@gmail.com](mailto:ilshidur@gmail.com).
