'use strict';

var openHours = [ '6:00am', '7:00am', '8:00am', '9:00am', '10:00am', '11:00am', '12:00pm', '1:00pm', '2:00pm',
 '3:00pm', '4:00pm', '5:00pm', '6:00pm', '7:00pm', '8:00pm'
];

//Creates the location data table element and adds the 
var elTable = document.createElement('table');
var elTableBody = makeBaby('tbody', '', elTable);
var elTableFooter = makeBaby('tfoot', '', elTable);

// constructs a new ShopLocation object using a given name, minimum expected customers, maximum expected customers,
// and average number of cookies purchased at this location. When created, will generate and store arrays of expected
// customers and cookie sales per hour, respectively. 
function ShopLocation(locationName, minCustomers, maxCustomers, avgPurchase) {
    this.locationName = '' + locationName;
    this.minCustomers = parseInt(minCustomers, 10);
    this.maxCustomers = parseInt(maxCustomers, 10);
    this.avgPurchase = parseInt(avgPurchase, 10);
    this.hrlyCustEstimate = [];
    this.hrlyCookEstimate = [];
    ShopLocation.allLocations.push(this);
    this.simHourlyCustomers();
    this.simHourlyCookies();
}

ShopLocation.allLocations = [];

// Adds function to ShopLocation objects that generates randomized number of customers using this location's 
// minimum and maximum customer properties.
ShopLocation.prototype.randCustomers = function() {
    var hrCust = Math.floor(Math.random() * (this.maxCustomers - this.minCustomers)) + this.minCustomers;
    return hrCust;
}

// Adds function to ShopLocation that generates a simulated estimate of hourly customers for each hour 
// this location is open. Returns and stores this information in the hrlyCustEstimate property.
ShopLocation.prototype.simHourlyCustomers = function() {
    var randCustAdd = 0;
    for (var i = 0; i < openHours.length; i++) {
        randCustAdd = this.randCustomers();
        this.hrlyCustEstimate.push(randCustAdd);
    }
}

// Uses hourly customer record and average number of cookies purchased at this location to generate and return
// a per-hour estimate of cookie purchases.
ShopLocation.prototype.simHourlyCookies = function() {
    var cookAdd = 0;
    for (var i = 0; i < openHours.length; i++) {
        cookAdd = Math.ceil(this.avgPurchase * this.hrlyCustEstimate[i]);
        this.hrlyCookEstimate.push(cookAdd);
    }
}

// generates, stores and returns estimated daily total of cookies purchased
ShopLocation.prototype.totalCookies = function() {
    var total = 0;
    var cookieTally = this.hrlyCookEstimate;
    for (var i = 0; i < cookieTally.length; i++) {
        total += cookieTally[i];
    }
    return total;
}

// makes and returns a child HTML element using given parameters for its type, text content, parent, and optional
// class name. 
function makeBaby(elemType, elemContent, parent, className) {
    var el = document.createElement('' + elemType);
    el.textContent = '' + elemContent;
    parent.appendChild(el);
    if (className) {
    el.classList.add('' + className);
    }
    return el;
}

// renders location's row and returns row element
ShopLocation.prototype.makeRow = function() {
    var cookRec = this.hrlyCookEstimate;
    var elRow = document.createElement('tr');
    makeBaby('th', this.locationName, elRow);
    for (var i = 0; i < cookRec.length; i++) {
        makeBaby('td', cookRec[i], elRow);
    }
    makeBaby('td', this.totalCookies(), elRow, 'dayTotal');

    return elRow;
}

// renders a table containing hourly cookie purchase data for each store location, with each row containing
// a location's hourly cookie purchase data and totals.
// also renders footer row of hourly totals for cookie purchases across all store locations.
function renderTable() {
    var elLocList = document.getElementsByClassName('displayLocations').item(0);
    var elTableDiv = makeBaby('div', '', elLocList, 'tableDiv');
    makeBaby('h2', 'Cookies needed by location, per hour', elTableDiv, 'locationHeader');
    elTableDiv.appendChild(elTable);

    renderHeader();
    renderBody();
    renderFooter();
}

// renders a header for our location data table that labels each column.
function renderHeader() {
    var elTableHeader = makeBaby('thead', '', elTable);
    var elTableHeadRow = makeBaby('tr', '', elTableHeader);
    makeBaby('th', 'location', elTableHeadRow);
    for (var i = 0; i < openHours.length; i++) {
        makeBaby('th', openHours[i], elTableHeadRow, 'hour');
    }
    makeBaby('th', 'Day\'s total', elTableHeadRow);
}

// populates our location purchase data table with rows for each location, containing their hourly
// purchase data and daily totals.
function renderBody() {
    elTableBody.innerHTML = '';
    for (var i = 0; i < ShopLocation.allLocations.length; i++) {
        console.log('Rendering row: '+ ShopLocation.allLocations[i].locationName);
        elTableBody.appendChild(ShopLocation.allLocations[i].makeRow());
    }
}

//returns array of hourly totals of cookies purchased across all locations, including daily total
function hrlyTotals() {
    var footVals = [];
    var hourlyTotal;
    var allTotal = 0;
    for (var i = 0; i < openHours.length; i++) {
        hourlyTotal = 0;
        for (var j = 0; j < ShopLocation.allLocations.length; j++) {
            hourlyTotal += ShopLocation.allLocations[j].hrlyCookEstimate[i];
        }
        footVals.push(hourlyTotal);
        console.log('hourly total calced as ' + hourlyTotal);

        allTotal += hourlyTotal;
        console.log('allTotal is now ' + allTotal);
    }
    footVals.push(allTotal);
    console.log('footVals is ' + footVals);
    return footVals;
}

// creates a table footer that adds total cookie purchases for each hour across all store locations. 
function renderFooter() {
    elTableFooter.innerHTML = '';
    
    makeBaby('th', 'Hourly Totals', elTableFooter);
    
    var ftVals = hrlyTotals();
    for (var i = 0; i <= openHours.length; i++) {
        // var elTd = document.createElement('td');
        // elTd.textContent = ftVals[i];
        // elTableFooter.appendChild(elTd);
        console.log('adding to tablefooter: ' + ftVals[i]);
        if (i === openHours.length) {
            makeBaby('td', ftVals[i], elTableFooter, 'totaltotal');
            console.log('totaltotal');
        } else {
            makeBaby('td', ftVals[i], elTableFooter);
        }
    }
}

//Location table seed
var firstAndPike = new ShopLocation('1st and Pike', 23, 65, 6.3);
var seaTacAirport = new ShopLocation('Seatac Airport', 3, 24, 1.2);
var seattleCenter = new ShopLocation('Seattle Center', 11, 38, 3.7);
var capitolHill = new ShopLocation('Capitol Hill', 20, 38, 2.3);
var alki = new ShopLocation('Alki', 2, 16, 4.6);


var newLocForm = document.getElementById('addNewLocForm');

//Event function
function addNewLocation (event) {
    event.preventDefault();
    var locName = event.target.locName.value;
    var mnCust = event.target.mnCust.value;
    var mxCust = event.target.mxCust.value;
    var avPur = event.target.avPur.value;

    new ShopLocation(locName, mnCust, mxCust, avPur);

    renderBody();
    renderFooter();
    newLocForm.reset();

}

//Event listener
newLocForm.addEventListener('submit', addNewLocation);

renderTable();
