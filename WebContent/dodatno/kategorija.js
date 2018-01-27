$(document).ready(function(){ refreshStranice();

//******************************NOVA KATEGORIJA FORMA***********************************************************
	$(document).on('click', '#addKategorija', function()
	{
		$('#storeNavTulbar').hide();
		$('#sredina').load("novaKategorijaForma.html");
		
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/kategorije',
			dataType: 'json',
			success: function(data)
			{
				var list = data == null ? [] : (data instanceof Array ? data : [ data ]);
				$.each(list, function(index, kategorije) 
				{
					$('#upcategorySelect').append("<option>"+kategorije.naziv+"</option>");
				});
			},
			error: function()
			{
				alert("FEJL KOD SERVERA DODAVANJE RADNJE");
			}
		});
	});
	
	
	//******************************NOVA KATEGORIJA REGISTROVANJE***********************************************************	
	$(document).on('click', '#addCategory', function()
	{
		var name = $('#name').val();
		var description = $('#description').val();
		var upcategory = $("#upcategorySelect option:selected").text();
		
		$.ajax
		({
			type: 'POST',
			url: 'rest/servis/regCategory',
			contentType: 'application/json',
			dataType: 'text',
			data: JSON.stringify
			({
				"naziv" : name,
				"opis" : description,
				"nadkategorija" : upcategory,
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
					alertCrveni("Kategorija vec postoji!")
				}
				else
				{
					alertCrveni("Doslo je do greske prilikom dodavanja nove kategorije!")
				}
			},
			error: function()
			{
				
			}
		});
	});
	
	//******************************PRIKAZ KATEGORIJE***********************************************************
	$('#navTulbar').on('click', "#sveKategorije", function()
	{	
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/kategorije',
			dataType: 'json',
			success: function(data)
			{
				var list = data == null ? [] : (data instanceof Array ? data : [ data ]);
				$('#storeNavTulbar').hide();
				$('#sredina').load("kategorijePrikaz.html", function() 
						{$.each(list, function(index, kategorije) 
						{
					        //var forma = $('<form method="get" class="productsform" action="ShoppingCartServlet"></form>');
					        var tr = $('<tr></tr>');
					        tr.append('<td>' + kategorije.naziv + '</td>' +
					                '<td>' + kategorije.opis + '</td>' +
					                '<td>' + kategorije.nadkategorija + '</td>' +
					                '<td><button name="delCategory" id=\"' +kategorije.naziv + ' \"class=\"btn btn-default\">Obrisi</button></td>' +
					                '<td><button name="editCategory" id=\"' +kategorije.naziv + ' \"class=\"btn btn-default\">Izmeni</button></td>' );
					        $('#kategorijaTabela').append(tr);
						});});
			},
			error: function()
			{
				alert("NEUSPESNO POKPLJENI PODACI SA SERVERA DOSTAVLJACI!");
			}
		});
	});
	
	//******************************IZMENA KATEGORIJE***********************************************************
	$(document).on('click', "button[name = 'editCategory']", function()
	{
		var id = $(this).attr("id");
		console.log("pre ajax za izmenu prodavnice " + id );
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/kategorije/izmena/' + id,
			dataType: 'json',
			success: function(data)
			{
				$('#sredina').load("novaKategorijaForma.html", function()
				{
							
//							$('#addCategory').html("<span id=\"ikonica\" class=\"glyphicon glyphicon-floppy-disk\" aria-hidden=\"true\"></span>Sacuvaj izmene");
							$('#addCategory').hide();
							$('#dugme').append("<tr><td><button  id=\"changeCategory\" class=\"btn btn-primary btn-lg\"  style=\"width: 181px;  \"> <span id=\"ikonica\" class=\"glyphicon glyphicon-floppy-disk\" aria-hidden=\"true\"></span>Sacuvaj izmene</button></td></tr>");
							$('#name').prop('disabled', true);
							$('#name').val(data.naziv);
							$('#description').val(data.opis);
							
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
										$('#upcategorySelect').append("<option>"+kategorija.naziv+"</option>");
									});
									$('#upcategorySelect option:contains("'+data.nadkategorija+'")').attr("selected","selected"); 
								},
								error: function()
								{
									alert("FEJL KOD SERVERA DODAVANJE RADNJE");
								}
							});
							
							$(document).on('click','#changeCategory', function()
							{
								var name = $('#name').val();
								var description = $('#description').val();
								var upcategory = $("#upcategorySelect option:selected").text();
								
								$.ajax
								({
									type: 'GET',
									url: 'rest/servis/kategorije/brisanje/' + name ,
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
									url: 'rest/servis/regCategory',
									contentType: 'application/json',
									dataType: 'text',
									data: JSON.stringify
									({
										"naziv" : name,
										"opis" : description,
										"nadkategorija" : upcategory,
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
											alertCrveni("Kategorija vec postoji!")
										}
										else
										{
											alertCrveni("Doslo je do greske prilikom dodavanja nove kategorije!")
										}
									},
									error: function()
									{
										
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
	
	//******************************BRISANJE KATEGORIJE***********************************************************
	$(document).on('click', "button[name = 'delCategory']", function()
	{
		var id = $(this).attr("id");
		console.log("pre ajaxa za delete kategorije" + id);
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/kategorije/brisanje/' + id ,
			dataType: 'text',
			success: function(data)
			{
				$.ajax
				({
					type: 'GET',
					url: 'rest/servis/kategorije',
					dataType: 'json',
					success: function(data)
					{
						var list = data == null ? [] : (data instanceof Array ? data : [ data ]);
						$('#storeNavTulbar').hide();
						$('#sredina').load("kategorijePrikaz.html", function() 
								{$.each(list, function(index, kategorije) 
								{
							        //var forma = $('<form method="get" class="productsform" action="ShoppingCartServlet"></form>');
							        var tr = $('<tr></tr>');
							        tr.append('<td>' + kategorije.naziv + '</td>' +
							                '<td>' + kategorije.opis + '</td>' +
							                '<td>' + kategorije.nadkategorija + '</td>' +
							                '<td><button name="delCategory" id=\"' +kategorije.naziv + ' \"class=\"btn btn-default\">Obrisi</button></td>' +
							                '<td><button name="editCategory" id=\"' +kategorije.naziv + ' \"class=\"btn btn-default\">Izmeni</button></td>' );
							        $('#kategorijaTabela').append(tr);
								});});
					},
					error: function()
					{
						alert("NEUSPESNO POKPLJENI PODACI SA SERVERA KATEGORIJA!");
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