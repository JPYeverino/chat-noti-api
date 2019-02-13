import { Injectable, HttpService } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { AppGateway } from 'src/app.gateway';


@Injectable()
export class QuotesService {

    constructor(private http: HttpService,
        private gw: AppGateway
        ) {}

    getQuotes(request) {
        const headersRequest = {
            Cookie: `SESSIONID=${request.cookies['SESSIONID']}`
        };
        
        return this.http.get('http://localhost:3000/api/users/auth', { headers: headersRequest })
            .pipe(
                map(response => response.data)
            );
    }
}
