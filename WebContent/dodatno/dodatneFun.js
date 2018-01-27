//******************************POMOCNE FUNCKIJE***********************************************************

function logovanjePrikaz()
{
	var username = $('#username').val();
	var password = $('#password').val();
	
	alertZeleni("Uspesno ste se prijavili!");
	$('#prviLink').text()
	
	//$('#wlc').text("Welcome, " + username + "!");
	$('#formica').hide(500);
	$('#pls').hide(500);
}

function registracijaPrikaz()
{
	$('#wlc').hide(500);
	$('#formica').hide(500);
	$('#pls').hide(500);
	
	$('#sredina').append("<table id=\"tabelica\">"+
			"<tr>"+
				"<td> Korinsicko ime: </td> "+
				"<td> <input type=\"text\" name=\"username\" id=\"username2\" /></td>"+
			"</tr>"+
			
			"<tr>"+
				"<td>Lozinka:</td>"+
				"<td><input type=\"text\" name=\"password\"  id=\"password2\" /></td>"+
			"</tr>"+
			
			"<tr>"+
				"<td> Ime: </td> "+
				"<td> <input type=\"text\" name=\"name\" id=\"name\" /></td>"+
			"</tr>"+
			
			"<tr>"+
				"<td> Prezime: </td> "+
				"<td> <input type=\"text\" name=\"surname\" id=\"surname\" /></td>"+
			"</tr>"+
			
			"<tr>"+
			"<td> Telefon: </td> "+
			"<td> <input type=\"text\" name=\"cnum\" id=\"cnum\" /></td>"+
			"</tr>"+
			
			"<tr>"+
			"<td> Email: </td> "+
			"<td> <input type=\"text\" name=\"email\" id=\"email\" /></td>"+
			"</tr>"+
			
			"<tr>"+
			"<td> Adresa: </td> "+
			"<td> <input type=\"text\" name=\"adress\" id=\"adress\" /></td>"+
			"</tr>"+
			
			"<tr>"+
			"<td> Drzava: </td> "+
			"<td> <input type=\"text\" name=\"country\" id=\"country\" /></td>"+
			"</tr>"+
			
			"<tr>"+
				"<td></td><td><button id=\"sgn2\" class=\"btn btn-primary btn-lg\"  name=\"log\"  style=\"width: 181px; \">Sign up</button></td>"+
			"</tr>"+
		"</table>");
	
}

function registrovanje()
{
	alertZeleni("Uspesno ste se registrovali!");
	
	$('#tabelica').hide(500);
	
	$('#wlc').show(500);
	$('#formica').show(500);
	$('#pls').show(500);
}

function alertCrveni(tekst)
{
	$('#sredina').prepend("<div class=\"alert alert-danger alert-dismissible\" role=\"alert\" id=\"postoji\">" + tekst +"</div>");
	$('#postoji').hide(5000);
}
 function alertZeleni(tekst)
 {
	$('#sredina').prepend("<div class=\"alert alert-success\" role=\"alert\" id=\"postoji\">" + tekst +"</div>");
	$('#postoji').hide(5000);
 }
 function refreshStranice()
 {
	 $.ajax
		({
			type: 'GET',
			url: 'rest/servis/sesija',
			dataType: 'json',
			success: function(data)
			{
				//console.log("POSLE REFRESH STRANICE: " + data.korisnickoIme + " " + data.uloga);
				if(data != null || data != undefined )
				{
					$('#tulbar').show();
					$('#wlc').show();
					$('#wlc').text("Welcome " + data.korisnickoIme + "!");
					$('#formica').hide();
					$('#pls').hide();
					$('#tabelaNovaProdavnica').hide();
					$('#tabelarniPrikaz').hide();
					$('#korisnikTabela').hide();
					$('#tabelaNovDostavljac').hide();
					$('#tabelaNovaKategorija').hide();
					if(data.uloga == "administrator")
						{
							adminPrikaz(data.korisnickoIme);
							$('#tulbar').show();

						}
					else if(data.uloga == "kupac")
						{
							kupacPrikaz(data.korisnickoIme);
							$('#tulbar').show();
							
						}
					else
					{
						$('#tulbar').show();
						prodavacPrikaz(data.korisnickoIme);
					}
					
					//$('#loggedUser').html("<span class=\"glyphicon glyphicon-user\" aria-hidden=\"true\"></span> " + data.korisnickoIme);
//					$('#navTulbar').load("toolbar.html", function()
//						{
//							$('#loggedUser').html("<span class=\"glyphicon glyphicon-user\" aria-hidden=\"true\"></span> " + data.korisnickoIme);
//						});
				}
				else
				{
					$('#tabelaNovaProdavnica').hide();
//					$('#wlc').text("Welcome!");
//					$('#loggedUser').hide();
//					$('#sout').hide();
//					$('#prodavniceDD').hide();
//					$('#prodavciDD').hide();
//					$('#kupciDD').hide();
//					$('#dostavljaciDD').hide();
//					$('#tabelarniPrikaz').hide();
//					$('#korisnikTabela').hide();
					$('#tabelaNovDostavljac').hide();
					$('#tabelaNovaKategorija').hide();
////					$('#pls').show();
//					$('#username').val("");
//					$('#password').val("");
					$('#sredina').load("indexSredina.html");
				}
							
			},
			error: function()
			{
				alertCrveni("GET NIJE USPEO REFRESH");
			}
		});
 }
 
 function adminPrikaz(korisnickoIme)
 {
	 $('#navTulbar').load("adminToolbar.html", function()
	 {
				$('#loggedUser').html("<span class=\"glyphicon glyphicon-user\" aria-hidden=\"true\"></span> " + korisnickoIme);
				$('#prodavniceDDul').append("<li role=\"separator\" class=\"divider\"></li>");
				
				$.ajax
				({
					type: 'GET',
					url: 'rest/servis/prodavnice',
					dataType: 'json',
					success: function(data)
					{
						var list = data == null ? [] : (data instanceof Array ? data : [ data ]);
						$.each(list, function(index, prodavnica) 
								{
									$('#prodavniceDDul').append("<li><a name=\"shop\" id=\""+prodavnica.sifra+"\" href=\"#\">" +prodavnica.naziv+"</a></li>");
								});
								
					},
					error: function()
					{
						
					}
				});
				$('#tulbar').show();
				$('#tulbar').show();
				$('#tulbar').show();
				$('#tulbar').show();
				$('#tulbar').show();
				$('#tulbar').show();
				$('#tulbar').show();
				$('#tulbar').show();
				
	 });
 }
	 
	 function kupacPrikaz(korisnickoIme)
	 {
		 $('#navTulbar').load("kupacToolbar.html", function()
				 {
							$('#loggedUser').html("<span class=\"glyphicon glyphicon-user\" aria-hidden=\"true\"></span> " + korisnickoIme);
							
							$.ajax
							({
								type: 'GET',
								url: 'rest/servis/prodavnice',
								dataType: 'json',
								success: function(data)
								{
									var list = data == null ? [] : (data instanceof Array ? data : [ data ]);
									$.each(list, function(index, prodavnica) 
											{
												$('#prodavniceDDul').append("<li><a name=\"shop\" id=\""+prodavnica.sifra+"\" href=\"#\">" +prodavnica.naziv+"</a></li>");
											});
											
								},
								error: function()
								{
									
								}
							});
							$('#tulbar').show();
							$('#tulbar').show();
							$('#tulbar').show();
							$('#tulbar').show();
							$('#tulbar').show();
							$('#tulbar').show();
							$('#tulbar').show();
							$('#tulbar').show();
							
				 });
	 }
	 
	 function prodavacPrikaz(korisnickoIme)
	 {
		 $('#navTulbar').load("prodavacToolbar.html", function()
				 {
							$('#loggedUser').html("<span class=\"glyphicon glyphicon-user\" aria-hidden=\"true\"></span> " + korisnickoIme);
							$('#prodavniceDDul').append("<li role=\"separator\" class=\"divider\"></li>");
							
							$.ajax
							({
								type: 'GET',
								url: 'rest/servis/prodavnice',
								dataType: 'json',
								success: function(data)
								{
									var list = data == null ? [] : (data instanceof Array ? data : [ data ]);
									$.each(list, function(index, prodavnica) 
											{
												if(korisnickoIme == prodavnica.odgovorniProdavac)
												{
													$('#prodavniceDDul').append("<li><a name=\"shop\" id=\""+prodavnica.sifra+"\" href=\"#\">" +prodavnica.naziv+"</a></li>");
												}
											});
											
								},
								error: function()
								{
									
								}
							});
							
				 });
	 }