$(document).ready(function(){ refreshStranice();

//******************************NOV DOSTAVLJAC FORMA***********************************************************
	$('#navTulbar').on('click', '#novDostavljac', function()
	{
		$('#storeNavTulbar').hide();
		$('#sredina').load("novDostavljacForma.html");
	});
	
	//******************************NOV DOSTAVLJAC REGISTROVANJE***********************************************************	
	$(document).on('click', '#addDeliverer', function()
	{
		var name = $('#name').val();
		var deliverId = $('#deliverId').val();
		var description = $('#description').val();
		var countryShipping = $('#countryShipping').val();
		var smallT = $('#smallT').val();
		var mediumT = $('#mediumT').val();
		var bigT = $('#bigT').val();
		console.log("treba da izbrise za izmenu: " + deliverId);
	
		
		$.ajax
		({
			type: 'POST',
			url: 'rest/servis/regDeliverer',
			contentType: 'application/json',
			dataType: 'text',
			data: JSON.stringify
			({
				"naziv" : name,
				"sifra" : deliverId,
				"opis" : description,
				"drzavePoslovanja" : countryShipping,
				"malaTarifa" : smallT,
				"srednjaTarifa" : mediumT,
				"velikaTarifa" : bigT,
			}),
			success: function(data)
			{
				if(data == "ok")
				{
					alertZeleni("Uspesno dodat dostavljac!");
//					$('#prodavciDDul').append("<li role=\"separator\" class=\"divider\"></li>");
//					$('#prodavciDDul').append("<li><a id=\"sviProdavci\" href=\"#\">Nova prodavnica</a></li>");
					location.reload();
				}
				else if(data == "praznaPolja")
				{
					alertCrveni("Popunite sva polja!");
				}
				else if(data == "vecPostoji")
				{
					alertCrveni("Dostavljac vec postoji!")
				}
				else if(data == "unesiteBroj")
				{
					alertCrveni("Unesite brojcane vrednosti u polja koja to semanticki zahtevaju!")
				}
				else
				{
					alertCrveni("Doslo je do greske prilikom dodavanja novog dostavljaca!")
				}
			},
			error: function()
			{
				alert("DODAVANJE DOSTAVLJACA FEJLOVALO SERVER");
			}
		});
		
	});
	
	//******************************PRIKAZ DOSTAVLJACA***********************************************************
	$('#navTulbar').on('click', "#sviDostavljaci", function()
	{
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/dostavljaci',
			dataType: 'json',
			success: function(data)
			{
				var list = data == null ? [] : (data instanceof Array ? data : [ data ]);
				$('#storeNavTulbar').hide();
				$('#sredina').load("dostavljaciPrikaz.html", function() 
						{$.each(list, function(index, dostavljaci) 
						{
					        //var forma = $('<form method="get" class="productsform" action="ShoppingCartServlet"></form>');
					        var tr = $('<tr></tr>');
					        tr.append('<td>' + dostavljaci.naziv + '</td>' +
					                '<td>' + dostavljaci.sifra + '</td>' +
					                '<td>' + dostavljaci.opis + '</td>' +
					                '<td>' + dostavljaci.drzavePoslovanja + '</td>' +
					                '<td>' + dostavljaci.malaTarifa + '</td>' +
					                '<td>' + dostavljaci.srednjaTarifa + '</td>' +
					                '<td>' + dostavljaci.velikaTarifa + '</td>' +
					                '<td><button name="delDeliverer" id=\"' +dostavljaci.sifra+ ' \"class=\"btn btn-default\">Obrisi</button></td>' +
					                '<td><button name="editDeliverer" id=\"' +dostavljaci.sifra+ ' \"class=\"btn btn-default\">Izmeni</button></td>' );
					        $('#korisnikTabela').append(tr);
						});});
			},
			error: function()
			{
				alert("NEUSPESNO POKPLJENI PODACI SA SERVERA DOSTAVLJACI!");
			}
		});
	});
	
	//******************************IZMENA DOSTAVLJACA***********************************************************
	$(document).on('click', "button[name = 'editDeliverer']", function()
	{
		var id = $(this).attr("id");
		console.log("pre ajax za izmenu dostavljaca " + id );
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/dostavljaci/izmena/' + id,
			dataType: 'json',
			success: function(data)
			{
				$('#sredina').load("novDostavljacForma.html", function()
				{
//							$('#addDeliverer').html("<span id=\"ikonica\" class=\"glyphicon glyphicon-floppy-disk\" aria-hidden=\"true\"></span>Sacuvaj izmene");
							$('#addDeliverer').hide();
							$('#dugme').append("<tr><td><button  id=\"changeDeliverer\" class=\"btn btn-primary btn-lg\"  style=\"width: 181px;  \"> <span id=\"ikonica\" class=\"glyphicon glyphicon-floppy-disk\" aria-hidden=\"true\"></span>Sacuvaj izmene</button></td></tr>");
							$('#deliverId').prop('disabled', true);
							$('#name').val(data.naziv);
							$('#deliverId').val(data.sifra);
							$('#description').val(data.opis);
							$('#countryShipping').val(data.drzavePoslovanja);
							$('#smallT').val(data.malaTarifa);
							$('#mediumT').val(data.srednjaTarifa);
							$('#bigT').val(data.velikaTarifa);
							
							$(document).on('click','#changeDeliverer', function()
							{
								var name = $('#name').val();
								var deliverId = $('#deliverId').val();
								var description = $('#description').val();
								var countryShipping = $('#countryShipping').val();
								var smallT = $('#smallT').val();
								var mediumT = $('#mediumT').val();
								var bigT = $('#bigT').val();
								console.log("treba da izbrise za izmenu: " + deliverId);
								$.ajax
								({
									type: 'GET',
									url: 'rest/servis/dostavljaci/brisanje/' + deliverId ,
									dataType: 'text',
									success: function(data)
									{
										
									},
									error: function()
									{
										alertCrveni("FEJL BRISANJA SERVER GRESKA");
									}
								});
								
								$.ajax
								({
									type: 'POST',
									url: 'rest/servis/regDeliverer',
									contentType: 'application/json',
									dataType: 'text',
									data: JSON.stringify
									({
										"naziv" : name,
										"sifra" : deliverId,
										"opis" : description,
										"drzavePoslovanja" : countryShipping,
										"malaTarifa" : smallT,
										"srednjaTarifa" : mediumT,
										"velikaTarifa" : bigT,
									}),
									success: function(data)
									{
										if(data == "ok")
										{
											alertZeleni("Uspesno dodat dostavljac!");
//											$('#prodavciDDul').append("<li role=\"separator\" class=\"divider\"></li>");
//											$('#prodavciDDul').append("<li><a id=\"sviProdavci\" href=\"#\">Nova prodavnica</a></li>");
											location.reload();
										}
										else if(data == "praznaPolja")
										{
											alertCrveni("Popunite sva polja!");
										}
										else if(data == "vecPostoji")
										{
											alertCrveni("Dostavljac vec postoji!")
										}
										else if(data == "unesiteBroj")
										{
											alertCrveni("Unesite brojcanu vrednost u polja koja to semanticki zahtevaju!")
										}
										else
										{
											alertCrveni("Doslo je do greske prilikom dodavanja novog dostavljaca!")
										}
									},
									error: function()
									{
										alert("DODAVANJE DOSTAVLJACA FEJLOVALO SERVER");
									}
								});
							});
							

				});
			},
			error: function()
			{
				
			}
		});
	});
	
	//******************************BRISANJE DOSTAVLJACA***********************************************************
	$(document).on('click', "button[name = 'delDeliverer']", function()
	{
		var id = $(this).attr("id");
		console.log("pre ajaxa za delete dostavljaca" + id);
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/dostavljaci/brisanje/' + id ,
			dataType: 'text',
			success: function(data)
			{
				$.ajax
				({
					type: 'GET',
					url: 'rest/servis/dostavljaci',
					dataType: 'json',
					success: function(data)
					{
						var list = data == null ? [] : (data instanceof Array ? data : [ data ]);
						$('#sredina').load("dostavljaciPrikaz.html", function() 
								{$.each(list, function(index, dostavljaci) 
								{
							        //var forma = $('<form method="get" class="productsform" action="ShoppingCartServlet"></form>');
							        var tr = $('<tr></tr>');
							        tr.append('<td>' + dostavljaci.naziv + '</td>' +
							                '<td>' + dostavljaci.sifra + '</td>' +
							                '<td>' + dostavljaci.opis + '</td>' +
							                '<td>' + dostavljaci.drzavePoslovanja + '</td>' +
							                '<td>' + dostavljaci.malaTarifa + '</td>' +
							                '<td>' + dostavljaci.srednjaTarifa + '</td>' +
							                '<td>' + dostavljaci.velikaTarifa + '</td>' +
							                '<td><button name="delDeliverer" id=\"' +dostavljaci.sifra+ ' \"class=\"btn btn-default\">Obrisi</button></td>' +
							                '<td><button name="editDeliverer" id=\"' +dostavljaci.sifra+ ' \"class=\"btn btn-default\">Izmeni</button></td>' );
							        $('#korisnikTabela').append(tr);
								});});
					},
					error:function()
					{
						
					}
				});
			},
			error: function()
			{
				alertCrveni("FEJL BRISANJA SERVER GRESKA");
			}
		});
	});

});