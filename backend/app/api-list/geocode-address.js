const api = {
  requestURL: "/geocode-address",
  post: {
    payload: {
      address: "hausweg",
    },
    response:{
        "address": "Hausweg, Südost, Altenburg, Altenburger Land, Thüringen, 04600, Deutschland",
        "location": [
            12.4463551,
            50.9889843
        ],
        "status": "success"
    },
  },
};
