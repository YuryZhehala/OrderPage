const PRODUCT_COL_NUM = "0";
const UNIT_PRICE_COL_NUM = "1";
const QUANTITY_COL_NUM = "2";
const TOTAL_COL_NUM = "3";
const SELECT_MESSAGE = "Please select an order from the list";
const SORRY_MESSAGE = "Sorry, there are no any available orders";
const SORRY_TABLE_MESSAGE = "Sorry, there are no available products";
const DIRECT_BUTTON_CLASS = "sort direct-button";
const REVERSE_BUTTON_CLASS = "sort reverse-button";
const ENTER_KEY_CODE = 13;
const ORDERS_TO_RENDER = 20;
const LOCATION = "Your order location";
const FILTER_SORT_SETTINGS = {
    value: "",
    direction: DIRECT_BUTTON_CLASS,
    colNum: PRODUCT_COL_NUM,
};

function fetchOrders() {
    HttpClient.getOrders().then(function(Orders) {
        showMessage(Orders);
        displayOrsdersNum(Orders);
        displayList(Orders);
        searchOrder(Orders);
        resetSearch(Orders);
        selectOrder(Orders);
        deleteOrderFromServer(Orders);
        
    });
}
fetchOrders();

//Checking order base is not empty or undefined
function showMessage(Orders) {
    var message = document.querySelector("#onload-message");
    if (Orders.length) {
        message.innerHTML = SELECT_MESSAGE;
    } else {
        message.innerHTML = SORRY_MESSAGE;
    }
}

//________________________________________________SIDEBAR__________________________________________________//

//-------------------Implementation of search feature in the orders list
function searchOrder(Orders) {
    var searchOrderButton = document.querySelector("#search-order-button");
    var searchOrderInput = document.querySelector("#searching-info");
    searchOrderButton.addEventListener(
        "click",
        showFilteredList.bind(Orders, event),
    );
    searchOrderInput.addEventListener("focus", hideReloadButton);
    searchOrderInput.addEventListener("blur", addReloadButton);
    searchOrderInput.addEventListener("keydown", function(event) {
        if (event.keyCode === ENTER_KEY_CODE) {
            showFilteredList.call(Orders);
        }
    });
}

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
//Filtration of orders list
function showFilteredList() {
    var input = document.querySelector("#searching-info").value;
    var message = document.querySelector("#order-id");
    var ordersToShow = this.filter(function(order) {
        return (
            (
                order.id +
                "" +
                order.summary.customer +
                "" +
                order.summary.shippedAt +
                "" +
                order.summary.createdAt +
                "" +
                order.summary.status
            )
                .toLowerCase()
                .indexOf(input.toLowerCase()) !== -1
        );
    });
    if (ordersToShow.length) {
        displayList(ordersToShow);
    } else {
        hideContent([
            "tab-bar",
            "customer-information",
            "products-table-wrapper",
            "order-price",
            "total-price",
            "currency",
            "customer-details",
        ]);
        var message = document.querySelector("#orders-list");
        message.innerHTML = SORRY_MESSAGE;
    }
    displayOrsdersNum(ordersToShow);
}
//Orders search reset
function resetSearch(Orders) {
    var ordersReloadButton = document.querySelector("#reload-orders-button");
    ordersReloadButton.addEventListener("click", function() {
        var message = document.querySelector("#order-id");
        message.innerHTML = SELECT_MESSAGE;
        document.querySelector("#searching-info").value = null;
        hideContent([
            "tab-bar",
            "customer-information",
            "products-table-wrapper",
            "order-price",
            "total-price",
            "currency",
            "customer-details",
        ]);
        displayList(Orders);
        displayOrsdersNum(Orders);
    });
}

//Displaying of the sidebar
function displayList(ordersArray) {
    if (!ordersArray.length) {
        var message = document.querySelector("#orders-list");
        message.innerHTML = SORRY_MESSAGE;
        message.classList.add("empty-list-message");
    }
    var orderList = "<ul>";
    var listElement = document.querySelector("#orders-list");
    ordersArray.forEach(function(item, i) {
        if (i < ORDERS_TO_RENDER) {
            orderList +=
                '<li class="order-number" id="' +
                item.id +
                '" href="#">' +
                "<div>" +
                "<div>Order " +
                item.id +
                "</div>" +
                "<div>" +
                item.summary.customer +
                "</div>" +
                "<div>Shipped: " +
                item.summary.shippedAt +
                "</div>" +
                "</div>" +
                "<div>" +
                "<div>" +
                item.summary.createdAt +
                "</div>" +
                "<div>" +
                item.summary.status +
                "</div>" +
                "</div>" +
                "</li>";
        }
    });
    displayOrsdersNum(ordersArray);
    listElement.innerHTML = orderList;
}
//Changing the number of displayed objects
function displayOrsdersNum(ordersArray) {
    var ordersQuantity = document.querySelector("#orders-quantity");
    ordersQuantity.innerHTML = ordersArray.length;
}
//Adding of classes which hide the content
function hideContent(contentIdArray) {
    contentIdArray.forEach(function(contentId) {
        var elem = document.querySelector("#" + contentId + "");
        elem.classList.add("hide-content");
    });
}

//__________________________________ADD ORDER________________________________________//
openForm("order");
function createOrder() {
    var loadButton = document.querySelector("#upload-order");
    loadButton.addEventListener("click", function() {
        var orderDetails = {
            firstName: document.querySelector("#new-first-name").value,
            lastName: document.querySelector("#new-last-name").value,
            address: document.querySelector("#new-address").value,
            phone: document.querySelector("#new-phone").value,
            email: document.querySelector("#new-email").value,
            name: document.querySelector("#new-name").value,
            zipCode: document.querySelector("#new-zip").value,
            region: document.querySelector("#new-region").value,
            country: document.querySelector("#new-country").value,
        };
        var newOrderArray = prepareOrderForm(orderDetails);
        var createdOrder = JSON.stringify(newOrderArray);
        HttpClient.addOrder(createdOrder);    
        showHiddenContent(["create-order-message"]);
        setTimeout(() => {
            hideContent(["create-order-message"]);
        }, 3000);
    });
}
createOrder();

function createDate() {
    var options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    };
    var date = new Date();
    var createdDate = date.toLocaleString("ru", options);
    return createdDate;
}

function prepareOrderForm(orderDetails) {
    var todaysDate = createDate();
    var newOrder = {
        summary: {
            createdAt: todaysDate,
            customer: orderDetails.firstName + " " + orderDetails.lastName,
            status: "Accepted",
            shippedAt: "",
            totalPrice: "",
            currency: "",
        },
        shipTo: {
            name: orderDetails.name,
            address: orderDetails.address,
            ZIP: orderDetails.zipCode,
            region: orderDetails.region,
            country: orderDetails.country,
        },
        customerInfo: {
            firstName: orderDetails.firstName,
            lastName: orderDetails.lastName,
            address: orderDetails.address,
            phone: orderDetails.phone,
            email: orderDetails.email,
        },
    };
    return newOrder;
}

//__________________________________DELETE ORDER________________________________________//
function deleteOrderFromServer(Orders) {
    var deleteOrderButton = document.querySelector("#delete-order");
    deleteOrderButton.addEventListener("click", function(event) {
        var order = Orders.find(function(order) {
            return String(order.id) === selectedOrder.id;
        });
        var deletionOrder = confirm(
            "Are you sure you want to delete this order?",
        );
        if (deletionOrder) {
            HttpClient.deleteOrder(order);
            selectedOrder.classList.add("hide-content");
            hideContent([
                "tab-bar",
                "customer-information",
                "products-table-wrapper",
                "order-price",
                "total-price",
                "currency",
                "customer-details",
            ]);
        }
    });
}

//________________________________________________SUMMARY__________________________________________________//

//------------------------Implementation of "show detail" information feature********************//
function selectOrder(Orders) {
    var listContainer = document.querySelector("#orders-list");
    
    listContainer.addEventListener("click", function(event) {
        FILTER_SORT_SETTINGS.value = "";
        var target = event.target;
        var li = target.closest("li");
        if (!li) return;
        if (!listContainer.contains(li)) return;
        highlightOrder(li);
        var order = Orders.find(function(order) {
            return String(order.id) === li.id;
        });
        hideContent(["onload-message"]);
        showHiddenContent([
            "tab-bar",
            "customer-information",
            "products-table-wrapper",
            "order-price",
            "total-price",
            "currency",
            "customer-details",
        ]);
        setDefaultTab("shipping-tab");
        setDefaultTab("customer-tab");
        setDefaultTab("map-tab");        
        setDefaultSortButtons();
        makeDefaultEditButton();
        makeReadOnlyForm(true);
        showHeaderInfo(order);
        showShippingCustomerMap(order);
        showShippingAddress.call(order);
        highlighShipping();
        HttpClient.getProducts().then(function(productsList) {
            searchProdList(productsList);
        });
        clearInput();
        HttpClient.getGeocode(order).then(function(geocodingResponse) {
            var coordinates = geocodingResponse.results[0].geometry.location;
            initMap(coordinates);    
        });
    });
}

//------------------------------Displaying of Header information------------------------------//
function showHeaderInfo(order) {
    var orderIdElement = document.querySelector("#order-id");
    var customerName = document.querySelector("#order-customer");
    var orderedDate = document.querySelector("#ordered-date");
    var shippedDate = document.querySelector("#order-shipped");
    customerInformationHeader = document.querySelector(
        ".customer-information h1",
    );
    customerInformationHeader.innerHTML = "Shipping address map point";
    hideContent(["shipping-customer-form"]);
    orderIdElement.innerHTML = order.id;
    customerName.innerHTML = order.summary.customer;
    orderedDate.innerHTML = editDate(order.summary.createdAt);
    shippedDate.innerHTML = editDate(order.summary.shippedAt);
}
function selectTab() {
    var tabBarElement = document.querySelector("#tab-bar");
    tabBarElement.addEventListener("click", function(event) {
        var target = event.target;
        var li = target.closest("li");
        if (!li) return;
        if (!tabBarElement.contains(li)) return;
        highlighTab(li);
    });
}
selectTab();
//Highlitung of shipping tab at first
function highlighShipping() {
    var shippingTab = document.querySelector("#shipping-tab");
    shippingTab.classList.add("highlight-tab1");
}
//Logic of highlighting of selected tab
function highlighTab(node) {
    if (node.id == "shipping-tab") {
        node.classList.add("highlight-tab1");
        document
            .querySelector("#customer-tab")
            .classList.remove("highlight-tab2");
        document.querySelector("#map-tab").classList.remove("highlight-tab3");
    }
    if (node.id == "customer-tab") {
        node.classList.add("highlight-tab2");
        document
            .querySelector("#shipping-tab")
            .classList.remove("highlight-tab1");
        document.querySelector("#map-tab").classList.remove("highlight-tab3");
    }
    if (node.id == "map-tab") {
        node.classList.add("highlight-tab3");
        document
            .querySelector("#shipping-tab")
            .classList.remove("highlight-tab1");
        document
            .querySelector("#customer-tab")
            .classList.remove("highlight-tab2");
    }
}

var selectedOrder;
//Highlight selected tab
function highlightOrder(node) {
    if (selectedOrder) {
        selectedOrder.classList.remove("highlight");
    }
    selectedOrder = node;
    selectedOrder.classList.add("highlight");
}
//Set default value of the tab-bar
function setDefaultTab(contentId) {
    var elem = document.querySelector("#" + contentId + "");
    if (elem.classList.contains("highlight-tab1")) {
        elem.classList.remove("highlight-tab1");
    }
    if (elem.classList.contains("highlight-tab2")) {
        elem.classList.remove("highlight-tab2");
    }
    if (elem.classList.contains("highlight-tab3")) {
        elem.classList.remove("highlight-tab3");
    }
}
//Removing of classes which hide the content
function showHiddenContent(contentIdArray) {
    contentIdArray.forEach(function(contentId) {
        var elem = document.querySelector("#" + contentId + "");
        if (elem.classList.contains("hide-content")) {
            elem.classList.toggle("hide-content");
        }
    });
}

//_______________________________________SHIPPING & CUSTOMER INFO________________________________________//

//-----------------------View shipping, customer or map information according to clicked button
function showShippingCustomerMap(order) {
    var shippingTabElement = document.querySelector("#shipping-tab");
    var customerTabElement = document.querySelector("#customer-tab");
    var mapTabElement = document.querySelector("#map-tab");
    shippingTabElement.addEventListener(
        "click",
        showShippingAddress.bind(order, event),
    );
    customerTabElement.addEventListener(
        "click",
        showCustomer.bind(order, event),
    );
    mapTabElement.addEventListener("click", showMap.bind(order, event));
}

//-------------------------Displaying of shipping address information
function showShippingAddress() {
    showHiddenContent(["shipping-customer-form", "edit-shipping-wrapper"]);
    hideContent(["map", "edit-customer-wrapper"]);
    makeDefaultEditButton();
    makeReadOnlyForm(true);

    //Changing of the value of each label
    customerInformationHeader = document.querySelector(
        ".customer-information h1",
    );
    customerInformationHeader.innerHTML = "Shipping Address";
    var informationDetailsLabel = document.querySelectorAll(
        ".information-details-label",
    );
    var labels = ["Name", "Street", "ZIP Code/City", "Region", "Country"];

    [].forEach.call(informationDetailsLabel, function(elem, i) {
        elem.innerHTML = labels[i];
    });

    //Changing of the value of each input
    var order = this;

    var values = [
        order.shipTo.name,
        order.shipTo.address,
        order.shipTo.ZIP,
        order.shipTo.region,
        order.shipTo.country,
    ];
    var informationDetails = document.querySelectorAll(".information-details");
    [].forEach.call(informationDetails, function(elem, i) {
        elem.value = values[i];
    });
}

//This function hides or shows "edit", "save", "cancel" buttons
//(result for last param of the function changes according to pressed button)
function hideShowButtons(action, hide, showHide, readOnlyAttribute) {
    var formFieldsCollection = document.querySelectorAll(
        ".information-details",
    );
    var editFormFields = Array.prototype.slice.call(formFieldsCollection);
    var editButton = document.querySelector("#" + action + "");
    editButton.addEventListener("click", function(event) {
        hideContent([action]);
        showHiddenContent([hide]);
        if (action == "edit-customer" || action == "edit-shipping") {
            showHiddenContent([showHide]);
        } else {
            hideContent([showHide]);
        }
        makeReadOnlyForm(readOnlyAttribute);
    });
}

function makeDefaultEditButton() {
    showHiddenContent(["edit-customer", "edit-shipping"]);
    hideContent([
        "save-customer",
        "cancel-customer",
        "save-shipping",
        "cancel-shipping",
    ]);
}
function makeReadOnlyForm(confirmation) {
    var formFieldsCollection = document.querySelectorAll(
        ".information-details",
    );
    var editFormFields = Array.prototype.slice.call(formFieldsCollection);
    editFormFields.forEach(function(el) {
        el.readOnly = confirmation;
        if (confirmation) {
            el.classList.add("hide-input-border");
        } else {
            el.classList.remove("hide-input-border");
        }
    });
}
hideShowButtons("edit-customer", "save-customer", "cancel-customer", false);
hideShowButtons("save-customer", "edit-customer", "cancel-customer", true);
hideShowButtons("cancel-customer", "edit-customer", "save-customer", true);

hideShowButtons("edit-shipping", "save-shipping", "cancel-shipping", false);
hideShowButtons("save-shipping", "edit-shipping", "cancel-shipping", true);
hideShowButtons("cancel-shipping", "edit-shipping", "save-shipping", true);

// Show edit shipping information block
function editShippingAddress() {
    var saveChanges = document.querySelector("#save-shipping");
    saveChanges.addEventListener("click", function() {
        var newShippingDetails = {
            name: document.querySelector("#customer-full-name").value,
            address: document.querySelector("#customer-street").value,
            zipCode: document.querySelector("#customer-zip-code").value,
            region: document.querySelector("#customer-region").value,
            country: document.querySelector("#customer-country").value,
        };
        var newOrderArray = prepareShippingForm(newShippingDetails);
        var shippingChangesMade = JSON.stringify(newOrderArray);
        HttpClient.editOrder(shippingChangesMade, selectedOrder.id).then(fetchOrders)
    });
}
editShippingAddress();

function prepareShippingForm(shippingDetails) {
    var newShipping = {
        shipTo: {
            name: shippingDetails.name,
            address: shippingDetails.address,
            ZIP: shippingDetails.zipCode,
            region: shippingDetails.region,
            country: shippingDetails.country,
        },
    };
    return newShipping;
}

// Show edit customer information block
function editCustomerAddress() {
    var saveChanges = document.querySelector("#save-customer");
    saveChanges.addEventListener("click", function() {
        var newShippingDetails = {
            name: document.querySelector("#customer-full-name").value,
            address: document.querySelector("#customer-street").value,
            zipCode: document.querySelector("#customer-zip-code").value,
            region: document.querySelector("#customer-region").value,
            country: document.querySelector("#customer-country").value,
        };
        var newOrderArray = prepareCustomerForm(newShippingDetails);
        var shippingChangesMade = JSON.stringify(newOrderArray);
        HttpClient.editOrder(shippingChangesMade, selectedOrder.id);
        showShippingCustomerMap(order);
    });
}
editCustomerAddress();

function prepareCustomerForm(shippingDetails) {
    var newCustomer = {
        customerInfo: {
            firstName: shippingDetails.name,
            lastName: shippingDetails.address,
            address: shippingDetails.zipCode,
            phone: shippingDetails.region,
            email: shippingDetails.country,
        },
    };
    return newCustomer;
}

//-------------------------------Displaying of customer information
function showCustomer() {
    showHiddenContent(["edit-customer-wrapper", "shipping-customer-form"]);
    hideContent(["edit-shipping-wrapper", "map"]);
    makeDefaultEditButton();
    makeReadOnlyForm(true);
    //Changing of the value of each label
    customerInformationHeader = document.querySelector(
        ".customer-information h1",
    );
    customerInformationHeader.innerHTML = "Customer Info";
    var informationDetailsLabel = document.querySelectorAll(
        ".information-details-label",
    );
    [].forEach.call(informationDetailsLabel, function(elem, i) {
        arr = ["First Name", "Last Name", "Address", "Phone", "Email"];
        elem.innerHTML = arr[i];
    });
    //Changing of the value of each input
    var order = this;
    var informationDetails = document.querySelectorAll(".information-details");
    [].forEach.call(informationDetails, function(elem, i) {
        arr = [
            order.customerInfo.firstName,
            order.customerInfo.lastName,
            order.customerInfo.address,
            order.customerInfo.phone,
            order.customerInfo.email,
        ];
        elem.setAttribute("value", arr[i]);
    });
}
//-------------------------------Displaying of customer location
function showMap() {
    makeDefaultEditButton();
    makeReadOnlyForm(true);
    showHiddenContent(["map"]);
    customerInformationHeader = document.querySelector(
        ".customer-information h1",
    );
    customerInformationHeader.innerHTML = "Shipping address map point";
    hideContent([
        "shipping-customer-form",
        "edit-shipping-wrapper",
        "edit-customer-wrapper",
    ]);
}

//Displaying a map
function initMap(coordinates) {
    var centerLatLng = new google.maps.LatLng(coordinates);
    var mapOptions = {
        center: centerLatLng,
        zoom: 8,
    };
    var map = new google.maps.Map(document.querySelector("#map"), mapOptions);
    var marker = new google.maps.Marker({
        position: centerLatLng,
        map: map,
        title: LOCATION,
    });
}

//_______________________________________PRODUCTS TABLE________________________________________//
//*****************Showing of Products list in a "line items" table (products)***************//
//-----------------------Loading Products base from the server

//Search product list of selected order among other products
function searchProdList(productsList) {
    var orderProductsList = productsList.filter(function(product) {
        return product.orderId == selectedOrder.id;
    });
    if (orderProductsList.length) {
        showProductsList(orderProductsList);
    } else {
        var productsTableElement = document.querySelector("#products-tbody");

        showProductsList(orderProductsList);
        productsTableElement.innerHTML = SORRY_TABLE_MESSAGE;
    }
}

function showProductsList(orderProductsList) {
    var searchingProducts = document.querySelector("#search-product-button");
    var searchProductInput = document.querySelector("#searching-products");
    var productsReloadButton = document.querySelector(
        "#products-reload-button",
    );
    renderTable(orderProductsList);
    searchingProducts.addEventListener(
        "click",
        showFilteredProducts.bind(orderProductsList, event),
    );
    searchProductInput.addEventListener("keydown", function(event) {
        if (event.keyCode === ENTER_KEY_CODE) {
            showFilteredProducts.call(orderProductsList);
        }
    });
    productsReloadButton.addEventListener(
        "click",
        showOriginalProducts.bind(orderProductsList, event),
    );
    showSortedProducts(orderProductsList);
}
//------------------Rendering of original table of products
function renderTable(productsArray) {
    var productsTableElement = document.querySelector("#products-tbody");
    var productsTable = "<tr>";
    productsArray.forEach(function(product, i) {
        productsTable +=
            "<td><div class='highlight-text'>" +
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
            "</td><td><button class='delete-product' id='" +
            product.id +
            "'><div><img src='media/trash-blue.svg'></div></button></td></tr><tr>";
    });
    productsTable += "</tbody>";
    productsTableElement.innerHTML = productsTable;
    //Calculating the number of products
    var lineItems = document.querySelector("#line-items span");
    lineItems.innerHTML = productsArray.length;
    calculateTotalPrice(productsArray);
}
//Calculating of total price of products
function calculateTotalPrice(productsArray) {
    var productsTotalPrice = productsArray
        .map(function(product) {
            return +product.totalPrice;
        })
        .reduce(function(sum, current) {
            return sum + current;
        }, 0);

    var totalPrice = document.querySelector("#total-price");
    totalPrice.innerHTML = productsTotalPrice;
    //Taking currency
    var currency = document.querySelector("#currency");
    if (productsArray[0]) {
        currency.innerHTML = productsArray[0].currency;
    }
}

//----------------------Implementation of sorting and quick search in the products table

function filterProducts(products) {
    var productsToShow = products.filter(function(product) {
        return (
            Object.values(product)
                .join("")
                .toLowerCase()
                .indexOf(FILTER_SORT_SETTINGS.value.toLowerCase()) !== -1
        );
    });
    return new Promise(function(resolve, reject) {
        resolve(productsToShow);
    });
}

function sortProducts(productsToShow) {
    var compare;
    switch (FILTER_SORT_SETTINGS.colNum) {
        case PRODUCT_COL_NUM:
            compare = function(productA, productB) {
                if (productA.name > productB.name) return 1;
                if (productA.name < productB.name) return -1;
            };
            break;
        case UNIT_PRICE_COL_NUM:
            compare = function(productA, productB) {
                if (productA.price > productB.price) return 1;
                if (productA.price < productB.price) return -1;
            };
            break;
        case QUANTITY_COL_NUM:
            compare = function(productA, productB) {
                if (+productA.quantity > +productB.quantity) return 1;
                if (+productA.quantity < +productB.quantity) return -1;
            };
            break;
        case TOTAL_COL_NUM:
            compare = function(productA, productB) {
                if (+productA.totalPrice > +productB.totalPrice) return 1;
                if (+productA.totalPrice < +productB.totalPrice) return -1;
            };
            break;
    }

    switch (FILTER_SORT_SETTINGS.direction) {
        case REVERSE_BUTTON_CLASS:
            finalArray = productsToShow.sort(compare);
            break;
        case DIRECT_BUTTON_CLASS:
            finalArray = productsToShow.sort(compare).reverse();
            break;
    }
    return new Promise(function(resolve, reject) {
        resolve(finalArray);
    });
}
function filterSortProducts(products) {
    filterProducts(products)
        .then(sortProducts)
        .then(renderTable);
}
var listeners = [];
function showSortedProducts(orderProductsList) {
    var tableHeaderRow = document.querySelector("#header-row");
    // tableHeaderRow.removeEventListener;
    const listener = function(event) {
        var target = event.target;
        var button = target.closest("button");
        if (!button) return;
        if (!tableHeaderRow.contains(button)) return;
        setDefaultSortButtons();
        FILTER_SORT_SETTINGS.direction = button.getAttribute("class");
        button.classList.add("hide-content");
        FILTER_SORT_SETTINGS.colNum = button.getAttribute("cell-index");
        filterSortProducts(orderProductsList);
    }
    listeners.push(listener);
    listeners.forEach(function(action) {
        tableHeaderRow.removeEventListener("click", action)
    })
    tableHeaderRow.addEventListener("click", listener);
}
//Set default settings of fulter buttons
function setDefaultSortButtons() {
    var restButtons = document.querySelectorAll(".sort");
    [].forEach.call(restButtons, function(el, i) {
        if (el.classList.contains("hide-content")) {
            el.classList.remove("hide-content");
        }
    });
}
//Rendering of filtered table of products
function showFilteredProducts() {
    var input = document.querySelector("#searching-products").value;
    FILTER_SORT_SETTINGS.value = input;
    if (FILTER_SORT_SETTINGS.value) {
        filterSortProducts(this);
    } else {
        renderTable(this);
    }
}
//Products search reset
function showOriginalProducts() {
    document.querySelector("#searching-products").value = null;
    renderTable(this);
}
function clearInput() {
    document.querySelector("#searching-products").value = "";
}

//_____________________________________ADD PRODUCT________________________________________//
//Creating of opening form constructor
function openForm(orderOrProduct) {
    var addButton = document.querySelector("#add-" + orderOrProduct + "");
    addButton.addEventListener("click", function(event) {
        showHiddenContent([
            "popup-background",
            "new-" + orderOrProduct + "-form",
        ]);
    });
    var closeButton = document.querySelector(
        "#close-" + orderOrProduct + "-form",
    );
    closeButton.addEventListener("click", function(event) {
        hideContent(["popup-background", "new-" + orderOrProduct + "-form"]);
    });
}
//Open popup to add a product
openForm("product");

//Creating JSON of the product according to entered values, sending it on server
function createProduct() {
    var loadButton = document.querySelector("#upload-product");
    loadButton.addEventListener("click", function() {
        var productDetails = {
            name: document.querySelector("#new-product").value,
            price: document.querySelector("#new-product-price").value,
            quantity: document.querySelector("#new-product-quantity").value,
        };
        var newProductArray = prepareProductForm(productDetails);
        var createdProduct = JSON.stringify(newProductArray);
        HttpClient.addProduct(createdProduct);
        showHiddenContent(["create-poduct-message"]);
        setTimeout(() => {
            hideContent(["create-poduct-message"]);
        }, 3000);
    });
}
createProduct();

//Creatin of product's form
function prepareProductForm(productDetails) {
    var newProduct = {
        name: productDetails.name,
        price: productDetails.price,
        currency: "EUR",
        quantity: productDetails.quantity,
        totalPrice: productDetails.quantity * productDetails.price,
        orderId: selectedOrder.id,
    };
    return newProduct;
}

//_____________________________________DELETE PRODUCT________________________________________//
HttpClient.getProducts().then(function(productsData) {
    deleteProductFromServer(productsData);
});
function deleteProductFromServer(productList) {
    var tbody = document.querySelector("#products-tbody");
    tbody.addEventListener("click", function(event) {
        var target = event.target;
        var button = target.closest("button");
        if (!button) return;
        if (!tbody.contains(button)) return;
        var product = productList.find(function(product) {
            return String(product.id) === button.id;
        });
        var tr = target.closest("tr");
        var deletionProduct = confirm(
            "Are you sure you want to delete this product?",
        );
        if (deletionProduct) {
            HttpClient.deleteProduct(product);
            tr.classList.add("hide-content");
        }
    });
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
