$(document).ready(function(){ refreshStranice();

//******************************NOVA PRODAVNICA FORMA***********************************************************
	$('#navTulbar').on('click', '#novaProdavnica', function()
	{
		$('#storeNavTulbar').hide();
		$('#sredina').load("novaProdavnicaForma.html", function()
		{
			$.ajax
			({
				type: 'GET',
				url: 'rest/servis/prodavci',
				dataType: 'json',
				success: function(data)
				{
					var list = data == null ? [] : (data instanceof Array ? data : [ data ]);
					$.each(list, function(index, korisnik) 
					{
						$('#prodavacSelect').append("<option>"+korisnik.korisnickoIme+"</option>");
					});
				},
				error: function()
				{
					alert("FEJL KOD SERVERA DODAVANJE RADNJE");
				}
			});
		});
	});
	
	
	//******************************NOVA PRODAVNICA REGISTROVANJE***********************************************************	
	$(document).on('click', '#addStore', function()
	{
		var storeName = $('#storeName').val();
		var storeId = $('#storeId').val();
		var adress = $('#adress').val();
		var country = $('#country').val();
		var cnum = $('#cnumber').val();
		var email = $('#email').val();
		var prodavac = $("#prodavacSelect option:selected").text();
		console.log(prodavac);
		
		
		$.ajax
		({
			type: 'POST',
			url: 'rest/servis/regStore',
			contentType: 'application/json',
			dataType: 'text',
			data: JSON.stringify
			({
				"naziv" : storeName,
				"sifra" : storeId,
				"telefon" : cnum,
				"email" : email,
				"adresa" : adress,
				"drzava" : country,
				"odgovorniProdavac": prodavac,
			}),
			success: function(data)
			{
				if(data == "ok")
				{
					alertZeleni("Uspesno dodata prodavnica!");
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
					alertCrveni("Prodavnica vec postoji!")
				}
				else
				{
					alertCrveni("Doslo je do greske prilikom dodavanja nove radnje!")
				}
			},
			error: function()
			{
				alert("DODAVANJE RADNJE FEJLOVALO SERVER");
			}
		});
		

	});
	
	//******************************PRIKAZ PRODAVNICA***********************************************************
	$('#navTulbar').on('click', "#sveProdavnice", function()
	{
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/sesija',
			dataType: 'json',
			success: function(data)
			{
				if(data.uloga == "prodavac")
				{
					var sellerId = data.korisnickoIme;
					
					$.ajax
					({
						type: 'GET',
						url: 'rest/servis/prodavnice',
						dataType: 'json',
						success: function(data)
						{
							var list = data == null ? [] : (data instanceof Array ? data : [ data ]);
							$('#storeNavTulbar').hide();
							$('#sredina').load("prodavnicePrikaz.html", function() 
									{$.each(list, function(index, prodavnica) 
									{
								        //var forma = $('<form method="get" class="productsform" action="ShoppingCartServlet"></form>');
								       if(sellerId == prodavnica.odgovorniProdavac)
										{
								    	   var tr = $('<tr></tr>');
								    	   tr.append('<td>' + prodavnica.naziv + '</td>' +
								                '<td>' + prodavnica.sifra + '</td>' +
								                '<td>' + prodavnica.telefon + '</td>' +
								                '<td>' + prodavnica.email + '</td>' +
								                '<td>' + prodavnica.adresa + '</td>' +
								                '<td>' + prodavnica.drzava + '</td>'+
								                '<td>' + prodavnica.odgovorniProdavac + '</td>' +
								                '<td><button name="editStore" id=\"' +prodavnica.naziv+ ' \"class=\"btn btn-default\">Izmeni</button></td>' );
								    	   $('#korisnikTabela').append(tr);
										}
									});});
						},
						error: function()
						{
							alert("NEUSPESNO POKPLJENI PODACI SA SERVERA PRODAVNICE!");
						}
					});
				}
				else
				{
					$.ajax
					({
						type: 'GET',
						url: 'rest/servis/prodavnice',
						dataType: 'json',
						success: function(data)
						{
							var list = data == null ? [] : (data instanceof Array ? data : [ data ]);
							$('#storeNavTulbar').hide();
							$('#sredina').load("prodavnicePrikaz.html", function() 
									{$.each(list, function(index, prodavnica) 
									{
								        //var forma = $('<form method="get" class="productsform" action="ShoppingCartServlet"></form>');
								        var tr = $('<tr></tr>');
								        tr.append('<td>' + prodavnica.naziv + '</td>' +
								                '<td>' + prodavnica.sifra + '</td>' +
								                '<td>' + prodavnica.telefon + '</td>' +
								                '<td>' + prodavnica.email + '</td>' +
								                '<td>' + prodavnica.adresa + '</td>' +
								                '<td>' + prodavnica.drzava + '</td>'+
								                '<td>' + prodavnica.odgovorniProdavac + '</td>' +
								                '<td><button name="delStore" id=\"' +prodavnica.naziv+ ' \"class=\"btn btn-default\">Obrisi</button></td>' +
								                '<td><button name="editStore" id=\"' +prodavnica.naziv+ ' \"class=\"btn btn-default\">Izmeni</button></td>' );
								        $('#korisnikTabela').append(tr);
									});});
						},
						error: function()
						{
							alert("NEUSPESNO POKPLJENI PODACI SA SERVERA PRODAVNICE!");
						}
					});
				}
			}
		});
	});
	
	//******************************IZMENA PRODAVNICE***********************************************************
	$(document).on('click', "button[name = 'editStore']", function()
	{
		var id = $(this).attr("id");
		console.log("pre ajax za izmenu prodavnice " + id );
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/prodavnice/izmena/' + id,
			dataType: 'json',
			success: function(data)
			{
				$('#sredina').load("novaProdavnicaForma.html", function()
						{
							//$('#addStore').html("<span id=\"ikonica\" class=\"glyphicon glyphicon-floppy-disk\" aria-hidden=\"true\"></span>Sacuvaj izmene");
							$('#addStore').hide();
							$('#dugme').append("<tr><td><button  id=\"changeStore\" class=\"btn btn-primary btn-lg\"  style=\"width: 181px;  \"> <span id=\"ikonica\" class=\"glyphicon glyphicon-floppy-disk\" aria-hidden=\"true\"></span>Sacuvaj izmene</button></td></tr>");
							$('#storeName').prop('disabled', true);
							$('#storeId').prop('disabled', true);
							$('#storeName').val(data.naziv);
							$('#storeId').val(data.sifra);
							$('#adress').val(data.adresa);
							$('#country').val(data.drzava);
							$('#cnumber').val(data.telefon);
							$('#email').val(data.email);
//							$('#prodavacSelect').val(data.adresa);
//							$('#prodavacSelect option:contains("'+data.odgovorniProdavac+'")').prop('selected',true);
							$.ajax
							({
								type: 'GET',
								url: 'rest/servis/prodavci',
								dataType: 'json',
								success: function(data2)
								{
									var list = data2 == null ? [] : (data2 instanceof Array ? data2 : [ data2 ]);
									$.each(list, function(index, korisnik) 
									{
										$('#prodavacSelect').append("<option>"+korisnik.korisnickoIme+"</option>");
									});
									$('#prodavacSelect option:contains("'+data.odgovorniProdavac+'")').attr("selected","selected"); 
								},
								error: function()
								{
									alert("FEJL KOD SERVERA DODAVANJE RADNJE");
								}
							});
							
							$(document).on('click','#changeStore', function()
							{
								var storeName = $('#storeName').val();
								var storeId = $('#storeId').val();
								var adress = $('#adress').val();
								var country = $('#country').val();
								var cnum = $('#cnumber').val();
								var email = $('#email').val();
								var prodavac = $("#prodavacSelect option:selected").text();
								console.log(prodavac);
								
								$.ajax
								({
									type: 'GET',
									url: 'rest/servis/prodavnice/brisanje/' + storeName ,
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
									url: 'rest/servis/regStore',
									contentType: 'application/json',
									dataType: 'text',
									data: JSON.stringify
									({
										"naziv" : storeName,
										"sifra" : storeId,
										"telefon" : cnum,
										"email" : email,
										"adresa" : adress,
										"drzava" : country,
										"odgovorniProdavac": prodavac,
									}),
									success: function(data)
									{
										if(data == "ok")
										{
											alertZeleni("Uspesno dodata prodavnica!");
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
											alertCrveni("Prodavnica vec postoji!")
										}
										else
										{
											alertCrveni("Doslo je do greske prilikom dodavanja nove radnje!")
										}
									},
									error: function()
									{
										alert("DODAVANJE RADNJE FEJLOVALO SERVER");
									}
								});
							});
							
						});
			},
			error: function()
			{
				alert("NEUSPESNI POKUSAJ IZMENE PRODAVNICE")
			}
		});
	});

	//******************************BRISANJE PRODAVNICE***********************************************************
	$(document).on('click', "button[name = 'delStore']", function()
	{
		var id = $(this).attr("id");
		console.log("pre ajaxa za delete prodavnice" + id);
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/prodavnice/brisanje/' + id ,
			dataType: 'text',
			success: function(data)
			{
				$.ajax
				({
					type: 'GET',
					url: 'rest/servis/prodavnice',
					dataType: 'json',
					success: function(data)
					{
						var list = data == null ? [] : (data instanceof Array ? data : [ data ]);
						$('#sredina').load("prodavnicePrikaz.html", function() 
								{$.each(list, function(index, prodavnica) 
								{
									var tr = $('<tr></tr>');
							        tr.append('<td>' + prodavnica.naziv + '</td>' +
							                '<td>' + prodavnica.sifra + '</td>' +
							                '<td>' + prodavnica.telefon + '</td>' +
							                '<td>' + prodavnica.email + '</td>' +
							                '<td>' + prodavnica.adresa + '</td>' +
							                '<td>' + prodavnica.drzava + '</td>'+
							                '<td>' + prodavnica.odgovorniProdavac + '</td>' +
							                '<td><button name="delStore" id=\"' +prodavnica.naziv+ ' \"class=\"btn btn-default\">Obrisi</button></td>' +
							                '<td><button name="editStore" id=\"' +prodavnica.naziv+ ' \"class=\"btn btn-default\">Izmeni</button></td>' );
							        $('#korisnikTabela').append(tr);
								});});
					},
					error: function()
					{
						alert("FAIL FIAL FAIL BRISANJE PRDAVCA PA UCITAVANJE");
					}
				});
				
			},
			error: function()
			{
				alert("FAIL FIAL FAIL BRISANJE PRDAVCA");
			}
		});
	});
	
	//******************************PREPOZNAVANJE PRODAVNICE***********************************************************
	$(document).on('click', "a[name = 'shop']",function()
	{
	
		var storeId = $(this).attr("id");
		$('#storeNavTulbar').hide();
		$('#navTulbar').after( function()
		{
			//<ul id=\"dugmiciStore\" class=\"nav navbar-nav\"></ul>
			$('#navTulbar').after("<nav id=\"storeNavTulbar\"  class=\"navbar navbar-default\"> "+
			"<div id=\"storeNavTulbarDiv\" class=\"container-fluid\">" +
			"</div></nav>");
			$('#storeNavTulbarDiv').load("prodavnicaToolbar.html");
			
			$.ajax
			({
				type: 'GET',
				url: 'rest/servis/prodavnice/' + storeId,
				dataType: 'json',
				success: function(data)
				{
					$('#storeHomePage').text(data.naziv);
					refreshStranice();
					$.ajax
					({
						type: 'GET',
						url: 'rest/servis/sesija',
						dataType: 'json',
						success: function(data7)
						{
							if(data7.uloga == "kupac")
							{
								$('#dugmiciStore').load("adminToolbarStore.html", function()
								{
									$('#proizvodiDD').hide();
								});
								
								$.ajax
								({
									type: 'GET',
									url: 'rest/servis/prodavnice/' + storeId + '/proizvodi',
									dataType: 'json',
									success: function(data2)
									{
										$('#sredina').html("");
										var list = data2 == null ? [] : (data2 instanceof Array ? data2 : [ data2 ]);
										$.each(list, function(index, proizvod) 
										{
											$.ajax
											({
												type: 'GET',
												url: 'rest/servis/sesija',
												dataType: 'json',
												success: function(data)
												{
													if(data.uloga === "administrator" || data.uloga === "prodavac")
													{
														$('#sredina').append("<div style=\"font-size:	10px; max-width:250px; max-height:600px;\" class=\"col-sm-6 col-md-4\"><div style=\"max-width:250px; max-height:600px;\" class=\"thumbnail\">"+
																"<img style=\" max-width:150px; max-height:150px;\"src=\"" + "multimedia/" + proizvod.slika+"\" alt=\"slicica\">"+
																"<div style=\" max-width:250px; max-height:200px;\"class=\"caption\">"+
																"<h3 style=\"font-size: 17px; \">" + proizvod.naziv + "</h3>"+
																"<h2 style=\"font-size: 17px; \">" + proizvod.jedinicnaCena + " rsd</h2>"+
																"<p><a href=\"#\" name=\"delProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-primary\" role=\"button\">Obrisi</a> " +
																"<button name=\"editProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\">Izmeni</button> "+
																// "<a href=\"#\" name=\"editProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\" role=\"button\">Izmeni podatke</a></p>"+
																"</div>"+
														"</div></div>");
													}
													else if(data.uloga === "kupac")
													{
														$('#sredina').append("<div style=\"font-size:	10px; max-width:250px; max-height:600px;\" class=\"col-sm-6 col-md-4\"><div style=\"max-width:250px; max-height:600px;\" class=\"thumbnail\">"+
																"<img style=\" max-width:150px; max-height:150px;\"src=\"" + "multimedia/" + proizvod.slika+"\" alt=\"slicica\">"+
																"<div style=\" max-width:300px; max-height:350px;\"class=\"caption\">"+
																"<h3 style=\"font-size: 17px; \">" + proizvod.naziv + "</h3>"+
																"<h2 style=\"font-size: 17px; \">" + proizvod.jedinicnaCena + " rsd</h2>"+
																"<p><a href=\"#\" name=\"addToCart\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-primary\" role=\"button\">Stavi u korpu</a> " +
																"<button name=\"detailProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\">Detalji proizvoda</button> "+
																"<button name=\"wishProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\">Dodaj u listu zelja</button> "+
																"<button name=\"commentProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\">Dodaj recenziju</button> "+
																// "<a href=\"#\" name=\"editProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\" role=\"button\">Izmeni podatke</a></p>"+
																"</div>"+
														"</div></div>");

													}
														
												}
											});
										});
									},
									error: function()
									{
										alert("nisi uspeo pokupiti sve prodavnice");
									}
								});
							}
							else
							{
								$('#dugmiciStore').load("adminToolbarStore.html", function()
								{
									$('#novProizvod').attr("name", storeId);
											
								});
								
								$.ajax
								({
									type: 'GET',
									url: 'rest/servis/prodavnice/' + storeId + '/proizvodi',
									dataType: 'json',
									success: function(data2)
									{
										$('#sredina').html("");
										var list = data2 == null ? [] : (data2 instanceof Array ? data2 : [ data2 ]);
										$.each(list, function(index, proizvod) 
										{
											$.ajax
											({
												type: 'GET',
												url: 'rest/servis/sesija',
												dataType: 'json',
												success: function(data)
												{
													if(data.uloga === "administrator" || data.uloga === "prodavac")
													{
														$('#sredina').append("<div style=\"font-size:	10px; max-width:250px; max-height:600px;\" class=\"col-sm-6 col-md-4\"><div style=\"max-width:250px; max-height:600px;\" class=\"thumbnail\">"+
																"<img style=\" max-width:150px; max-height:150px;\"src=\"" + "multimedia/" + proizvod.slika+"\" alt=\"slicica\">"+
																"<div style=\" max-width:250px; max-height:200px;\"class=\"caption\">"+
																"<h3 style=\"font-size: 17px; \">" + proizvod.naziv + "</h3>"+
																"<h2 style=\"font-size: 17px; \">" + proizvod.jedinicnaCena + " rsd</h2>"+
																"<p><a href=\"#\" name=\"delProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-primary\" role=\"button\">Obrisi</a> " +
																"<button name=\"editProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\">Izmeni</button> "+
																// "<a href=\"#\" name=\"editProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\" role=\"button\">Izmeni podatke</a></p>"+
																"</div>"+
														"</div></div>");
													}
													else if(data.uloga === "kupac")
													{
														$('#sredina').append("<div style=\"font-size:	10px; max-width:250px; max-height:600px;\" class=\"col-sm-6 col-md-4\"><div style=\"max-width:250px; max-height:600px;\" class=\"thumbnail\">"+
																"<img style=\" max-width:150px; max-height:150px;\"src=\"" + "multimedia/" + proizvod.slika+"\" alt=\"slicica\">"+
																"<div style=\" max-width:300px; max-height:350px;\"class=\"caption\">"+
																"<h3 style=\"font-size: 17px; \">" + proizvod.naziv + "</h3>"+
																"<h2 style=\"font-size: 17px; \">" + proizvod.jedinicnaCena + " rsd</h2>"+
																"<p><a href=\"#\" name=\"addToCart\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-primary\" role=\"button\">Stavi u korpu</a> " +
																"<button name=\"detailProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\">Detalji proizvoda</button> "+
																"<button name=\"wishProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\">Dodaj u listu zelja</button> "+
																"<button name=\"commentProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\">Dodaj recenziju</button> "+
																// "<a href=\"#\" name=\"editProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\" role=\"button\">Izmeni podatke</a></p>"+
																"</div>"+
														"</div></div>");

													}
														
												}
											});
										});
									},
									error: function()
									{
										alert("nisi uspeo pokupiti sve prodavnice");
									}
								});
							}
						}
					});
		
				},
				error: function()
				{
					
				}
			});

		});

	});


});