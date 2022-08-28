class ErrorType():
  USERNAME_TAKEN = 'USERNAME_TAKEN'
  EMAIL_TAKEN = 'EMAIL_TAKEN'
  PASSWORD_TOO_SIMPLE = 'PASSWORD_TOO_SIMPLE'
  PASSWORD_TOO_SHORT = 'PASSWORD_TOO_SHORT'
  PASSWORD_NUMERIC = 'PASSWORD_NUMERIC'
  EMAIL_INCORRECT = 'EMAIL_INCORRECT'
  USER_NOT_FOUND = 'USER_NOT_FOUND'
  TOKEN_EXPIRED = 'TOKEN_EXPIRED'
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS'
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED'
  NOT_UNIQUE_NAME = 'NOT_UNIQUE_NAME'
  RELATED_OBJECT = 'RELATED_OBJECT'
  NEGATIVE_NUMBER = 'NEGATIVE_NUMBER'
  PERMA_BANNED = 'PERMA_BANNED'
  TEMPORARY_BANNED = 'TEMPORARY_BANNED'
  GROUP_NOT_FOUND = 'GROUP_NOT_FOUND'
  
def get_error_dict(errorType, msg, data = None):
  if not data:
    return {'type': errorType, 'message': msg}
  
  return {'type': errorType, 'message': msg, 'data': data}

    
