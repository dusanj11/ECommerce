$(document).ready(function(){ refreshStranice();

//******************************NOVI PROIZVOD FORMA***********************************************************
	$(document).on('click',"#novProizvod", function(){
		$('#sredina').after(function()
		{
//			$('#sredina').append("<div class=\"col-sm-6 col-md-4\"><div class=\"thumbnail\">"+
//	      "<img src=\"...\" alt=\"...\">"+
//	      "<div class=\"caption\">"+
//	        "<h3>Thumbnail label</h3>"+
//	        "<p>...</p>"+
//	        "<p><a href=\"#\" class=\"btn btn-primary\" role=\"button\">Button</a> <a href=\"#\" class=\"btn btn-default\" role=\"button\">Button</a></p>"+
//	      "</div>"+
	// "</div></div>");
			
			$('#sredina').load("novProizvodForma.html", function()
					{
						$('#addProduct').attr("name", $('#novProizvod').attr("name"));
						
						$.ajax
						({
							type: 'GET',
							url: 'rest/servis/kategorije',
							dataType: 'json',
							success: function(data2)
							{
								var list = data2 == null ? [] : (data2 instanceof Array ? data2 : [ data2 ]);
								$.each(list, function(index, kategorija) 
								{
									$('#categorySelect').append("<option>"+kategorija.naziv+"</option>");
								});
//								$('#categorySelect option:contains("'+data.nadkategorija+'")').attr("selected","selected"); 
							},
							error: function()
							{
								alert("FEJL KOD SERVERA DODAVANJE RADNJE");
							}
						});
					});
		});
	});

//******************************NOVI PROIZVOD REGISTROVANJE***********************************************************	
	$(document).on('click', '#addProduct', function()
	{
		var name = $('#name').val();
		var productId = $('#productId').val(); 
		var color = $('#color').val(); 
		var dimension = $('#dimension').val(); 
		var weight = $('#weight').val(); 
		var madeBy = $('#madeBy').val(); 
		var makerName = $('#makerName').val(); 
		var price = $('#price').val(); 
		var category = $("#categorySelect option:selected").text();
		var description = $('#description').val(); 
		var amount = $('#amount').val(); 
		var picture = $('#picture').get(0).files[0];
		var storeId = $('#addProduct').attr("name");
		
		var formData = new FormData();
		
		
		$.ajax
		({
			type: 'POST',
			url: 'rest/servis/proizvodi',
			contentType: 'application/json',
			dataType: 'text',
			data: JSON.stringify
			({
				"naziv" : name,
				"sifra" : productId,
				"boja" : color,
				"dimenzija" : dimension,
				"tezina" : weight,
				"zemljaProizvodnje" : madeBy,
				"nazivProizvodjaca" : makerName,
				"jedinicnaCena" : price,
				"kategorijaProizvoda" : category,
				"slika" : picture.name,
				"opis" : description,
				"kolicinaUMagacinu" : amount,
				"prodavnica" : storeId,
			}),
			success: function(data)
			{
				if(data == "ok")
				{
					formData.append('file', picture);
					$.ajax({
					  url : 'rest/servis/upload',
					  type : 'POST',
					  data : formData,
					  cache : false,
					  contentType : false,
					  processData : false,
					  success : function(data) 
					  {
					    //alert("SLICICA ONLINE");
					  },
					  error : function() 
					  {
					    alert("FEJL BRO FEJL");
					  }
					});
					
					alertZeleni("Uspesno dodat proizvod!");
					$('#tabelaNovaProdavnica').hide();
//					$('#prodavciDDul').append("<li role=\"separator\" class=\"divider\"></li>");
//					$('#prodavciDDul').append("<li><a id=\"sviProdavci\" href=\"#\">Nova prodavnica</a></li>");
					
					
				}
				else if(data == "praznaPolja")
				{
					alertCrveni("Popunite sva polja!");
				}
				else if(data == "unesiteBroj")
				{
					alertCrveni("Unesite brojcane vrednosti u polja koja semanticki to zahtevaju!");
				}
				else if(data == "vecPostoji")
				{
					alertCrveni("Proizvod vec postoji!")
				}
				else
				{
					alertCrveni("Doslo je do greske prilikom dodavanja novog proizvoda!")
				}
			},
			error: function()
			{
				alert("FAIL");
			}
			
		});
		
//		$('#sredina').append("<div class=\"col-sm-6 col-md-4\"><div class=\"thumbnail\">"+
//			      "<img src=\"" + "multimedia/" + picture.name+"\" alt=\"slicica\">"+
//			      "<div class=\"caption\">"+
//			        "<h3>Thumbnail label</h3>"+
//			        "<p>PROBA</p>"+
//			        "<p><a href=\"#\" class=\"btn btn-primary\" role=\"button\">Button</a> <a href=\"#\" class=\"btn btn-default\" role=\"button\">Button</a></p>"+
//			      "</div>"+
//			 "</div></div>");
	});
	
	//******************************IZMENA PROIZVODA IZ AKTIVNE PRODAVNICE***********************************************************
	$(document).on('click', "button[name = 'editProduct']", function()
	{
		var id = $(this).attr("id");
		var storeId;
		var storeName;
		console.log("id proizvoda za izmenu: " + id);
		
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/prodavnice/aktivna',
			dataType: 'json',
			success: function(data0)
			{
				storeId = data0.sifra;
				storeName = data0.naziv;
				console.log("aktivna prodavnica je: " + storeName +" sa sifrom: " + storeId);
				
				$.ajax
				({
					type: 'GET',
					url: 'rest/servis/prodavnice/' + storeId + '/proizvodi/'+id,
					dataType: 'json',
					success: function(data)
					{
						console.log("prodavnica koju je treba da prepozna: " + storeId+" "+storeName+ " i proizvod: " + id);
						console.log("Proizvod " + data.sifra+" "+data.naziv + ", a prepoznao je prodavnicu: " + data.prodavnica);
						
						
						$('#sredina').load("novProizvodForma.html", function()
							{
									$('#addProduct').hide();
									$('#dugme').append("<tr><td><button  id=\"changeProduct\" class=\"btn btn-primary btn-lg\"  style=\"width: 181px;  \"> <span id=\"ikonica\" class=\"glyphicon glyphicon-floppy-disk\" aria-hidden=\"true\"></span>Sacuvaj izmene</button></td></tr>");							
									$('#productId').prop('disabled', true);
									$('#name').val(data.naziv);
									$('#productId').val(data.sifra); 
									$('#color').val(data.boja); 
									$('#dimension').val(data.dimenzija); 
									$('#weight').val(data.tezina); 
									$('#madeBy').val(data.zemljaProizvodnje); 
									$('#makerName').val(data.nazivProizvodjaca); 
									$('#price').val(data.jedinicnaCena);  
									$('#description').val(data.opis); 
									$('#amount').val(data.kolicinaUMagacinu); 
									
									$.ajax
									({
										type: 'GET',
										url: 'rest/servis/kategorije',
										dataType: 'json',
										success: function(data2)
										{
											var list = data2 == null ? [] : (data2 instanceof Array ? data2 : [ data2 ]);
											$.each(list, function(index, kategorija) 
											{
												$('#categorySelect').append("<option>"+kategorija.naziv+"</option>");
											});
											$('#categorySelect option:contains("'+data.kategorijaProizvoda+'")').attr("selected","selected"); 
										},
										error: function()
										{
											alert("FEJL KOD SERVERA DODAVANJE RADNJE");
										}
									});
									//var staraSlika = data.slika;
									
									$(document).one('click','#changeProduct', function()
									{
										 	 
												var name = $('#name').val();
												var productId = $('#productId').val(); 
												var color = $('#color').val(); 
												var dimension = $('#dimension').val(); 
												var weight = $('#weight').val(); 
												var madeBy = $('#madeBy').val(); 
												var makerName = $('#makerName').val(); 
												var price = $('#price').val(); 
												var category = $("#categorySelect option:selected").text(); 
												var description = $('#description').val(); 
												var amount = $('#amount').val();

												var picture = $('#picture').get(0).files[0];
												var pictureProvera;
												var formData = new FormData();
												
												if(picture === undefined)
													pictureProvera = "";
												else 
													pictureProvera = picture.name;
												
												$.ajax
												({
													type: 'POST',
													url: 'rest/servis/prodavnice/'+storeId+'/proizvodi/izmena/'+productId,
													contentType: 'application/json',
													dataType: 'text',
													data: JSON.stringify
													({
														"naziv" : name,
														"sifra" : productId,
														"boja" : color,
														"dimenzija" : dimension,
														"tezina" : weight,
														"zemljaProizvodnje" : madeBy,
														"nazivProizvodjaca" : makerName,
														"jedinicnaCena" : price,
														"kategorijaProizvoda" : category,
														"slika" : pictureProvera,
														"opis" : description,
														"kolicinaUMagacinu" : amount,
													}),
													success: function(data3)
													{
														if(data3 == "okej")
														{
															if(pictureProvera != "")
															{
																console.log("MOMENAT PRE POZIVA ZA SER SLIKE: " +pictureProvera + " " + picture);
																formData.append('file', picture);
																$.ajax({
																	url : 'rest/servis/upload',
																	type : 'POST',
																	data : formData,
																	cache : false,
																	contentType : false,
																	processData : false,
																	success : function(data4) 
																	{
																		//alert("SLICICA ONLINE");
																	},
																	error : function() 
																	{
																		alert("FEJL BRO FEJL");
																	}
																});
															}
															
															alertZeleni("Uspesno izmenjen proizvod!");
															$('#tabelaNovaProdavnica').hide();
//															location.reload();
//															$('#storeNavTulbarDiv').show();
//															$('#prodavciDDul').append("<li role=\"separator\" class=\"divider\"></li>");
//															$('#prodavciDDul').append("<li><a id=\"sviProdavci\" href=\"#\">Nova prodavnica</a></li>");
															
															
														}
														else if(data3 == "notokej")
														{
															alertCrveni("Proizvod za izmenu nije pronadjen na serveru!");
														}
														else if(data3 == "praznaPolja")
														{
															alertCrveni("Popunite sva polja!");
														}
														else if(data3 == "unesiteBroj")
														{
															alertCrveni("Unesite brojcane vrednosti u polja koja to semanticki zahtevaju!");
														}
														else
														{
															alertCrveni("Doslo je do greske prilikom izmene proizvoda!")
														}
													},
													error: function()
													{
														alert("FAIL");
													}
													
												});
									});
							});
					},
					error: function()
					{
						alertCrveni("NEUSPESNO UZIMANJE INFORMACIJA O PROIZVODU ZA IZMENU U  AKTIVNOJ PRODAVNICI");
					}
				});
				
				
			},
			error: function()
			{
				alertCrveni("NEUSPESNO UZIMANJE INFORMACIJA O AKTIVNOJ PRODAVNICI");
			}
		});
		
		
		
//		$.ajax
//		({
//			type: 'GET',
//			url: 'rest/servis/prodavnice/aktivna',
//			dataType: 'json',
//			success: function(data0)
//			{
//				var storeId = data0.sifra;
//				
//				$.ajax
//				({
//					type: 'GET',
//					url: 'rest/servis/prodavnice/'+storeId+'/proizvodi/'+id,
//					dataType: 'json',
//					success: function(data)
//					{
//						$('#sredina').load("novProizvodForma.html", function()
//						{
//							$('#addProduct').hide();
//							$('#dugme').append("<tr><td><button  id=\"changeProduct\" class=\"btn btn-primary btn-lg\"  style=\"width: 181px;  \"> <span id=\"ikonica\" class=\"glyphicon glyphicon-floppy-disk\" aria-hidden=\"true\"></span>Sacuvaj izmene</button></td></tr>");							
//							$('#productId').prop('disabled', true);
//							$('#name').val(data.naziv);
//							$('#productId').val(data.sifra); 
//							$('#color').val(data.boja); 
//							$('#dimension').val(data.dimenzija); 
//							$('#weight').val(data.tezina); 
//							$('#madeBy').val(data.zemljaProizvodnje); 
//							$('#makerName').val(data.nazivProizvodjaca); 
//							$('#price').val(data.jedinicnaCena); 
//							$('#category').val(data.kategorijaProizvoda); 
//							$('#description').val(data.opis); 
//							$('#amount').val(data.kolicinaUMagacinu); 
//							//$('#picture').text(data.slika);
//							
//							$(document).on('click','#changeProduct', function()
//							{
//								var name = $('#name').val();
//								var productId = $('#productId').val(); 
//								var color = $('#color').val(); 
//								var dimension = $('#dimension').val(); 
//								var weight = $('#weight').val(); 
//								var madeBy = $('#madeBy').val(); 
//								var makerName = $('#makerName').val(); 
//								var price = $('#price').val(); 
//								var category = $('#category').val(); 
//								var description = $('#description').val(); 
//								var amount = $('#amount').val(); 
//								
//								//var picture = $('#picture').get(0).files[0];
//										
////										$.ajax
////										({
////											type: 'GET',
////											url: 'rest/servis/prodavnice/'+storeId+'/proizvodi/brisanje/'+id,
////											dataType: 'text',
////											success: function(data2)
////											{
////												//alert("USPESNO OBRISAN " + productId);
////												
////												
////											},
////											error: function()
////											{
////												alert("GRESKA KOD SERVERA PRILIKOM BRISANJA PROIZVODA");
////											}
////										});
//										
//										$.ajax
//										({
//											type: 'POST',
//											url: 'rest/servis/prodavnice/'+storeId+'/proizvodi/izmena/'+id,
//											contentType: 'application/json',
//											dataType: 'text',
//											data: JSON.stringify
//											({
//												"naziv" : name,
//												"sifra" : productId,
//												"boja" : color,
//												"dimenzija" : dimension,
//												"tezina" : weight,
//												"zemljaProizvodnje" : madeBy,
//												"nazivProizvodjaca" : makerName,
//												"jedinicnaCena" : price,
//												"kategorijaProizvoda" : category,
//												"slika" : picture.name,
//												"opis" : description,
//												"kolicinaUMagacinu" : amount,
//											}),
//											success: function(data3)
//											{
//												if(data3 == "okej")
//												{
////													formData.append('file', picture);
////													$.ajax({
////													  url : 'rest/servis/upload',
////													  type : 'POST',
////													  data : formData,
////													  cache : false,
////													  contentType : false,
////													  processData : false,
////													  success : function(data) 
////													  {
////													    //alert("SLICICA ONLINE");
////													  },
////													  error : function() 
////													  {
////													    alert("FEJL BRO FEJL");
////													  }
////													});
//													
//													alertZeleni("Uspesno dodat proizvod!");
//													$('#tabelaNovaProdavnica').hide();
////													location.reload();
////													$('#storeNavTulbarDiv').show();
////													$('#prodavciDDul').append("<li role=\"separator\" class=\"divider\"></li>");
////													$('#prodavciDDul').append("<li><a id=\"sviProdavci\" href=\"#\">Nova prodavnica</a></li>");
//													
//													
//												}
//												else if(data3 == "praznaPolja")
//												{
//													alertCrveni("Popunite sva polja!");
//												}
//												else if(data3 == "vecPostoji")
//												{
//													alertCrveni("Proizvod vec postoji!")
//												}
//												else
//												{
//													alertCrveni("Doslo je do greske prilikom dodavanja novog proizvoda!")
//												}
//											},
//											error: function()
//											{
//												alert("FAIL");
//											}
//											
//										});
//							});
//							
//						});
//					},
//					error: function()
//					{
//						
//					}
//				});
//			},
//			error: function()
//			{
//				alert("NEUSPESNO POKUPLJENA AKTINVA PRODAVNICA SA SERVERA");
//			}
//		});
	});
	
	//******************************BRISANJE PROIZVODA IZ AKTIVNE PRODAVNICE***********************************************************
	$(document).on('click', "a[name = 'delProduct']", function()
	{
		var id = $(this).attr("id");

		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/prodavnice/aktivna',
			dataType: 'json',
			success: function(data)
			{
				var storeId = data.sifra;
				console.log("aktivna prodavnica je: " + storeId);
				
				$.ajax
				({
					type: 'GET',
					url: 'rest/servis/prodavnice/'+storeId+'/proizvodi/brisanje/'+id,
					dataType: 'text',
					success: function(data)
					{
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
									$('#sredina').append("<div style=\" max-width:250px; max-height:600px;\" class=\"col-sm-6 col-md-4\"><div style=\"max-width:250px; max-height:600px;\" class=\"thumbnail\">"+
									      "<img style=\" max-width:150px; max-height:150px;\"src=\"" + "multimedia/" + proizvod.slika+"\" alt=\"slicica\">"+
									      "<div style=\" max-width:250px; max-height:200px;\"class=\"caption\">"+
									        "<h3 style=\"font-size: 17px; \">" + proizvod.naziv + " rsd</h3>"+
									        "<h2 style=\"font-size: 17px; \">" + proizvod.jedinicnaCena + "</h2>"+
									        "<p><a href=\"#\" name=\"delProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-primary\" role=\"button\">Obrisi</a> " +
									        "<a href=\"#\" name=\"editProduct\" id=\"" +proizvod.sifra+ " \"class=\"btn btn-default\" role=\"button\">Izmeni podatke</a></p>"+
									      "</div>"+
									 "</div></div>");
								});
							},
							error: function()
							{
								alert("nisi uspeo pokupiti sve prodavnice");
							}
						});
					},
					error: function()
					{
						alert("GRESKA KOD SERVERA PRILIKOM BRISANJA PROIZVODA");
					}
				});
				
			},
			error: function()
			{
				alertCrveni("NEUSPESNO PREUZIMANJE AKTIVNE PRODAVNICE");
			}
		});
		
	});
	
	//******************************DETALJJI PROIZVODA ***********************************************************
	$(document).on('click', "button[name = 'detailProduct']",function()
	{
		var id = $(this).attr("id");
		var storeId;
		var storeName;
		console.log("id proizvoda za izmenu: " + id);
		
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/prodavnice/aktivna',
			dataType: 'json',
			success: function(data0)
			{
				storeId = data0.sifra;
				storeName = data0.naziv;
				console.log("aktivna prodavnica je: " + storeName +" sa sifrom: " + storeId);
				
				$.ajax
				({
					type: 'GET',
					url: 'rest/servis/prodavnice/' + storeId + '/proizvodi/'+id,
					dataType: 'json',
					success: function(data)
					{
						console.log("prodavnica koju je treba da prepozna: " + storeId+" "+storeName+ " i proizvod: " + id);
						console.log("Proizvod " + data.sifra+" "+data.naziv + ", a prepoznao je prodavnicu: " + data.prodavnica);
						
						
						$('#sredina').load("novProizvodForma.html", function()
							{
									$('#addProduct').hide();
									$('#redSlika').hide();
									//$('#dugme').append("<tr><td><button  id=\"changeProduct\" class=\"btn btn-primary btn-lg\"  style=\"width: 181px;  \"> <span id=\"ikonica\" class=\"glyphicon glyphicon-floppy-disk\" aria-hidden=\"true\"></span>Sacuvaj izmene</button></td></tr>");							
									$('#productId').prop('disabled', true);
									$('#name').prop('disabled', true);
									$('#color').prop('disabled', true);
									$('#dimension').prop('disabled', true);
									$('#weight').prop('disabled', true);
									$('#madeBy').prop('disabled', true);
									$('#makerName').prop('disabled', true);
									$('#price').prop('disabled', true);
									$('#description').prop('disabled', true);
									$('#amount').prop('disabled', true);
									
									$('#name').val(data.naziv);
									$('#productId').val(data.sifra); 
									$('#color').val(data.boja); 
									$('#dimension').val(data.dimenzija); 
									$('#weight').val(data.tezina); 
									$('#madeBy').val(data.zemljaProizvodnje); 
									$('#makerName').val(data.nazivProizvodjaca); 
									$('#price').val(data.jedinicnaCena);  
									$('#description').val(data.opis); 
									$('#amount').val(data.kolicinaUMagacinu); 
									
									$.ajax
									({
										type: 'GET',
										url: 'rest/servis/kategorije',
										dataType: 'json',
										success: function(data2)
										{
											var list = data2 == null ? [] : (data2 instanceof Array ? data2 : [ data2 ]);
											$.each(list, function(index, kategorija) 
											{
												$('#categorySelect').append("<option>"+kategorija.naziv+"</option>");
											});
											$('#categorySelect option:contains("'+data.kategorijaProizvoda+'")').attr("selected","selected"); 
											$('#categorySelect').prop('disabled', true);
										},
										error: function()
										{
											alert("FEJL KOD SERVERA DODAVANJE RADNJE");
										}
									});
									
									$.ajax
									({
										type: 'GET',
										url: 'rest/servis/proizvod/'+id+'/recenzije',
										dataType: 'json',
										success: function(data7)
										{
											$.ajax
											({
												type: 'GET',
												url: 'rest/servis/sesija',
												dataType: 'json',
												success: function(data)
												{
													var userId = data.korisnickoIme;
													
													$('#sredina').append("<table style=\"font-size:	10px; \"id=\"korisnikTabela\" class=\"table\"><tr>"+
										    		"<th> Korisnicko ime recenzenta</th><th> Ocena </th><th> Recenzija </th></tr></table>");
													
													var list = data7 == null ? [] : (data7 instanceof Array ? data7 : [ data7 ]);
													$.each(list, function(index, recenzija) 
													{
														if(recenzija.korisnik == userId)
														{
															 var tr = $('<tr></tr>');
														        tr.append('<td>' + recenzija.korisnik + '</td>' +
														                '<td>' + recenzija.ocena + '</td>' +
														                '<td>' + recenzija.komentar + '</td>' +
														                '<td><button name="delComment" id=\"' +recenzija.sifra+ ' \"class=\"btn btn-default\">Obrisi</button></td>');
														        $('#korisnikTabela').append(tr);
														}
														else
														{
															 var tr = $('<tr></tr>');
														        tr.append('<td>' + recenzija.korisnik + '</td>' +
														                '<td>' + recenzija.ocena + '</td>' +
														                '<td>' + recenzija.komentar + '</td>' );
														        $('#korisnikTabela').append(tr);
														}
													});
												}
											});	
										}
									});
							});
					},
					error: function()
					{
						alertCrveni("NEUSPESNO UZIMANJE INFORMACIJA O PROIZVODU ZA IZMENU U  AKTIVNOJ PRODAVNICI");
					}
				});
				
				
			},
			error: function()
			{
				alertCrveni("NEUSPESNO UZIMANJE INFORMACIJA O AKTIVNOJ PRODAVNICI");
			}
		});
		
	});
	

});