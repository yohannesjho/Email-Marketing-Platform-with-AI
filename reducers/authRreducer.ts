export type AuthState = {
    user: {id: string, email: string, name: string} | null,
    isLoading: boolean,
    error: string | null
}

export type AuthAction = 
 | {type: "LOGIN_REQUEST"}
 | {type: "LOGIN_SUCCESS", payload: {id: string, email: string, name: string}}
 | {type: "LOGIN_FAILURE", payload: string}

export const InitialAuthState : AuthState = {
    user: null,
    isLoading: false,
    error: null
} 

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case "LOGIN_REQUEST":
            return {
                ...state,
                isLoading: true,
                error: null
            }
        case "LOGIN_SUCCESS":
            return {
                user: action.payload,
                isLoading: false,
                error: null
            }
        case "LOGIN_FAILURE":
            return {
                user:null,
                isLoading: false,
                error: action.payload
            }
    }
}