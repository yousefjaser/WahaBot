import { WhatsappSession } from '@waha/core/abc/session.abc';
import { WebhookSender } from '@waha/core/integrations/webhooks/WebhookSender';
import { WAHAEvents } from '@waha/structures/enums.dto';
import { WebhookConfig } from '@waha/structures/webhooks.config.dto';
import { WAHAWebhook } from '@waha/structures/webhooks.dto';
import { EventWildUnmask } from '@waha/utils/events';
import { LoggerBuilder } from '@waha/utils/logging';
import { VERSION } from '@waha/version';
import { Logger } from 'pino';

export class WebhookConductor {
  private logger: Logger;
  private eventUnmask: EventWildUnmask;

  constructor(protected loggerBuilder: LoggerBuilder) {
    this.logger = loggerBuilder.child({ name: WebhookConductor.name });
    this.eventUnmask = new EventWildUnmask(WAHAEvents);
  }

  protected buildSender(webhookConfig: WebhookConfig): WebhookSender {
    return new WebhookSender(this.loggerBuilder, webhookConfig);
  }

  private getSuitableEvents(events: WAHAEvents[] | string[]): WAHAEvents[] {
    return this.eventUnmask.unmask(events);
  }

  public configure(session: WhatsappSession, webhooks: WebhookConfig[]) {
    for (const webhookConfig of webhooks) {
      this.configureSingleWebhook(session, webhookConfig);
    }
  }

  private configureSingleWebhook(
    session: WhatsappSession,
    webhook: WebhookConfig,
  ) {
    if (!webhook || !webhook.url || webhook.events.length === 0) {
      return;
    }

    const url = webhook.url;
    this.logger.info(`Configuring webhooks for ${url}...`);
    const events = this.getSuitableEvents(webhook.events);
    const sender = this.buildSender(webhook);
    for (const event of events) {
      session.events.on(event, (data: any) =>
        this.callWebhook(event, session, data, sender),
      );
      this.logger.debug(`Event '${event}' is enabled for url: ${url}`);
    }
    this.logger.info(`Webhooks were configured for ${url}.`);
  }

  public async callWebhook(
    event,
    session: WhatsappSession,
    data: any,
    sender: WebhookSender,
  ) {
    const me = session.getSessionMeInfo();
    const json: WAHAWebhook = {
      event: event,
      session: session.name,
      metadata: session.sessionConfig?.metadata,
      me: me,
      payload: data,
      engine: session.engine,
      environment: VERSION,
    };
    sender.send(json);
  }
}
