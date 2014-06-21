	var follows_sucess = false;
	var followedby_success = false;

	var follows_array = [];
	var followedby_array = [];

	var number_async_calls_follows = 0;
	var number_async_calls_followedby = 0;

	var ACCESS_TOKEN;;

$(document).ready(function($) {
	$('#tableviewcontainer').hide();
	ACCESS_TOKEN = GetToken();
	follows_recursive('https://api.instagram.com/v1/users/self/follows?access_token=' + ACCESS_TOKEN);
	followedby_recursive('https://api.instagram.com/v1/users/self/followed-by?access_token=' + ACCESS_TOKEN);
});

//make sure to call this function with the access token attached the url.
function follows_recursive(url){
	number_async_calls_follows++;

	$.ajax({
			url: url,
			type: 'GET',
			dataType: 'jsonp'
		})
		.done(function(data) {
			console.log(data);
			follows_array = follows_array.concat(data.data);

			//recursive call to get ALL the hits since IG randomly limits the amount of results available.
			if(data.pagination.next_url)
			{
				console.log('url_available');
				follows_recursive(data.pagination.next_url)
			}
			else
			{
				console.log('no_url_available');
				follows_sucess = true; //inc
				received_ajax_response();
			}
		})
		.fail(function() {
			console.log("error");
		});
}

function followedby_recursive(url){
	number_async_calls_followedby++;

	$.ajax({
			url: url,
			type: 'GET',
			dataType: 'jsonp'
		})
		.done(function(data) {
			console.log(data);
			followedby_array = followedby_array.concat(data.data);

			//recursive call to get ALL the hits since IG randomly limits the amount of results available.
			if(data.pagination.next_url)
			{
				console.log('url_available');
				followedby_recursive(data.pagination.next_url)
			}
			else
			{
				console.log('no_url_available');
				followedby_success = true; //inc
				received_ajax_response();
			}
		})
		.fail(function() {
			console.log("error");
		});
}

	function GetToken() {
		return window.location.hash.substring(window.location.hash.indexOf("=")+1);
	}

	function received_ajax_response(){
		if(followedby_success & followedby_success)
	  	{
	  		$('#tableviewcontainer').show();
 			$('#nousersfound').hide();

 			mixpanel.track("Unfollowers Calculated and Viewed");

	  		followedby_success = false;
	  		follows_sucess = false;

	  		console.log("Both Ajax Calls completed successfully!");
			var c = []; //will store the people who are only followed by me.
			var d = []; //will store followers who are followed by me.

				for(var i = 0; i< follows_array.length; i++)
				{
					for(var j = 0; j<followedby_array.length; j++)
					{
						if(follows_array[i].id == followedby_array[j].id)
						{
							d[d.length] = follows_array[i];
							break;
						}
						else if(j==followedby_array.length-1)
						{
							c[c.length] = follows_array[i];
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