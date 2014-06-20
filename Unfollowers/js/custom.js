	var FollowersSucess = false;
	var FolloweesSuccess = false;

	var peopleIFollowArray = [];
	var peopleWhoFollowMeArray = [];

	var number_async_calls = 0;

$(document).ready(function($) {
	$('#tableviewcontainer').hide();
	Followers();
});

//make sure to call this function with the access token attached the url.
function Followers(url){
	number_async_calls++;

	$.ajax({
			url: url,
			type: 'GET',
			dataType: 'jsonp'
		})
		.done(function(data) {
			FollowersSucess = true; //inc
			console.log(data);
			peopleIFollowArray = peopleIFollowArray.concat(data.data);

			//recursive call to get ALL the hits since IG randomly limits the amount of results available.
			if(data.pagination.next_url)
				Followers(data.pagination.next_url)
			else
				ReceivedAJAXResponse();
		})
		.fail(function() {
			console.log("error");
		});
}


	function Followers(){
		var ACCESS_TOKEN = GetToken();

		$.ajax({
			url: 'https://api.instagram.com/v1/users/self/follows?access_token=' + ACCESS_TOKEN,
			type: 'GET',
			dataType: 'jsonp'
		})
		.done(function(data) {
			console.log(data);
			if(data.meta.code != 400)
			{
				FollowersSucess = true;
				peopleIFollowArray = data;
				ReceivedAJAXResponse();
			}
		})
		.fail(function() {
			console.log("error");
		});

		$.ajax({				 
			url: 'https://api.instagram.com/v1/users/self/followed-by?access_token=' + ACCESS_TOKEN,
			type: 'GET',
			dataType: 'jsonp'
		})
		.done(function(data) {
			console.log(data);
			if(data.meta.code != 400)
			{
				FolloweesSuccess = true;
				peopleWhoFollowMeArray = data;
				ReceivedAJAXResponse();
			}
		})
		.fail(function() {
			console.log("error");
		});
		
	}



	function GetToken() {
		return window.location.hash.substring(window.location.hash.indexOf("=")+1);
	}

	function ReceivedAJAXResponse(){
		if(FolloweesSuccess & FolloweesSuccess)
	  	{
	  		$('#tableviewcontainer').show();
 			$('#nousersfound').hide();

 			mixpanel.track("Unfollowers Calculated and Viewed");

	  		FolloweesSuccess = false;
	  		FollowersSucess = false;

	  		console.log("Both Ajax Calls completed successfully!");
			var c = []; //will store the people who are only followed by me.
			var d = []; //will store followers who are followed by me.

				for(var i = 0; i< peopleIFollowArray.data.length; i++)
				{
					for(var j = 0; j<peopleWhoFollowMeArray.data.length; j++)
					{
						if(peopleIFollowArray.data[i].id == peopleWhoFollowMeArray.data[j].id)
						{
							d[d.length] = peopleIFollowArray.data[i];
							break;
						}
						else if(j==peopleWhoFollowMeArray.data.length-1)
						{
							c[c.length] = peopleIFollowArray.data[i];
						}
					}
				}

				$.each(c, function(k, v){
					$('#tableview').append( "<tr><td class='tblcell'>" + v.username + "</td> <td class='tblcell'>"+ v.full_name+"</td></tr>");
				});

			console.log(c);
			console.log(d);
		}
	    else
	    {
	    	console.log("Haven't received full data set yet");
	    }
	}

	function SortByID(a, b){
		  return ((a.id < b.id) ? -1 : ((a.id > b.id) ? 1 : 0));
	}