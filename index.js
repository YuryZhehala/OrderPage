const productColNum = "0";
const unitPriceColNum = "1";
const quantityColNum = "2";
const totalColNum = "3";
const directButtonClass = "sort direct-button";
const reverseButtonClass = "sort reverse-button";
const filterSortSettings = {
    value: "",
    direction: directButtonClass,
    colNum: productColNum,
};
//Checking order base is not empty or undefined
document.addEventListener("DOMContentLoaded", ready);
const selectMessage = "Please select an order from the list";
const sorryMessage = "Sorry, there are no any available orders";
// var Orders;
function ready() {
    var message = document.querySelector("#order-id");
    if (Orders.length) {
        message.innerHTML = selectMessage;
    } else {
        message.innerHTML = sorryMessage;
        window.stop();
    }
}

//********************Implementation of search feature in the orders list********************//
var searchOrderButton = document.getElementById("search-order-button");
var searchOrderInput = document.getElementById("searching-info");
searchOrderButton.addEventListener("click", showFilteredList);
searchOrderInput.addEventListener("focus", hideReloadButton, false);
searchOrderInput.addEventListener("blur", addReloadButton, false);
searchOrderInput.addEventListener(
    "keydown",
    function(event) {
        if (event.keyCode === 13) {
            showFilteredList();
        }
    },
    false,
);
function hideReloadButton(event) {
    var input = document.querySelector("#searching-info");
    if (event.target !== document.querySelector("#searching-info")) {
        return;
    }
    if (!input.value) {
        document.querySelector("#reload-orders-button").style.display = "none";
        document.querySelector("#search-order-button").style.display = "inline";
        document.querySelector("#search-order-button").style.display = "inline";
    } else {
        document.querySelector("#search-order-button").style.display = "inline";
        document.querySelector("#reload-orders-button").style.display = "none";
    }
}
function addReloadButton(event) {
    var input = document.querySelector("#searching-info");
    if (event.target !== document.querySelector("#searching-info")) {
        return;
    }
    if (!input.value) {
        document.querySelector("#search-order-button").style.display = "inline";
        document.querySelector("#reload-orders-button").style.display =
            "inline";
    } else {
        document.querySelector("#reload-orders-button").style.display =
            "inline";
    }
}
//Orders search
function showFilteredList() {
    var input = document.getElementById("searching-info").value;
    var message = document.querySelector("#order-id");
    document.getElementById("searching-info").value = null;
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
    if (ordersToShow.length) {
        displayList(ordersToShow, 21);
    } else {
        addContentHider("tab-bar");
        addContentHider("customer-information");
        addContentHider("products-table-wrapper");
        addContentHider("total-price");
        addContentHider("currency");
        addContentHider("customer-details");
        var message = document.querySelector("#order-id");
        message.innerHTML = sorryMessage;
    }
    displayList(ordersToShow);
    displayOrsdersNum(ordersToShow);
}
//Orders search reset
var ordersReloadButton = document.getElementById("reload-orders-button");
ordersReloadButton.addEventListener("click", function() {
    var message = document.querySelector("#order-id");
    message.innerHTML = selectMessage;
    document.getElementById("searching-info").value = null;
    addContentHider("tab-bar");
    addContentHider("customer-information");
    addContentHider("products-table-wrapper");
    addContentHider("total-price");
    addContentHider("currency");
    addContentHider("customer-details");
    displayList(Orders, 21);
    displayOrsdersNum(Orders);
});
//Displaying of the sidebar
displayOrsdersNum(Orders);
displayList(Orders);
function displayList(ordersArray) {
    var message = document.querySelector("#order-id");
    const ordersNumLimit = 21;
    var orderList = "<ul>";
    var listElement = document.getElementById("orders-list");

    ordersArray.forEach(function(item, i) {
        if (i < ordersNumLimit) {
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
                item.OrderInfo.shippedAt +
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
        }
    });
    displayOrsdersNum(Orders);
    listElement.innerHTML = orderList;
}
//Changing the number of displayed objects
function displayOrsdersNum(ordersArray) {
    var ordersQuantity = document.querySelector("#orders-quantity");
    ordersQuantity.innerHTML = "Orders (" + ordersArray.length + ")";
}
//Adding of classes which hide the content
function addContentHider(contentId) {
    var elem = document.getElementById(contentId);
    elem.classList.add("hide-content");
}

//********************Implementation of "show detail" information feature********************//
var listContainer = document.getElementById("orders-list");
listContainer.addEventListener("click", function(event) {
    var target = event.target;
    var li = target.closest("li");
    if (!li) return;
    if (!listContainer.contains(li)) return;
    highlightOrder(li);
    var order = Orders.find(function(item) {
        return item.id === li.id;
    });
    removeContentHider("tab-bar");
    removeContentHider("customer-information");
    removeContentHider("products-table-wrapper");
    removeContentHider("total-price");
    removeContentHider("currency");
    removeContentHider("customer-details");
    setDefaultTab("shipping-tab");
    setDefaultTab("customer-tab");
    showHeaderInfo(order);
    showShippingCustomer(order);
    showProductsList(order);
    showShippingAddress.call(order);
});
//Set default value of the tab-bar
function setDefaultTab(contentId) {
    var elem = document.getElementById(contentId);
    if (elem.classList.contains("highlight-tab1")) {
        elem.classList.remove("highlight-tab1");
    }
    if (elem.classList.contains("highlight-tab2")) {
        elem.classList.remove("highlight-tab2");
    }
}
//Removing of classes which hide the content
function removeContentHider(contentId) {
    var elem = document.getElementById(contentId);
    if (elem.classList.contains("hide-content")) {
        elem.classList.toggle("hide-content");
    }
}
var selectedLi;
function highlightOrder(node) {
    if (selectedLi) {
        selectedLi.classList.remove("highlight");
    }
    selectedLi = node;
    selectedLi.classList.add("highlight");
}

//****************************Displaying of Header information*******************************//
function showHeaderInfo(order) {
    var orderIdElement = document.querySelector("#order-id");
    var customerName = document.querySelector("#order-customer");
    var orderedDate = document.querySelector("#ordered-date");
    var shippedDate = document.querySelector("#order-shipped");
    orderIdElement.innerHTML = "Order " + order.id;
    customerName.innerHTML = "Customer: " + order.OrderInfo.customer;
    orderedDate.innerHTML = "Ordered: " + editDate(order.OrderInfo.createdAt);
    shippedDate.innerHTML = "Shipped: " + editDate(order.OrderInfo.shippedAt);
}
var tabBarElement = document.getElementById("tab-bar");
tabBarElement.addEventListener("click", function(event) {
    var target = event.target;
    var li = target.closest("li");
    var shippingTabUnderline = document.getElementById(
        "shipping-tab-underline",
    );
    var customerTabUnderline = document.getElementById(
        "customer-tab-underline",
    );
    if (!li) return;
    if (!tabBarElement.contains(li)) return;
    highlighTab(li);
});
function highlighTab(node) {
    selectedTab = node;
    if (node.id == "shipping-tab") {
        selectedTab1 = node;
        selectedTab1.classList.add("highlight-tab1");
        try {
            if (selectedTab2.classList.contains("highlight-tab2")) {
                selectedTab2.classList.remove("highlight-tab2");
            }
        } catch (e) {
            console.log("Ошибка " + e.name + ":" + e.message + "\n" + e.stack);
        }
    } else {
        selectedTab2 = node;
        selectedTab2.classList.add("highlight-tab2");
        try {
            if (selectedTab1.classList.contains("highlight-tab1")) {
                selectedTab1.classList.remove("highlight-tab1");
            }
        } catch (e) {
            console.log("Ошибка " + e.name + ":" + e.message + "\n" + e.stack);
        }
    }
}

//************************Displaying of shipping address information*************************//
function showShippingCustomer(order) {
    var shippingTabElement = document.getElementById("shipping-tab");
    var customerTabElement = document.getElementById("customer-tab");
    shippingTabElement.addEventListener(
        "click",
        showShippingAddress.bind(order, event),
    );
    customerTabElement.addEventListener(
        "click",
        showCustomer.bind(order, event),
    );
}
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
    informationDetails[0].setAttribute("value", this.ShipTo.name);
    informationDetails[1].setAttribute("value", this.ShipTo.Address);
    informationDetails[2].setAttribute("value", this.ShipTo.ZIP);
    informationDetails[3].setAttribute("value", this.ShipTo.Region);
    informationDetails[4].setAttribute("value", this.ShipTo.Country);
}

//****************************Displaying of customer information*****************************//
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
    informationDetails[0].setAttribute("value", this.CustomerInfo.firstName);
    informationDetails[1].setAttribute("value", this.CustomerInfo.lastName);
    informationDetails[2].setAttribute("value", this.CustomerInfo.address);
    informationDetails[3].setAttribute("value", this.CustomerInfo.phone);
    informationDetails[4].setAttribute("value", this.CustomerInfo.email);
}

//*****************Showing of Products list in a "line items" table (products)***************//
function showProductsList(order) {
    var searchingProducts = document.getElementById("search-product-button");
    var searchProductInput = document.getElementById("searching-products");
    var productsReloadButton = document.getElementById(
        "products-reload-button",
    );
    drawTable(order.products);
    var modifiedProductsArr = order.products;
    searchingProducts.addEventListener(
        "click",
        showFilteredProducts.bind(order, event),
    );
    productsReloadButton.addEventListener(
        "click",
        showOriginalProducts.bind(order, event),
    );
    searchProductInput.addEventListener(
        "keydown",
        function(event) {
            if (event.keyCode === 13) {
                showFilteredProducts.call(order);
            }
        },
        false,
    );
    renderSortedArray(modifiedProductsArr);
}
function renderSortedArray(modifiedProductsArr) {
    var tableElement = document.getElementById("products-table");
    tableElement.addEventListener("click", function(event) {
        var target = event.target;
        var button = target.closest("button");
        if (!button) return;
        if (!tableElement.contains(button)) return;
        filterSortSettings.direction = button.getAttribute("class");
        filterSortSettings.colNum = button.getAttribute("cell-index");
        filterSortOrders(modifiedProductsArr);
    });
}

//*****Implementation of sorting and quick search in the products table (via button in the column titles)*****//
function filterSortOrders(products) {
    var productsToShow = products.filter(function(product) {
        return (
            Object.values(product)
                .join("")
                .toLowerCase()
                .indexOf(filterSortSettings.value.toLowerCase()) !== -1
        );
    });
    var compare;
    switch (filterSortSettings.colNum) {
        case productColNum:
            compare = function(productA, productB) {
                if (productA.name > productB.name) return 1;
                if (productA.name < productB.name) return -1;
            };
            break;
        case unitPriceColNum:
            compare = function(productA, productB) {
                if (productA.price > productB.price) return 1;
                if (productA.price < productB.price) return -1;
            };
            break;
        case quantityColNum:
            compare = function(productA, productB) {
                if (+productA.quantity > +productB.quantity) return 1;
                if (+productA.quantity < +productB.quantity) return -1;
            };
            break;
        case totalColNum:
            compare = function(productA, productB) {
                if (+productA.totalPrice > +productB.totalPrice) return 1;
                if (+productA.totalPrice < +productB.totalPrice) return -1;
            };
            break;
    }

    switch (filterSortSettings.direction) {
        case directButtonClass:
            finalArray = productsToShow.sort(compare);
            break;
        case reverseButtonClass:
            finalArray = productsToShow.sort(compare).reverse();
            break;
    }
    drawTable(finalArray);
}

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

function showFilteredProducts() {
    var input = document.getElementById("searching-products").value;
    filterSortSettings.value = input;
    filterSortOrders(this.products);
    function clearInput() {
        document.getElementById("searching-products").value = "";
    }
    setTimeout(clearInput, 0);
}
//Products search reset
function showOriginalProducts() {
    document.getElementById("searching-products").value = null;
    filterSortSettings.value = "";
    filterSortSettings.direction = directButtonClass;
    filterSortSettings.colNum = productColNum;
    filterSortOrders(this.products);
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
