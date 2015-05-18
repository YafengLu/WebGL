function drawCityArcs(data){
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
	  
	  var cities = data.topCities;
	  var arcdata = data.cityLinks;
	   
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
	
		 
}