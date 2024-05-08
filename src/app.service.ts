import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getUsers(): string[] { // Change return type to string[](stirng Array) 
    return ['userOne', 'userTwo'];
  }
}
