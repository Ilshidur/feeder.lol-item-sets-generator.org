import { CronJob } from 'cron';
import { outputErr } from './log';

// CRON = '*/2 * * * *' = Every 2 minutes

function cronTask (task, cron) {

  const runTask = async () => {
    try {
      await task();
    } catch (e) {
      outputErr(`===> ${e.stack}`);
    }
  };

  if (!cron) {
    console.log('No CRON.');
    runTask();
  } else {
    console.log('Starting CRON ...');
    const cronDone = () => {
      console.log('CRON done.');
    };
    /*const job = */ new CronJob(cron, runTask, cronDone, true, 'Europe/Paris');
    console.log('Started CRON !');
  }

}

export default cronTask;
