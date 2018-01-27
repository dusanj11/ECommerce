$(document).ready(function(){ refreshStranice(); 

//******************************PRETRAGE PRODAVNICE***********************************************************
	$(document).on('click', '#searchStoreConfirm', function()
	{
		var srcin = $('#searchStoreInput').val();
		console.log("zelim pretrazivati po reci: " + srcin);
		
		
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/sesija',
			dataType: 'json',
			success: function(data)
			{
				var userUloga = data.uloga;
				
				$.ajax
				({
					type: 'GET',
					url:'rest/servis/prodavnice/pretraga/'+srcin,
					dataType: 'json',
					success: function(data2)
					{
						alertZeleni("Uspesno pronadjeno.");
						
						if(userUloga == "prodavac")
						{
							$('#storeNavTulbar').hide();
							$('#sredina').html("");
							var list = data2 == null ? [] : (data2 instanceof Array ? data2 : [ data2 ]);
							$.each(list, function(index, prodavnica) 
							{
								if(data.korisnickoIme == prodavnica.odgovorniProdavac)
								{
									$('#sredina').append("<li><a name=\"shop\" id=\""+prodavnica.sifra+"\" href=\"#\">" +prodavnica.naziv+"</a></li>");
								}
							});
						}
						else
						{
							$('#storeNavTulbar').hide();
							$('#sredina').html("");
							var list = data2 == null ? [] : (data2 instanceof Array ? data2 : [ data2 ]);
							$.each(list, function(index, prodavnica) 
							{
								$('#sredina').append("<li><a name=\"shop\" id=\""+prodavnica.sifra+"\" href=\"#\">" +prodavnica.naziv+"</a></li>");
							});
						}
					}
				});
			}
		});
		
	});

//******************************PRETRAGE PROIZVODA***********************************************************
	$(document).on('click', '#searchConfirm', function()
	{
		var srcin = $('#searchInput').val();
		console.log("zelim pretrazivati po reci: " + srcin);
		

			$.ajax
			({
				type: 'GET',
				url:'rest/servis/proizvodi/pretraga/'+srcin,
				dataType: 'json',
				success: function(data2)
				{
					alertZeleni("Uspesno pronadjeno.");
					
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
					alertCrveni("Neuspesna pretraga");
				}
					
			});	
	});
});

