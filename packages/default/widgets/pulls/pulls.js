widget = {

  onData : function ( el, data ) {
    $( '.content', el ).empty();

    if ( data.title ) {
      $( 'h2', el ).text( data.title );
    }

    if ( !data.pulls || !data.pulls.length ) {
      $( '.content', el ).append( $( "<div>" ).html( "No pulls found." ) );
    }
    else {

      this.log( data.pulls.length + ' pulls found!' );

      data.pulls.forEach( function ( pull ) {
        var eventDiv = $( "<div/>" ).addClass( 'leave-event' );
        //$( eventDiv ).append( $( "<div/>" ).addClass( 'leave-dates' ).append( event.startDate +
        //                                                                      " - " +
        //                                                                      event.endDate ) );
        var link = $( "<a/>" ).attr("href", pull.html_url ).append( pull.title );
        $( eventDiv ).append( $( "<div/>" ).addClass( 'leave-summary' ).append( link ) );

        $( '.content', el ).append( eventDiv );
      } );
    }
  }
};

