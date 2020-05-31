const axios = require("axios");

function invokeDBlogCall() {
  console.log('trying to do post: ', process.env.ADMINKEY);
  axios.post(`/api/history?adminKey=${process.env.ADMINKEY}`, {});
}

invokeDBlogCall();