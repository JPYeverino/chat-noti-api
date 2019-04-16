import { Injectable } from '@nestjs/common';
import { Configuration } from './configuration.enum';
import { get } from 'config';

@Injectable()
export class ConfigurationService {

    static user_api_ur: string = get(Configuration.USER_API); 
    private environmentHosting: string = process.env.NODE_ENV || 'development';

    get(name: string): string {
        console.log(name, get(name));
        return process.env[name] || get(name);
    }

    get isDevelopment(): boolean {
        return this.environmentHosting === 'development';
    }
}
