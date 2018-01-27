$(document).ready(function(){ refreshStranice();

//******************************NOV PRODAVAC FORMA***********************************************************
	$('#navTulbar').on('click', '#novProdavac', function()
	{
		$('#storeNavTulbar').hide();
		$('#sredina').load("novProdavacForma.html");
	});
	
	//******************************NOV PRODAVAC REGISTROVANJE***********************************************************
	$(document).on('click', '#addSeller', function()
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
			type: 'POST',
			url: 'rest/servis/regSeller',
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
					alertZeleni("USPELO REGISTROVANJE/MENJANJE PRODAVCA");
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
	
	//******************************PRIKAZ PRODAVACA***********************************************************
	$('#navTulbar').on('click', "#sviProdavci", function()
	{
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/prodavci',
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
			                '<td><button name="delSeller" id=\"' +korisnik.korisnickoIme+ ' \"class=\"btn btn-default\">Obrisi</button></td>' +
			                '<td><button name="editSeller" id=\"' +korisnik.korisnickoIme+ ' \"class=\"btn btn-default\">Izmeni</button></td>' );
			        $('#korisnikTabela').append(tr);
				});});

				
				
			},
			error: function()
			{
				alert("FAIL FIAL FAIL");
			}
				
		});
	});
	
	//******************************IZMENA PRODAVCA***********************************************************
	$(document).on('click', "button[name = 'editSeller']", function()
	{
		var id = $(this).attr("id");
		console.log("pre ajaxa za edit" + id);
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/prodavci/izmena/' + id,
			dataType: 'json',
			success: function(data)
			{
				//alert("IZMENA : " + data.korisnickoIme);
				$('#sredina').load("novProdavacForma.html", function()
				{
//					$('#addSeller').html("<span id=\"ikonica\" class=\"glyphicon glyphicon-floppy-disk\" aria-hidden=\"true\"></span>Sacuvaj izmene");
					$('#addSeller').hide();
					$('#dugme').append("<tr><td><button  id=\"changeSeller\" class=\"btn btn-primary btn-lg\"  style=\"width: 181px;  \"> <span id=\"ikonica\" class=\"glyphicon glyphicon-floppy-disk\" aria-hidden=\"true\"></span>Sacuvaj izmene</button></td></tr>");
					$('#username').prop('disabled', true);
					$('#username').val(data.korisnickoIme);
					$('#password').val(data.lozinka);
					$('#name').val(data.ime);
					$('#surname').val(data.prezime);
					$('#cnum').val(data.telefon);
					$('#email').val(data.email);
					$('#adress').val(data.adresa);
					$('#country').val(data.drzava);
					
					$(document).on('click','#changeSeller', function()
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
							url: 'rest/servis/prodavci/brisanje/' + username3 ,
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
							url: 'rest/servis/regSeller',
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
									alertZeleni("USPELO REGISTROVANJE/MENJANJE PRODAVCA");
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
					
				});
			},
			error: function()
			{
				alert("FEJL KOD IZMENE SERVER GRESK");
			}
		});
	});
	
	//******************************BRISANJE PRODAVCA***********************************************************
	$(document).on('click', "button[name = 'delSeller']", function()
	{
		var id = $(this).attr("id");
		console.log("pre ajaxa za delete" + id);
		$.ajax
		({
			type: 'GET',
			url: 'rest/servis/prodavci/brisanje/' + id ,
			dataType: 'text',
			success: function(data)
			{
				
				$.ajax
				({
					type: 'GET',
					url: 'rest/servis/prodavci',
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
					                '<td><button name="delSeller" id=\"' +korisnik.korisnickoIme+ ' \"class=\"btn btn-default\">Obrisi</button></td>' +
					                '<td><button name="editSeller" id=\"' +korisnik.korisnickoIme+ ' \"class=\"btn btn-default\">Izmeni</button></td>' );
					        $('#korisnikTabela').append(tr);
						});});
						
					},
					error: function()
					{
						alert("FAIL FIAL FAIL");
					}});
				
				alertZeleni("Uspesno obrisan prodavac " + data + "!");
				
			},
			error: function()
			{
				alertCrveni("FEJL BRISANJA SERVER GRESKA");
			}
		});

	});

});