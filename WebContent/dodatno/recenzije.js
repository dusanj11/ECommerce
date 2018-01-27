$(document).ready(function(){ refreshStranice();

//******************************BRISANJE RECENZIJE***********************************************************
	$(document).on('click', "button[name='delComment']",function()
	{
		var recenzijaId = $(this).attr("id");
		$('#sredina').html("");
		$.ajax
		({
			type: 'GET',
			url:'rest/servis/proizvod/recenzije/brisanje/'+recenzijaId,
			dataType: 'json',
			success: function(data11)
			{
				var productId = data11;
				
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
							url: 'rest/servis/prodavnice/' + storeId + '/proizvodi/'+productId,
							dataType: 'json',
							success: function(data)
							{
								console.log("prodavnica koju je treba da prepozna: " + storeId+" "+storeName+ " i proizvod: " + productId);
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
												url: 'rest/servis/proizvod/'+productId+'/recenzije',
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
			}
		});
	});

//******************************NOVA RECENZIJA FORMA***********************************************************
	$(document).on('click', "button[name = 'commentProduct']", function()
	{
		var productId = $(this).attr("id");
		console.log("product id pre forme: " + productId);
		$('#sredina').load("novaRecenzijaOcenaForma.html", function()
				{
					$("button[name='newComment']").attr("id", productId);
				});
	});
	
//******************************DODAVANJE RECENZIJE***********************************************************
	$(document).on('click', "button[name='newComment']", function()
	{
		var productId = $(this).attr("id");
		console.log("product id posle forme: " + productId);
		
		var komentar = $('#commentArea').val()
		var ocena = $("#ocenaSelect option:selected").text();
		
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/sesija',
			dataType: 'json',
			success: function(data3)
			{
				var userId = data3.korisnickoIme;
				$.ajax
				({
					type: 'POST',
					url: 'rest/servis/proizvod/'+productId+'/recenzije/dodavanje/'+userId,
					contentType: 'application/json',
					dataType: 'text',
					data: JSON.stringify
					({
						"komentar" : komentar,
						"ocena" : ocena,
						"sifraProizvoda" : productId,
					}),
					success: function(data)
					{
						if(data == "okej")
						{
							$('#sredina').html("");
							alertZeleni("Recenzija uspesno postavljena!");
						}
						else if(data == "vecPostojiRecenzija")
						{
							alertCrveni("Vec ste dali recenziju ovom proizvodu!");
						}
						else
						{
							alertCrveni("Nepoznata greska!");
						}
						
					},
					error: function()
					{
						alertCrveni("Neuspelo postavljanje recenzije - server greska!");
					}
				});
			}
		});
	
	});

});