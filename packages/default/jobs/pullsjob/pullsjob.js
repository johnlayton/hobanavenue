/**
 * Job: pullsjob
 *
 * Expected configuration:
 *
 * { }
 */
var GitHub = require( "github" );
var util = require( "util" );
var q = require( "q" );
var _ = require( "lodash" );

module.exports = function ( config, dependencies, job_callback ) {

  var github = new GitHub( config.github );
  github.authenticate( config.auth );

  var pulls = function ( org, repo ) {
    var deferred = q.defer();
    if ( repo ) {
      github.getPullrequestsApi().getAll( {
        user     : org,
        repo     : repo,
        per_page : 100
      }, function ( err, res ) {
        if ( err ) {
          deferred.reject( err );
        }
        else {
          deferred.resolve( _.map( res, function ( pull ) {
            return pull;
          } ) );
        }
      } );
    }
    else {
      github.getReposApi().getFromOrg( {
        org      : org,
        per_page : 100
      }, function ( err, repos ) {
        if ( err ) {
          deferred.reject( err );
        }
        else {
          q.allSettled( _.map( repos, function ( repo ) {
            return pulls( org, repo.name );
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

  pulls( config.org ).then( function ( pulls ) {
    job_callback( null, {title : config.title + " (" + pulls.length + ")", pulls : pulls } );
  } );

};
