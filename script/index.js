$(window).resize(resizeMap);


function resizeMap(){
    $('.mapBox').width($(window).width());
};


$(document).ready(function(){
    $(window).trigger('resize');
    
    $('.btn').click(function(){
        sentiment = $(this).attr('id');
        
        updateMap(sentiment);
        
        if(sentiment != 'general'){
            updateDateChart(sentiment);
            updateTimeChart(sentiment);
            updateAirlinesChart(sentiment);   
        }else{
            addDateChart(dataCSV);
            addTimeChart(dataCSV);
            addAirlinesChart(dataCSVAirline);  
        };
    });
}); 