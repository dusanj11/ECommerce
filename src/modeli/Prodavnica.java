package modeli;

public class Prodavnica 
{
	private String sifra; //jedinstvena
	private String naziv; //jedinstven
	private String adresa;
	private String drzava;
	private String telefon;
	private String email;
	private String odgovorniProdavac;
	private double ocena;
	private Recenzija recenzija;
	
	public Prodavnica()
	{
		
	}
	
	public Prodavnica(String sifra, String naziv, String adresa, String drzava, String telefon, String email,
			String odgovorniProdavac, double ocena, Recenzija recenzija) 
	{
		this.sifra = sifra;
		this.naziv = naziv;
		this.adresa = adresa;
		this.drzava = drzava;
		this.telefon = telefon;
		this.email = email;
		this.odgovorniProdavac = odgovorniProdavac;
		this.ocena = ocena;
		this.recenzija = recenzija;
	}
	public String getSifra() {
		return sifra;
	}
	public void setSifra(String sifra) {
		this.sifra = sifra;
	}
	public String getNaziv() {
		return naziv;
	}
	public void setNaziv(String naziv) {
		this.naziv = naziv;
	}
	public String getAdresa() {
		return adresa;
	}
	public void setAdresa(String adresa) {
		this.adresa = adresa;
	}
	public String getDrzava() {
		return drzava;
	}
	public void setDrzava(String drzava) {
		this.drzava = drzava;
	}
	public String getTelefon() {
		return telefon;
	}
	public void setTelefon(String telefon) {
		this.telefon = telefon;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getOdgovorniProdavac() {
		return odgovorniProdavac;
	}
	public void setOdgovorniProdavac(String odgovorniProdavac) {
		this.odgovorniProdavac = odgovorniProdavac;
	}
	public double getOcena() {
		return ocena;
	}
	public void setOcena(double ocena) {
		this.ocena = ocena;
	}
	public Recenzija getRecenzija() {
		return recenzija;
	}
	public void setRecenzija(Recenzija recenzija) {
		this.recenzija = recenzija;
	}
	
	
}
