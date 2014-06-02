widget = {

  onData : function ( el, data ) {
    //$( '.content', el ).empty();

    //if ( data.title ) {
    //  $( 'h2', el ).text( data.title );
    //}

    if ( !data.tree ) {
      $( '.content', el ).append( $( "<div>" ).html( "No instances found." ) );
    }
    else {

      var margin = {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20
        },
        width = $( ".content", el ).parentsUntil( "li" ).parent().width() - margin.right - margin.left,
        height = $( ".content", el ).parentsUntil( "li" ).parent().height() - margin.top - margin.bottom;


      console.log( $( ".content" ).parentsUntil( "li" ).parent().width() );
      console.log( $( ".content" ).parentsUntil( "li" ).parent().height() );

      var i = 0,
        duration = 750,
        rectW = 60,
        rectH = 30;

      var tree = d3.layout.tree().nodeSize([70, 40]);
      var diagonal = d3.svg.diagonal()
        .projection(function (d) {
          return [d.x + rectW / 2, d.y + rectH / 2];
        });

      console.log( el );

      var svg = d3.select( ".deployment-diagram" )
        .attr( "width", width + margin.right + margin.left )
        .attr( "height", height + margin.top + margin.bottom )
        .call(zm = d3.behavior.zoom().scaleExtent([1,3]).on("zoom", redraw))
        .append( "g" )
        .attr( "transform", "translate(" + margin.left + "," + margin.top + ")" );

      //var svg = d3.select("#body").append("svg").attr("width", 1000).attr("height", 1000)
      //  .call(zm = d3.behavior.zoom().scaleExtent([1,3]).on("zoom", redraw)).append("g")
      //  .attr("transform", "translate(" + 350 + "," + 20 + ")");

      //necessary so that zoom knows where to zoom and unzoom from
      zm.translate([350, 20]);

      root = data.tree

      root.x0 = 0;
      root.y0 = height / 2;

      function collapse(d) {
        if ( d && d.children) {
          d._children = d.children;
          d._children.forEach(collapse);
          d.children = null;
        }
      }

      root.children.forEach(collapse);

      update(root);

      //d3.select("#body").style("height", "800px");

      function update(source) {

        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
          links = tree.links(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function (d) {
          d.y = d.depth * 100;
        });

        // Update the nodes…
        var node = svg.selectAll("g.node")
          .data(nodes, function (d) {
            return d.id || (d.id = ++i);
          });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
          .attr("class", "node")
          .attr("transform", function (d) {
            return "translate(" + source.x0 + "," + source.y0 + ")";
          })
          .on("click", click);

        nodeEnter.append("rect")
          .attr("width", rectW)
          .attr("height", rectH)
          .attr("stroke", "black")
          .attr("stroke-width", 1)
          .style("fill", function (d) {
            return d._children ? "lightsteelblue" : "#fff";
          });

        nodeEnter.append("text")
          .attr("x", rectW / 2)
          .attr("y", rectH / 2)
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .text(function (d) {
            return d.name;
          });

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
          .duration(duration)
          .attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
          });

        nodeUpdate.select("rect")
          .attr("width", rectW)
          .attr("height", rectH)
          .attr("stroke", "black")
          .attr("stroke-width", 1)
          .style("fill", function (d) {
            return d._children ? "lightsteelblue" : "#fff";
          });

        nodeUpdate.select("text")
          .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
          .duration(duration)
          .attr("transform", function (d) {
            return "translate(" + source.x + "," + source.y + ")";
          })
          .remove();

        nodeExit.select("rect")
          .attr("width", rectW)
          .attr("height", rectH)
          //.attr("width", bbox.getBBox().width)""
          //.attr("height", bbox.getBBox().height)
          .attr("stroke", "black")
          .attr("stroke-width", 1);

        nodeExit.select("text");

        // Update the links…
        var link = svg.selectAll("path.link")
          .data(links, function (d) {
            return d.target.id;
          });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
          .attr("class", "link")
          .attr("x", rectW / 2)
          .attr("y", rectH / 2)
          .attr("d", function (d) {
            var o = {
              x: source.x0,
              y: source.y0
            };
            return diagonal({
              source: o,
              target: o
            });
          });

        // Transition links to their new position.
        link.transition()
          .duration(duration)
          .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
          .duration(duration)
          .attr("d", function (d) {
            var o = {
              x: source.x,
              y: source.y
            };
            return diagonal({
              source: o,
              target: o
            });
          })
          .remove();

        // Stash the old positions for transition.
        nodes.forEach(function (d) {
          d.x0 = d.x;
          d.y0 = d.y;
        });
      }

      // Toggle children on click.
      function click(d) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update(d);
      }

      //Redraw for zoom
      function redraw() {
        //console.log("here", d3.event.translate, d3.event.scale);
        svg.attr( "transform",
            "translate(" + d3.event.translate + ")"
            + " scale(" + d3.event.scale + ")" );
      }
/*
      var i = 0,
        duration = 750,
        root;

      var diagonal = d3.svg.diagonal()
        .projection( function ( d ) {
          return [d.y, d.x];
        } );

      var svg = d3.select( ".content" ).append( "svg" )
        .attr( "width", width + margin.right + margin.left )
        .attr( "height", height + margin.top + margin.bottom )
        .append( "g" )
        .attr( "transform", "translate(" + margin.left + "," + margin.top + ")" );

      var tree = d3.layout.tree()
        .size( [  width, height ] );

      function update( source ) {

        // Compute the new tree layout.
        var nodes = tree.nodes( root ).reverse(),
          links = tree.links( nodes );

        // Normalize for fixed-depth.
        nodes.forEach( function ( d ) {
          d.y = d.depth * 40;
        } );

        // Update the nodes…
        var node = svg.selectAll( "g.node" )
          .data( nodes, function ( d ) {
            return d.id || (d.id = ++i);
          } );

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append( "g" )
          .attr( "class", "node" )
          .attr( "transform", function ( d ) {
            return "translate(" + source.x0 + "," + source.y0 + ")";
          } )
          .on( "click", click );

        nodeEnter.append( "circle" )
          .attr( "r", 1e-6 )
          .style( "fill", function ( d ) {
            return d._children ? "lightsteelblue" : "#fff";
          } );

        nodeEnter.append( "text" )
          .attr( "x", function ( d ) {
            return d.children || d._children ? -10 : 10;
          } )
          .attr( "dy", ".35em" )
          .attr( "text-anchor", function ( d ) {
            return d.children || d._children ? "end" : "start";
          } )
          .text( function ( d ) {
            return d.name;
          } )
          .style( "fill-opacity", 1e-6 );

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
          .duration( duration )
          .attr( "transform", function ( d ) {
            return "translate(" + d.y + "," + d.x + ")";
          } );

        nodeUpdate.select( "circle" )
          .attr( "r", 4.5 )
          .style( "fill", function ( d ) {
            return d._children ? "lightsteelblue" : "#fff";
          } );

        nodeUpdate.select( "text" )
          .style( "fill-opacity", 1 );

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
          .duration( duration )
          .attr( "transform", function ( d ) {
            return "translate(" + source.y + "," + source.x + ")";
          } )
          .remove();

        nodeExit.select( "circle" )
          .attr( "r", 1e-6 );

        nodeExit.select( "text" )
          .style( "fill-opacity", 1e-6 );

        // Update the links…
        var link = svg.selectAll( "path.link" )
          .data( links, function ( d ) {
            return d.target.id;
          } );

        // Enter any new links at the parent's previous position.
        link.enter().insert( "path", "g" )
          .attr( "class", "link" )
          .attr( "d", function ( d ) {
            var o = {
              x : source.x0,
              y : source.y0
            };
            return diagonal( {
              source : o,
              target : o
            } );
          } );

        // Transition links to their new position.
        link.transition()
          .duration( duration )
          .attr( "d", diagonal );

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
          .duration( duration )
          .attr( "d", function ( d ) {
            var o = {x : source.x, y : source.y};
            return diagonal( {
              source : o, target : o
            } );
          } )
          .remove();

        // Stash the old positions for transition.
        nodes.forEach( function ( d ) {
          d.x0 = d.x;
          d.y0 = d.y;
        } );
      }

      // Toggle children on click.
      function click( d ) {
        if ( d.children ) {
          d._children = d.children;
          d.children = null;
        }
        else {
          d.children = d._children;
          d._children = null;
        }
        update( d );
      }

      root = data.tree;
      root.x0 = height / 2;
      root.y0 = 0;

      function collapse(d) {
        if (d && d.children) {
          d._children = d.children;
          d._children.forEach(collapse);
          d.children = null;
        }
      }

      root.children.forEach(collapse);

      update(root);
      //});
*/

      //this.log( data.instances.length + ' instances found!' );

      //console.log( data.instances );
      //
      //var envs = $( "<ol/>" ).appendTo(  $( "<div>" ).appendTo( $( '.content', el ) ) );
      //for ( env in data.instances ) {
      //  var srvs = $( "<ol/>" ).appendTo(  $( "<li/>" ).append( env ).appendTo( envs ) );
      //  for ( srv in data.instances[env] ) {
      //    var apps = $( "<ol/>" ).appendTo(  $( "<li/>" ).append( data.instances[env][srv].name ).appendTo( srvs ) );
      //    for ( app in data.instances[env][srv].apps ) {
      //      console.log( data.instances[env][srv].apps[app] )
      //      $( apps ).append( $( "<li/>" ).append( data.instances[env][srv].apps[app].name + " -> " + data.instances[env][srv].apps[app].version ) );
      //    }
      //  }
      //}

      //data.instances.forEach( function ( instance ) {
      //  var eventDiv = $( "<div/>" ).addClass( 'leave-event' );
      //  //$( eventDiv ).append( $( "<div/>" ).addClass( 'leave-dates' ).append( event.startDate +
      //  //                                                                      " - " +
      //  //                                                                      event.endDate ) );
      //  //var link = $( "<a/>" ).attr("href", pull.html_url ).append( pull.title );
      //  $( eventDiv ).append( $( "<div/>" ).addClass( 'leave-summary' ).append( instance ) );
      //
      //  $( '.content', el ).append( eventDiv );
      //} );

    }
  }
};