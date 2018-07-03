var dbCSV = '../data/tweets_public_clean.csv';
var dbCSVMap = '../data/tweets_public_map.csv';
var dbCSVAirline = '../data/tweets_public_airline.csv';
var dataCSV = new Array();
var dataCSVMap = new Array();
var dataCSVAirline = new Array();

window.sentiment = 'general';
window.date = 'general';

window.colors = {
    negative: '#E4523B',
    positive: '#3DB296',
    neutral: '#E8931E',
    general: '#000000'
};

window.markers = new Array();

Papa.parse(dbCSV, {
    header: true,
    download: true,
    complete: function(results) {
        dataCSV = results.data;
        
        addPieChart(dataCSV);
        addDateChart(dataCSV);
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