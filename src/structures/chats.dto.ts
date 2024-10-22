import { ApiProperty } from '@nestjs/swagger';
import { PaginationParams } from '@waha/structures/pagination.dto';
import { ChatIdProperty } from '@waha/structures/properties.dto';
import { getEngineName } from '@waha/version';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

import { SessionQuery } from './base.dto';

/**
 * Queries
 */

export class GetChatMessagesQuery extends SessionQuery {
  limit: number = 100;

  @ApiProperty({
    example: true,
    required: false,
    description: 'Download media for messages',
  })
  downloadMedia: boolean = true;
}

export enum ChatSortField {
  CONVERSATION_TIMESTAMP = 'conversationTimestamp',
  ID = 'id',
  NAME = 'name',
}

export class ChatsPaginationParams extends PaginationParams {
  @ApiProperty({
    description: 'Sort by field',
    enum: ChatSortField,
  })
  @IsOptional()
  @IsEnum(ChatSortField)
  sortBy?: string;
}

/**
 * Events
 */

export class ChatArchiveEvent {
  @ChatIdProperty()
  id: string;

  archived: boolean;

  timestamp: number;
}
