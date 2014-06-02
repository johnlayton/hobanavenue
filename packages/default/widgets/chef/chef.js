widget = {
  onData : function ( el, data ) {
    $( '.content', el ).empty();

    if ( data.title ) {
      $( 'h2', el ).text( data.title );
    }

    if ( !data.data || !data.envs || !data.envs.length ) {
      $( '.content', el ).append( $( "<div>" ).html( "No applications found." ) );
    }
    else {
      this.log( data.apps.length + ' applications found!' );

      var table = $( "<table/>" ).appendTo( $( '.content', el ) );

      // Add Table Head
      var thead = $( "<thead/>" ).appendTo( table );
      var tr = $( "<tr/>" ).appendTo( thead ).append( $( "<td/>" ) );
      data.envs.forEach( function ( env ) {
        tr.append( $( "<td/>" ).append( env ) );
      } );

      // Add Table Body
      var tbody = $( "<tbody/>" ).appendTo( table );
      data.apps.forEach( function ( app ) {

        var row = $( "<tr/>" ).appendTo( table );

        $( row ).append( $( "<td>" ).append( app ) );

        data.envs.forEach( function ( env ) {
          var e = data.data[env];
          var a = e[app];
          $( row ).append( $( "<td>" ).append( ( ( a && e ) ? a['config']['version'] : 'unk' ) ) );
        } );


      } );

    }


  }
};