import {fetch} from 'whatwg-fetch';

// @ts-ignore
import {Code as GameCode} from 'ma-games-codes-names/codes/Code';

import {Config} from '../../configs';
import {ParamsPreparer} from './ParamsPreparer';

export type Params = {
    userId:number;

    userLevel?:number;
    gameCode?:GameCode|null;
};

export type Response = {
    gameCode:GameCode;
    gameSettings:string;
};

/**
 * Generates game settings using analytics of player gaming results.
 * ANN is used to analyze player gaming results.
 */
export class Generator {
    static generate(params:Params):Promise<Response> {
        const generator = new Generator(params);

        return generator.generate();
    }

    private constructor(params:Params) {
        this.params = ParamsPreparer.prepare(params);
    }

    private async generate():Promise<Response> {
        const requestData = await this.makeRequestData();

        const responseRaw = await fetch(
            Config.GENERATE_GAME,
            requestData
        );

        const response = await responseRaw.json();

        if (response.status !== true) {
            console.error('Nika responded as error.', response);

            throw new GameGeneratorError(`Failed to generate game using HAI API.`);
        }

        return response.data;
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

    private async makeRequestBody():Promise<string> {
        const {userId, userLevel, gameCode} = this.params;

        const body:any = { userId };

        if (typeof gameCode === 'number')
            body.gameCode = gameCode;

        if (typeof userLevel === 'number')
            body.userLevel = userLevel;

        return JSON.stringify(body);
    }

    private readonly params:Params;
}

class GameGeneratorError extends Error {
    constructor(message:string) {
        super(message);

        Object.setPrototypeOf(this, GameGeneratorError);
    }
}
