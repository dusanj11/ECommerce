package modeli;

public class Recenzija 
{
	private String sifra;
	private String korisnik;
	private String datum;
	private String ocena;
	private String komentar;
	private String sifraProizvoda;
	
	public Recenzija()
	{
		
	}
	
	
	
	public Recenzija(String sifra, String korisnik, String datum, String ocena, String komentar,
			String sifraProizvoda) {
		super();
		this.sifra = sifra;
		this.korisnik = korisnik;
		this.datum = datum;
		this.ocena = ocena;
		this.komentar = komentar;
		this.sifraProizvoda = sifraProizvoda;
	}



	public String getSifraProizvoda() {
		return sifraProizvoda;
	}


	public void setSifraProizvoda(String sifraProizvoda) {
		this.sifraProizvoda = sifraProizvoda;
	}


	public void setKorisnik(String korisnik) {
		this.korisnik = korisnik;
	}


	public String getSifra() {
		return sifra;
	}
	public void setSifra(String sifra) {
		this.sifra = sifra;
	}
	
	public String getKorisnik() {
		return korisnik;
	}

	public String getDatum() {
		return datum;
	}
	public void setDatum(String datum) {
		this.datum = datum;
	}
	public String getOcena() {
		return ocena;
	}
	public void setOcena(String ocena) {
		this.ocena = ocena;
	}
	public String getKomentar() {
		return komentar;
	}
	public void setKomentar(String komentar) {
		this.komentar = komentar;
	}
	
	
}
