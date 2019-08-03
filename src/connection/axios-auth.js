import axios from "axios";

const authInstance = new axios.create({
  baseURL: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty'
});

export default authInstance;
