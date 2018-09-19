'use strict';

//Constructor function for ShopLocations
function ShopLocation(locationName, minCustomers, maxCustomers, avgPurchase) {
    this.locationName = locationName;
    this.minCustomers = minCustomers;
    this.maxCustomers = maxCustomers;
    this.avgPurchase = avgPurchase;
    this.hrlyCustEstimate = [];
    this.simmed = false;
    ShopLocation.allLocations.push(this);
}

ShopLocation.allLocations = [];

//generates randomized number of customers using this location's minimum and maximum customer properties
ShopLocation.prototype.randCustomers = function() {
    var hrCust = Math.ceil(Math.random() * (this.maxCustomers - this.minCustomers)) + this.minCustomers;
    console.log('randomized hour\'s customers as ' + hrCust);
    return hrCust;
}

//generates a simulated estimate of hourly customers for each hour this location is open.
//returns and stores this information in the hrlyCustEstimate property.
ShopLocation.prototype.simHourlyCustomers = function() {
    var randCustAdd = 0;
    console.log('entered simHrCust')
    for (var i = 0; i < 15; i++) {
        randCustAdd = this.randCustomers();
        this.hrlyCustEstimate.push(randCustAdd);
        console.log(this.hrlyCustEstimate);
    }
    console.log('simHrCust returns ' + this.hrlyCustEstimate);
    this.simmed = true;
    return this.hrlyCustEstimate;
}

//Calls .simHourlyCustomers function property to generate and store estimate of hourly customers 
// if it has not already been created. 
//Uses hourly customer estimate and average number of cookies purchased at this location to generate and return
// a per-hour estimate of cookie purchases.
ShopLocation.prototype.simHourlyCookies = function() {
    if (!this.simmed) {
        console.log('no customer estimate exists. simming customers');
        this.simHourlyCustomers();
    }
    var randCookAdd = 0;
    var hrlyCookEstimate = [];
    for (var i = 0; i < 15; i++) {
        console.log(this.avgPurchase);
        console.log(this.hrlyCustEstimate[i]);
        randCookAdd = Math.ceil(this.avgPurchase * this.hrlyCustEstimate[i]);
        console.log('added to cookie array: ' + randCookAdd);
        hrlyCookEstimate.push(randCookAdd);
        console.log(hrlyCookEstimate);
    }
    console.log('simhrcook returns ' + hrlyCookEstimate);
    return hrlyCookEstimate;
}

//generates, stores and returns estimated daily total of cookies purchased
ShopLocation.prototype.totalCookies = function() {
    var total = 0;
    var cookieTally = this.simHourlyCookies();
    for (var i = 0; i < cookieTally.length; i++) {
        total += cookieTally[i];
        console.log('total so far is ' + total);
    }
    console.log('final cookie total is ' + total);
    return total;
}

//renders location's row and returns row element
ShopLocation.prototype.renderRow = function() {
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

//renders table
function renderTable() {
    var elLocList = document.getElementsByClassName('displayLocations').item(0);
    var thisLoc = this;

    var elLocation = document.createElement('div');
    elLocation.className = 'location';
    elLocList.appendChild(elLocation);

    var elLocH = document.createElement('h2');
    elLocH.className = 'locationHeader';
    elLocH.textContent = 'Cookies needed by location each day';
    elLocation.appendChild(elLocH);

    var elTable = document.createElement('table');
    elTable.className = 'cookieTable';
    elLocation.appendChild(elTable);

    var elTableHeader = document.createElement('thead');
    elTable.appendChild(elTableHeader);

    var elTableHeadRow = document.createElement('tr');
    elTableHeader.appendChild(elTableHeadRow);

    //table header
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

    //table body
    var elTableBody = document.createElement('tbody');
    elTable.appendChild(elTableBody);

    for (var i = 0; i < ShopLocation.allLocations.length; i++) {
        console.log('Rendering row: '+ ShopLocation.allLocations[i].locationName);
        elTableBody.appendChild(ShopLocation.allLocations[i].renderRow());
    }

    //table footer
}


var firstAndPike = new ShopLocation('1st and Pike', 23, 65, 6.3);
var seaTacAirport = new ShopLocation('Seatac Airport', 3, 24, 1.2);
var seattleCenter = new ShopLocation('Seattle Center', 11, 38, 3.7);
var capitolHill = new ShopLocation('Capitol Hill', 20, 38, 2.3);
var alki = new ShopLocation('Alki', 2, 16, 4.6);


renderTable();
