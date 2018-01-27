$(document).ready(function(){ refreshStranice();




//******************************LOG IN***********************************************************
	$(document).on('click','#login', function()
	{
		var username = $('#username').val();
		var password = $('#password').val();
		
//		console.log($username.val() +  $password.val())
		$.ajax
		({
			 type: 'POST',
			 url: 'rest/servis/log',
			 contentType: 'application/json', //tip sadrzaja koji saljem na server
			 dataType: 'text', //tip podatka koji server salje klijentu
			 data: JSON.stringify({
				 
				 "korisnickoIme" : username,
				 "lozinka" : password,
			 }),
			 success: function(data) 
			 {
				 if(data == "okadmin")
				 {
					 logovanjePrikaz();
					 refreshStranice();
					 adminPrikaz();
				 }
				 else if(data == "okkupac")
				 {
					 logovanjePrikaz();
					 refreshStranice();
					 kupacPrikaz();
				 }
				 else if(data == "okprodavac")
				 {
					 logovanjePrikaz();
					 refreshStranice();
				 }
				 else if(data == "praznoPolje")
					 alertCrveni("Niste uneli sva polja! Popunite sva polja!");
				 else if(data == "notok")
					 alertCrveni("Pogresno ste uneli lozinku ili korisnicko ime! Pokusajte ponovo!");
			 },
			error: function()
			{
				alertCrveni("NEUSPESNO LOGOVANJE GRESKA NA SERVERU!");
			}
				
		
		});
		
//		$.ajax
//		({
//			type: 'GET',
//			url: 'rest/servis/sesija',
//			dataType: 'json',
//			success: function(data)
//			{
//				
////				$('#wlc').text("Welcomev" + data.korisnickoIme + "!");
////				$('#dugmici').append("<li ><a id=\"user\"><span class=\"glyphicon glyphicon-user\" aria-hidden=\"true\"></span>" + data.korisnickoIme+"</a></li>");
////				$('#dugmici').append("<li id=\"sout\"><a style=\"background-color: gold;\" id=\"prviLink\" href=\"#\"><span class=\"glyphicon glyphicon-log-out\" aria-hidden=\"true\"></span>Log Out</a></li>");
//				refreshStranice();
//			},
//			error: function()
//			{
//				alertCrveni("GET NIJE USPEO");
//			}
//		});
		
	});
//******************************SIGN UP***********************************************************
	$(document).on('click','#sgn', function()
	{
//		console.log($username.val() +  $password.val())
		registracijaPrikaz();
	});
	

//******************************REGISTER NEW USER***********************************************************	
	$(document).on('click', '#sgn2', function()
	{
		var username2 = $('#username2').val();
		var password2 = $('#password2').val();
		var name = $('#name').val();
		var surname = $('#surname').val();
		var cnum = $('#cnum').val();
		var email = $('#email').val();
		var adress = $('#adress').val();
		var country = $('#country').val();
		
		$.ajax
		({
			type: 'POST',
			url: 'rest/servis/register',
			contentType: 'application/json',
			dataType: 'text',
			data: JSON.stringify
			({
				"korisnickoIme" : username2,
				"lozinka" : password2,
				"ime" : name,
				"prezime" : surname,
				"telefon" : cnum,
				"email" : email,
				"adresa" : adress,
				"drzava" : country,	
			}),
			
			success: function(data)
			{
				if(data == "ok")
					registrovanje();
				else if(data == "postojiVec")
					alertCrveni("Korisnicko ime vec postoji! Unesite drugo korisnciko ime.");
				else if(data == "praznaPolja")
					alertCrveni("Popunite sva polja!")
				else
					alertCrveni("Nepoznata greska se desila!");
			},
			error: function()
			{
				alertCrveni("NEUSPESNO REGISTROVANJE GRESKA NA SERVERU");
			}
		});
	});
	
//******************************LOG OUT CLICK***********************************************************
	$('#navTulbar').on('click', '#sout', function()
	{
		
		 $.ajax
			({
				type: 'GET',
				url: 'rest/servis/odjava',
				dataType: 'text',
				success: function(data)
				{
					
					if(data === "odjavljen")
					{
						refreshStranice();
						location.reload();
						alertZeleni("Uspesno ste se odjavili!");
					}
					else
					{
						alertCrveni("U SAKSES ALI FEJL!");
					}
								
				},
				error: function()
				{
					alertCrveni("GET NIJE USPEO LOG OUT");
				}
			});
	});
	
	//******************************HOME PAGE***********************************************************
	$('#navTulbar').on('click', '#homePage', function()
	{
		//refreshStranice();
		location.reload(function()
				{
					refreshStranice();
				});
	});
	


});