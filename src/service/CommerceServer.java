package service;

import java.beans.XMLDecoder;
import java.beans.XMLEncoder;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map.Entry;
import java.util.UUID;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;

import com.sun.istack.internal.logging.Logger;

import modeli.Dostavljaci;
import modeli.KategorijaProizvoda;
import modeli.Korisnik;
import modeli.Kupovina;
import modeli.PrijavaKorisnika;
import modeli.Prodavnica;
import modeli.Proizvod;
import modeli.Recenzija;
import modeli.RegistrovaniKorisnici;


@Path("/servis")
public class CommerceServer 
{
	
	@Context
	HttpServletRequest request;
	@Context
	ServletContext ctx;

//******************************************** TEST **************************************************************
	@GET
	@Path("/test")
	@Produces(MediaType.TEXT_PLAIN)
	public String test() {
		return "Hello Jersey";
	}
	
//******************************************** PREUZIMANJE ULOGOVANOG KORISNIKA **************************************************************	
	@GET
	@Path("/sesija")
	@Produces(MediaType.APPLICATION_JSON)
	public Korisnik getUlogovanogKorisnika(@Context HttpServletRequest request)
	{
		return (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
	}
	
//******************************************** PREUZIMANJE POSTOJECIH PRODAVACA **************************************************************	
	@GET
	@Path("/prodavci")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Korisnik> getPostojeciProdavci() throws FileNotFoundException
	{
		RegistrovaniKorisnici posk = getKorisnici();
		ArrayList<Korisnik> prodavci = new ArrayList<Korisnik>();
		for (Korisnik postojeciKorisnici : posk.getPostojeciKorisnici().values()) 
		{
			if(postojeciKorisnici.getUloga().equals("prodavac"))
			{
				prodavci.add(postojeciKorisnici);
			}
		}
		System.out.println("Broj prodvaca: " + prodavci.size());
		return prodavci;
	}
//******************************************** PREUZIMANJE POSTOJECIH KUPACA **************************************************************	
	@GET
	@Path("/kupci")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Korisnik> getPostojeciKupci() throws FileNotFoundException
	{
		RegistrovaniKorisnici posk = getKorisnici();
		ArrayList<Korisnik> prodavci = new ArrayList<Korisnik>();
		for (Korisnik postojeciKorisnici : posk.getPostojeciKorisnici().values()) 
		{
			if(postojeciKorisnici.getUloga().equals("kupac"))
			{
				prodavci.add(postojeciKorisnici);
			}
		}
		System.out.println("Broj prodvaca: " + prodavci.size());
		return prodavci;
	}
//******************************************** PREUZIMANJE POSTOJECIH PRODAVNICA **************************************************************	
	@GET
	@Path("/prodavnice")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Prodavnica> getPostojeceProdavnice() throws FileNotFoundException
	{
		ArrayList<Prodavnica> prodavnice = getProdavnice();
		
		return prodavnice;
	}
//******************************************** PREUZIMANJE KONKRETNE PRODAVNICA **************************************************************	
		@GET
		@Path("/prodavnice/{id}")
		@Produces(MediaType.APPLICATION_JSON)
		public Prodavnica getProdavnica(@PathParam("id") String id) throws FileNotFoundException
		{
			ArrayList<Prodavnica> prodavnice = getProdavnice();
			
			for (Prodavnica prodavnica : prodavnice) 
			{
				if(prodavnica.getSifra().equals(id))
				{
					ctx.setAttribute("trenutnaProdavnica", prodavnica);
					return prodavnica;
				}	
			}
			
			return null;
			
		}
		
//******************************************** PREUZIMANJE AKTIVNE PRODAVNICA **************************************************************	
		@GET
		@Path("/prodavnice/aktivna")
		@Produces(MediaType.APPLICATION_JSON)
		public Prodavnica getAktivnaProdavnica()
		{
			Prodavnica aktivna =  (Prodavnica) ctx.getAttribute("trenutnaProdavnica");
			System.out.println("AKTIVNA PRODAVNICA JE: " + aktivna.getNaziv());
			return aktivna;
					
		}
		
//******************************************** PREUZIMANJE SVIH PROIZVODA KONKRETNE PRODAVNICA **************************************************************	
		@GET
		@Path("/prodavnice/{id}/proizvodi")
		@Produces(MediaType.APPLICATION_JSON)
		public ArrayList<Proizvod> getProizvodiProdavnica(@PathParam("id") String id) throws FileNotFoundException
		{
			ArrayList<Proizvod> proizvodi = getProizvodi();
			ArrayList<Proizvod> proizvodiAktuelneProdavnice  = new ArrayList<Proizvod>();		
			for (Proizvod proizvod : proizvodi) 
			{
				if(proizvod.getProdavnica().equals(id))
				{
					proizvodiAktuelneProdavnice.add(proizvod);
				}	
			}
					
			return proizvodiAktuelneProdavnice;
					
		}
		
//******************************************** PREUZIMANJE KONKRETNOG PROIZVODA KONKRETNE PRODAVNICA **************************************************************	
		@GET
		@Path("/prodavnice/{storeId}/proizvodi/{prodId}")
		@Produces(MediaType.APPLICATION_JSON)
		public Proizvod getKonkretniProizvod(@PathParam("storeId") String storeId, @PathParam("prodId") String prodId) throws FileNotFoundException
		{
			ArrayList<Proizvod> proizvodi = getProizvodi();
			System.out.println("POKUSAVAM PRONACI PRODAVNICU : " + storeId + "I PROIZVOD U NJOJ : " + prodId);
			for (Proizvod proizvod : proizvodi) 
			{
				if(proizvod.getProdavnica().equals(storeId) && proizvod.getSifra().equals(prodId))
				{
					System.out.println("USPEO SAM PRONACI KONKRETNI PROIZVOD AKTUELNE PRODAVNICE");
					return proizvod;
				}	
			}
							
			return null;
							
		}
//******************************************** PREUZIMANJE POSTOJECIH DOSTAVLJACA **************************************************************	
		@GET
		@Path("/dostavljaci")
		@Produces(MediaType.APPLICATION_JSON)
		public ArrayList<Dostavljaci> getPostojeceDostavljace() throws FileNotFoundException
		{
			ArrayList<Dostavljaci> dostavljaci = getDostavljaci();
			
			return dostavljaci;
		}
//******************************************** PREUZIMANJE POSTOJECIH KATEGORIJA **************************************************************	
		@GET
		@Path("/kategorije")
		@Produces(MediaType.APPLICATION_JSON)
		public ArrayList<KategorijaProizvoda> getPostojeceKategorije() throws FileNotFoundException
		{
			ArrayList<KategorijaProizvoda> kategorije = getKategorije();
					
			return kategorije;
		}
	
//******************************************** LOG OUT **************************************************************	
	@GET
	@Path("/odjava")
	@Produces(MediaType.TEXT_PLAIN)
	public String odjava(@Context HttpServletRequest request) throws FileNotFoundException
	{
		System.out.println("PRE INVALIDACIJE SESIJE");
		request.getSession().invalidate();
		System.out.println("POSLE INVALIDACIJE SESIJE");
		
		//praznjenje korpe kad se korisnik izloguje
		ArrayList<Proizvod> praznaKorpa = getProizvodiUKorpi();
		praznaKorpa.clear();
		XMLEncoder e = new XMLEncoder(
                new BufferedOutputStream(
                    new FileOutputStream(ctx.getRealPath("/") + "proizvodiUKorpi.xml")));
		e.writeObject(praznaKorpa);
		e.close();
		
		return "odjavljen";
	}
	
//******************************************** IZMENA KUPCA **************************************************************	
	@GET
	@Path("/kupci/izmena/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Korisnik izmenaKupca(@PathParam("id") String userid) throws FileNotFoundException
	{
		System.out.println("ZELIM IZMENITI: " + userid);
		RegistrovaniKorisnici posk = getKorisnici();
			
		for (Korisnik postojeciKorisnik : posk.getPostojeciKorisnici().values()) 
		{
			if(postojeciKorisnik.getKorisnickoIme().equals(userid))
			{	
				return  postojeciKorisnik;
			}
		}
			
		return null;
	}

//******************************************** IZMENA PRODAVCA **************************************************************	
	@GET
	@Path("/prodavci/izmena/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Korisnik izmenaProdavca(@PathParam("id") String userid) throws FileNotFoundException
	{
		System.out.println("ZELIM IZMENITI: " + userid);
		RegistrovaniKorisnici posk = getKorisnici();
		
		for (Korisnik postojeciKorisnik : posk.getPostojeciKorisnici().values()) 
		{
			if(postojeciKorisnik.getKorisnickoIme().equals(userid))
			{	
				return  postojeciKorisnik;
			}
		}
		
		return null;
	}

//******************************************** IZMENA DOSTAVLJACA **************************************************************	
	@GET
	@Path("/dostavljaci/izmena/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Dostavljaci izmeneDostavljaca(@PathParam("id") String userid) throws FileNotFoundException
	{
		System.out.println("ZELIM IZMENITI PRODAVNICU: " + userid);
		ArrayList<Dostavljaci> dostavljaci = getDostavljaci();
		
		for (Dostavljaci dostavljac : dostavljaci) 
		{
			if(dostavljac.getSifra().equals(userid))
			{
				return dostavljac;
			}
		}
		
		return null;
	}
	
//******************************************** IZMENA KATEGORIJE **************************************************************	
	@GET
	@Path("/kategorije/izmena/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public KategorijaProizvoda izmeneKategorije(@PathParam("id") String userid) throws FileNotFoundException
	{
		System.out.println("ZELIM IZMENITI KATEGORIJU: " + userid);
		ArrayList<KategorijaProizvoda> kategorije = getKategorije();
		
		for (KategorijaProizvoda kategorija : kategorije) 
		{
			if(kategorija.getNaziv().equals(userid))
			{
				return kategorija;
			}
		}
		
		return null;
	}
//******************************************** IZMENA PRODAVNICE **************************************************************	
	@GET
	@Path("/prodavnice/izmena/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Prodavnica izmeneProdavnice(@PathParam("id") String userid) throws FileNotFoundException
	{
		System.out.println("ZELIM IZMENITI PRODAVNICU: " + userid);
		ArrayList<Prodavnica> prodavnice = getPostojeceProdavnice();
		
		for (Prodavnica prodavnica : prodavnice) 
		{
			if(prodavnica.getNaziv().equals(userid))
			{
				return prodavnica;
			}
		}
		
		return null;
	}

//******************************************** IZMENA PROIZVODA IZ AKTIVNE PRODAVNICE **************************************************************
//	@POST
//	@Path("/prodavnice/{storeId}/proizvodi/izmena/{prodId}")
//	@Consumes(MediaType.APPLICATION_JSON)
//	@Produces(MediaType.TEXT_PLAIN)
//	public String izmenaProizvoda(@PathParam("storeId") String storeId, @PathParam("prodId") String prodId, Proizvod pr) throws FileNotFoundException
//	{
//		ArrayList<Proizvod> proizvodi = getProizvodi();
//		System.out.println("Size proizvoda pre izmene: " + proizvodi.size());
//		
//		for (Proizvod proizvod : proizvodi) 
//		{
//			if(proizvod.getSifra().equals(prodId) && proizvod.getProdavnica().equals(storeId))
//			{
//				System.out.println("PREPOZNAO PROIZVOD ZA IZMENU!");
//				proizvod.setBoja(pr.getBoja());
//				proizvod.setDimenzija(pr.getDimenzija());
//				proizvod.setJedinicnaCena(pr.getJedinicnaCena());
//				proizvod.setKategorijaProizvoda(pr.getKategorijaProizvoda());
//				proizvod.setKolicinaUMagacinu(pr.getKolicinaUMagacinu());
//				proizvod.setNaziv(pr.getNaziv());
//				proizvod.setNazivProizvodjaca(pr.getNazivProizvodjaca());
//				proizvod.setOpis(pr.getOpis());
//				proizvod.setSlika(pr.getSlika());
//				proizvod.setTezina(pr.getTezina());
//				proizvod.setZemljaProizvodnje(pr.getZemljaProizvodnje());
//				
//				XMLEncoder e = new XMLEncoder(
//						new BufferedOutputStream(
//								new FileOutputStream(ctx.getRealPath("/") + "proizvodi.xml")));
//				e.writeObject(proizvodi);
//				e.close();
//				
//				System.out.println("PROIZVOD IZMENJEN!");
//				return "okej";
//			}
//		}
//		return "notokej";
//	}
	@POST
	@Path("prodavnice/{storeId}/proizvodi/izmena/{productId}")
	@Produces(MediaType.TEXT_PLAIN)
	@Consumes(MediaType.APPLICATION_JSON)
	public String izmenaKonkretnogProizvoda(@PathParam("storeId") String storeId, @PathParam("productId") String productId, Proizvod izmPr) throws FileNotFoundException
	{
		ArrayList<Proizvod> proizvodi = getProizvodi();
		
		for (Proizvod proizvod : proizvodi) 
		{
			if(proizvod.getSifra().equals(productId) && proizvod.getProdavnica().equals(storeId))
			{
				if(izmPr.getNaziv().trim().length() == 0 ||
						izmPr.getBoja().trim().length() == 0 ||
						izmPr.getDimenzija().trim().length() == 0 ||
						izmPr.getJedinicnaCena().trim().length() == 0 ||
						izmPr.getKategorijaProizvoda().trim().length() == 0 ||
						izmPr.getKolicinaUMagacinu().trim().length() == 0 ||
						izmPr.getNazivProizvodjaca().trim().length() == 0 ||
						izmPr.getOpis().trim().length() == 0 ||
						izmPr.getSifra().trim().length() == 0 ||	
						izmPr.getZemljaProizvodnje().trim().length() == 0 ||	
						izmPr.getTezina().trim().length() == 0)
				{
					return "praznaPolja";
				}
				try{
		            Double.valueOf(izmPr.getJedinicnaCena());
		            Double.valueOf(izmPr.getKolicinaUMagacinu());
		            Double.valueOf(izmPr.getTezina());
		            Double.valueOf(izmPr.getDimenzija());
		        }catch(Exception e){
		            return "unesiteBroj";
		        }
			
				System.out.println("PREPOZNAO PROIZVOD ZA IZMENU!");
				proizvod.setBoja(izmPr.getBoja());
				proizvod.setDimenzija(izmPr.getDimenzija());
				proizvod.setJedinicnaCena(izmPr.getJedinicnaCena());
				proizvod.setKategorijaProizvoda(izmPr.getKategorijaProizvoda());
				proizvod.setKolicinaUMagacinu(izmPr.getKolicinaUMagacinu());
				proizvod.setNaziv(izmPr.getNaziv());
				proizvod.setNazivProizvodjaca(izmPr.getNazivProizvodjaca());
				proizvod.setOpis(izmPr.getOpis());
				proizvod.setTezina(izmPr.getTezina());
				proizvod.setZemljaProizvodnje(izmPr.getZemljaProizvodnje());
				if(!izmPr.getSlika().equals("") || (izmPr.getSlika()==null))
				{
					System.out.println("USO ODJE A NE BI TREBALO");
					proizvod.setSlika(izmPr.getSlika());
				}
				System.out.println("PROIZVOD IZMENJEN!");
				XMLEncoder e = new XMLEncoder(
						new BufferedOutputStream(
								new FileOutputStream(ctx.getRealPath("/") + "proizvodi.xml")));
				e.writeObject(proizvodi);
				e.close();
				
				return "okej";
			}
		}
		
		
		return "notokej";
	}
//******************************************** BRISANJE PROIZVODA IZ AKTIVNE PRODAVNICE **************************************************************
	@GET
	@Path("/prodavnice/{storeId}/proizvodi/brisanje/{prodId}")
	@Produces(MediaType.TEXT_PLAIN)
	public String brisanjeProizvoda(@PathParam("storeId") String storeId, @PathParam("prodId") String prodId ) throws FileNotFoundException
	{
		ArrayList<Proizvod> proizvodi = getProizvodi();
		
		for (Proizvod proizvod : proizvodi) 
		{
			if(proizvod.getSifra().equals(prodId) && proizvod.getProdavnica().equals(storeId))
			{
				System.out.println("Proizvod koji ce biti IZBRISAN: " + proizvod.getNaziv());
				proizvodi.remove(proizvod);
				
				XMLEncoder e = new XMLEncoder(
						new BufferedOutputStream(
								new FileOutputStream(ctx.getRealPath("/") + "proizvodi.xml")));
				e.writeObject(proizvodi);
				e.close();
				
				return "uspesno brisanje";
			}
		}
		return "doslo do neodredjene greske";
		
	}
//******************************************** BRISANJE PRODAVNICE **************************************************************
	@GET
	@Path("/prodavnice/brisanje/{id}")
	@Produces(MediaType.TEXT_PLAIN)
	public String brisanjeProdavnice(@PathParam("id") String userid) throws FileNotFoundException
	{
		System.out.println("ZELIM IZBRISATI PRODAVNICU: " + userid);
		ArrayList<Prodavnica> prodavnice = getProdavnice();
		
		for (Prodavnica prodavnica : prodavnice) 
		{
			if(prodavnica.getNaziv().equals(userid))
			{
				prodavnice.remove(prodavnica);
				
				XMLEncoder e = new XMLEncoder(
		                new BufferedOutputStream(
		                    new FileOutputStream(ctx.getRealPath("/") + "prodavnice.xml")));
				e.writeObject(prodavnice);
				e.close();
				
				return  userid;
			}
		}
		return "doslo do neodredjene greske";
	}
//******************************************** BRISANJE KUPCA **************************************************************
	@GET
	@Path("/kupci/brisanje/{id}")
	@Produces(MediaType.TEXT_PLAIN)
	public String brisanjeKupca(@PathParam("id") String userid) throws FileNotFoundException
	{
		System.out.println("ZELIM IZBRISATI KUPCA: " + userid);
		RegistrovaniKorisnici posk = getKorisnici();
		ArrayList<Korisnik> kupci = new ArrayList<Korisnik>();
		
		for (Korisnik postojeciKorisnik : posk.getPostojeciKorisnici().values()) 
		{
			if(postojeciKorisnik.getKorisnickoIme().equals(userid))
			{
				posk.getPostojeciKorisnici().remove(userid);
				
				XMLEncoder e = new XMLEncoder(
		                new BufferedOutputStream(
		                    new FileOutputStream(ctx.getRealPath("/") + "korisnici.xml")));
				e.writeObject(posk.getPostojeciKorisnici());
				e.close();
				
//				RegistrovaniKorisnici novik = getKorisnici();
//				for (Korisnik azuriraniKorisnik : posk.getPostojeciKorisnici().values()) 
//				{
//					if(azuriraniKorisnik.getUloga().equals("prodavac"))
//					{
//						prodavci.add(azuriraniKorisnik);
//					}
//				}
				
				return  userid;
				
			}
		}
		
		return "ili nije izbrisan, ili nije pronadjen";
	}
//******************************************** BRISANJE KATEGORIJE **************************************************************
		@GET
		@Path("/kategorije/brisanje/{id}")
		@Produces(MediaType.TEXT_PLAIN)
		public String brisanjeKategorije(@PathParam("id") String userid) throws FileNotFoundException
		{
			System.out.println("ZELIM IZBRISATI KATEGORIJU: " + userid);
			ArrayList<KategorijaProizvoda> kategorije = getKategorije();
			
			for (KategorijaProizvoda kategorija : kategorije) 
			{
				if(kategorija.getNaziv().equals(userid))
				{
					kategorije.remove(kategorija);
					
					XMLEncoder e = new XMLEncoder(
			                new BufferedOutputStream(
			                    new FileOutputStream(ctx.getRealPath("/") + "kategorije.xml")));
					e.writeObject(kategorije);
					e.close();
					
					System.out.println("IZBRISANA KATEGORIJA: " + userid);
					System.out.println("size KATEGORIJA posle brisanja: " + kategorije.size());
					return  userid;
				}
			}
			return "doslo do neodredjene greske";
		}
//******************************************** BRISANJE DOSTAVLJACA **************************************************************
		@GET
		@Path("/dostavljaci/brisanje/{id}")
		@Produces(MediaType.TEXT_PLAIN)
		public String brisanjeDostavljaca(@PathParam("id") String userid) throws FileNotFoundException
		{
			System.out.println("ZELIM IZBRISATI DOSTAVLJACA: " + userid);
			ArrayList<Dostavljaci> dostavljaci = getDostavljaci();
			
			for (Dostavljaci dostavljac : dostavljaci) 
			{
				if(dostavljac.getSifra().equals(userid))
				{
					dostavljaci.remove(dostavljac);
					
					XMLEncoder e = new XMLEncoder(
			                new BufferedOutputStream(
			                    new FileOutputStream(ctx.getRealPath("/") + "dostavljaci.xml")));
					e.writeObject(dostavljaci);
					e.close();
					
					System.out.println("IZBRISAN DOSTAVLJACA: " + userid);
					System.out.println("size DOSTAVLJACA posle brisanja: " + userid);
					return  userid;
				}
			}
			return "doslo do neodredjene greske";
		}
//******************************************** BRISANJE PRODAVCA **************************************************************
	@GET
	@Path("/prodavci/brisanje/{id}")
	@Produces(MediaType.TEXT_PLAIN)
	public String brisanjeProdavca(@PathParam("id") String userid) throws FileNotFoundException
	{
		System.out.println("ZELIM IZBRISATI: " + userid);
		RegistrovaniKorisnici posk = getKorisnici();
		ArrayList<Korisnik> prodavci = new ArrayList<Korisnik>();
		
		for (Korisnik postojeciKorisnik : posk.getPostojeciKorisnici().values()) 
		{
			if(postojeciKorisnik.getKorisnickoIme().equals(userid))
			{
				posk.getPostojeciKorisnici().remove(userid);
				
				XMLEncoder e = new XMLEncoder(
		                new BufferedOutputStream(
		                    new FileOutputStream(ctx.getRealPath("/") + "korisnici.xml")));
				e.writeObject(posk.getPostojeciKorisnici());
				e.close();
				
//				RegistrovaniKorisnici novik = getKorisnici();
//				for (Korisnik azuriraniKorisnik : posk.getPostojeciKorisnici().values()) 
//				{
//					if(azuriraniKorisnik.getUloga().equals("prodavac"))
//					{
//						prodavci.add(azuriraniKorisnik);
//					}
//				}
				
				return  userid;
				
			}
		}
		
		return "ili nije izbrisan, ili nije pronadjen";
	}
//******************************************** UPLOAD NOVE SLIKE **************************************************************	
	static Logger logger = Logger.getLogger(CommerceServer.class);
	
	@POST
	@Path("/upload")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	@Produces("text/html")
	public Response uploadFile(@FormDataParam("file") InputStream fileInputString,
			@FormDataParam("file") FormDataContentDisposition fileInputDetails) {

		System.out.println("fileInputString: " + fileInputString);
		System.out.println("fileInputDetails: " + fileInputDetails);
		String fileLocation = ctx.getRealPath("/multimedia") + "/" + fileInputDetails.getFileName();
		String status = null;
		NumberFormat myFormat = NumberFormat.getInstance();
		myFormat.setGroupingUsed(true);

		// Save the file
		try {
			OutputStream out = new FileOutputStream(new File(fileLocation));
			byte[] buffer = new byte[1024];
			int bytes = 0;
			long file_size = 0;
			while ((bytes = fileInputString.read(buffer)) != -1) {
				out.write(buffer, 0, bytes);
				file_size += bytes;
			}
			out.flush();
			out.close();

			logger.info(String.format("Inside uploadFile==> fileName: %s,  fileSize: %s",
					fileInputDetails.getFileName(), myFormat.format(file_size)));

			status = "File has been uploaded to:" + fileLocation + ", size: " + myFormat.format(file_size) + " bytes";
		} catch (IOException ex) {
			// logger.error("Unable to save file: " + fileLocation);
			ex.printStackTrace();
		}

		return Response.status(200).entity(status).build();
	}

//******************************************** PREUZIMANJE  PROIZVODA IZ KORPE AKTIVNE PRODAVNICE **************************************************************
	@GET
	@Path("/korpa")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Proizvod> preuzimanjeProizvodaKorpe(Proizvod pr) throws FileNotFoundException
	{
		ArrayList<Proizvod> proizvodiUKorpi = getProizvodiUKorpi();
		ArrayList<Proizvod> proizvodiKorpeProdavnice = new ArrayList<Proizvod>();
		
		Prodavnica aktivnaProdavnica = (Prodavnica) ctx.getAttribute("trenutnaProdavnica");
		String storeId = aktivnaProdavnica.getSifra();
		System.out.println("Radnja gde bi trebali da nadjemo proizvode korpe: " + storeId );
		for (Proizvod proizvod : proizvodiUKorpi) 
		{
			System.out.println("Iterirani roizvod ima RADNJU: " + proizvod.getProdavnica());
			if(proizvod.getProdavnica().equals(storeId))
				proizvodiKorpeProdavnice.add(proizvod);
		}
		return proizvodiKorpeProdavnice;
	}
//******************************************** DODAVANJE  PROIZVODA U KORPU **************************************************************
	@POST
	@Path("/korpa/dodavanje")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.TEXT_PLAIN)
	public String dodavanjeProizvodaUKorpu(Proizvod pr) throws FileNotFoundException
	{
		ArrayList<Proizvod> proizvodiUKorpi = getProizvodiUKorpi();
		proizvodiUKorpi.add(pr);
		
		XMLEncoder e = new XMLEncoder(
                new BufferedOutputStream(
                    new FileOutputStream(ctx.getRealPath("/") + "proizvodiUKorpi.xml")));
		e.writeObject(proizvodiUKorpi);
		e.close();
		
		return "okej";
	}

//******************************************** ISTORIJA KUPOVINA KONKRETNOG KORISNIKA **************************************************************
		@GET
		@Path("/kupovine/{userId}")
		@Produces(MediaType.APPLICATION_JSON)
		public ArrayList<Kupovina> getKupovineKorisnika(@PathParam("userId") String userId) throws FileNotFoundException
		{
			ArrayList<Kupovina> sveKupovine = getIstorijaKupovina();
			ArrayList<Kupovina> kupovineKorisnika = new ArrayList<Kupovina>();
			
			for (Kupovina kupovina : sveKupovine) 
			{
				if(kupovina.getKupac().equals(userId))
				{
					kupovineKorisnika.add(kupovina);
					
					System.out.println("ISTORIJA K kupovina-sifra: " +kupovina.getSifra() + 
							" cena prenosa: " + kupovina.getCenaPrenosa()+
							" kupac: " + kupovina.getKupac()+
							" naziv dostavljaca: " + kupovina.getNazivDostavljaca()+
							" prodavnica: " + kupovina.getProdavnica()+
							" proizvod: " + kupovina.getProizvod()+
							" kolicina: " + kupovina.getKolicinaProizvoda()+
							" trajanje prenosa: " + kupovina.getTrajanjePrenosa()+
							" ukupna cena: " + kupovina.getUkupnaCena() +"");
				}
			}
			
			
			
			return kupovineKorisnika;
		}
	
//******************************************** KUPOVINA KORPE **************************************************************
		@GET
		@Path("/kupovine/dodavanje/{delivererId}")
		@Produces(MediaType.TEXT_PLAIN)
		public String dodavanjeKupovine(@PathParam("delivererId") String delivererId, Proizvod pr) throws FileNotFoundException
		{
			ArrayList<Kupovina> stareKupovine = getIstorijaKupovina();
			ArrayList<Dostavljaci> dostavljaci = getDostavljaci();
			Dostavljaci selektovaniDostavljac  = new Dostavljaci();
			Prodavnica aktivna =  (Prodavnica) ctx.getAttribute("trenutnaProdavnica");
			String storeId = aktivna.getSifra();
			
			
			for (Dostavljaci dostavljac : dostavljaci) 
			{
				if(dostavljac.getSifra().equals(delivererId))
				{
					System.out.println("Prepoznao sam dostavljaca!");
					selektovaniDostavljac = dostavljac;
					break;
				}
			}
			
			System.out.println("trazio dostavljaca: " + delivererId + ", a pronasao: " + selektovaniDostavljac.getSifra());
			
			ArrayList<Proizvod> trenutnaKorpa = getProizvodiUKorpi();
			
			ArrayList<Proizvod> razlicitiProizvodi= new ArrayList<Proizvod>();
			ArrayList<Integer> kolicinaRazlProizvoda = new ArrayList<Integer>();
			razlicitiProizvodi.clear();
			kolicinaRazlProizvoda.clear();
			

				int j = 0;
				for (Proizvod proizvod : trenutnaKorpa) 
				{
					if(j == 0)
					{
						if(proizvod.getProdavnica().trim().equals(storeId.trim()))
						{
							int brojPojavljivanja = 0;
							razlicitiProizvodi.add(proizvod);
							for (Proizvod proizvodKorpa : trenutnaKorpa) 
							{
								if(proizvod.getSifra().trim().equals(proizvodKorpa.getSifra().trim()) && proizvod.getProdavnica().trim().equals(storeId.trim()))
								{
									brojPojavljivanja++;
								}
							}
							kolicinaRazlProizvoda.add(brojPojavljivanja);
							j++;
						}
					}
					else
					{
						if(proizvod.getProdavnica().trim().equals(storeId.trim()))
						{
							int  imaVec = 0;
							for (Proizvod razlProizvod : razlicitiProizvodi) 
							{
								if(razlProizvod.getSifra().trim().equals(proizvod.getSifra().trim()))
									imaVec++;
							}
							if(!(imaVec > 0))
							{
								int brojPojavljivanja = 0;
								razlicitiProizvodi.add(proizvod);
								for (Proizvod proizvodKorpa : trenutnaKorpa) 
								{
									if(proizvod.getSifra().trim().equals(proizvodKorpa.getSifra().trim()) && proizvod.getProdavnica().trim().equals(storeId.trim()))
									{
										brojPojavljivanja++;
									}
								}
								kolicinaRazlProizvoda.add(brojPojavljivanja);
							}
						}
					}
				}
				
				
				System.out.println("BROJ RAZLICITIH PROIZVODA: " + razlicitiProizvodi.size());
				for(int i = 0; i < razlicitiProizvodi.size(); i++)
				{
					System.out.println("Proizvod: " + razlicitiProizvodi.get(i).getNaziv() + ", kolicine: " + kolicinaRazlProizvoda.get(i).toString());
				}
				
				//kada smo ih smestili u pomocnu listu iz korpe brisemo sve one koji su iz te prodavnice iserijalizujemo
				ArrayList<Proizvod> novaKorpa = new ArrayList<Proizvod>();
				for (Proizvod proizvod : trenutnaKorpa) 
				{
					if(!(proizvod.getProdavnica().trim().equals(storeId.trim())))
					{
						System.out.println("stavljam u novu korpu");
						novaKorpa.add(proizvod);
					}
				}
				
				System.out.println("trenutna korpa pre serijalizacije ima: " + novaKorpa.size());
				XMLEncoder e = new XMLEncoder(
		                new BufferedOutputStream(
		                    new FileOutputStream(ctx.getRealPath("/") + "proizvodiUKorpi.xml")));
				e.writeObject(novaKorpa);
				e.close();
				System.out.println("odradjena serijalizacija");
				
				ctx.setAttribute("proizvodiUKorpi", novaKorpa);
				
				//sada pravimo kupovinu
				 UUID uuid = UUID.randomUUID();
			     String sifraKupovine = uuid.toString();
			     
			     
			     ArrayList<Kupovina> noveKupovine = new ArrayList<Kupovina>();
			     
			     for (int k = 0; k < razlicitiProizvodi.size(); k++) 
			     {
			    	Kupovina kupovina = new Kupovina();
					Proizvod prKup = razlicitiProizvodi.get(k);
					String kategorijaPr = prKup.getKategorijaProizvoda();
					int kolicina = kolicinaRazlProizvoda.get(k);
					Korisnik kupac = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
					String prodavnica = storeId;
					String nazDost = selektovaniDostavljac.getNaziv();
					String trajanjePrenosa;
					double cenaPrenosa = 0;
					double ukupnaCena = 0;
					
					//utvrdjivanje trajanje prenosa
					if(kupac.getDrzava().trim().equals(selektovaniDostavljac.getDrzavePoslovanja().trim()))
					{
						trajanjePrenosa = "do 1 dana";
					}
					else
					{
						trajanjePrenosa = "do 10 dana";
					}
					
					//utvrdjivanje tarife
					if( (Double.valueOf(prKup.getTezina()) <= 2) || (Double.valueOf(prKup.getDimenzija()) <= 50))
					{
						cenaPrenosa = Double.valueOf(selektovaniDostavljac.getMalaTarifa());
					}
					else if( (Double.valueOf(prKup.getTezina()) > 2 && Double.valueOf(prKup.getTezina()) <= 10) 
							|| (Double.valueOf(prKup.getDimenzija()) > 50 && Double.valueOf(prKup.getDimenzija()) < 70))
					{
						cenaPrenosa = Double.valueOf(selektovaniDostavljac.getSrednjaTarifa());
					}
					else
					{
						cenaPrenosa = Double.valueOf(selektovaniDostavljac.getVelikaTarifa());
					}
				
					ukupnaCena = kolicina*(cenaPrenosa + Double.valueOf(prKup.getJedinicnaCena()));
					double ukupnoSaPorezom = ukupnaCena + ukupnaCena/10;
					
					kupovina.setCenaPrenosa(Double.toString(cenaPrenosa));
					kupovina.setKupac(kupac.getKorisnickoIme());
					kupovina.setNazivDostavljaca(nazDost);
					kupovina.setProdavnica(prodavnica);
					kupovina.setProizvod(prKup.getSifra());
					kupovina.setKolicinaProizvoda(Integer.toString(kolicina));
					kupovina.setSifra(sifraKupovine);
					kupovina.setTrajanjePrenosa(trajanjePrenosa);
					kupovina.setUkupnaCena(Double.toString(ukupnoSaPorezom));
					kupovina.setKategorijaProizvoda(kategorijaPr);
					
					System.out.println("kupovina-sifra: " +kupovina.getSifra() + 
							" cena prenosa: " + kupovina.getCenaPrenosa()+
							" kupac: " + kupovina.getKupac()+
							" naziv dostavljaca: " + kupovina.getNazivDostavljaca()+
							" prodavnica: " + kupovina.getProdavnica()+
							" proizvod: " + kupovina.getProizvod()+
							" kategorija proizvoda: " + kupovina.getKategorijaProizvoda()+
							" kolicina: " + kupovina.getKolicinaProizvoda()+
							" trajanje prenosa: " + kupovina.getTrajanjePrenosa()+
							" ukupna cena: " + kupovina.getUkupnaCena() +"");
					
					noveKupovine.add(kupovina);
					
			     }
			     
			     for (Kupovina kupovina2 : noveKupovine) 
			     {
					stareKupovine.add(kupovina2);
				 }
			     
			     
			     System.out.println("VELICINA NOVE KUPOVINE: " +noveKupovine.size());
			     XMLEncoder kup = new XMLEncoder(
			                new BufferedOutputStream(
			                    new FileOutputStream(ctx.getRealPath("/") + "istorijaKupovina.xml")));
					kup.writeObject(stareKupovine);
					kup.close();
			     
			     System.out.println("PROVERA smestanja kupovina");
			     
			     ArrayList<Kupovina> sveKupovine = getIstorijaKupovina();
			     
			     System.out.println("VELICINA ISTORIJE KUPOVINA: " + sveKupovine.size());
				
				//novaKorpa.clear();
				razlicitiProizvodi.clear();
				kolicinaRazlProizvoda.clear();
			return "okej";
		}

//******************************************** UKLANJANJE  PROIZVODA IZ  KORPE **************************************************************
	@GET
	@Path("/korpa/ukloni/{productId}")
	@Produces(MediaType.TEXT_PLAIN)
	public String ukloniItemIzKorpe(@PathParam("productId") String productId) throws FileNotFoundException
	{
		ArrayList<Proizvod> proizvodiUKorpi = getProizvodiUKorpi();
		System.out.println("Artikal koji zelim dauklonim iz korpe ima sifru: " + productId);
		for (Proizvod proizvod : proizvodiUKorpi) 
		{
			System.out.println("iterirani item za uklanjanje iz korpe ima sifru: " + proizvod.getSifra());
			if((proizvod.getSifra().trim()).equals(productId.trim()))
			{
				System.out.println("Prepoznao sam artikal koji zelim da uklonim iz korpe!");
				proizvodiUKorpi.remove(proizvod);
				
				XMLEncoder e = new XMLEncoder(
		                new BufferedOutputStream(
		                    new FileOutputStream(ctx.getRealPath("/") + "proizvodiUKorpi.xml")));
				e.writeObject(proizvodiUKorpi);
				e.close();
				
				return "okej";
			}
		}
		
		return "notokej";
	}
//******************************************** DODAVANJE NOVOG PROIZVODA **************************************************************	
	@POST
	@Path("/proizvodi")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.TEXT_PLAIN)
	public String dodavanjeProizvoda(Proizvod pr) throws FileNotFoundException
	{
		ArrayList<Proizvod> proizvodi = getProizvodi();
		System.out.println("Size proizvoda: " + proizvodi.size());
		if(!proizvodi.isEmpty())
		{
			for (Proizvod proizvod : proizvodi) 
			{
				if(proizvod.getSifra().equals(pr.getSifra()))
				{
					return "vecPostoji";
				}
			
				if(pr.getNaziv().trim().length() == 0 ||
						pr.getBoja().trim().length() == 0 ||
						pr.getDimenzija().trim().length() == 0 ||
						pr.getJedinicnaCena().trim().length() == 0 ||
						pr.getKategorijaProizvoda().trim().length() == 0 ||
						pr.getKolicinaUMagacinu().trim().length() == 0 ||
						pr.getNazivProizvodjaca().trim().length() == 0 ||
						pr.getOpis().trim().length() == 0 ||
						pr.getSifra().trim().length() == 0 ||
						pr.getSlika().trim().length() == 0 ||	
						pr.getZemljaProizvodnje().trim().length() == 0 ||	
						pr.getTezina().trim().length() == 0)
				{
					return "praznaPolja";
				}
				
				try{
		            Double.valueOf(pr.getJedinicnaCena());
		            Double.valueOf(pr.getKolicinaUMagacinu());
		            Double.valueOf(pr.getTezina());
		            Double.valueOf(pr.getDimenzija());
		        }catch(Exception e){
		            return "unesiteBroj";
		        }
			
			}
			proizvodi.add(pr);
			System.out.println("DODAT PROIZVOD: " + pr.getNaziv());
			XMLEncoder e = new XMLEncoder(
	                new BufferedOutputStream(
	                    new FileOutputStream(ctx.getRealPath("/") + "proizvodi.xml")));
							e.writeObject(proizvodi);
								e.close();
			return "ok";
		}
		else
		{
			if(pr.getNaziv().trim().length() == 0 ||
					pr.getBoja().trim().length() == 0 ||
					pr.getDimenzija().trim().length() == 0 ||
					pr.getJedinicnaCena().trim().length() == 0 ||
					pr.getKategorijaProizvoda().trim().length() == 0 ||
					pr.getKolicinaUMagacinu().trim().length() == 0 ||
					pr.getNazivProizvodjaca().trim().length() == 0 ||
					pr.getOpis().trim().length() == 0 ||
					pr.getSifra().trim().length() == 0 ||
					pr.getSlika().trim().length() == 0 ||	
					pr.getZemljaProizvodnje().trim().length() == 0 ||	
					pr.getTezina().trim().length() == 0)
			{
				return "praznaPolja";
			}
			
			proizvodi.add(pr);
			System.out.println("DODAT PROIZVOD: " + pr.getNaziv());
			XMLEncoder e = new XMLEncoder(
	                new BufferedOutputStream(
	                    new FileOutputStream(ctx.getRealPath("/") + "proizvodi.xml")));
							e.writeObject(proizvodi);
								e.close();
			return "ok";
		}
	}
//******************************************** DODAVANJE NOVE KATEGORIJE **************************************************************	
	@POST
	@Path("/regCategory")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.TEXT_PLAIN)
	public String dodavanjeKategorije(KategorijaProizvoda kat) throws FileNotFoundException
	{
		ArrayList<KategorijaProizvoda> kategorije = getKategorije();
		System.out.println("Size kategorija: " + kategorije.size());
		if(!kategorije.isEmpty())
		{
			for (KategorijaProizvoda kategorija : kategorije) 
			{
				if(kategorija.getNaziv().equals(kat.getNaziv()))
				{
					return "vecPostoji";
				}
			
				if(kat.getNaziv().trim().length() == 0 ||
						kat.getOpis().trim().length() == 0)
				{
					return "praznaPolja";
				}
			
			}
			kategorije.add(kat);
			
			XMLEncoder e = new XMLEncoder(
	                new BufferedOutputStream(
	                    new FileOutputStream(ctx.getRealPath("/") + "kategorije.xml")));
							e.writeObject(kategorije);
								e.close();
			return "ok";
		}
		else
		{
			if(kat.getNaziv().trim().length() == 0 ||
					kat.getOpis().trim().length() == 0)
			{
				return "praznaPolja";
			}
			
			kategorije.add(kat);
			
			XMLEncoder e = new XMLEncoder(
	                new BufferedOutputStream(
	                    new FileOutputStream(ctx.getRealPath("/") + "kategorije.xml")));
							e.writeObject(kategorije);
								e.close();
			return "ok";
		}
	}
//******************************************** DODAVANJE NOVE PRODAVNICE **************************************************************	
	@POST
	@Path("/regStore")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.TEXT_PLAIN)
	public String dodavanjeProdavnice(Prodavnica regpro) throws FileNotFoundException
	{
		
		ArrayList<Prodavnica> prodavnice = getProdavnice();
		System.out.println("Size prodavnica: " + prodavnice.size());
		if(!prodavnice.isEmpty())
		{
			for (Prodavnica prodavnica : prodavnice) 
			{
				if(prodavnica.getSifra().equals(regpro.getSifra()) || prodavnica.getNaziv().equals(regpro.getNaziv()))
				{
					return "vecPostoji";
				}
			
				if(regpro.getAdresa().trim().length() == 0 ||
						regpro.getDrzava().trim().length() == 0 ||
						regpro.getEmail().trim().length() == 0 ||
						regpro.getNaziv().trim().length() == 0 ||
						regpro.getSifra().trim().length() == 0 ||
						regpro.getTelefon().trim().length() == 0)
				{
					return "praznaPolja";
				}
			
			}
			prodavnice.add(regpro);
			
			XMLEncoder e = new XMLEncoder(
	                new BufferedOutputStream(
	                    new FileOutputStream(ctx.getRealPath("/") + "prodavnice.xml")));
							e.writeObject(prodavnice);
								e.close();
			return "ok";
		}
		else
		{
			if(regpro.getAdresa().trim().length() == 0 ||
					regpro.getDrzava().trim().length() == 0 ||
					regpro.getEmail().trim().length() == 0 ||
					regpro.getNaziv().trim().length() == 0 ||
					regpro.getSifra().trim().length() == 0 ||
					regpro.getTelefon().trim().length() == 0)
			{
				return "praznaPolja";
			}
			
			prodavnice.add(regpro);
			
			XMLEncoder e = new XMLEncoder(
	                new BufferedOutputStream(
	                    new FileOutputStream(ctx.getRealPath("/") + "prodavnice.xml")));
							e.writeObject(prodavnice);
								e.close();
			return "ok";
		}
		
	}
//******************************************** REGISTROVANJE DOSTAVLJACA ***********************************************************
	@POST
	@Path("/regDeliverer")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.TEXT_PLAIN)
	public String registrovanjeDostavljaca(Dostavljaci regD) throws FileNotFoundException
	{
		ArrayList<Dostavljaci> dostavljaci = getDostavljaci();
		System.out.println("Size dostavljaca: " + dostavljaci.size());
		if(!dostavljaci.isEmpty())
		{
			for (Dostavljaci dostavljac : dostavljaci) 
			{
				if(dostavljac.getSifra().equals(regD.getSifra()))
				{
					return "vecPostoji";
				}
			
				if(regD.getNaziv().trim().length() == 0 ||
						regD.getDrzavePoslovanja().trim().length() == 0 ||
						regD.getOpis().trim().length() == 0 ||
						regD.getMalaTarifa().trim().length() == 0 ||
						regD.getSrednjaTarifa().trim().length() == 0 ||
						regD.getVelikaTarifa().trim().length() == 0 ||
						regD.getSifra().trim().length() == 0)
				{
					return "praznaPolja";
				}
				
				try{
		            Double.valueOf(regD.getMalaTarifa());
		            Double.valueOf(regD.getSrednjaTarifa());
		            Double.valueOf(regD.getVelikaTarifa());
		        }catch(Exception e){
		            return "unesiteBroj";
		        }
			
			}
			dostavljaci.add(regD);
			
			XMLEncoder e = new XMLEncoder(
	                new BufferedOutputStream(
	                    new FileOutputStream(ctx.getRealPath("/") + "dostavljaci.xml")));
							e.writeObject(dostavljaci);
								e.close();
			return "ok";
		}
		else
		{
			if(regD.getNaziv().trim().length() == 0 ||
					regD.getDrzavePoslovanja().trim().length() == 0 ||
					regD.getOpis().trim().length() == 0 ||
					regD.getMalaTarifa().trim().length() == 0 ||
					regD.getSrednjaTarifa().trim().length() == 0 ||
					regD.getVelikaTarifa().trim().length() == 0 ||
					regD.getSifra().trim().length() == 0)
			{
				return "praznaPolja";
			}
			
			try{
	            Double.valueOf(regD.getMalaTarifa());
	            Double.valueOf(regD.getSrednjaTarifa());
	            Double.valueOf(regD.getVelikaTarifa());
	        }catch(Exception e){
	            return "unesiteBroj";
	        }
			
			dostavljaci.add(regD);
			
			XMLEncoder e = new XMLEncoder(
	                new BufferedOutputStream(
	                    new FileOutputStream(ctx.getRealPath("/") + "dostavljaci.xml")));
							e.writeObject(dostavljaci);
								e.close();
			return "ok";
		}
	}
//******************************************** REGISTROVANJE PRODAVCA **************************************************************	
	@POST
	@Path("/regSeller")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.TEXT_PLAIN)
	public String registrovanjeProdavca( Korisnik regK) throws FileNotFoundException
	{
		RegistrovaniKorisnici posk = getKorisnici();
		
		System.out.println("Size: " + posk.getPostojeciKorisnici().size());
		
		System.out.println("USAO PRE FOR PETLJU OD REGISTROVANJA ZA PROVERU KORISNIKA");
		for (Korisnik postojeciKorisnici : posk.getPostojeciKorisnici().values()) 
		{
			System.out.println("USAO U FOR PETLJU OD REGISTROVANJA ZA PROVERU KORISNIKA");
			if(regK.getKorisnickoIme().equals(postojeciKorisnici.getKorisnickoIme()))
					return "postojiVec";
		}
		
		if((regK.getKorisnickoIme().trim().length() == 0) 
				|| (regK.getIme().trim().length() == 0)
				|| (regK.getPrezime().trim().length() == 0)
				|| (regK.getTelefon().trim().length() == 0)
				|| (regK.getAdresa().trim().length() == 0)
				|| (regK.getDrzava().trim().length() == 0)
				|| (regK.getEmail().trim().length() == 0)
				|| (regK.getLozinka().trim().length() == 0))
			return "praznaPolja";
		
		regK.setUloga("prodavac");
		posk.getPostojeciKorisnici().put(regK.getKorisnickoIme(), regK);
		
		//serijalizacija da bi korisnik ostao zapamcen
		XMLEncoder e = new XMLEncoder(
                new BufferedOutputStream(
                    new FileOutputStream(ctx.getRealPath("/") + "korisnici.xml")));
		e.writeObject(posk.getPostojeciKorisnici());
		e.close();
		
		return "ok";
	}
//******************************************** LOGOVANJE **************************************************************	
	@POST
	@Path("/log")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.TEXT_PLAIN)
	public String logovanje(@Context HttpServletRequest request, PrijavaKorisnika logk) throws FileNotFoundException
	{
		RegistrovaniKorisnici k = getKorisnici();
		
		System.out.println("Size: "  +  k.getPostojeciKorisnici().size());
//		System.out.println("Korisnik: " +  k.getPostojeciKorisnici().containsKey(logk.getKorisnickoIme()));
//		System.out.println("Lozinka: " + k.getPostojeciKorisnici().get(logk.getKorisnickoIme()).getLozinka());
//		System.out.println("Lozinka unos: " + logk.getLozinka());
		if( k.getPostojeciKorisnici().containsKey(logk.getKorisnickoIme()) 
				&& (k.getPostojeciKorisnici().get(logk.getKorisnickoIme()).getLozinka().equals(logk.getLozinka())))
		{
			request.getSession().setAttribute("ulogovanKorisnik", k.getPostojeciKorisnici().get(logk.getKorisnickoIme()));
			
			if(k.getPostojeciKorisnici().get(logk.getKorisnickoIme()).getUloga().equals("administrator"))
			{
				//praznjenje korpe kad se korisnik izloguje
				ArrayList<Proizvod> praznaKorpa = getProizvodiUKorpi();
				praznaKorpa.clear();
				XMLEncoder e = new XMLEncoder(
		                new BufferedOutputStream(
		                    new FileOutputStream(ctx.getRealPath("/") + "proizvodiUKorpi.xml")));
				e.writeObject(praznaKorpa);
				e.close();
				return "okadmin";
			}
			else if(k.getPostojeciKorisnici().get(logk.getKorisnickoIme()).getUloga().equals("kupac"))
			{
				//praznjenje korpe kad se korisnik izloguje
				ArrayList<Proizvod> praznaKorpa = getProizvodiUKorpi();
				praznaKorpa.clear();
				XMLEncoder e = new XMLEncoder(
		                new BufferedOutputStream(
		                    new FileOutputStream(ctx.getRealPath("/") + "proizvodiUKorpi.xml")));
				e.writeObject(praznaKorpa);
				e.close();
				return "okkupac";
			}
			else
			{
				//praznjenje korpe kad se korisnik izloguje
				ArrayList<Proizvod> praznaKorpa = getProizvodiUKorpi();
				praznaKorpa.clear();
				XMLEncoder e = new XMLEncoder(
		                new BufferedOutputStream(
		                    new FileOutputStream(ctx.getRealPath("/") + "proizvodiUKorpi.xml")));
				e.writeObject(praznaKorpa);
				e.close();
				return "okprodavac";
			}
			
		}
		else if((logk.getLozinka().trim().length() == 0) || (logk.getKorisnickoIme().trim().length() == 0))
			return "praznoPolje";
		else
			return "notok";
	}
//******************************************** PREUZIMANJE LISTE ZELJA KORISNIKA AKTIVNE RADNJE**************************************************************	
	@GET
	@Path("/wishList/{userId}")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Proizvod> getWishListuKorisnika(@PathParam("userId") String userId) throws FileNotFoundException
	{
		ArrayList<Proizvod> wishList = getProizvodiSaListeZelja();
		ArrayList<Proizvod> korisnikovaListaZelja = new ArrayList<Proizvod>();
		Prodavnica aktivna =  (Prodavnica) ctx.getAttribute("trenutnaProdavnica");
		
		for (Proizvod proizvod : wishList) 
		{
			System.out.println("prodavnica proizvoda: " + proizvod.getProdavnica());
			if(proizvod.getWishKorisnik().equals(userId)  &&  proizvod.getProdavnica().equals(aktivna.getSifra()))
			{
				korisnikovaListaZelja.add(proizvod);
			}
		}
		
		return korisnikovaListaZelja;
		
	}
//******************************************** DODAVANJE U LISTU ZELJA **************************************************************	
	@POST
	@Path("/wishList/dodavanje")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.TEXT_PLAIN)
	public String dodavanjeNaListuZelja(Proizvod wishP) throws FileNotFoundException
	{
		System.out.println("u wish list zelim " + wishP.getNaziv() + " " + wishP.getSifra());
		ArrayList<Proizvod> wishList = getProizvodiSaListeZelja();
		for (Proizvod proizvod : wishList) 
		{
			if((proizvod.getSifra().equals(wishP.getSifra())) && (proizvod.getWishKorisnik().equals(wishP.getWishKorisnik())))	
				return "vecPostoji";
		}
		wishList.add(wishP);
		
		System.out.println("pre serijalizacije wish list ima stavki: " + wishList.size());
		XMLEncoder e = new XMLEncoder(
                new BufferedOutputStream(
                    new FileOutputStream(ctx.getRealPath("/") + "wishList.xml")));
		e.writeObject(wishList);
		e.close();
		
		System.out.println("wishlist sada ima stavki: " + wishList.size());
		
		return "okej";
	}
//******************************************** BRISANJE PROIZVODA IZ LISTE ZELJA **************************************************************
		@POST
		@Path("/wishList/uklanjanje")
		@Consumes(MediaType.APPLICATION_JSON)
		@Produces(MediaType.TEXT_PLAIN)
		public String uklanjanjeSaListeZelja(Proizvod wishP) throws FileNotFoundException
		{
			System.out.println("u wish list korisnik :"+wishP.getWishKorisnik()+" NE zeli " + wishP.getNaziv() + " " + wishP.getSifra());
			ArrayList<Proizvod> wishList = getProizvodiSaListeZelja();
			
			System.out.println("lista zelja sada ima stavki: " + wishList.size());
			for (Proizvod proizvod : wishList) 
			{	
				System.out.println("provera proizvoda: " + proizvod.getSifra() + "i njeovog kupca: " +  proizvod.getWishKorisnik());
				
				if((proizvod.getSifra().trim().equals(wishP.getSifra().trim())) && (proizvod.getWishKorisnik().trim().equals(wishP.getWishKorisnik().trim())))	
					{
						wishList.remove(proizvod);
						
						System.out.println("pre serijalizacije wish list ima stavki: " + wishList.size());
						XMLEncoder e = new XMLEncoder(
				                new BufferedOutputStream(
				                    new FileOutputStream(ctx.getRealPath("/") + "wishList.xml")));
						e.writeObject(wishList);
						e.close();
						
						System.out.println("wishlist sada ima stavki: " + wishList.size());
						
						return "okej";
					}
			}
			
			return "notokej";
		}
//******************************************** GENERISANJE PREPORUCENIH PROIZVODA **************************************************************	
		//generisace se na osnovu kategorije gde je korisnik najvise kupovao i to preporucivanjem
		//Proizvoda te kategorije
		//lista preporucenih proizvoda ce se razlikovati u zavisnosti od toga u kojoj je raadnji korisnik
		@GET
		@Path("/preporuka/{userId}")
		@Produces(MediaType.APPLICATION_JSON)
		public ArrayList<Proizvod> generisanjePreporucenihProizvoda(@PathParam("userId") String userId) throws FileNotFoundException
		{
			ArrayList<Proizvod> preporuceniProizvodi = getPreporuceniProizvodi();
			preporuceniProizvodi.clear(); //zato sto se svaki put preporucuju novi proizvodi
			ArrayList<Kupovina> istorijaKupovina = getIstorijaKupovina();
			Prodavnica aktivna =  (Prodavnica) ctx.getAttribute("trenutnaProdavnica");
			HashMap<String, Double> katKol = new HashMap<String, Double>();
			String storeId = aktivna.getSifra();
			
			ArrayList<Proizvod> proizvodi = getProizvodi();
			ArrayList<Proizvod> proizvodiAktuelneProdavnice  = new ArrayList<Proizvod>();		
			for (Proizvod proizvod : proizvodi) 
			{
				if(proizvod.getProdavnica().equals(storeId))
				{
					proizvodiAktuelneProdavnice.add(proizvod);
				}	
			}
			
			for (Kupovina kupovina : istorijaKupovina) 
			{	
				if(kupovina.getKupac().equals(userId) && kupovina.getProdavnica().equals(storeId))
				{
					String productId = kupovina.getProizvod();
					double kolicinaPr = Double.valueOf(kupovina.getKolicinaProizvoda());
					String kategorija = kupovina.getKategorijaProizvoda();
					
					if(katKol.containsKey(kategorija))
					{
						double staraKolicinaKategorije;
						double novaKolicinaKategorije;
						
						staraKolicinaKategorije = katKol.get(kategorija).doubleValue();
						novaKolicinaKategorije = staraKolicinaKategorije + kolicinaPr;
								
						katKol.put(kategorija, novaKolicinaKategorije);
					}
					else
					{
						katKol.put(kategorija, kolicinaPr);
					}
				}
			}
			
			System.out.println("PRIKAZ HASHMAPE KATEGORIJA I KOLICINE PRE SORTIRANJA:");
			
			for (String kateg : katKol.keySet()) 
			{
			    System.out.println("kategorij: " + kateg + " , kolicina: " + katKol.get(kateg));
			}
			
			Entry<String,Double> maxEntry = null;

			for(Entry<String,Double> entry : katKol.entrySet()) {
			    if (maxEntry == null || entry.getValue() > maxEntry.getValue()) {
			        maxEntry = entry;
			    }
			}
			
			for (Proizvod proizvod : proizvodiAktuelneProdavnice) 
			{
				if(proizvod.getKategorijaProizvoda().trim().equals(maxEntry.getKey().trim()))
					preporuceniProizvodi.add(proizvod);
			}
			
			XMLEncoder e = new XMLEncoder(
	                new BufferedOutputStream(
	                    new FileOutputStream(ctx.getRealPath("/") + "preporuceniProizvodi.xml")));
			e.writeObject(preporuceniProizvodi);
			e.close();
			
			System.out.println("NAJKUPOVANIJA KATEGORIJA: "+ maxEntry.getKey()+ " , sa kolicinom: "+ maxEntry.getValue() );
			
			
			return preporuceniProizvodi;
		}
//******************************************** REGISTROVANJE KORISNIKA **************************************************************	
	@POST
	@Path("/register")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.TEXT_PLAIN)
	public String registrovanje(Korisnik k) throws FileNotFoundException
	{
		RegistrovaniKorisnici rk = getKorisnici();
		
		System.out.println("Size: " + rk.getPostojeciKorisnici().size());
		
		for (Korisnik postojeciKorisnici : rk.getPostojeciKorisnici().values()) 
		{
			System.out.println("USAO U FOR PETLJU OD REGISTROVANJA ZA PROVERU KORISNIKA");
			if(k.getKorisnickoIme().equals(postojeciKorisnici.getKorisnickoIme()))
					return "postojiVec";
		}
		
		if((k.getKorisnickoIme().trim().length() == 0) 
				|| (k.getIme().trim().length() == 0)
				|| (k.getPrezime().trim().length() == 0)
				|| (k.getTelefon().trim().length() == 0)
				|| (k.getAdresa().trim().length() == 0)
				|| (k.getDrzava().trim().length() == 0)
				|| (k.getEmail().trim().length() == 0)
				|| (k.getLozinka().trim().length() == 0))
			return "praznaPolja";
//		if(k.getKorisnickoIme())
		
		k.setUloga("kupac");
		rk.getPostojeciKorisnici().put(k.getKorisnickoIme(), k);
		
		//serijalizacija da bi korisnik ostao zpaamcen
		XMLEncoder e = new XMLEncoder(
                new BufferedOutputStream(
                    new FileOutputStream(ctx.getRealPath("/") + "korisnici.xml")));
		e.writeObject(rk.getPostojeciKorisnici());
		e.close();
		
		return "ok";
	}
//******************************************** PREUZIMANJE RECENIJA PROIZVODA **************************************************************
	@GET
	@Path("/proizvod/{productId}/recenzije")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Recenzija> getSveRecenzijeProizvoda(@PathParam("productId") String productId) throws FileNotFoundException
	{
		ArrayList<Recenzija> sveRecenzije = getSveRecenzije();
		ArrayList<Recenzija> recProizvoda = new ArrayList<Recenzija>();
		
		for (Recenzija recenzija : sveRecenzije) 
		{
			if(recenzija.getSifraProizvoda().equals(productId))
			{
				recProizvoda.add(recenzija);
			}
		}
		
		return recProizvoda;
		
	}
//******************************************** BRISANJE RECENIJE PROIZVODA **************************************************************
	@GET
	@Path("/proizvod/recenzije/brisanje/{recId}")
	@Produces(MediaType.TEXT_PLAIN)
	public String brisanjeRecenzijeProizvoda(@PathParam("recId") String recId) throws FileNotFoundException
	{
		ArrayList<Recenzija> sveRecenzije = getSveRecenzije();
		String productId;
		
		for (Recenzija recenzija : sveRecenzije) 
		{
			if(recenzija.getSifra().equals(recId))
			{
				productId = recenzija.getSifraProizvoda();
				sveRecenzije.remove(recenzija);
				
				return productId;
			}
		}
			
		return null;
			
	}
//******************************************** DODAVANJE RECENIJE PROIZVODA **************************************************************
	@POST
	@Path("/proizvod/{productId}/recenzije/dodavanje/{userId}")
	@Produces(MediaType.TEXT_PLAIN)
	@Consumes(MediaType.APPLICATION_JSON)
	public String dodajRecenzijuNaProizvod(@PathParam("productId") String productId, @PathParam("userId") String userId, Recenzija rec) throws FileNotFoundException
	{
		ArrayList<Recenzija> sveRecenzije = getSveRecenzije();
		Korisnik ulogovan = (Korisnik) request.getSession().getAttribute("ulogovanKorisnik");
		
		 UUID uuid = UUID.randomUUID();
	     String sifraRecenzije = uuid.toString();
	     
	     System.out.println("ulogovan: " + userId +
	    		 ", recenzija: " + rec.getKomentar()+
	    		 ", ocena: " + rec.getOcena() +
	    		 ", productId: " + productId);
	     
		if(!sveRecenzije.isEmpty())
		{
			for (Recenzija recenzija : sveRecenzije) 
			{
				if(((recenzija.getSifraProizvoda().trim()).equals(productId.trim())) && (recenzija.getKorisnik().equals(userId)))
				{
					return "vecPostojiRecenzija";
				}
				else
				{
					System.out.println("USAO U DODAVANJE RECENZIJE");
					rec.setKorisnik(userId);
					rec.setSifra(sifraRecenzije);
					sveRecenzije.add(rec);
					
					XMLEncoder e = new XMLEncoder(
			                new BufferedOutputStream(
			                    new FileOutputStream(ctx.getRealPath("/") + "recenzije.xml")));
					e.writeObject(sveRecenzije);
					e.close();
							
					return "okej";
				}
			}
		}
		else
		{
			System.out.println("USAO U DODAVANJE RECENZIJE");
			rec.setKorisnik(userId);
			rec.setSifra(sifraRecenzije);
			sveRecenzije.add(rec);
			
			XMLEncoder e = new XMLEncoder(
	                new BufferedOutputStream(
	                    new FileOutputStream(ctx.getRealPath("/") + "recenzije.xml")));
			e.writeObject(sveRecenzije);
			e.close();
			
			return "okej";
		}
				
		
		return "notokej";
	}
//******************************************** PRETRAGA PRODAVNICA **************************************************************
	@GET
	@Path("/prodavnice/pretraga/{srcin}")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Prodavnica> getPronadjeneProdavnice(@PathParam("srcin") String srcin) throws FileNotFoundException
	{

		System.out.println("SRCIN JE ZA PRODAVNICU: " + srcin);
		
		ArrayList<Prodavnica> sveProdavnice = getProdavnice();
		ArrayList<Prodavnica> pronadjeneProdavnice = new ArrayList<Prodavnica>(); 
		
		System.out.println("USAO U PRAVU METODU ");
		
		for (Prodavnica prodavnica : sveProdavnice) 
		{	
	
				if((prodavnica.getNaziv().trim().toLowerCase().contains(srcin.trim())) ||
						(prodavnica.getDrzava().trim().toLowerCase().contains(srcin.trim())))
				{
					pronadjeneProdavnice.add(prodavnica);
				}
		}
		
		System.out.println("PRONASAO: " + pronadjeneProdavnice.size() + " , prodavnica");
		return pronadjeneProdavnice;
	}
//******************************************** PRETRAGA PROIZVODA **************************************************************
	@GET
	@Path("/proizvodi/pretraga/{srcin}")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Proizvod> getPronadjeniProizvodi(@PathParam("srcin") String srcin) throws FileNotFoundException
	{
		Prodavnica aktivnaProdavnica = (Prodavnica) ctx.getAttribute("trenutnaProdavnica");
		String storeId = aktivnaProdavnica.getSifra();

		System.out.println("SRCIN JE ZA PROIZVOD: " + srcin);
		
		ArrayList<Proizvod> sviProizvodi = getProizvodi();
		ArrayList<Proizvod> pronadjeniProizvodi = new ArrayList<Proizvod>(); 
		
		System.out.println("USAO U PRAVU METODU ");
		
		for (Proizvod proizvod : sviProizvodi) 
		{	
			if(srcin.matches("\\d*"))
			{
				double dabsrcin = Double.valueOf(srcin);
				if((proizvod.getProdavnica().trim().equals(storeId.trim())) &&
						((((Double.valueOf(proizvod.getTezina()))-(Double.valueOf(proizvod.getTezina()))/10 ) <= (Double.valueOf(srcin)) && (Double.valueOf(srcin))  <= ((Double.valueOf(proizvod.getTezina()))+(Double.valueOf(proizvod.getTezina()))/10 )) ||
						((((Double.valueOf(proizvod.getDimenzija()))-(Double.valueOf(proizvod.getDimenzija()))/10 ) <= (Double.valueOf(srcin)) && (Double.valueOf(srcin))  <= ((Double.valueOf(proizvod.getDimenzija()))+(Double.valueOf(proizvod.getDimenzija()))/10 ))) ||
						((((Double.valueOf(proizvod.getJedinicnaCena()))-(Double.valueOf(proizvod.getJedinicnaCena()))/10 ) <= (Double.valueOf(srcin)) && (Double.valueOf(srcin))  <= ((Double.valueOf(proizvod.getJedinicnaCena()))+(Double.valueOf(proizvod.getJedinicnaCena()))/10 ))) ||
						((((Double.valueOf(proizvod.getKolicinaUMagacinu()))-(Double.valueOf(proizvod.getKolicinaUMagacinu()))/10 ) <= (Double.valueOf(srcin)) && (Double.valueOf(srcin))  <= ((Double.valueOf(proizvod.getKolicinaUMagacinu()))+(Double.valueOf(proizvod.getKolicinaUMagacinu()))/10 )))))
				{
					pronadjeniProizvodi.add(proizvod);
				}
						
			}
			else
			{
				if((proizvod.getProdavnica().trim().equals(storeId.trim())) && 
						((proizvod.getNaziv().trim().toLowerCase().contains(srcin.trim().toLowerCase())) ||
						(proizvod.getOpis().toLowerCase().contains(srcin.trim().toLowerCase())) ||
						(proizvod.getKategorijaProizvoda().toLowerCase().contains(srcin.trim().toLowerCase())) ||
						(proizvod.getBoja().toLowerCase().contains(srcin.trim().toLowerCase())) ||
						(proizvod.getZemljaProizvodnje().toLowerCase().contains(srcin.trim().toLowerCase()))))
				{
					pronadjeniProizvodi.add(proizvod);
				}
			}
		}
		
		System.out.println("PRONASAO: " + pronadjeniProizvodi.size() + " , proizvoda");
		return pronadjeniProizvodi;
	}
//******************************************** DODATNE FUNKCIJE **************************************************************
	private RegistrovaniKorisnici getKorisnici() throws FileNotFoundException 
	{
		RegistrovaniKorisnici korisnici = (RegistrovaniKorisnici) ctx.getAttribute("registrovaniKorisnici");
		if (korisnici == null) 
		{
			String putanja = ctx.getRealPath("/") + "korisnici.xml";
			korisnici = new RegistrovaniKorisnici(putanja);
			System.out.println(ctx.getRealPath(""));
			ctx.setAttribute("registrovaniKorisnici", korisnici);
		}
		return korisnici;
	}
	
	private ArrayList<Prodavnica> getProdavnice() throws FileNotFoundException
	{
		ArrayList<Prodavnica> prodavnice = (ArrayList<Prodavnica>) ctx.getAttribute("registrovaneProdavnice");
		if(prodavnice == null)
		{
			String putanja = ctx.getRealPath("/") + "prodavnice.xml";
			prodavnice = new ArrayList<Prodavnica>();
			
//			XMLEncoder e = new XMLEncoder(
//	                new BufferedOutputStream(
//	                    new FileOutputStream(ctx.getRealPath("/") + "prodavnice.xml")));
//			e.writeObject(prodavnice);
//			e.close();
			
			XMLDecoder d = new XMLDecoder(
	                new BufferedInputStream(
	                    new FileInputStream(putanja)));
			prodavnice = (ArrayList<Prodavnica>) d.readObject();
			d.close();
			
			System.out.println(ctx.getRealPath(""));
			ctx.setAttribute("registrovaneProdavnice", prodavnice);
		}
		return prodavnice;
	}
	
	private ArrayList<Dostavljaci> getDostavljaci() throws FileNotFoundException
	{
		ArrayList<Dostavljaci> dostavljaci = (ArrayList<Dostavljaci>) ctx.getAttribute("dostavljaci");
		if(dostavljaci == null)
		{
			String putanja = ctx.getRealPath("/") + "dostavljaci.xml";
			dostavljaci = new ArrayList<Dostavljaci>();
			
//			XMLEncoder e = new XMLEncoder(
//	                new BufferedOutputStream(
//	                    new FileOutputStream(ctx.getRealPath("/") + "dostavljaci.xml")));
//			e.writeObject(dostavljaci);
//			e.close();
			
			XMLDecoder d = new XMLDecoder(
	                new BufferedInputStream(
	                    new FileInputStream(putanja)));
			dostavljaci = (ArrayList<Dostavljaci>) d.readObject();
			d.close();
			
			System.out.println(ctx.getRealPath(""));
			ctx.setAttribute("dostavljaci", dostavljaci);
		}
		return dostavljaci;
	}
	
	private ArrayList<KategorijaProizvoda> getKategorije() throws FileNotFoundException
	{
		ArrayList<KategorijaProizvoda> kategorije = (ArrayList<KategorijaProizvoda>) ctx.getAttribute("kategorije");
		if(kategorije == null)
		{
			String putanja = ctx.getRealPath("/") + "kategorije.xml";
			kategorije = new ArrayList<KategorijaProizvoda>();
			
//			XMLEncoder e = new XMLEncoder(
//	                new BufferedOutputStream(
//	                    new FileOutputStream(ctx.getRealPath("/") + "kategorije.xml")));
//			e.writeObject(kategorije);
//			e.close();
//			
			XMLDecoder d = new XMLDecoder(
	                new BufferedInputStream(
	                    new FileInputStream(putanja)));
			kategorije = (ArrayList<KategorijaProizvoda>) d.readObject();
			d.close();
			
			System.out.println(ctx.getRealPath(""));
			ctx.setAttribute("kategorije", kategorije);
		}
		return kategorije;
	}
	
	private ArrayList<Proizvod> getProizvodi() throws FileNotFoundException
	{
		ArrayList<Proizvod> proizvodi = (ArrayList<Proizvod>) ctx.getAttribute("proizvodi");
		if(proizvodi == null)
		{
			String putanja = ctx.getRealPath("/") + "proizvodi.xml";
			proizvodi = new ArrayList<Proizvod>();
			
//			XMLEncoder e = new XMLEncoder(
//	                new BufferedOutputStream(
//	                    new FileOutputStream(ctx.getRealPath("/") + "proizvodi.xml")));
//			e.writeObject(proizvodi);
//			e.close();
			
			XMLDecoder d = new XMLDecoder(
	                new BufferedInputStream(
	                    new FileInputStream(putanja)));
			proizvodi = (ArrayList<Proizvod>) d.readObject();
			d.close();
			
			System.out.println(ctx.getRealPath(""));
			ctx.setAttribute("proizvodi", proizvodi);
		}
		return proizvodi;
	}
	
	private ArrayList<Kupovina> getIstorijaKupovina() throws FileNotFoundException
	{
		ArrayList<Kupovina> istorijaKupovina = (ArrayList<Kupovina>) ctx.getAttribute("istorijaKupovina");
		if(istorijaKupovina == null)
		{
			String putanja = ctx.getRealPath("/") + "istorijaKupovina.xml";
			System.out.println(putanja);
			istorijaKupovina = new ArrayList<Kupovina>();
			
//			XMLEncoder e = new XMLEncoder(
//	                new BufferedOutputStream(
//	                    new FileOutputStream(ctx.getRealPath("/") + "istorijaKupovina.xml")));
//			e.writeObject(istorijaKupovina);
//			e.close();
			
			XMLDecoder d = new XMLDecoder(
	                new BufferedInputStream(
	                    new FileInputStream(putanja)));
			istorijaKupovina = (ArrayList<Kupovina>) d.readObject();
			d.close();
			
			System.out.println(ctx.getRealPath(""));
			ctx.setAttribute("istorijaKupovina", istorijaKupovina);
		}
		return istorijaKupovina;
	}
	
	private ArrayList<Proizvod> getProizvodiUKorpi() throws FileNotFoundException
	{
		ArrayList<Proizvod> proizvodiUKorpi = (ArrayList<Proizvod>) ctx.getAttribute("proizvodiUKorpi");
		if(proizvodiUKorpi == null)
		{
			String putanja = ctx.getRealPath("/") + "proizvodiUKorpi.xml";
			proizvodiUKorpi = new ArrayList<Proizvod>();
			
			XMLEncoder e = new XMLEncoder(
	                new BufferedOutputStream(
	                    new FileOutputStream(ctx.getRealPath("/") + "proizvodiUKorpi.xml")));
			e.writeObject(proizvodiUKorpi);
			e.close();
			
			XMLDecoder d = new XMLDecoder(
	                new BufferedInputStream(
	                    new FileInputStream(putanja)));
			proizvodiUKorpi = (ArrayList<Proizvod>) d.readObject();
			d.close();
			
			System.out.println(ctx.getRealPath(""));
			ctx.setAttribute("proizvodiUKorpi", proizvodiUKorpi);
		}
		return proizvodiUKorpi;
	}
	
	private ArrayList<Proizvod> getProizvodiSaListeZelja() throws FileNotFoundException
	{
		ArrayList<Proizvod> listaZelja = (ArrayList<Proizvod>) ctx.getAttribute("listaZelja");
		if(listaZelja == null)
		{
			String putanja = ctx.getRealPath("/") + "wishList.xml";
			listaZelja = new ArrayList<Proizvod>();
			
			XMLEncoder e = new XMLEncoder(
	                new BufferedOutputStream(
	                    new FileOutputStream(ctx.getRealPath("/") + "wishList.xml")));
			e.writeObject(listaZelja);
			e.close();
			
			XMLDecoder d = new XMLDecoder(
	                new BufferedInputStream(
	                    new FileInputStream(putanja)));
			listaZelja = (ArrayList<Proizvod>) d.readObject();
			d.close();
			
			System.out.println(ctx.getRealPath(""));
			ctx.setAttribute("listaZelja", listaZelja);
		}
		return listaZelja;
	}
	
	private ArrayList<Proizvod> getPreporuceniProizvodi() throws FileNotFoundException
	{
		ArrayList<Proizvod> preporuceniProizvodi = (ArrayList<Proizvod>) ctx.getAttribute("preporuceniProizvodi");
		if(preporuceniProizvodi == null)
		{
			String putanja = ctx.getRealPath("/") + "preporuceniProizvodi.xml";
			preporuceniProizvodi = new ArrayList<Proizvod>();
			
			XMLEncoder e = new XMLEncoder(
	                new BufferedOutputStream(
	                    new FileOutputStream(ctx.getRealPath("/") + "preporuceniProizvodi.xml")));
			e.writeObject(preporuceniProizvodi);
			e.close();
			
			XMLDecoder d = new XMLDecoder(
	                new BufferedInputStream(
	                    new FileInputStream(putanja)));
			preporuceniProizvodi = (ArrayList<Proizvod>) d.readObject();
			d.close();
			
			System.out.println(ctx.getRealPath(""));
			ctx.setAttribute("preporuceniProizvodi", preporuceniProizvodi);
		}
		return preporuceniProizvodi;
	}
	
	private ArrayList<Recenzija> getSveRecenzije() throws FileNotFoundException
	{
		ArrayList<Recenzija> recenzije = (ArrayList<Recenzija>) ctx.getAttribute("recenzije");
		if(recenzije == null)
		{
			String putanja = ctx.getRealPath("/") + "recenzije.xml";
			recenzije = new ArrayList<Recenzija>();
			
//			XMLEncoder e = new XMLEncoder(
//	                new BufferedOutputStream(
//	                    new FileOutputStream(ctx.getRealPath("/") + "recenzije.xml")));
//			e.writeObject(recenzije);
//			e.close();
			
			XMLDecoder d = new XMLDecoder(
	                new BufferedInputStream(
	                    new FileInputStream(putanja)));
			recenzije = (ArrayList<Recenzija>) d.readObject();
			d.close();
			
			System.out.println(ctx.getRealPath(""));
			ctx.setAttribute("recenzije", recenzije);
		}
		return recenzije;
	}

}