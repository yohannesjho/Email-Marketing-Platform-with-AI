export type AuthState = {
    user: {id: string, email: string, name: string} | null,
    token: string | null,
    isLoading: boolean,
    error: string | null
}

export type AuthAction = 
 | {type: "LOGIN_REQUEST"}
 | {type: "LOGIN_SUCCESS", payload: {token: string, user: {id: string, email: string, name: string}}}
 | {type: "LOGIN_FAILURE", payload: string}
 | {type: "LOGOUT"}
 | {type: "FINISH_LOADING"};

export const InitialAuthState : AuthState = {
    user: null,
    token: null,
    isLoading: true,
    error: null
} 

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
      case "LOGIN_REQUEST":
        return {
          ...state,
          isLoading: true,
          error: null,
        };
      case "LOGIN_SUCCESS":
        return {
          user: action.payload.user,
          token: action.payload.token,
          isLoading: false,
          error: null,
        };
      case "LOGIN_FAILURE":
        return {
          user: null,
          token: null,
          isLoading: false,
          error: action.payload,
        };
      case "LOGOUT":
        return {
          user: null,
          token: null,
          isLoading: false,  
          error: null,
        };
      case "FINISH_LOADING":
        return { ...state, isLoading: false };
    }
}

 

