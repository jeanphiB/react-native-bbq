import base64 from 'react-native-base64';
import { URL, USER, PASS, APIKEY } from '../constants/Params';

const headers = {
  Accept: 'application/json',
  Authorization: `Basic ${base64.encode(`${USER}:${PASS}`)}`,
  'x-api-key': APIKEY,
};

export const checkin = {
  get() {
    return fetch(`${URL}checkin`, { headers })
      .then((response) => response.json())
      .then((response) => {
        if (false !== response.status) {
          return {
            guests: response.sort((a, b) => (
              a.lastname.concat(a.firstname).toLowerCase() < b.lastname.concat(b.firstname).toLowerCase() ? -1
              : a.lastname.concat(a.firstname).toLowerCase() > b.lastname.concat(b.firstname).toLowerCase() ? 1 : 0
            ))
          };
        } else {
          return { error: response.error };
        }
      })
      .catch((error) => { error: JSON.stringify(err) });
  },

  getWithExternalId(id) {
    return fetch(`${URL}checkin?barcode=${id}`, { headers })
      .then((response) => response.json())
      .then((response) => {
        if (false !== response.status) {
          const guest = response[0];
          return guest;
        } else {
          return { error: response.error };
        }
      })
      .catch((error) => { error: JSON.stringify(err) });
  },

  put(id, value) {
    return fetch(`${URL}checkin/${id}`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(value),
    })
    .then((response) => response.json())
    .catch((error) => { error: JSON.stringify(err) });
  },

  getStats() {
    return fetch(`${URL}/stats`, { headers })
      .then((response) => response.json())
      .then((response) => {
        if (false !== response.status) {
          return response;
        } else {
          return { error: response.error };
        }
      })
      .catch((error) => { error: JSON.stringify(err) });
  },
}
