import {clone} from 'lodash';
import {UserUtils} from 'nika-user-utils';

// @ts-ignore
import {Code as GameCode, Security as GameCodeSecurity} from 'ma-games-codes-names/codes';

import {Params} from './Generator';

export class ParamsPreparer {
    /**
     * @throws {ParamsPreparerError}
     */
    static prepare(params:Params):Params|never {
        params = clone(params);

        params.userId = this.validateUserId(params.userId);

        if (params.gameCode)
            params.gameCode = this.validateGameCode(params.gameCode);

        return params;
    }

    private static validateUserId(userId:any):number|never {
        return UserUtils.validateId(userId);
    }

    private static validateGameCode(gameCode:any):GameCode|null {
        try {
            return GameCodeSecurity.validateGameCode(gameCode);
        } catch (e) {
            return null;
        }
    }
}

class ParamsPreparerError extends Error {
    constructor(message:string) {
        super(message);

        Object.setPrototypeOf(this, ParamsPreparerError);
    }
}
