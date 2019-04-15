import {UserUtils} from 'user-utils';
import {ObjectUtils} from 'data-structures-utils';
import {Code as GameCode, Security as GameCodeSecurity} from 'ma-games-codes-names/codes';

import {Values} from './Sender';

export class ValuesPreparer {
    static prepare(values:Values):Values {
        values = this.prepareValues(values);

        values.userId = this.validateUserId(values.userId);
        values.gameCode = this.validateGameCode(values.gameCode);
        values.isAnnTask = this.validateIsAnnTask(values.isAnnTask);
        values.bornTimestamp = this.validateBornTimestamp(values.bornTimestamp);

        return values;
    }

    private static validateUserId(userId:any):number|never {
        return UserUtils.validateId(userId);
    }

    private static validateGameCode(gameCode:any):GameCode|never {
        return GameCodeSecurity.validateGameCode(gameCode);
    }

    private static validateIsAnnTask(AnnTask:any):boolean {
        return !!AnnTask;
    }

    private static validateBornTimestamp(bornTimestamp:any):number {
        return parseInt(bornTimestamp, 10) || 0;
    }

    private static prepareValues(values:Values) {
        return ObjectUtils.getClone<Values>(values);
    }
}

class ValuesPreparerError extends Error {
    constructor(message:string) {
        super(message);

        Object.setPrototypeOf(this, ValuesPreparerError);
    }
}