import {clone} from 'lodash';
import {UserUtils} from 'nika-user-utils';

import {Config} from '../../configs';

type Params = {
    userId:number;
};

export class Generator {
    static generate(params:Params) {
        const generator = new Generator(params);

        return generator.generate();
    }

    private constructor(params) {
        this.params = Generator.prepareParams(params);
    }

    private async generate() {
        const response = await this.fetch();

        if (response.status !== true)
            return Generator.throwInvalidResponse();

        return response.data;
    }

    private async fetch() {
        const apiUrl = Generator.getApiUrl();

        const requestData = await this.makeRequestData();

        return await Generator.fetch(apiUrl, requestData);
    }

    private async makeRequestData() {
        const body = await this.makeRequestBody();

        return {
            body,
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        };
    }

    private async makeRequestBody() {
        const userId = this.getUserId();

        return JSON.stringify({ userId });
    }

    private getUserId():number|never {
        return Generator.validateUserId(this.params.userId);
    }

    private static getApiUrl() {
        return Config.GENERATE_HOMETASK;
    }

    private static prepareParams(params:Params):Params {
        params = clone(params);

        params.userId = this.validateUserId(params.userId);

        return params;
    }

    private static validateUserId(userId:any):number|never {
        return UserUtils.validateId(userId);
    }

    private static async fetch(apiUrl:string, requestData:{[key:string]:any}) {
        const responseDirty = await fetch(apiUrl, requestData);

        return await responseDirty.json();
    }

    private static throwInvalidResponse():never {
        throw new GeneratorError(`Failed to generate hometask.`);
    }

    private readonly params:Params;
}

class GeneratorError extends Error {
    constructor(message:string) {
        super(message);

        Object.setPrototypeOf(this, GeneratorError);
    }
}