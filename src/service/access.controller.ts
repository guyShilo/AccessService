import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
  BadRequestException,
  UsePipes,
  ValidationPipe,
  Request,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import * as express from 'express';
import { UserService } from '../user/user.service';
import { AccessService } from './access.service';
import { CreateAccessDto } from './dto/create-access.dto';

import { IJwtToken } from './dto/token.dto';
import * as _ from 'lodash';

@Controller('')
@UsePipes(new ValidationPipe())
export class AccessController {
  constructor(
    private readonly accessService: AccessService,
    private readonly userService: UserService,
  ) { }
  private readonly logger = new Logger(AccessService.name);

  @Post()
  async generateApiKey(@Body() createAccessDto: CreateAccessDto) {
    const getUser = await this.userService.findOne(createAccessDto.userId);

    try {

      if (_.isEmpty(getUser)) {

        const newUser = {
          userId: createAccessDto.userId,
          permissions: createAccessDto.permissions,
          tokens: [],
        };
        await this.userService.create(newUser);

        this.logger.log(`New user created - id ${createAccessDto.userId} - ${createAccessDto.permissions} permissions`)
      }

      const getApiKey = this.accessService.generateKey(
        createAccessDto.userId,
        createAccessDto.permissions,
      );

      const getTokenRecord = this.accessService.tokenRecord(getApiKey.access_token);
      await this.userService.addToken(createAccessDto.userId, getTokenRecord)


      this.logger.log(`new token generated - userId ${createAccessDto.userId} - ${createAccessDto.permissions} permissions`);
      return getApiKey;
    } catch (error) {
      this.logger.error(error.message);
      throw new BadRequestException();
    }
  }

  @Post('authenticate')
  async authenticate(@Request() request: express.Request) {
    const getAuthHeader = request.headers.authorization;

    if (_.isEmpty(getAuthHeader)) {

      throw new UnauthorizedException();
    }
    const getToken = getAuthHeader.split('Bearer ')[1];

    try {

      this.accessService.validateToken(getToken);

      // @ts-expect-error
      const getDecodedToken: IJwtToken = this.accessService.decodeToken(getToken);
      const getValidToken = this.accessService.generateKey(getDecodedToken.sub, getDecodedToken.permissions);
      const getTokenRecord = this.accessService.tokenRecord(getValidToken.access_token);

      await this.userService.addToken(getDecodedToken.sub, getTokenRecord);
      await this.userService.removeToken(getDecodedToken.sub, getToken);

      return getValidToken;
    } catch (error) {

      this.logger.error(error.message);
      return error;
    }
  }

  @Delete(':id')
  remove(@Param('id') userId: string, @Request() request: express.Request) {
    const getAuthHeader = request.headers.authorization;

    if (_.isEmpty(getAuthHeader)) {

      throw new UnauthorizedException();
    }

    const getToken = getAuthHeader.split('Bearer ')[1];
    try {

      return this.userService.removeToken(userId, getToken);
    } catch (error) {

      this.logger.error(error.message);
      return new BadRequestException();
    }
  }

  // (showing only the last 4 chars, like a credit card) with their status and last recently used date.
  @Get()
  async findAllTokens(@Param('userId') userId: string, @Request() request: express.Request) {
    const getAuthHeader = request.headers.authorization;

    if (_.isEmpty(getAuthHeader)) {

      throw new UnauthorizedException();
    }

    const getToken = getAuthHeader.split('Bearer ')[1];
    try {
      // @ts-expect-error
      const getDecodedToken: IJwtToken = this.accessService.decodeToken(getToken);

      return await this.userService.getTokens(getDecodedToken.sub);
    } catch (error) {

      this.logger.error(error);
      throw new NotFoundException();
    }
  }
}
