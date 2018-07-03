/*Map*/
function makeMap(df){   
    var map = L.map('mapid',{zoomControl:false, scrollWheelZoom: false, dragging: false, doubleClickZoom: false}).setView([0,0], 2);

    var tiles = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	ext: 'png'
    }).addTo(map);
    
    df.forEach(element => {
        var circle = L.circle([element['lat'], element['lon']], {
            stroke: false,
            fillColor: colors[sentiment],
            fillOpacity: 0.3,
            radius: element[sentiment]*10000,
        }).addTo(map);

        circle['country'] = element['country'];
        circle['general'] = element['general'];
        circle['negative'] = element['negative'];
        circle['positive'] = element['positive'];
        circle['neutral'] = element['neutral'];
        circle['date'] = element['date'];

        markers.push(circle);
    })
};


function updateMap(){
    markers.forEach(element => {
        if(date == 'general'){
            element.setStyle({fillColor: colors[sentiment]});
            element.setRadius(element[sentiment]*10000);           
            
        }else{
            if(element.date == date){
                element.setStyle({fillColor: colors[sentiment], fillOpacity: 0.7});
                element.setRadius(element[sentiment]*50000); 
                
            }else{
                element.setStyle({fill: false});
                element.setRadius(0); 
                
            }
        }
    })
};


/*Pie chart*/
function addPieChart(df){ 
    window.pieChart = $("#pieChart")[0];
    
    var dataPie = {
        negative: df.filter(obj => {return obj.airline_sentiment == 'negative'}).length,
        positive: df.filter(obj => {return obj.airline_sentiment == 'positive'}).length,
        neutral: df.filter(obj => {return obj.airline_sentiment == 'neutral'}).length
    };
    

    window.pieData = {
      values: Object.values(dataPie),
      labels: Object.keys(dataPie),
      type: 'pie',
      marker: {
        colors: Object.values(colors),
        line: {color: '#FFFFFF'}
      }
    };

    window.pieLayout = {
        height: 300,
        title: 'Porcentaje de sentimiento de las aerolíneas',
        titlefont: {size: 12},
        xaxis: {showgrid: false, 
                showline: false},
        yaxis: {showgrid: false, 
                showline: false},
        showlegend: false,
        margin: {l: 50, r: 50, b: 50, t: 50},
        autosize: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        hoverinfo: 'text',
        hovermode: 'closest'
    };    

    Plotly.newPlot(pieChart, [pieData], pieLayout, {displayModeBar: false});
    
    pieChart.on('plotly_click', function(data){
        sentiment = data['points']['0']['label'];

        updateDateChart(sentiment);
        updateTimeChart(sentiment);
        updateAirlinesChart(sentiment);
        updateMap(sentiment);
    });
};


/*Line charts by date*/
function addDateChart(df){
    window.dateChart = $("#lineChartDate")[0];
    
    var x = new Array();
    var y = new Array();
    var s = new Array();
    
    df.forEach(element => {
        x.push(new Date(element['tweet_created']));
        y.push(parseInt(element['negative'])+parseInt(element['positive'])+parseInt(element['neutral']));
    });
    
//    console.log(x,y)
    
    window.dateData = {
      type: 'bar',
      x: x,
      y: y,
      marker: {color: '#000000'}
    };
    
    window.dateLayout = {
        height: 300,
        title: 'Tweets según fechas',
        titlefont: {size: 12},
        xaxis: {showgrid: true, 
                gridcolor: '#DCDCDC',
                gridwidth: 0.3,
                showline: true, 
                linewidth: 1,
                linecolor: '#DCDCDC',
                tickangle: 45},
        yaxis: {showgrid: true, 
                gridcolor: '#DCDCDC',
                gridwidth: 0.3,
                showline: true, 
                linewidth: 1,
                linecolor: '#DCDCDC'},
        showlegend: false,
        margin: {l: 50, r: 50, b: 50, t: 50},
        autosize: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        hoverinfo: 'text',
        hovermode: 'closest'
    }; 
    
    Plotly.newPlot(dateChart, [dateData], dateLayout, {displayModeBar: false});
    
    dateChart.on('plotly_click', function(data){
        date = (data['points']['0']['x']).split(' ')[0];
        
//        updateTimeChart();
        updateWordClouds()
        updateMap();
        updateAirlinesChart();
    });
};


function updateDateChart(){
    x = [];
    y = [];
    c = colors[sentiment];    
    
    dataCSVDate.forEach(element => {
        x.push(new Date(element['tweet_created']));
        y.push(parseInt(element[sentiment]));
    });
    
    dateData['marker']['color'] = c;
    dateData['x'] = x;
    dateData['y'] = y;
    
    Plotly.update(dateChart, [dateData], dateLayout);
};


function updateWordClouds(){
    if(sentiment != 'general'){
        var imgSrc = "data/figures/BoWs/BoW_"+date+"_"+sentiment+".jpg"   
        
        Plotly.purge(timeChart);
        $('#lineChartTime').empty();
        $('#lineChartTime').append('<img src="'+imgSrc+'" class="img-fluid mx-auto d-block imgWc">');
    }    
};


function addTimeChart(df){
    window.timeChart = $("#lineChartTime")[0];
    
    var x = new Array();
    var y = new Array();
    
    df.forEach(element => {
        x.push(element['hour']);
        y.push(1);
    });
    
    
    window.timeData = {
      type: 'bar',
      x: x,
      y: y,
      transforms: [{
        type: 'aggregate',
        groups: x,
        aggregations: [{
            target: 'y',
            func: 'sum',
            enabled: true
        }]
      }],
      marker: {color: '#000000'}
    };
    
    window.timeLayout = {
        height: 300,
        title: 'Tweets según las horas del día',
        titlefont: {size: 12},
        xaxis: {showgrid: true, 
                gridcolor: '#DCDCDC',
                gridwidth: 0.3,
                showline: true, 
                linewidth: 1,
                linecolor: '#DCDCDC'},
        yaxis: {showgrid: true, 
                gridcolor: '#DCDCDC',
                gridwidth: 0.3,
                showline: true, 
                linewidth: 1,
                linecolor: '#DCDCDC'},
        showlegend: false,
        margin: {l: 50, r: 50, b: 50, t: 50},
        autosize: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        hoverinfo: 'text',
        hovermode: 'closest'
    }; 
    
    Plotly.newPlot(timeChart, [timeData], timeLayout, {displayModeBar: false});
};


function updateTimeChart(){
    x = [];
    y = [];
    c = colors[sentiment];
    
    if(sentiment != 'general' && date != 'general'){
        var dataFilter = dataCSV.filter(function(el){
            return el['airline_sentiment'] == sentiment && el['date'] == date
        });
        
    }else if(sentiment == 'general' && date != 'general'){
        var dataFilter = dataCSV.filter(function(el){
            return el['date'] == date
        });        
        
    }else if(sentiment != 'general' && date == 'general'){
        var dataFilter = dataCSV.filter(function(el){
            return el['airline_sentiment'] == sentiment
        });        
        
    }else{
        var dataFilter = dataCSV;
    };   
    
    dataFilter.forEach(element => {
        x.push(element['hour']);
        y.push(1);
    });
    
    timeData['marker']['color'] = c;
    timeData['x'] = x;
    timeData['y'] = y;
    
    Plotly.update(timeChart, [timeData], timeLayout);
};


function addAirlinesChart(df){
    window.airlineChart = $("#barChart")[0];
    
    $('#object').width($('#object').parent().width());
    
    var x = new Array();
    var y = new Array();
    
    df.forEach(element => {
        x.push(element['airline']);
        y.push(1);
    });
    
    
    window.airlinedata = {
      type: 'bar',
      x: x,
      y: y,
      transforms: [{
        type: 'aggregate',
        groups: x,
        aggregations: [{
            target: 'y',
            func: 'sum',
            enabled: true
        }]
      }],
      marker: {color: '#000000'}
    };
    
    window.airlineLayout = {
        height: 300,
        title: 'Tweets de las aerolíneas',
        titlefont: {size: 12},
        xaxis: {showgrid: true, 
                gridcolor: '#DCDCDC',
                gridwidth: 0.3,
                showline: true, 
                linewidth: 1,
                linecolor: '#DCDCDC',
                tickangle: 45},
        yaxis: {showgrid: true, 
                gridcolor: '#DCDCDC',
                gridwidth: 0.3,
                showline: true, 
                linewidth: 1,
                linecolor: '#DCDCDC'},
        showlegend: false,
        margin: {l: 50, r: 50, b: 75, t: 50},
        autosize: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        hoverinfo: 'text',
        hovermode: 'closest'
    }; 
    
    Plotly.newPlot(airlineChart, [airlinedata], airlineLayout, {displayModeBar: false});
};


function updateAirlinesChart(){
    x = [];
    y = [];
    c = colors[sentiment];
    
    if(sentiment != 'general' && date != 'general'){
        var dataFilter = dataCSVAirline.filter(function(el){
            return el['sentiment'] == sentiment && el['date'] == date
        });
        
    }else if(sentiment == 'general' && date != 'general'){
        var dataFilter = dataCSVAirline.filter(function(el){
            return el['date'] == date
        });        
        
    }else if(sentiment != 'general' && date == 'general'){
        var dataFilter = dataCSVAirline.filter(function(el){
            return el['sentiment'] == sentiment
        });        
        
    }else{
        var dataFilter = dataCSVAirline;
    };
    
//    var dataFilter = dataCSVAirline.filter(function(el){
//        return el['sentiment'] == sentiment
//    });    
    
    dataFilter.forEach(element => {
        x.push(element['airline']);
        y.push(1);
    });
    
    airlinedata['marker']['color'] = c;
    airlinedata['x'] = x;
    airlinedata['y'] = y;
    
    Plotly.update(airlineChart, [airlinedata], airlineLayout);
};