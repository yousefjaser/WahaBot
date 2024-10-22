import { PaginationParams } from '@waha/structures/pagination.dto';
import * as lodash from 'lodash';
import { Client } from 'whatsapp-web.js';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { LoadWAHA } = require('./_WAHA.js');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { LoadLodash } = require('./_lodash.js');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { LoadPaginator } = require('./_Paginator.js');

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ChatFactory = require('whatsapp-web.js/src/factories/ChatFactory');

export class WebjsClient extends Client {
  async inject() {
    // Even tho this.inject is not defined as interface in Client.ts
    // We can still call and override it
    // @ts-ignore
    await super.inject();

    // Load util functions (serializers, helper functions)
    await this.pupPage.evaluate(LoadLodash);
    await this.pupPage.evaluate(LoadPaginator);
    await this.pupPage.evaluate(LoadWAHA);
  }

  async getChats(pagination?: PaginationParams) {
    if (lodash.isEmpty(pagination)) {
      return await super.getChats();
    }

    // Get paginated chats
    pagination.limit ||= Infinity;
    pagination.offset ||= 0;

    const chats = await this.pupPage.evaluate(async (pagination) => {
      // @ts-ignore
      return await window.WAHA.getChats(pagination);
    }, pagination);

    return chats.map((chat) => ChatFactory.create(this, chat));
  }
}
