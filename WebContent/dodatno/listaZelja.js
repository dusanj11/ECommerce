$(document).ready(function(){ refreshStranice();

//******************************DODAVANJE NA WISH LIST***********************************************************
	$(document).on('click', "button[name = 'wishProduct']",function()
	{
		var productId = $(this).attr("id");
		
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/prodavnice/aktivna',
			dataType: 'json',
			success: function(data0)
			{
				var storeId = data0.sifra;
				
				$.ajax
				({
					type: 'GET',
					url: 'rest/servis/prodavnice/'+storeId+'/proizvodi/'+productId,
					dataType: 'json',
					success: function(data2)
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
						var amount = data2.kolicinaUMagacinu; 
						var picture = data2.slika;
						var storeId2 = storeId;
						
						$.ajax
						({
							type: 'GET',
							url: 'rest/servis/sesija',
							dataType: 'json',
							success: function(data3)
							{
								var wishUser = data3.korisnickoIme;
								$.ajax
								({
									type: 'POST',
									url: 'rest/servis/wishList/dodavanje',
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
										"slika" : picture,
										"opis" : description,
										"kolicinaUMagacinu" : amount,
										"prodavnica" : storeId2,
										"wishKorisnik" : wishUser,
									}),
									success: function(data4)
									{
										if(data4 == "okej" )
											alertZeleni("Artikal uspesno dodat u listu zelja!");
										else if( data4 == "vecPostoji")
											alertCrveni("Artikal vec postoji na listi zelja!");
										else
											alertCrveni("nepoznata greska");
									},
									error: function()
									{
										alertCrveni("Neuspesno dodavanje na listu zelja. Greska na serveru!");
									}
								});
								
							}
						});

					}
				});
			
			}
		});
		
	});
	
//******************************UKLANJANJE ARTIKLA IZ LISTE ZELJA***********************************************************
	$(document).on('click',  "button[name = 'delWishProduct']", function()
	{
		var productId = $(this).attr("id");
		
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/prodavnice/aktivna',
			dataType: 'json',
			success: function(data0)
			{
				var storeId = data0.sifra;
				
				$.ajax
				({
					type: 'GET',
					url: 'rest/servis/prodavnice/'+storeId+'/proizvodi/'+productId,
					dataType: 'json',
					success: function(data2)
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
						var amount = data2.kolicinaUMagacinu; 
						var picture = data2.slika;
						var storeId2 = storeId;
						
						$.ajax
						({
							type: 'GET',
							url: 'rest/servis/sesija',
							dataType: 'json',
							success: function(data3)
							{
								var wishUser = data3.korisnickoIme;
								$.ajax
								({
									type: 'POST',
									url: 'rest/servis/wishList/uklanjanje',
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
										"slika" : picture,
										"opis" : description,
										"kolicinaUMagacinu" : amount,
										"prodavnica" : storeId2,
										"wishKorisnik" : wishUser,
									}),
									success: function(data4)
									{
										if(data4 == "okej" )
										{
											//alertZeleni("Artikal uspesno uklonjen iz liste zelja!");
											
											$.ajax
											({
												type: 'GET',
												url: 'rest/servis/sesija',
												dataType: 'json',
												success: function(data1)
												{
													var wishUser = data1.korisnickoIme;
													
													$.ajax
													({
														type: 'GET',
														url: 'rest/servis/wishList/' + wishUser,
														dataType: 'json',
														success: function(data2)
														{
															$('#sredina').html("");
															var list = data2 == null ? [] : (data2 instanceof Array ? data2 : [ data2 ]);
															$.each(list, function(index, proizvod) 
															{
																$('#sredina').append("<div style=\"font-size:	10px; max-width:250px; max-height:600px;\" class=\"col-sm-6 col-md-4\"><div style=\"max-width:250px; max-height:600px;\" class=\"thumbnail\">"+
																		"<img style=\" max-width:150px; max-height:150px;\"src=\"" + "multimedia/" + proizvod.slika+"\" alt=\"slicica\">"+
																		"<div style=\" max-width:300px; max-height:350px;\"class=\"caption\">"+
																		"<h3 style=\"font-size: 17px; \">" + proizvod.naziv + " </h3>"+
																		"<h2 style=\"font-size: 17px; \">" + proizvod.jedinicnaCena + " rsd</h2>"+
																		"<p><a href=\"#\" name=\"addToCartWish\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-primary\" role=\"button\">Stavi u korpu</a> " +
																		"<button name=\"detailProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\">Detalji proizvoda</button> "+
																		"<button name=\"delWishProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\">Ukloni iz liste zelja</button> "+
																		"<button name=\"commentProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\">Dodaj recenziju</button> "+
																		// "<a href=\"#\" name=\"editProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\" role=\"button\">Izmeni podatke</a></p>"+
																		"</div>"+
																"</div></div>");
																
															});
														}
													});
												}
											});
										}
										else
											alertCrveni("nepoznata greska");
									},
									error: function()
									{
										alertCrveni("Neuspesno dodavanje na listu zelja. Greska na serveru!");
									}
								});
								
							}
						});

					}
				});
			
			}
		});
	});
	
//******************************DODAVANJE U KORPU IZ LISTE ZELJA***********************************************************
	$(document).on('click', "a[name = 'addToCartWish']", function()
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
											//alertZeleni("Uspesno smesteno na listu korpe");
											
											$.ajax
											({
												type: 'GET',
												url: 'rest/servis/prodavnice/aktivna',
												dataType: 'json',
												success: function(data0)
												{
													var storeId = data0.sifra;
													
													$.ajax
													({
														type: 'GET',
														url: 'rest/servis/prodavnice/'+storeId+'/proizvodi/'+productId,
														dataType: 'json',
														success: function(data2)
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
															var amount = data2.kolicinaUMagacinu; 
															var picture = data2.slika;
															var storeId2 = storeId;
															
															$.ajax
															({
																type: 'GET',
																url: 'rest/servis/sesija',
																dataType: 'json',
																success: function(data3)
																{
																	var wishUser = data3.korisnickoIme;
																	$.ajax
																	({
																		type: 'POST',
																		url: 'rest/servis/wishList/uklanjanje',
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
																			"slika" : picture,
																			"opis" : description,
																			"kolicinaUMagacinu" : amount,
																			"prodavnica" : storeId2,
																			"wishKorisnik" : wishUser,
																		}),
																		success: function(data4)
																		{
																			if(data4 == "okej" )
																			{
																				//alertZeleni("Artikal uspesno uklonjen iz liste zelja!");
																				
																				$.ajax
																				({
																					type: 'GET',
																					url: 'rest/servis/sesija',
																					dataType: 'json',
																					success: function(data1)
																					{
																						var wishUser = data1.korisnickoIme;
																						
																						$.ajax
																						({
																							type: 'GET',
																							url: 'rest/servis/wishList/' + wishUser,
																							dataType: 'json',
																							success: function(data2)
																							{
																								$('#sredina').html("");
																								var list = data2 == null ? [] : (data2 instanceof Array ? data2 : [ data2 ]);
																								$.each(list, function(index, proizvod) 
																								{
																									$('#sredina').append("<div style=\"font-size:	10px; max-width:250px; max-height:600px;\" class=\"col-sm-6 col-md-4\"><div style=\"max-width:250px; max-height:600px;\" class=\"thumbnail\">"+
																											"<img style=\" max-width:150px; max-height:150px;\"src=\"" + "multimedia/" + proizvod.slika+"\" alt=\"slicica\">"+
																											"<div style=\" max-width:300px; max-height:350px;\"class=\"caption\">"+
																											"<h3 style=\"font-size: 17px; \">" + proizvod.naziv + " rsd</h3>"+
																											"<h2 style=\"font-size: 17px; \">" + proizvod.jedinicnaCena + " rsd</h2>"+
																											"<p><a href=\"#\" name=\"addToCartWish\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-primary\" role=\"button\">Stavi u korpu</a> " +
																											"<button name=\"detailProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\">Detalji proizvoda</button> "+
																											"<button name=\"delWishProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\">Ukloni iz liste zelja</button> "+
																											"<button name=\"commentProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\">Dodaj recenziju</button> "+
																											// "<a href=\"#\" name=\"editProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\" role=\"button\">Izmeni podatke</a></p>"+
																											"</div>"+
																									"</div></div>");
																									
																								});
																							}
																						});
																					}
																				});
																			}
																			else
																				alertCrveni("nepoznata greska");
																		},
																		error: function()
																		{
																			alertCrveni("Neuspesno dodavanje na listu zelja. Greska na serveru!");
																		}
																	});
																	
																}
															});

														}
													});
												
												}
											});
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
//******************************PRIKAZ LISTA ZELJE KUPCA***********************************************************
	$(document).on('click', '#wishList', function()
	{
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/sesija',
			dataType: 'json',
			success: function(data1)
			{
				var wishUser = data1.korisnickoIme;
				
				$.ajax
				({
					type: 'GET',
					url: 'rest/servis/wishList/' + wishUser,
					dataType: 'json',
					success: function(data2)
					{
						$('#sredina').html("");
						var list = data2 == null ? [] : (data2 instanceof Array ? data2 : [ data2 ]);
						$.each(list, function(index, proizvod) 
						{
							$('#sredina').append("<div style=\"font-size:	10px; max-width:250px; max-height:600px;\" class=\"col-sm-6 col-md-4\"><div style=\"max-width:250px; max-height:600px;\" class=\"thumbnail\">"+
									"<img style=\" max-width:150px; max-height:150px;\"src=\"" + "multimedia/" + proizvod.slika+"\" alt=\"slicica\">"+
									"<div style=\" max-width:300px; max-height:350px;\"class=\"caption\">"+
									"<h3 style=\"font-size: 17px; \">" + proizvod.naziv + " rsd</h3>"+
									"<h2 style=\"font-size: 17px; \">" + proizvod.jedinicnaCena + " rsd</h2>"+
									"<p><a href=\"#\" name=\"addToCartWish\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-primary\" role=\"button\">Stavi u korpu</a> " +
									"<button name=\"detailProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\">Detalji proizvoda</button> "+
									"<button name=\"delWishProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\">Ukloni iz liste zelja</button> "+
									"<button name=\"commentProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\">Dodaj recenziju</button> "+
									// "<a href=\"#\" name=\"editProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\" role=\"button\">Izmeni podatke</a></p>"+
									"</div>"+
							"</div></div>");
							
						});
					}
				});
			}
		});
		
	});

});