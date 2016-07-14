var _exportCanvasMap = function(){
    var canvas = document.getElementById('mapCanvas');
    var canvasContext = canvas.getContext('2d');

    canvasContext.scale(1, 1)

    canvas.toBlob(function(blob) {
      saveAs(blob, 'mapImage.png');
    });
}

var _addCanvasElements = function(mapHeight, mapWidth, printedMapImage, mapMultiplyer){

  var mapCanvas = new fabric.Canvas('mapCanvas', {
    height: (mapHeight * mapMultiplyer) + (mapHeight/3),
    width: (mapWidth * mapMultiplyer) + (mapWidth/5),
    background: '#fff'
  });

  var rectWidth = (mapWidth * mapMultiplyer) + (mapWidth/5);
  var rectHeight = (mapHeight * mapMultiplyer) + (mapHeight/3);

  mapCanvas.add(new fabric.Rect({width: (mapWidth * mapMultiplyer) + (mapWidth/5), height: (mapHeight * mapMultiplyer) + (mapHeight/3), left: 0, top: 0, fill: 'white', angle: 0}));

  mapCanvas.add(new fabric.Text('Map TItle', {fontSize: 40, top: 25, left: (rectWidth/2), textAlign: 'center', originX: 'center', fontFamily: 'GillSansRegular'}));

  mapCanvas.add(new fabric.Image(printedMapImage, {left: (mapWidth/10), top: (mapHeight/6)}));

  _exportCanvasMap();

};

var _executePrintTask = function(map){
  var exportServiceUrl = '';
  var printTask = new PrintTask(exportServiceUrl),
      params = new PrintParameters(),
      mapScale = _map.getScale(),
      mapHeight = _map.height,
      mapWidth = _map.width,
      printTemplate = new PrintTemplate(),
      mapMultiplyer = 3;

  params.map = map;

  printTemplate.exportOptions = {
      width: mapWidth * mapMultiplyer,
      height: mapHeight * mapMultiplyer,
      dpi: 96 * mapMultiplyer
  };

  printTemplate.format = 'PNG32';
  printTemplate.layout = 'MAP_ONLY';
  printTemplate.preserveScale = true;
  printTemplate.outScale = mapScale / mapMultiplyer;

  params.template = printTemplate;

  printTask.execute(params, function(response){

    var printedMapImage = new Image(mapWidth * mapMultiplyer, mapHeight * mapMultiplyer);

    printedMapImage.onload = function(){

      _addCanvasElements(mapHeight, mapWidth, printedMapImage, mapMultiplyer);

    };

    printedMapImage.setAttribute('crossOrigin', 'anonymous');
    printedMapImage.src = response.url;

  });
};
