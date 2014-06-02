/**
 * Job: glassfishjob
 *
 * Expected configuration:
 *
 * { }
 */
var request = require( "request" );
var ChefApi = require( "chef-api" );
var util = require( "util" );
var q = require( "q" );
var _ = require( "lodash" );

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

module.exports = function ( config, dependencies, job_callback ) {

  var url = function ( host, port, path ) {
    return "https://" + host + ":" + port + "/management/domain" + path;
  };

  var list = function ( obj ) {
    return _.reduce( obj, function ( result, value, key ) {
      return _.union( result, [
        { name    : key.split( ":" )[0],
          version : key.split( ":" )[1],
          type    : value.split( ", " ) }
      ] );
    }, [] );
  };

  var chef = new ChefApi();

  chef.config( config.auth );

  var apps = function ( host, port, user, pass ) {
    var deferred = q.defer();
    var options = {
      url     : url( host, port, "/applications/list-applications" ),
      auth    : {
        user : user,
        pass : pass
      },
      headers : {
        'Accept'     : 'application/json',
        'User-Agent' : 'request'
      },
      timeout : 5000,
      json    : true
    };

    request.get( options, function ( err, res, body ) {
      if ( !err && res.statusCode == 200 ) {
        deferred.resolve( list( body.properties ) );
      }
      else {
        deferred.reject( err );
      }
    } );

    return deferred.promise;
  };

  var node = function ( name ) {
    var deferred = q.defer();
    if ( name ) {
      chef.getNode( name, function ( err, res ) {
        if ( err ) {
          deferred.reject( err );
        }
        else {
          if ( res ) {
            if ( res && res.override && res.override.glassfish ) {
              q.allSettled( _.map( _.keys( res.override.glassfish.domains ), function ( key ) {
                var conf = res.override.glassfish.domains[key].config;
                return apps( name, conf.admin_port, conf.username, conf.password );
              } ) ).then( function ( results ) {
                deferred.resolve( {
                  name     : res.automatic.hostname,
                  env      : res.chef_environment,
                  children : _.flatten( _.map( results, function ( result ) {
                    return result.value
                  } ) ) } );
              } );
            }
            else {
              deferred.resolve( {
                name     : res.automatic.hostname,
                env      : res.chef_environment,
                children : [] } );
            }
          }
          else {
            deferred.resolve( {
              name     : name,
              env      : "unknown",
              children : [] } );
          }
        }
      } );
    }
    else {
      chef.getNodes( function ( err, res ) {
        if ( err ) {
          deferred.reject( err );
        }
        else {
          q.allSettled( _.map( _.keys( res ), function ( item ) {
            return node( item );
          } ) ).done(
            function ( fullfilled ) {
              var value = _.flatten( _.map( fullfilled, function ( result ) {
                return result.value
              } ) );
              deferred.resolve( value );
            },
            function ( rejected ) {
            },
            function ( progress ) {
            }
          );
        }
      } );
    }

    return deferred.promise;
  };

  var children = function ( obj ) {
    return _.reduce( obj, function ( result, value, key ) {
      return _.union( result, [
        { name     : key,
          children : value }
      ] );
    }, [] );
  };

  node().done(
    function ( fullfilled ) {
      job_callback( null, {
        title : config.title,
        tree  : {
          name     : 'fisg',
          children : children( _.groupBy( fullfilled, function ( item ) {
            return item.env;
          } ) )
        }
      } );
    },
    function ( rejected ) {
    },
    function ( progress ) {
    }
  );
};
