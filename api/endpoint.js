// export const BASE_URL = "https://fixxyworker.herokuapp.com";

export const BASE_URL = "https://prmproject-200708163028.azurewebsites.net/";

// export const BASE_URL = "http://10.1.140.193:8080"

// export const BASE_URL = "http://172.20.10.11:8080"

export const LOGIN_ENDPOINT = `${BASE_URL}/login`;
export const DEVICEID_ENDPOINT = `${BASE_URL}/api/users/device-id/`;
export const ACCEPT_ORDER_ENDPOINT = `${BASE_URL}/api/orders`;
export const WORKER_HISTORY_ENDPOINT = `${BASE_URL}/api/orders/worker/jwt`;
export const POST_NOTIFICATION_ENDPOINT = 'https://expo.io/--/api/v2/push/send'
export const USER_ENDPOINT = `${BASE_URL}/api/users`;
export const USER_GET_PROFILE_ENDPOINT = `${BASE_URL}/api/users/jwt`;
export const ORDER_COMPLETE_ENDPOINT = `${BASE_URL}/api/orders`;
export const ORDER_GET_BY_SKILL_ENDPOINT = `${BASE_URL}/api/orders/skills/jwt`;
export const GET_ALL_SKILL = `${BASE_URL}/api/skills`;

export const CANCEL_ORDER_ENDPOINT = `${BASE_URL}/api/order-cancel`

export const NOTIFICATION_TYPE_REQEST = 'NOTIFICATION_REQUEST_ORDER'

export const NOTIFICATION_TYPE_ACCEPT = 'NOTIFICATION_ACCEPT_ORDER'

export const NOTIFICATION_TYPE_COMPELETE = 'NOTIFICATION_COMPLETE_ORDER'

export const NOTIFICATION_TYPE_CANCEL = 'NOTIFICATION_CANCEL_ORDER'

export const GEO_KEY_API = 'AIzaSyBBMyrK14hU6f_M3EzQMoLSvg5fmpjrTAw'