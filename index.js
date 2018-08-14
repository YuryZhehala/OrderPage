//Checking order base is not empty or undefined
document.addEventListener("DOMContentLoaded", ready);
var Orders;
function ready() {
    if (Orders === undefined || Orders.length === 0) {
        var message = document.querySelector("#order-id");
        message.innerHTML = "Ops";
    }
}
//Displaying of the sidebar
var ordersQuantity = document.querySelector("#orders-quantity");
ordersQuantity.innerHTML = "Orders (" + Orders.length + ")";
function drawList(ordersArray) {
    var orderList = "<ul>";
    var listElement = document.getElementById("orders-list");
    ordersArray.forEach(function(item, i) {
        orderList +=
            '<li class="order-number" id="' +
            item.id +
            '" href="#">' +
            "<div>" +
            "<div>Order " +
            item.id +
            "</div>" +
            "<div>" +
            item.OrderInfo.customer +
            "</div>" +
            "<div>Shipped: " +
            editDate(item.OrderInfo.shippedAt) +
            "</div>" +
            "</div>" +
            "<div>" +
            "<div>" +
            item.OrderInfo.createdAt +
            "</div>" +
            "<div>" +
            item.OrderInfo.status +
            "</div>" +
            "</div>" +
            "</li>";
    });
    listElement.innerHTML = orderList;
}
drawList(Orders);
//********************Implementation of search feature in the orders list********************//
function showFilteredList() {
    var input = document.getElementById("searching-info").value;
    var ordersToShow = Orders.filter(function(order) {
        return (
            (
                order.id +
                "" +
                order.OrderInfo.customer +
                "" +
                order.OrderInfo.shippedAt +
                "" +
                order.OrderInfo.createdAt +
                "" +
                order.OrderInfo.status
            )
                .toLowerCase()
                .indexOf(input.toLowerCase()) !== -1
        );
    });
    drawList(ordersToShow);
    //Changing the number of displayed objects
    var ordersQuantity = document.querySelector("#orders-quantity");
    ordersQuantity.innerHTML = "Orders (" + ordersToShow.length + ")";
    //Running through a fitered order list to be able to add an event
    var ordersCollection = document.getElementsByClassName("order-number");
    [].forEach.call(ordersCollection, addActivity);
}
document.getElementById("search-order-button").onclick = showFilteredList;
//Search reset
function showOriginalList() {
    drawList(Orders);
    //Changing the number of displayed objects
    var ordersQuantity = document.querySelector("#orders-quantity");
    ordersQuantity.innerHTML = "Orders (" + Orders.length + ")";
    //Running through a fitered order list to be able to add an event
    var ordersCollection = document.getElementsByClassName("order-number");
    [].forEach.call(ordersCollection, addActivity);
}
document.getElementById("reload-button").onclick = showOriginalList;
//********************Implementation of "show detail" information feature********************//
//Running through an original order list to be able to add an event
var ordersCollection = document.getElementsByClassName("order-number");
[].forEach.call(ordersCollection, addActivity);
function addActivity(el) {
    //Searching selected order in "Orders" array by clicking on it
    el.addEventListener("click", function(e) {
        var order = Orders.find(function(item) {
            return item.id === el.id;
        });
        showOrder(order);
    });
}
//Displaying of order information
function showOrder(order) {
    //****************************Displaying of Header information*******************************//
    var orderIdElement = document.querySelector("#order-id");
    var customerName = document.querySelector("#order-customer");
    var orderedDate = document.querySelector("#ordered-date");
    var shippedDate = document.querySelector("#order-shipped");
    orderIdElement.innerHTML = "Order " + order.id;
    customerName.innerHTML = "Customer: " + order.OrderInfo.customer;
    orderedDate.innerHTML = "Ordered: " + editDate(order.OrderInfo.createdAt);
    shippedDate.innerHTML = "Ordered: " + editDate(order.OrderInfo.shippedAt);
    showShippingAddress();
    //Removing of classes which hide the content
    function removeContentHider(contentId) {
        if (
            document
                .getElementById(contentId)
                .className.match(/(?:^|\s)hide-content(?!\S)/)
        ) {
            document.getElementById(
                contentId,
            ).className = document
                .getElementById(contentId)
                .className.replace(/(?:^|\s)hide-content(?!\S)/g, "");
        }
    }
    removeContentHider("tab-bar");
    removeContentHider("customer-information");
    removeContentHider("products-table-wrapper");
    //************************Displaying of shipping address information*************************//
    var customerTabElement = document.getElementById("shipping-tab");
    customerTabElement.addEventListener("click", showShippingAddress);
    function showShippingAddress() {
        //Changing of the value of each label
        customerInformationHeader = document.querySelector(
            ".customer-information h1",
        );
        customerInformationHeader.innerHTML = "Shipping Address";

        var informationDetailsLabel = document.getElementsByClassName(
            "information-details-label",
        );
        informationDetailsLabel[0].innerHTML = "Name";
        informationDetailsLabel[1].innerHTML = "Street";
        informationDetailsLabel[2].innerHTML = "ZIP Code/City";
        informationDetailsLabel[3].innerHTML = "Region";
        informationDetailsLabel[4].innerHTML = "Country";
        //Changing of the value of each input
        var informationDetails = document.getElementsByClassName(
            "information-details",
        );

        informationDetails[0].setAttribute("value", order.ShipTo.name);
        informationDetails[1].setAttribute("value", order.ShipTo.Address);
        informationDetails[2].setAttribute("value", order.ShipTo.ZIP);
        informationDetails[3].setAttribute("value", order.ShipTo.Region);
        informationDetails[4].setAttribute("value", order.ShipTo.Country);
    }
    //****************************Displaying of customer information*****************************//
    var customerTabElement = document.getElementById("customer-tab");
    customerTabElement.addEventListener("click", showCustomer);
    function showCustomer() {
        //Changing of the value of each label
        customerInformationHeader = document.querySelector(
            ".customer-information h1",
        );
        customerInformationHeader.innerHTML = "Customer Info";
        var informationDetailsLabel = document.getElementsByClassName(
            "information-details-label",
        );
        informationDetailsLabel[0].innerHTML = "First Name";
        informationDetailsLabel[1].innerHTML = "Last Name";
        informationDetailsLabel[2].innerHTML = "Address";
        informationDetailsLabel[3].innerHTML = "Phone";
        informationDetailsLabel[4].innerHTML = "Email";
        //Changing of the value of each input
        var informationDetails = document.getElementsByClassName(
            "information-details",
        );
        informationDetails[0].setAttribute(
            "value",
            order.CustomerInfo.firstName,
        );
        informationDetails[1].setAttribute(
            "value",
            order.CustomerInfo.lastName,
        );
        informationDetails[2].setAttribute("value", order.CustomerInfo.address);
        informationDetails[3].setAttribute("value", order.CustomerInfo.phone);
        informationDetails[4].setAttribute("value", order.CustomerInfo.email);
    }
    //********************Implementation of quick search in a products table*********************//
    var searchingProducts = document.getElementById("search-product-button");
    searchingProducts.addEventListener("click", showFilteredProducts);
    function showFilteredProducts() {
        var input = document.getElementById("searching-products").value;
        var productsToShow = order.products.filter(function(product) {
            return (
                (
                    product.id +
                    "" +
                    product.name +
                    "" +
                    product.price +
                    "" +
                    product.currency +
                    "" +
                    product.quantity +
                    "" +
                    product.totalPrice
                )
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) !== -1
            );
        });
        drawTable(productsToShow);
    }
    //Products search reset
    function showOriginalProducts() {
        drawTable(order.products);
    }
    document.getElementById(
        "products-reload-button",
    ).onclick = showOriginalProducts;
    //*****************Showing of Products list in a "line items" table (products)***************//
    function drawTable(productsArray) {
        var productsTableElement = document.querySelector("#products-tbody");
        var productsTable = "<!-- --!>";
        productsArray.forEach(function(product, i) {
            productsTable +=
                "<tr><td><div class='highlight-text'>" +
                product.name +
                "</div><div>" +
                product.id +
                "</div>" +
                "</td><td><span class='highlight-text'>" +
                product.price +
                "</span> " +
                product.currency +
                "</td><td>" +
                product.quantity +
                "</td><td><span class='highlight-text'>" +
                product.totalPrice +
                "</span> " +
                product.currency +
                "</td></tr>";
        });
        productsTable += "</tbody>";
        productsTableElement.innerHTML = productsTable;
        //Calculating the number of products
        var lineItems = document.querySelector("#line-items");
        lineItems.innerHTML = "Line Items(" + productsArray.length + ")";
        //Calculating of total price of products
        var priceArray = productsArray.map(function(product) {
            return +product.totalPrice;
        });
        var productsTotalPrice = priceArray.reduce(function(sum, current) {
            return sum + current;
        }, 0);
        var totalPrice = document.getElementById("total-price");
        totalPrice.innerHTML = productsTotalPrice;
        //Taking currency
        var currency = document.getElementById("currency");
        currency.innerHTML = Orders[0].products[0].currency;
    }
    drawTable(order.products);
    //*****Implementation of sorting in the products table (via button in the column titles)*****//
    var directCollection = document.getElementsByClassName("sort");
    [].forEach.call(directCollection, addAction);
    function addAction(el) {
        el.addEventListener("click", function(e) {
            sortGrid(
                e.target.getAttribute("cell-index"),
                e.target.getAttribute("data-type"),
                e.target.getAttribute("class"),
            );
        });
    }
    var grid = document.getElementById("products-table");
    function sortGrid(colNum, type, order) {
        var tbody = grid.getElementsByTagName("tbody")[0];
        var rowsArray = [].slice.call(tbody.rows);
        var compare;
        switch (type) {
            case "number":
                compare = function(rowA, rowB) {
                    return (
                        parseInt(rowA.cells[colNum].innerText) -
                        parseInt(rowB.cells[colNum].innerText)
                    );
                };
                break;
            case "string":
                compare = function(rowA, rowB) {
                    return (
                        rowA.cells[colNum].innerText >
                        rowB.cells[colNum].innerText
                    );
                };
                break;
        }
        switch (order) {
            case "sort direct-button":
                finalArray = rowsArray.sort(compare);
                break;
            case "sort reverse-button":
                finalArray = rowsArray.sort(compare).reverse();
                break;
        }
        grid.removeChild(tbody);
        for (var i = 0; i < finalArray.length; i++) {
            tbody.appendChild(finalArray[i]);
        }
        grid.appendChild(tbody);
    }
}
//Function to change date format (8.09.1991 -> September 8, 1991)
function editDate(dateToChange) {
    var options = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    var replacedDate = new Date(
        dateToChange.replace(/(\d+).(\d+).(\d+)/, "$3,$2,$1"),
    );
    var resultDate = new Date(replacedDate).toLocaleString("en-US", options);
    return resultDate;
}
