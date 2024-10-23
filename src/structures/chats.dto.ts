import { ApiProperty } from '@nestjs/swagger';
import { BooleanString } from '@waha/nestjs/validation/BooleanString';
import { PaginationParams } from '@waha/structures/pagination.dto';
import { ChatIdProperty } from '@waha/structures/properties.dto';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { SessionQuery, WHATSAPP_DEFAULT_SESSION_NAME } from './base.dto';

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

export class GetChatMessageQuery {
  @ApiProperty({
    example: true,
    required: false,
    description: 'Download media for messages',
  })
  @Transform(BooleanString)
  @IsBoolean()
  @IsOptional()
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
