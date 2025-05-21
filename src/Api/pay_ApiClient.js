import React, { Component } from 'react';

class ApiClient extends Component {
  static sendGetRequest(url,order_id, callback) {

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({order_id:order_id}),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with code: ${response.status}`);
        }
        return response.text();
      })
      .then(responseBody => {
        callback.onResponseReceived(responseBody);
      })
      .catch(error => {
        callback.onFailure(error);
      });
  }

  static sendPostRequest(url, payload, callback) {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with code: ${response.status}`);
        }
        return response.text();
      })
      .then(processResponse => {
        callback.onResponseReceived(processResponse);
      })
      .catch(error => {
        callback.onFailure(error);
      });
  }
}

export default ApiClient;
