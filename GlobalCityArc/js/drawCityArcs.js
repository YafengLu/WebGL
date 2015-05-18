function drawCityArcs(){
	  canvas.style("background-color", "#333333");

      var controls = new THREE.TrackballControls(camera, canvas.node());
      controls.rotateSpeed = 0.2;
      controls.zoomSpeed = 0.3;
      controls.noPan = true;
      controls.minDistance = 100;
      controls.maxDistance = 6000;

      var world = THREE.ImageUtils.loadTexture('demos/images/world.jpg', null, function () {
        canvas.transition().duration(3000)
          .style("opacity", 1)

        d3.select("#loading").transition().duration(3000)
          .style("opacity", 0).remove();
      });

      var textMaterial = new THREE.MeshFaceMaterial([ 
        new THREE.MeshPhongMaterial({color: '#ffffff', shading: THREE.FlatShading}),
        new THREE.MeshPhongMaterial({color: '#555555', shading: THREE.SmoothShading})
      ]);

      var textOptions = {
        size: 10,
        height: 20,
        curveSegments: 50,
        font: 'kai',
        weight: 'regular',
        style: 'regular',
        extrudeMaterial: 1
      };

      var circleGeometry = new THREE.CircleGeometry(3, 30); 
      var circleMaterial = new THREE.MeshPhongMaterial({color: '#4ECDC4'});

      var colors = d3.scale.ordinal()
        .range(['#594F4F','#547980','#45ADA8','#9DE0AD','#E5FCC2','#ECD078']);

      var getColor = lineCache(colors);

      var highlight = new THREE.LineBasicMaterial({
        color: '#EEEE00', linewidth: 3
      });

      var earth  = new THREE.MeshPhongMaterial({map: world, shininess: 5});
      var sphere = new THREE.SphereGeometry(200, 40, 40); 
	  
	  
	   d3.json('demos/data/top-cities.json', function (err, cities) {
	  //d3.json('data/cityLinks.json', function (err, data) {
        // GENERATE SOME MOCK DATA
        
		//var data = [];
		var arcdata = [{"source":{"name":"Tokyo","pop":37883000,"lat":35.689722,"lng":139.691667},"target":{"name":"Los Angeles","pop":13131431,"lat":34.05,"lng":-118.25}},{"source":{"name":"Tokyo","pop":37883000,"lat":35.689722,"lng":139.691667},"target":{"name":"Shanghai","pop":24750000,"lat":31.2,"lng":121.5}},{"source":{"name":"Tokyo","pop":37883000,"lat":35.689722,"lng":139.691667},"target":{"name":"Delhi","pop":21753486,"lat":28.61,"lng":77.23}},{"source":{"name":"Tokyo","pop":37883000,"lat":35.689722,"lng":139.691667},"target":{"name":"Sao Paulo","pop":20935204,"lat":-23.533,"lng":-46.617}},{"source":{"name":"Tokyo","pop":37883000,"lat":35.689722,"lng":139.691667},"target":{"name":"Istanbul","pop":14160467,"lat":41.1575,"lng":28.868333}},{"source":{"name":"Tokyo","pop":37883000,"lat":35.689722,"lng":139.691667},"target":{"name":"Cape Town","pop":3740026,"lat":-33.925278,"lng":18.423889}},{"source":{"name":"Seoul","pop":25258000,"lat":37.566667,"lng":126.978056},"target":{"name":"Los Angeles","pop":13131431,"lat":34.05,"lng":-118.25}},{"source":{"name":"Seoul","pop":25258000,"lat":37.566667,"lng":126.978056},"target":{"name":"Shanghai","pop":24750000,"lat":31.2,"lng":121.5}},{"source":{"name":"Seoul","pop":25258000,"lat":37.566667,"lng":126.978056},"target":{"name":"Delhi","pop":21753486,"lat":28.61,"lng":77.23}},{"source":{"name":"Seoul","pop":25258000,"lat":37.566667,"lng":126.978056},"target":{"name":"Sao Paulo","pop":20935204,"lat":-23.533,"lng":-46.617}},{"source":{"name":"Seoul","pop":25258000,"lat":37.566667,"lng":126.978056},"target":{"name":"Istanbul","pop":14160467,"lat":41.1575,"lng":28.868333}},{"source":{"name":"Seoul","pop":25258000,"lat":37.566667,"lng":126.978056},"target":{"name":"Cape Town","pop":3740026,"lat":-33.925278,"lng":18.423889}},{"source":{"name":"Mexico City","pop":21178959,"lat":19.433333,"lng":-99.133333},"target":{"name":"Los Angeles","pop":13131431,"lat":34.05,"lng":-118.25}},{"source":{"name":"Mexico City","pop":21178959,"lat":19.433333,"lng":-99.133333},"target":{"name":"Shanghai","pop":24750000,"lat":31.2,"lng":121.5}},{"source":{"name":"Mexico City","pop":21178959,"lat":19.433333,"lng":-99.133333},"target":{"name":"Delhi","pop":21753486,"lat":28.61,"lng":77.23}},{"source":{"name":"Mexico City","pop":21178959,"lat":19.433333,"lng":-99.133333},"target":{"name":"Sao Paulo","pop":20935204,"lat":-23.533,"lng":-46.617}},{"source":{"name":"Mexico City","pop":21178959,"lat":19.433333,"lng":-99.133333},"target":{"name":"Istanbul","pop":14160467,"lat":41.1575,"lng":28.868333}},{"source":{"name":"Mexico City","pop":21178959,"lat":19.433333,"lng":-99.133333},"target":{"name":"Cape Town","pop":3740026,"lat":-33.925278,"lng":18.423889}},{"source":{"name":"Beijing","pop":21148000,"lat":39.913889,"lng":116.391667},"target":{"name":"Los Angeles","pop":13131431,"lat":34.05,"lng":-118.25}},{"source":{"name":"Beijing","pop":21148000,"lat":39.913889,"lng":116.391667},"target":{"name":"Shanghai","pop":24750000,"lat":31.2,"lng":121.5}},{"source":{"name":"Beijing","pop":21148000,"lat":39.913889,"lng":116.391667},"target":{"name":"Delhi","pop":21753486,"lat":28.61,"lng":77.23}},{"source":{"name":"Beijing","pop":21148000,"lat":39.913889,"lng":116.391667},"target":{"name":"Sao Paulo","pop":20935204,"lat":-23.533,"lng":-46.617}},{"source":{"name":"Beijing","pop":21148000,"lat":39.913889,"lng":116.391667},"target":{"name":"Istanbul","pop":14160467,"lat":41.1575,"lng":28.868333}},{"source":{"name":"Beijing","pop":21148000,"lat":39.913889,"lng":116.391667},"target":{"name":"Cape Town","pop":3740026,"lat":-33.925278,"lng":18.423889}},{"source":{"name":"Jakarata","pop":20000000,"lat":-6.175,"lng":106.828611},"target":{"name":"Los Angeles","pop":13131431,"lat":34.05,"lng":-118.25}},{"source":{"name":"Jakarata","pop":20000000,"lat":-6.175,"lng":106.828611},"target":{"name":"Shanghai","pop":24750000,"lat":31.2,"lng":121.5}},{"source":{"name":"Jakarata","pop":20000000,"lat":-6.175,"lng":106.828611},"target":{"name":"Delhi","pop":21753486,"lat":28.61,"lng":77.23}},{"source":{"name":"Jakarata","pop":20000000,"lat":-6.175,"lng":106.828611},"target":{"name":"Sao Paulo","pop":20935204,"lat":-23.533,"lng":-46.617}},{"source":{"name":"Jakarata","pop":20000000,"lat":-6.175,"lng":106.828611},"target":{"name":"Istanbul","pop":14160467,"lat":41.1575,"lng":28.868333}},{"source":{"name":"Jakarata","pop":20000000,"lat":-6.175,"lng":106.828611},"target":{"name":"Cape Town","pop":3740026,"lat":-33.925278,"lng":18.423889}},{"source":{"name":"New York","pop":19949502,"lat":40.808611,"lng":-74.020386},"target":{"name":"Los Angeles","pop":13131431,"lat":34.05,"lng":-118.25}},{"source":{"name":"New York","pop":19949502,"lat":40.808611,"lng":-74.020386},"target":{"name":"Shanghai","pop":24750000,"lat":31.2,"lng":121.5}},{"source":{"name":"New York","pop":19949502,"lat":40.808611,"lng":-74.020386},"target":{"name":"Delhi","pop":21753486,"lat":28.61,"lng":77.23}},{"source":{"name":"New York","pop":19949502,"lat":40.808611,"lng":-74.020386},"target":{"name":"Sao Paulo","pop":20935204,"lat":-23.533,"lng":-46.617}},{"source":{"name":"New York","pop":19949502,"lat":40.808611,"lng":-74.020386},"target":{"name":"Istanbul","pop":14160467,"lat":41.1575,"lng":28.868333}},{"source":{"name":"New York","pop":19949502,"lat":40.808611,"lng":-74.020386},"target":{"name":"Cape Town","pop":3740026,"lat":-33.925278,"lng":18.423889}}];	
		/*	
        for (var i = 0; i < cities.length; i+=2) {
          for (var j = 1; j < cities.length; j+=2) {
            if (i !== j) {
              data.push({
                source: cities[i],
                target: cities[j]
              });
            }
          }
        }*/
		//console.log(data);
        // SELECT INTO THE SCENE
        var root = SubUnit.select(scene);

        var globe = root.append("mesh")
          .attr("material", earth)
          .attr("geometry", sphere);

        globe.node().rotation.y = Math.PI;

        // ADD ARCS
        var arcs = root.selectAll(".line")
          .data(arcdata).enter()
          .append("line")
          .attr("tags", "line")
          .attr("geometry", function (d) {
            var s = getCoords(d.source.lat, d.source.lng, true);
            var t = getCoords(d.target.lat, d.target.lng, true);
            return arc(s, t, 10);
          })
          .attr("material", function (d) {
            return getColor(d.source.name, 1.5);
          })
          .on("click", function (event, d) {
            d3.select("#msg").html(function () {
              return d.source.name + " to " + d.target.name;
            });

            arcs.attr("material", function (d) {
              return getColor(d.source.name, 1.5);
            });

            this.material = highlight;
          });

        // ADD CITY CIRCLES AND LABELS
        var cities = root.selectAll(".node")
          .data(cities).enter()
          .append("object")
          .attr("tags", "node")
          .each(function (d) {
            this.position.copy(getCoords(d.lat, d.lng));
            this.lookAt(root.node().position);
          });

        var circles = cities.append("mesh")
          .attr("material", circleMaterial)
          .attr("geometry", circleGeometry)
          .each(function (d) {
            this.rotation.y = Math.PI;
          });

        var labels = cities.append("mesh")
          .attr("material", textMaterial)
          .attr("geometry", function (d) {
            var text = new THREE.TextGeometry(d.name, textOptions);
            text.computeBoundingBox();
            text.computeVertexNormals();
            return text;
          })
          .each(function (d) {
            var min = this.geometry.boundingBox.min.x;
            var max = this.geometry.boundingBox.max.x;
            this.rotation.y = Math.PI
            this.scale.z = 0.05;
            this.position.set(max - min, 0, -5);
          });

        root.node().rotation.y = Math.PI;
        root.node().rotation.x = Math.PI / 6;
        root.node().scale.set(2.75, 2.75, 2.75);

        raycast(camera, arcs[0], 'click');

        function animate() {
          requestAnimationFrame(animate);
          render();
        }

        function render() {
          stats.update();
          controls.update();

          renderer.render(scene, camera);
        }
        animate();
		
      });
		 
}