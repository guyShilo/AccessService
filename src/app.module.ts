import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfigService } from './database/database.providers';
import { AccessController } from './service/access.controller';
import { AccessService } from './service/access.service';
import { UserSchema } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';

const mongooseModel = MongooseModule.forFeature([
  {
    name: 'Users',
    schema: UserSchema,
  },
]);

@Module({
  imports: [
    mongooseModel,
    MongooseModule.forRootAsync({
      useClass: MongoConfigService,
    }),
    JwtModule.register({
      secret: 'shh_im_a_secret',
      signOptions: { expiresIn: '3600s' },
    }),
    UserModule],
  exports: [mongooseModel],
  controllers: [AccessController],
  providers: [AccessService, UserService]
})
export class AppModule { }
