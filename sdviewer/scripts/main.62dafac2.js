function scaleDrawing(){var a=$("#model1").find("#viewport")[0];if(a){var b=a.getBBox(),c=($(".jumbotron").width()/b.width*100|0)/100;drawing.transform(c,-b.x*c,-b.y*c),$("#model1").attr("height",(b.height*c|0)+20)}}function getQueryParams(a){a=a.split("+").join(" ");for(var b,c={},d=/[?&]?([^=]+)=([^&]*)/g;b=d.exec(a);)c[decodeURIComponent(b[1])]=decodeURIComponent(b[2]);return c}var drawing,sim;$(window).resize(scaleDrawing),$(function(){var a=getQueryParams(document.location.search),b="population.xmile";"model"in a&&(b=a.model),$("#main-header").text(b),sd.load(b,function(a){drawing=a.drawing("#model1",!0),scaleDrawing(),sim=a.sim(),sim.setDesiredSeries(Object.keys(drawing.named_ents)),sim.runToEnd().then(function(a){drawing.visualize(a)})})});