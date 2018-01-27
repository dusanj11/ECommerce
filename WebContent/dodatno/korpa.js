

//******************************PREGLED KORPE***********************************************************
	$(document).on('click', '#shopCart', function()
	{
		$('#sredina').load("stanjeKorpePrikaz.html");
		
		$('#sredina').load("stanjeKorpePrikaz.html");
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/prodavnice/aktivna',
			dataType: 'json',
			success: function(data1)
			{
				var storeCountry = data1.drzava;
		
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/korpa',
			dataType: 'json',
			success: function(data)
			{
				//$('#sredina').html("");
				var list = data == null ? [] : (data instanceof Array ? data : [ data ]);
				$.each(list, function(index, proizvod) 
				{
					 var tr = $('<tr></tr>');
				        tr.append('<td>' + proizvod.naziv + '</td>' +
				                '<td>' + proizvod.sifra + '</td>' +
				                '<td>' + proizvod.prodavnica + '</td>' +
				                '<td>' + proizvod.boja + '</td>' +
				                '<td>' + proizvod.dimenzija + '</td>' +
				                '<td>' + proizvod.tezina + '</td>' +
				                '<td>' + proizvod.zemljaProizvodnje + '</td>' +
				                '<td>' + proizvod.nazivProizvodjaca + '</td>' +
				                '<td>' + proizvod.kategorijaProizvoda + '</td>' +
				                '<td>' + proizvod.jedinicnaCena + '</td>' +
				                '<td><button name="delItem" id=\"' +proizvod.sifra+ ' \"class=\"btn btn-default\">Ukloni stavku</button></td>');
				        $('#korisnikTabela').append(tr);
				});
				$('#korisnikTabela').append("<tr>"+
				"<td>Dostavljac:</td>"+
				"<td><select  name=\"dostavljac\"  id=\"delivererSelect\" ></select></td>"+
			"</tr><tr id=\"dugme\">"+
				"<td><button  id=\"buyCart\" class=\"btn btn-primary btn-lg\"  name=\"buyCart\"  style=\"width: 250px;\">"+
				"<span id=\"ikonica\" class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span>Kupi odabrane stavke </button></td></tr>");
			
				$.ajax
				({
					type: 'GET',
					url: 'rest/servis/dostavljaci',
					dataType: 'json',
					success: function(data2)
					{
						var list = data2 == null ? [] : (data2 instanceof Array ? data2 : [ data2 ]);
						//$('#storeNavTulbar').hide();
						
						$.each(list, function(index, dostavljaci) 
						{
							console.log("sifra dostavljaca pre namestanja option : " + dostavljaci.sifra);
							if(storeCountry == dostavljaci.drzavePoslovanja)
								{
							$('#delivererSelect').append("<option id=\""+dostavljaci.sifra +"\">"+dostavljaci.naziv+"</option>");
								}
						});
					},
					error: function()
					{
						alert("NEUSPESNO POKPLJENI PODACI SA SERVERA DOSTAVLJACI!");
					}
				});
			
			}
		});
	   }
	 });
	});
	
	
//******************************UKLANJANJE PROIZVODA U KORPU***********************************************************	
	$(document).on('click', "button[name='delItem']", function()
	{
		var productId = $(this).attr("id");
		console.log("artikal za uklanjanje iz korpe je: " + productId);
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/korpa/ukloni/'+productId,
			dataType: 'text',
			success: function(data)
			{
				if(data == "okej")
				{
					$.ajax
					({
						type: 'GET',
						url: 'rest/servis/prodavnice/aktivna',
						dataType: 'json',
						success: function(data)
						{
							var storeId = data.sifra;
							console.log("aktivna prodavnica: " +  storeId + " , a proizvod: " + productId);
							
							$.ajax
							({
								type: 'GET',
								url: 'rest/servis/prodavnice/'+storeId+'/proizvodi/'+productId,
								dataType: 'json',
								success: function(data2)
								{
									console.log("pronadjen proizvod: " + data2.naziv + " ,sa kolicinom: " + data2.kolicinaUMagacinu);
									var staraKolicina = parseFloat(data2.kolicinaUMagacinu);
									var novaKolicina = staraKolicina + 1;
									console.log("stara kolicina: " + staraKolicina + ", nova kolicina: " + novaKolicina);
									
									var name = data2.naziv;
									var productId2 = productId; 
									var color = data2.boja; 
									var dimension = data2.dimenzija; 
									var weight = data2.tezina; 
									var madeBy = data2.zemljaProizvodnje; 
									var makerName = data2.nazivProizvodjaca; 
									var price = data2.jedinicnaCena; 
									var category = data2.kategorijaProizvoda;
									var description = data2.opis; 
									var amount = novaKolicina;
									var storeId2 = storeId;
									var picture = data2.slika;
									
									$.ajax
									({
										type: 'POST',
										url: 'rest/servis/prodavnice/'+storeId+'/proizvodi/izmena/'+productId,
										contentType: 'application/json',
										dataType: 'text',
										data: JSON.stringify
										({
											"naziv" : name,
											"sifra" : productId2,
											"boja" : color,
											"dimenzija" : dimension,
											"tezina" : weight,
											"zemljaProizvodnje" : madeBy,
											"nazivProizvodjaca" : makerName,
											"jedinicnaCena" : price,
											"kategorijaProizvoda" : category,
											"opis" : description,
											"kolicinaUMagacinu" : amount,
											"slika" : picture,
											"prodavnica" : storeId2,
										}),
										success: function(data3)
										{
											if(data3 == "okej")
											{
												$('#sredina').load("stanjeKorpePrikaz.html");
												$.ajax
												({
													type: 'GET',
													url: 'rest/servis/korpa',
													dataType: 'json',
													success: function(data7)
													{
														
														
														var list = data7 == null ? [] : (data7 instanceof Array ? data7 : [ data7 ]);
														$.each(list, function(index, proizvod) 
														{
															 var tr = $('<tr></tr>');
														        tr.append('<td>' + proizvod.naziv + '</td>' +
														                '<td>' + proizvod.sifra + '</td>' +
														                '<td>' + proizvod.prodavnica + '</td>' +
														                '<td>' + proizvod.boja + '</td>' +
														                '<td>' + proizvod.dimenzija + '</td>' +
														                '<td>' + proizvod.tezina + '</td>' +
														                '<td>' + proizvod.zemljaProizvodnje + '</td>' +
														                '<td>' + proizvod.nazivProizvodjaca + '</td>' +
														                '<td>' + proizvod.kategorijaProizvoda + '</td>' +
														                '<td>' + proizvod.jedinicnaCena + '</td>' +
														                '<td><button name="delItem" id=\"' +proizvod.sifra+ ' \"class=\"btn btn-default\">Ukloni stavku</button></td>');
														        $('#korisnikTabela').append(tr);
														});

														if ( $("button[name='delItem']").length ) 
														{
														    
														 
														
														$('#korisnikTabela').append("<tr>"+
																"<td>Dostavljac:</td>"+
																"<td><select  name=\"dostavljac\"  id=\"delivererSelect\" ></select></td>"+
															"</tr><tr id=\"dugme\">"+
																"<td><button  id=\"buyCart\" class=\"btn btn-primary btn-lg\"  name=\"buyCart\"  style=\"width: 250px;\">"+
																"<span id=\"ikonica\" class=\"glyphicon glyphicon-ok\" aria-hidden=\"true\"></span>Kupi odabrane stavke </button></td></tr>");
															
																$.ajax
																({
																	type: 'GET',
																	url: 'rest/servis/dostavljaci',
																	dataType: 'json',
																	success: function(data)
																	{
																		var list = data == null ? [] : (data instanceof Array ? data : [ data ]);
																		//$('#storeNavTulbar').hide();
																		
																		$.each(list, function(index, dostavljaci) 
																		{
																			console.log("sifra dostavljaca pre namestanja option : " + dostavljaci.sifra);
																			$('#delivererSelect').append("<option id=\""+dostavljaci.sifra +"\">"+dostavljaci.naziv+"</option>");
																		});
																	},
																	error: function()
																	{
																		alert("NEUSPESNO POKPLJENI PODACI SA SERVERA DOSTAVLJACI!");
																	}
																});
															  }
															}
												});
											}
											else
											{
												alert("fail");
											}
											
										}
									});
								}
							});
						}
					});			
				}
				else 
				{
					alert("fejl");
				}
			},
			error: function()
			{
				alertCrveni("Neuspesno uklanjanje itema iz korpe - SERVER!");
			}
		});
	});
//******************************DODAVANJE KUPOVINE***********************************************************	
	$(document).on('click', '#buyCart', function()
	{
		var odabranDostavljac = $('#delivererSelect option:selected').attr('id');
		console.log("odabran dostavljac ima id: " + odabranDostavljac);
		//$('#sredina').html("");
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/kupovine/dodavanje/'+ odabranDostavljac,
			dataType: 'text',
			success: function(data)
			{
				alertZeleni(data);
				$('#sredina').load("stanjeKorpePrikaz.html");
				
			},
			error: function()
			{
				alertCrveni("Greska na serveru prilikom kupovine korpe!")
			}
		});
	});
//******************************DODAVANJE PROIZVODA U KORPU***********************************************************	
	$(document).on('click', "a[name='addToCart']", function()
	{
		var productId = $(this).attr("id");
		
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/prodavnice/aktivna',
			dataType: 'json',
			success: function(data)
			{
				var storeId = data.sifra;
				console.log("aktivna prodavnica: " +  storeId + " , a proizvod: " + productId);
				
				$.ajax
				({
					type: 'GET',
					url: 'rest/servis/prodavnice/'+storeId+'/proizvodi/'+productId,
					dataType: 'json',
					success: function(data2)
					{
						console.log("pronadjen proizvod: " + data2.naziv + " ,sa kolicinom: " + data2.kolicinaUMagacinu);
						var staraKolicina = parseFloat(data2.kolicinaUMagacinu);
						var novaKolicina = staraKolicina - 1;
						console.log("stara kolicina: " + staraKolicina + ", nova kolicina: " + novaKolicina);
						if(novaKolicina < 1)
						{
							alertCrveni("Nema vise proizvoda na stanju!");
						}
					else
					{
						var name = data2.naziv;
						var productId2 = productId; 
						var color = data2.boja; 
						var dimension = data2.dimenzija; 
						var weight = data2.tezina; 
						var madeBy = data2.zemljaProizvodnje; 
						var makerName = data2.nazivProizvodjaca; 
						var price = data2.jedinicnaCena; 
						var category = data2.kategorijaProizvoda;
						var description = data2.opis; 
						var amount = novaKolicina;
						var storeId2 = storeId;
						var picture = data2.slika;
						
						$.ajax
						({
							type: 'POST',
							url: 'rest/servis/prodavnice/'+storeId+'/proizvodi/izmena/'+productId,
							contentType: 'application/json',
							dataType: 'text',
							data: JSON.stringify
							({
								"naziv" : name,
								"sifra" : productId2,
								"boja" : color,
								"dimenzija" : dimension,
								"tezina" : weight,
								"zemljaProizvodnje" : madeBy,
								"nazivProizvodjaca" : makerName,
								"jedinicnaCena" : price,
								"kategorijaProizvoda" : category,
								"opis" : description,
								"kolicinaUMagacinu" : amount,
								"slika" : picture,
								"prodavnica" : storeId2,
							}),
							success: function(data3)
							{
								if(data3 == "okej")
								{
									$.ajax
									({
										type: 'POST',
										url: 'rest/servis/korpa/dodavanje',
										contentType: 'application/json',
										dataType: 'text',
										data: JSON.stringify
										({
											"naziv" : name,
											"sifra" : productId2,
											"boja" : color,
											"dimenzija" : dimension,
											"tezina" : weight,
											"zemljaProizvodnje" : madeBy,
											"nazivProizvodjaca" : makerName,
											"jedinicnaCena" : price,
											"kategorijaProizvoda" : category,
											"opis" : description,
											"kolicinaUMagacinu" : amount,
											"slika" : picture,
											"prodavnica" : storeId2,
										}),
										success: function(data4)
										{
											alertZeleni("Uspesno smesteno na listu korpe");
										}
									});
								}
								
							}
						});
					}
				   }
				});
			}
		});
		
	});

});