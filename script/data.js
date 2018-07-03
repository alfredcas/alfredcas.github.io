var dbCSV = '../data/tweets_public_clean.csv';
var dbCSVMap = '../data/tweets_public_map.csv';
var dbCSVAirline = '../data/tweets_public_airline.csv';
var dbCSVDate = '../data/tweets_by_date.csv';

var dataCSV = new Array();
var dataCSVMap = new Array();
var dataCSVAirline = new Array();
var dataCSVDate = new Array();

window.sentiment = 'general';
window.date = 'general';

window.colors = {
    negative: '#ff5050',
    positive: '#009933',
    neutral: '#333399',
    general: '#000000'
};

window.markers = new Array();

Papa.parse(dbCSV, {
    header: true,
    download: true,
    complete: function(results) {
        dataCSV = results.data;
        
        addPieChart(dataCSV);
        addTimeChart(dataCSV);
    }
});

Papa.parse(dbCSVMap, {
    header: true,
    download: true,
    complete: function(results) {
        dataCSVMap = results.data;
        
        makeMap(dataCSVMap);
    }
});

Papa.parse(dbCSVAirline, {
    header: true,
    download: true,
    complete: function(results) {
        dataCSVAirline = results.data;
        
        addAirlinesChart(dataCSVAirline);
    }
});

Papa.parse(dbCSVDate, {
    header: true,
    download: true,
    complete: function(results) {
        dataCSVDate = results.data;
        
        addDateChart(dataCSVDate);
    }
});