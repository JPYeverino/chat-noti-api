import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { ConfigurationService } from 'src/shared/configuration/configuration.service';

@Injectable()
export class QuotesService {

    constructor(private http: HttpService,
    ) { }

    authHttp(request) {
        const userApiUrl = ConfigurationService.user_api_ur;
        const headersRequest = {
            Cookie: `SESSIONID=${request.cookies['SESSIONID']}`
        };
        return this.http.get(userApiUrl + '/auth', { headers: headersRequest })
            .pipe(
                map(response => response.data)
            )
            .toPromise();
    }

    authIO(cookie) {
        const userApiUrl = ConfigurationService.user_api_ur;
        const headersRequest = {
            Cookie: `SESSIONID=${cookie}`
        };

        return this.http.get(userApiUrl + '/auth', { headers: headersRequest })
            .pipe(
                map(response => response.data)
            )
            .toPromise();
    }

    async getUser(id: string[]) {
        const userApiUrl = ConfigurationService.user_api_ur
        return await this.http.post(userApiUrl + '/contacts', id)
            .toPromise();
    }

}
