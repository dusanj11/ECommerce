$(document).ready(function(){ refreshStranice();


//******************************PRIKAZ KUPACA***********************************************************
	$('#navTulbar').on('click', "#sviKupci", function()
	{
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/kupci',
			dataType: 'json',
			success: function(data)
			{
				var list = data == null ? [] : (data instanceof Array ? data : [ data ]);
				$('#storeNavTulbar').hide();
				$('#sredina').load("korisnikPrikaz.html", function() 
				{$.each(list, function(index, korisnik) 
				{
			        //var forma = $('<form method="get" class="productsform" action="ShoppingCartServlet"></form>');
			        var tr = $('<tr></tr>');
			        tr.append('<td>' + korisnik.korisnickoIme + '</td>' +
			                '<td>' + korisnik.lozinka + '</td>' +
			                '<td>' + korisnik.ime + '</td>' +
			                '<td>' + korisnik.prezime + '</td>' +
			                '<td>' + korisnik.telefon + '</td>' +
			                '<td>' + korisnik.email + '</td>'+
			                '<td>' + korisnik.adresa + '</td>' +
			                '<td>' + korisnik.drzava + '</td>' +
			                '<td><button name="delBuyer" id=\"' +korisnik.korisnickoIme+ ' \"class=\"btn btn-default\">Obrisi</button></td>' +
			                '<td><button name="editBuyer" id=\"' +korisnik.korisnickoIme+ ' \"class=\"btn btn-default\">Izmeni</button></td>' );
			        $('#korisnikTabela').append(tr);
				});});
			},
			error:function()
			{
				
			}
		});
	});
	
	//******************************IZMENA KUPCA - CUVANJE IZMENA******************************************
	$(document).on('click', '#addBuyer', function()
			{
				var username3 = $('#username').val();
				var password3 = $('#password').val();
				var name = $('#name').val();
				var surname = $('#surname').val();
				var cnum = $('#cnum').val();
				var email = $('#email').val();
				var adress = $('#adress').val();
				var country = $('#country').val();
				
				$.ajax
				({
					type: 'GET',
					url: 'rest/servis/kupci/brisanje/' + username3 ,
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
					url: 'rest/servis/register',
					contentType: 'application/json',
					dataType: 'text',
					data: JSON.stringify
					({
						"korisnickoIme" : username3,
						"lozinka" : password3,
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
						{
							refreshStranice();
							alertZeleni("USPELO REGISTROVANJE/MENJANJE PRODAVCA/KUPCA");
						}
						else if(data == "postojiVec")
							alertCrveni("Korisnicko ime vec postoji! Unesite drugo korisnciko ime.");
						else if(data == "praznaPolja")
							alertCrveni("Popunite sva polja!");
						else
							alertCrveni("Nepoznata greska se desila!");
					},
					error: function()
					{
						alertCrveni("NEUSPESNO REGISTROVANJE GRESKA NA SERVERU PRODAVNICA");
					}
					
				});
			});
//******************************IZMENA KUPCA***********************************************************
	$(document).on('click', "button[name = 'editBuyer']", function()	
	{
		var id = $(this).attr("id");
		console.log("pre ajaxa za edit kupca" + id);
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/kupci/izmena/' + id,
			dataType: 'json',
			success: function(data)
			{
				$('#sredina').load("novKupacForma.html", function()
						{
							$('#addBuyer').html("<span id=\"ikonica\" class=\"glyphicon glyphicon-floppy-disk\" aria-hidden=\"true\"></span>Sacuvaj izmene");
							$('#username').prop('disabled', true);
							$('#username').val(data.korisnickoIme);
							$('#password').val(data.lozinka);
							$('#name').val(data.ime);
							$('#surname').val(data.prezime);
							$('#cnum').val(data.telefon);
							$('#email').val(data.email);
							$('#adress').val(data.adresa);
							$('#country').val(data.drzava);
							
						});
			},
			error: function()
			{
				
			}
		});
	});
	
	//******************************BRISANJE KUPCA***********************************************************
	$(document).on('click', "button[name = 'delBuyer']", function()
	{
		var id = $(this).attr("id");
		console.log("pre ajaxa za delete kupca" + id);
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/kupci/brisanje/' + id ,
			dataType: 'text',
			success: function(data)
			{
				$.ajax
				({
					type: 'GET',
					url: 'rest/servis/kupci',
					dataType: 'json',
					success: function(data)
					{
						var list = data == null ? [] : (data instanceof Array ? data : [ data ]);
						//refreshStranice();
						$('#sredina').load("korisnikPrikaz.html", function() 
						{$.each(list, function(index, korisnik) 
						{
					        //var forma = $('<form method="get" class="productsform" action="ShoppingCartServlet"></form>');
					        var tr = $('<tr></tr>');
					        tr.append('<td>' + korisnik.korisnickoIme + '</td>' +
					                '<td>' + korisnik.lozinka + '</td>' +
					                '<td>' + korisnik.ime + '</td>' +
					                '<td>' + korisnik.prezime + '</td>' +
					                '<td>' + korisnik.telefon + '</td>' +
					                '<td>' + korisnik.email + '</td>'+
					                '<td>' + korisnik.adresa + '</td>' +
					                '<td>' + korisnik.drzava + '</td>' +
					                '<td><button name="delBuyer" id=\"' +korisnik.korisnickoIme+ ' \"class=\"btn btn-default\">Obrisi</button></td>' +
					                '<td><button name="editBuyer" id=\"' +korisnik.korisnickoIme+ ' \"class=\"btn btn-default\">Izmeni</button></td>' );
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
	
	//******************************PRIKAZ ISTORIJE KUPOVINA***********************************************************
	$(document).on('click', '#historyShop',function()
	{
		
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/sesija',
			dataType: 'json',
			success: function(data)
			{
				var userId = data.korisnickoIme;
				console.log("ULOGOVAN USER: " + userId);
				$.ajax
				({
					type:'GET',
					url: 'rest/servis/kupovine/' + userId,
					datatype: 'json',
					success: function(data2)
					{
						var list = data2 == null ? [] : (data2 instanceof Array ? data2 : [ data2 ]);
						$('#sredina').load("istorijaKupovinaPrikaz.html", function() 
						{	
							$.each(list, function(index, kupovina) 
							{
							        //var forma = $('<form method="get" class="productsform" action="ShoppingCartServlet"></form>');
							        var tr = $('<tr></tr>');
							        tr.append('<td>' + kupovina.sifra + '</td>' +
							                '<td>' + kupovina.kupac + '</td>' +
							                '<td>' + kupovina.prodavnica + '</td>' +
							                '<td>' + kupovina.proizvod + '</td>' +
							                '<td>' + kupovina.kolicinaProizvoda + '</td>' +
							                '<td>' + kupovina.nazivDostavljaca + '</td>' +
							                '<td>' + kupovina.trajanjePrenosa + '</td>' +
							                '<td>' + kupovina.cenaPrenosa + '</td>' +
							                '<td>' + kupovina.ukupnaCena + '</td>');
							        $('#korisnikTabela').append(tr);
								});
						});
					}
				});
			}
		});
		
	});
	
	//******************************PEPORUCENI PROIZVODI***********************************************************
	$(document).on('click', '#suggestedProducts',function()
	{
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/sesija',
			dataType: 'json',
			success: function(data)
			{
				var userId = data.korisnickoIme;
				$.ajax
				({
					type: 'GET',
					url: 'rest/servis/preporuka/'+ userId,
					dataType: 'json',
					success: function(data2)
					{
						$('#sredina').html("");
						var list = data2 == null ? [] : (data2 instanceof Array ? data2 : [ data2 ]);
						$.each(list, function(index, proizvod) 
						{
							$('#sredina').append("<div style=\" max-width:250px; max-height:600px; font-size:	10px;\" class=\"col-sm-6 col-md-4\"><div style=\"max-width:250px; max-height:600px;\" class=\"thumbnail\">"+
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
							
						});
					}
				});
			}
		});
		
	});
});