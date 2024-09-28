import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constants';
import { JwtAuthService } from './jwt.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '5m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthService],
  exports: [AuthService, JwtModule, JwtAuthService],
})
export class AuthModule {}