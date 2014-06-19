	var FollowersSucess = false;
	var FolloweesSuccess = false;

	var peopleIFollowArray = [];
	var peopleWhoFollowMeArray = [];



	function Followers(){
		var ACCESS_TOKEN = getFirstAnchorTagValue(); 
		console.log("Access Token: " + ACCESS_TOKEN);


		$.ajax({
			url: 'https://api.instagram.com/v1/users/self/follows?access_token=' + ACCESS_TOKEN,
			type: 'GET',
			dataType: 'jsonp'
		})
		.done(function(data) {
			FollowersSucess = true; //inc
			console.log(data);
			peopleIFollowArray = data;
			receivedAJAXResponse();
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
			FolloweesSuccess = true;
			console.log(data);
			peopleWhoFollowMeArray = data;
			receivedAJAXResponse();
		})
		.fail(function() {
			console.log("error");
		});
		
	}

	function getFirstAnchorTagValue() {
		return window.location.hash.substring(window.location.hash.indexOf("=")+1);
	}

	function receivedAJAXResponse(){
		if(FolloweesSuccess & FolloweesSuccess)
	  	{
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

				var listofnames = "";
				$.each(c, function(k, v){
					$('#tableview').append( "<tr><td>" + v.username + "</td> <td>"+ v.full_name+"</td></tr>");
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