'use strict';




//global variable to store the location of the table we will populate
var elTable;


// constructor function for ShopLocations
function ShopLocation(locationName, minCustomers, maxCustomers, avgPurchase) {
    this.locationName = locationName;
    this.minCustomers = minCustomers;
    this.maxCustomers = maxCustomers;
    this.avgPurchase = avgPurchase;
    this.hrlyCustEstimate = [];
    ShopLocation.allLocations.push(this);
    this.simHourlyCustomers();
}

ShopLocation.allLocations = [];

//generates randomized number of customers using this location's minimum and maximum customer properties
ShopLocation.prototype.randCustomers = function() {
    var hrCust = Math.ceil(Math.random() * (this.maxCustomers - this.minCustomers)) + this.minCustomers;
    return hrCust;
}

//generates a simulated estimate of hourly customers for each hour this location is open.
//returns and stores this information in the hrlyCustEstimate property.
ShopLocation.prototype.simHourlyCustomers = function() {
    var randCustAdd = 0;
    for (var i = 0; i < 15; i++) {
        randCustAdd = this.randCustomers();
        this.hrlyCustEstimate.push(randCustAdd);
    }
}


// Uses hourly customer record and average number of cookies purchased at this location to generate and return
// a per-hour estimate of cookie purchases.
ShopLocation.prototype.simHourlyCookies = function() {
    var randCookAdd = 0;
    var hrlyCookEstimate = [];
    for (var i = 0; i < 15; i++) {
        randCookAdd = Math.ceil(this.avgPurchase * this.hrlyCustEstimate[i]);
        hrlyCookEstimate.push(randCookAdd);
    }
    return hrlyCookEstimate;
}

// generates, stores and returns estimated daily total of cookies purchased
ShopLocation.prototype.totalCookies = function() {
    var total = 0;
    var cookieTally = this.simHourlyCookies();
    for (var i = 0; i < cookieTally.length; i++) {
        total += cookieTally[i];
    }
    console.log('final cookie total is ' + total);
    return total;
}

// renders location's row and returns row element
ShopLocation.prototype.makeRow = function() {
    var elRow = document.createElement('tr');

    var elLocRowHeader = document.createElement('th');
    elLocRowHeader.textContent = this.locationName;
    elRow.appendChild(elLocRowHeader);

    for (var i = 0; i < this.simHourlyCookies().length; i++) {
        var elHrCookie = document.createElement('td');
        elHrCookie.textContent = this.simHourlyCookies()[i];
        elRow.appendChild(elHrCookie);
    }
    
    var elRowTotal = document.createElement('td');
    elRowTotal.classList.add('dayTotal');
    elRowTotal.textContent = this.totalCookies();
    elRow.appendChild(elRowTotal);
    return elRow;
}

// renders a table containing hourly cookie purchase data for each store location, with each row containing
// a location's hourly cookie purchase data and totals.
// also renders footer row of hourly totals for cookie purchases across all store locations.
function renderTable() {
    var elLocList = document.getElementsByClassName('displayLocations').item(0);
    var thisLoc = this;

    var elTableDiv = document.createElement('div');
    elTableDiv.className = 'location';
    elLocList.appendChild(elTableDiv);

    var elLocationH2 = document.createElement('h2');
    elLocationH2.className = 'locationHeader';
    elLocationH2.textContent = 'Cookies needed by location each day';
    elTableDiv.appendChild(elLocationH2);

    elTable = document.createElement('table');
    elTableDiv.appendChild(elTable);

    renderHeader();
    renderBody();
    renderFooter();

}

// renders a header for our location data table that labels each column.
function renderHeader() {
    var elTableHeader = document.createElement('thead');
    elTable.appendChild(elTableHeader);

    var elTableHeadRow = document.createElement('tr');
    elTableHeader.appendChild(elTableHeadRow);

    var elTh = document.createElement('th');
    elTh.textContent = 'Location';
    elTableHeadRow.appendChild(elTh);

    var hr = 6;
    var ampm = 'am';
    for (var i = 0; i < 15; i++) {
        var elHour = document.createElement('th');
        elHour.classList.add('hour');
        if (i >= 7) {
            hr = -6;
            ampm = 'pm';
            console.log('ampm switch');
        }
        elHour.textContent = '' + (hr + i) + ':00' + ampm;
        elTableHeadRow.appendChild(elHour);
    }
    var elThTotal = document.createElement('th');
    elThTotal.textContent = 'Day\'s Total';
    elTableHeadRow.appendChild(elThTotal);
}

// populates our location purchase data table with rows for each location, containing their hourly
// purchase data and daily totals.
function renderBody() {
    var elTableBody = document.createElement('tbody');
    elTable.appendChild(elTableBody);

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
    for (var i = 0; i < 15; i++) {
        hourlyTotal = 0;
        for (var j = 0; j < ShopLocation.allLocations.length; j++) {
            hourlyTotal += ShopLocation.allLocations[j].simHourlyCookies()[i];
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
    var elTableFooter = document.createElement('tfoot');
    elTable.appendChild(elTableFooter);

    var elFootHead = document.createElement('th');
    elFootHead.textContent = 'Hourly Totals';
    elTableFooter.appendChild(elFootHead);

    var ftVals = hrlyTotals();
    console.log('ftVals array is ' + ftVals);

    for (var i = 0; i < 16; i++) {
        var elTd = document.createElement('td');
        elTd.textContent = ftVals[i];
        elTableFooter.appendChild(elTd);
        console.log('adding to tablefooter: ' + ftVals[i]);
        if (i === 15) {
            elTd.classList.add('totaltotal');
            console.log('totaltotal');
        }
    }
}

var firstAndPike = new ShopLocation('1st and Pike', 23, 65, 6.3);
var seaTacAirport = new ShopLocation('Seatac Airport', 3, 24, 1.2);
var seattleCenter = new ShopLocation('Seattle Center', 11, 38, 3.7);
var capitolHill = new ShopLocation('Capitol Hill', 20, 38, 2.3);
var alki = new ShopLocation('Alki', 2, 16, 4.6);


renderTable();
