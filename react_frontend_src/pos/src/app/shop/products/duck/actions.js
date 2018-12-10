import T from './types'


export const requestProducts = () =>
    ({
        type: T.REQUEST_PRODUCTS
    })

export const receiveProducts = (data) =>
    ({
        type: T.RECEIVE_PRODUCTS,
        data
    })

export const clearSearchTimeout = () =>
    ({
        type: T.CLEAR_SEARCH_TIMEOUT
    })

export const setSearchTimeout = (timeout) =>
    ({
        type: T.SET_SEARCH_TIMEOUT,
        timeout,
    })

export const clearSearchProductID = () =>
    ({
        type: T.CLEAR_SEARCH_PRODUCT_ID
    })

export const setSearchProductID = (id) =>
    ({
        type: T.SET_SEARCH_PRODUCT_ID,
        id
    })

export const clearSearchValue = () =>
    ({
        type: T.CLEAR_SEARCH_VALUE
    })

export const setSearchValue = (value) =>
    ({
        type: T.SET_SEARCH_VALUE,
        value
    })