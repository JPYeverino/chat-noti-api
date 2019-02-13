import { Injectable } from '@nestjs/common';

import 'automapper-ts'

@Injectable()
export class MapperService {
    mapper: AutoMapperJs.AutoMapper;

    constructor() {
        this.mapper = automapper;

    }

    private initializeMapper(): void {
        this.mapper.initialize(MapperService.configure);
    }

    private static configure(config: AutoMapperJs.IConfiguration): void {
        
    }
}