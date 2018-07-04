import { ENGLISH_TRANSLATION } from './messages/en'
import T from './types'

const initialState = {
    language: ENGLISH_TRANSLATION.language,
    messages: ENGLISH_TRANSLATION.messages
}

export const appReducer = (state = {}, action={ type: null }) => {
    switch (action.type) {
        case T.SET_LOADING_MESSAGE:
            return {
                ...state,
                loading_message: action.message
            }
        case T.SET_LOADING:
            return {
                ...state,
                loading: action.loading
            }
        default:
            return {
                ...state
            }
    }
}


export const localeReducer = (state = initialState, action) => {
    switch (action.type) {
        case T.SET_LOCALE:
        switch (action.locale) {
            case 'en':
                return {
                    ...state,
                    language: ENGLISH_TRANSLATION.lang,
                    messages: ENGLISH_TRANSLATION.messages
                }
            default:
                return {
                    ...state,
                    language: ENGLISH_TRANSLATION.lang,
                    messages: ENGLISH_TRANSLATION.messages
                }
        }
    default :
        return state
    }
}
