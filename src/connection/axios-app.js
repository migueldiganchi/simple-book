import axios from "axios";

const appInstance = new axios.create({
  baseURL: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty'
});

// @todo: set tokenaxios.defaults.headers.common['Authorization'] = 'authorization_token'
appInstance.defaults.baseURL = 'https://fasobook-io.firebaseio.com/'
appInstance.defaults.headers.get['Accepts'] = 'application/json'

export default appInstance;
