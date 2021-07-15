import { Context } from 'aws-lambda';
import { LambdaLog, LambdaLogOptions } from 'lambda-log';

export class Logger extends LambdaLog {
  constructor(private stage: string, private context: Context) {
    super();
    this.setupLoggerOptions();
    this.setupAlertTopic();
  }

  setupLoggerOptions(): void {
    this.options = {
      tags: [this.stage, this.context.awsRequestId, this.context.functionName],
    } as LambdaLogOptions;
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
