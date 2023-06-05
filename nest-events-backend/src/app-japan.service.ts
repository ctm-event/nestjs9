import { Injectable } from '@nestjs/common';

@Injectable()
export class AppJapanService {
  getHello(): string {
    console.log(process.env);
    return 'こんにちは';
  }
}
