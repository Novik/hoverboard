'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.updateParticipantsCount = functions.database.ref('/activities/{activityId}/participants/{participantId}').onWrite(event => 
{
	if(event.data.exists())
	{
		return( 
			admin.database().ref('/activities/'+event.params.activityId+'/participants').once("value").then( function(snap) 
	  		{
	  			let count = 0;
				snap.forEach(function(child) 
				{
	  				if( child.val().signed )
	  		  		{
	  		  			count++;
		  		  	}
		  		});
	  			return( admin.database().ref('/activities/'+event.params.activityId+'/data').update(
	  			{
	  				participants: count
				}).then( function() 
				{
					return( admin.database().ref('/public_activities/'+event.params.activityId+'/data').once("value") );
				}).then( function(snap)
				{
					if( snap.exists() )
					{
						return(  snap.ref.update(
	  					{
			  				participants: count
						}));
					}
				}));
			}));
	}
});