import { Context } from 'aws-lambda';
import { LambdaLog } from 'lambda-log';

export class Logger extends LambdaLog {
  constructor(private stage: string, private context?: Context) {
    super();
    this.setupLoggerOptions();
    this.setupAlertTopic();
  }

  setupLoggerOptions(): void {
    const tags: string[] = [this.stage];
    if (this.context) {
      tags.push(this.context.awsRequestId);
      tags.push(this.context.functionName);
    }

    this.options = {
      tags,
    };
  }

  setupAlertTopic(): void {
    this.on('log', async (msg) => {
      if (msg.level === 'error') {
        // do something
        console.error('send alert message');
      }
    });
  }
}
