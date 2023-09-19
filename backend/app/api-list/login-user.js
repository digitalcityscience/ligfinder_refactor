const api = {
  requestURL: "/login-user",
  post: {
    payload: {
      payload: {
        loginEmail: "gok@kose.com",
        loginPassword: "11111111",
      },
    },
    response: {
      email: "gok@kose.com",
      firstname: "gokturk",
      id: 13,
      lastname: "kose",
      status: "success",
      text: "Your are successfully logged in ",
    },
  },
};
