# [feeder.lol-item-sets-generator.org](https://feeder.lol-item-sets-generator.org)

> The https://lol-item-sets-generator.org/ sets builder.

[![Slack Status](https://slack.lol-item-sets-generator.org/badge.svg)](https://slack.lol-item-sets-generator.org/)
[![Twitter Follow](https://img.shields.io/twitter/follow/LoL_item_sets.svg?style=social&label=Follow)](https://twitter.com/LoL_item_sets)

![stability-stable](https://img.shields.io/badge/stability-stable-green.svg)

[![Known Vulnerabilities][vulnerabilities-badge]][vulnerabilities-url]
[![dependency status][dependency-badge]][dependency-url]
[![devdependency status][devdependency-badge]][devdependency-url]

**This project builds the best League of Legends recommended items for the website LoL Item Sets Generator.**

## What this code does

* generates the item sets regularly with a cron task and store them in a MongoDB database
* saves the item sets to a given location
* imports the champions and items in a MongoDB database
* generates the champions/items sprites using [league-sprites](https://www.npmjs.com/package/league-sprites) and serves them with [express](https://github.com/expressjs/express)
* provides the tooltips API to lol-item-sets-generator.org using [league-tooltips](https://www.npmjs.com/package/league-tooltips) and [express](https://github.com/expressjs/express)

## Development

**REQUIRED** :
* [node-canvas](https://github.com/Automattic/node-canvas) (used by [node-sprite-generator](https://github.com/selaux/node-sprite-generator)), installation instructions [**here**](https://github.com/selaux/node-sprite-generator#installation)
* [Redis](https://redis.io)
* [PhantomJs](http://phantomjs.org)

**Installing** :

* Install the latest PhantomJS version using [these instructions](https://stackoverflow.com/a/14267295/4022804).

```bash
git clone https://github.com/league-of-legends-devs/feeder.lol-item-sets-generator.org feeder.lol-item-sets-generator.org
cd $_
```

**Running the tool** :

* Build : `npm run build`
* Set the required env variables as shown in the `ecosystem.config.sample.js` file
* Start :
  * Website : `npm start`
  * Worker : `npm run worker`

## License

Copyright (c) 2017 **Nicolas COUTIN**

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

Anyway, if you earn money on my open source work, I will fucking end you :)

**"LoL item sets generator" isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends.
League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.**

## Contact

Contact me at [ilshidur@lol-item-sets-generator.org](mailto:ilshidur@lol-item-sets-generator.org) or [ilshidur@gmail.com](mailto:ilshidur@gmail.com).

[vulnerabilities-badge]: https://snyk.io/test/github/league-of-legends-devs/feeder.lol-item-sets-generator.org/badge.svg
[vulnerabilities-url]: https://snyk.io/test/github/league-of-legends-devs/feeder.lol-item-sets-generator.org
[dependency-badge]: https://david-dm.org/league-of-legends-devs/feeder.lol-item-sets-generator.org.svg
[dependency-url]: https://david-dm.org/league-of-legends-devs/feeder.lol-item-sets-generator.org
[devdependency-badge]: https://david-dm.org/league-of-legends-devs/feeder.lol-item-sets-generator.org/dev-status.svg
[devdependency-url]: https://david-dm.org/league-of-legends-devs/feeder.lol-item-sets-generator.org#info=devDependencies
