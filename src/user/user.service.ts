import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as _ from 'lodash';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IToken, IUser } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('Users') private readonly usersModel: Model<IUser>) { }


  async create(createUserDto: CreateUserDto) {
    return await this.usersModel.create(createUserDto);
  }

  async findAll() {
    return await this.usersModel.find();
  }

  async findOne(id: string) {
    return await this.usersModel.findOne({ userId: id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersModel.findOneAndUpdate({ userId: id }, updateUserDto);
  }

  async addToken(id: string, token: IToken) {
    return this.usersModel.findOneAndUpdate({ userId: id }, { $addToSet: { tokens: token } });
  }

  async removeToken(id: string, token: string) {
    return this.usersModel.updateOne({ userId: id, 'tokens.token': token }, {
      $set: {
        'tokens.$.isActive': false
      }
    })
  };
  // new Date(exp_in_seconds * 1000)
  async getTokens(id: string) {
    const getUser = await this.findOne(id);
    const mapTokens = _.map(getUser.tokens, (tokenRecord) => {
      const getTokenLength = tokenRecord.token.length;
      const getSlicedTokens = tokenRecord.token.slice(getTokenLength - 4, getTokenLength);
      return { token: getSlicedTokens, isActive: tokenRecord.isActive }
    });

    return mapTokens;
  }

  async updateTokenUsage(id: string, token: string) {
    return this.usersModel.updateOne({ userId: id, 'tokens.token': token }, {
      $set: {
        'tokens.$.lastUsed': false
      }
    })
  }

  async remove(id: string) {
    return await this.usersModel.findOneAndDelete({ userId: id });
  }
}
