import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AppDataSource } from 'db/data-source';
import { User } from 'db/models/Users';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: any) {                  
    const userRepository = AppDataSource.getRepository(User);

    const get_user = await userRepository.findOneBy({
      username: user.username,
    });

    if (get_user && (await bcrypt.compare(user.password, get_user.password))) {
      const payload = { username: user.username, sub: get_user.id };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      return {
        error: 'Username or password is not correct',
      };
    }
  }

  async signup(user: any) {
    const userRepository = AppDataSource.getRepository(User);

    try {
      const saltRounds = 9;

      const hashed_password = await bcrypt.hash(user.password, saltRounds);

      const new_user = userRepository.create({
        username: user.username,
        email: user.email,
        password: hashed_password,
        age: user.age,
      });

      const createUser = await userRepository.save(new_user);

      return {
        message: 'Account created successfully',
      };
    } catch (e) {
      return {
        error: 'This username is already exists.',
      };
    }
  }

  async change_password(user: any) {
    const userRepository = AppDataSource.getRepository(User);

    try {
      const saltRounds = 9;

      const found_user = await userRepository.findOneBy({
        username: user.username,
      });

      if (
        found_user &&
        (await bcrypt.compare(user.current_password, found_user.password))
      ) {
        const hashed_password = await bcrypt.hash(
          user.new_password,
          saltRounds,
        );

        found_user.password = hashed_password;

        const createUser = await userRepository.save(found_user);

        return {
          message: 'Password changed successfully',
        };
      } else {
        return {
          error: 'Passwords does not match',
        };
      }
    } catch (e) {
      return {
        error: 'Error in change password',
      };
    }
  }

  async delete_account(username: string) {
    const userRepository = AppDataSource.getRepository(User);

    try {
      const found_user = await userRepository.findOneBy({
        username: username,
      });

      if (found_user) {
        await userRepository.remove(found_user);

        return {
          message: 'Account deleted successfully',
        };

      } else {
        return {
            error : "Account does not exists"
        }
      }


    } catch (e) {
      return {
        error: 'Error in delete account',
      };
    }
  }
}
