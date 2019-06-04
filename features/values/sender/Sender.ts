// @ts-ignore
import {Code as GameCode} from 'ma-games-codes-names/codes';

import {Config} from '../../../configs';
import {ValuesPreparer} from './ValuesPreparer';

export type Params = {
    gamingMode:string;
};

export type Response = {
    status:boolean;
};

export type Values = {
    userId:number;
    gameCode:GameCode;
    isAnnTask:boolean;
    bornTimestamp:number;
    data:{[key:string]:any};
};

/**
 * Sends game features values to server.
 */
export class Sender {
    static send(values:Values, params:Params):Promise<Response> {
        const sender = new Sender(values, params);

        return sender.send();
    }

    private constructor(values:Values, params:Params) {
        this.values = ValuesPreparer.prepare(values);
        this.params = params;
    }

    private async send():Promise<Response> {
        const requestData = await this.makeRequestData();

        const responseRaw = await fetch(
            Config.POST_FEATURES_VALUES,
            requestData
        );

        const response = await responseRaw.json();

        if (response.status !== true) {
            console.warn(
                `Failed to send game features values using HAI API.`,
                `API response:`,
                response
            );

            throw new SenderError(`Failed to send game features values using HAI API.`);
        }

        return response;
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
        const gamingMode = this.params.gamingMode;

        return JSON.stringify(
            Object.assign(
                this.values,
                {
                    gamingMode
                }
            )
        );
    }

    private readonly values:Values;
    private readonly params:Params;
}

class SenderError extends Error {
    constructor(message:string) {
        super(message);

        Object.setPrototypeOf(this, SenderError);
    }
}
