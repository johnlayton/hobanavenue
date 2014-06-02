/**
 * Job: chefjob
 *
 * Expected configuration:
 *
 * { }
 */

var ChefApi = require( "chef-api" );
var util = require( "util" );
var q = require( "q" );
var _ = require( "lodash" );

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

module.exports = function ( config, dependencies, job_callback ) {
  var text = "Hello World!";

  var chef = new ChefApi();

  chef.config( config.auth );

  var databag = function ( bag, item ) {
    var deferred = q.defer();
    if ( item ) {
      chef.getDataBagItem( bag, item, function ( err, data ) {
        if ( err ) {
          deferred.reject( err );
        }
        else {
          deferred.resolve( data );
        }
      } );
    }
    else {
      chef.getDataBag( bag, function ( err, res ) {
        if ( err ) {
          deferred.reject( err );
        }
        else {
          q.allSettled( _.map( _.keys( res ), function ( item ) {
            return databag( bag, item );
          } ) ).then( function ( results ) {
            deferred.resolve( _.flatten( _.map( results, function ( result ) {
              return result.value
            } ) ) );
          } );
        }
      } );
    }

    return deferred.promise;
  };

  databag( config.bag ).then( function ( applications ) {
    var sufx = ["version"];
    var envs = ["production", "uat", "development", "training", "chef_dev"];
    var apps = _.unique( _.map( applications, function ( app ) {
      return _.reduce( _.union( envs, sufx ), function ( name, extr ) {
        return name.replace( ( "_" + extr ), '' )
      }, app.id );
    } ) );
    var data = _.inject( envs, function ( ctx, env ) {
      ctx[env] = _.inject( apps, function ( cxt, app ) {
        var version = _.find( applications, function ( appl ) {
          return appl.id == ( app + "_" + env + "_version" );
        } );
        if ( version ) {
          cxt[app] = version;
        }
        return cxt;
      }, {} );
      return ctx;
    }, {} );
    job_callback( null, {title : config.title, data : data, envs : envs, apps : apps } );
  } );
};
