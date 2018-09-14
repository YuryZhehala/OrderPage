const HttpClient = {
    getOrders: function () {
        return fetch("http://localhost:3000/api/Orders")
        .then (function(responce) {
            return responce.json();
        });
    },
    addOrder: function (order) {
        return fetch("http://localhost:3000/api/Orders", {
            method: "POST",
            body: order,
            headers: {"Content-Type": "application/json; charset=utf-8"}
          })
          .then (function(responce) {
            return responce.json();
        });
    },
    editOrder: function (changes, order) {
        return fetch("http://localhost:3000/api/Orders/" + order + "", {
            method: "PUT",
            body: changes,
            headers: {"Content-Type": "application/json; charset=utf-8"}
          })
          .then (function(responce) {
            return responce.json();
        });
    },
    deleteOrder: function (order) {
        return fetch("http://localhost:3000/api/Orders/" + order.id + "", {
            method: "DELETE",
            body: JSON.stringify(order),
            headers: {"Content-Type": "application/json; charset=utf-8"}
          })
          .then (function(responce) {
            return responce.json();
        });
    },
    getGeocode: function(order) {
        //Converting shipping addresses into geographic coordinates
        var str = order.shipTo.address;
        var shippingAddress = str.replace(/ /g, "+");
        var location =
            shippingAddress +
            "+" +
            order.shipTo.region +
            "+" +
            order.shipTo.country;
        return fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" +
        location +
        "&key=")
        .then (function(responce) {
            return responce.json();
        });
    },
    getProducts: function () {
        return fetch("http://localhost:3000/api/OrderProducts")
        .then (function(responce) {
            return responce.json();
        });
    },
    addProduct: function (product) {
        return fetch("http://localhost:3000/api/OrderProducts", {
            method: "POST",
            body: product,
            headers: {"Content-Type": "application/json; charset=utf-8"}
          })
          .then (function(responce) {
            return responce.json();
        });
    },
    deleteProduct: function (product) {
        return fetch("http://localhost:3000/api/OrderProducts/" + product.id + "", {
            method: "DELETE",
            body: JSON.stringify(product),
            headers: {"Content-Type": "application/json; charset=utf-8"}
          })
          .then (function(responce) {
            return responce.json();
        });
    }
}
