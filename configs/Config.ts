import {GlobalConfig} from 'global-config';

export class Config {
    private static readonly DEBUG_MODE:boolean = GlobalConfig.DEBUG_MODE;

    static readonly API_URL = Config.DEBUG_MODE
        ? 'http://localhost:9009/'
        : 'https://nika-ann.herokuapp.com/';

    static readonly GENERATE_GAME = Config.API_URL + 'generate-game';
    static readonly GENERATE_HOMETASK = Config.API_URL + 'generate-hometask';
    static readonly POST_FEATURES_VALUES = Config.API_URL + 'post-features-values';
}