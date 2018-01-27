package modeli;

public class Proizvod 
{
	private String sifra; //jedinstvena
	private String prodavnica;
	private String naziv;
	private String boja;
	private String dimenzija;
	private String tezina;
	private String zemljaProizvodnje;
	private String nazivProizvodjaca;
	private String jedinicnaCena;
	private String kategorijaProizvoda;
	private String slika;
	private String video;
	private String ocena;
	private String opis;
	private Recenzija recenzija;
	private String kolicinaUMagacinu;
	private String wishKorisnik;
	
	public Proizvod()
	{
		
	}
	
	
	
	public Proizvod(String sifra, String prodavnica, String naziv, String boja, String dimenzija, String tezina,
			String zemljaProizvodnje, String nazivProizvodjaca, String jedinicnaCena, String kategorijaProizvoda,
			String slika, String video, String ocena, String opis, Recenzija recenzija, String kolicinaUMagacinu,
			String wishKorisnik) {

		this.sifra = sifra;
		this.prodavnica = prodavnica;
		this.naziv = naziv;
		this.boja = boja;
		this.dimenzija = dimenzija;
		this.tezina = tezina;
		this.zemljaProizvodnje = zemljaProizvodnje;
		this.nazivProizvodjaca = nazivProizvodjaca;
		this.jedinicnaCena = jedinicnaCena;
		this.kategorijaProizvoda = kategorijaProizvoda;
		this.slika = slika;
		this.video = video;
		this.ocena = ocena;
		this.opis = opis;
		this.recenzija = recenzija;
		this.kolicinaUMagacinu = kolicinaUMagacinu;
		this.wishKorisnik = wishKorisnik;
	}



	public String getWishKorisnik() {
		return wishKorisnik;
	}


	public void setWishKorisnik(String wishKorisnik) {
		this.wishKorisnik = wishKorisnik;
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
	public String getBoja() {
		return boja;
	}
	public void setBoja(String boja) {
		this.boja = boja;
	}
	public String getDimenzija() {
		return dimenzija;
	}
	public void setDimenzija(String dimenzija) {
		this.dimenzija = dimenzija;
	}
	public String getTezina() {
		return tezina;
	}
	public void setTezina(String tezina) {
		this.tezina = tezina;
	}
	public String getZemljaProizvodnje() {
		return zemljaProizvodnje;
	}
	public void setZemljaProizvodnje(String zemljaProizvodnje) {
		this.zemljaProizvodnje = zemljaProizvodnje;
	}
	public String getNazivProizvodjaca() {
		return nazivProizvodjaca;
	}
	public void setNazivProizvodjaca(String nazivProizvodjaca) {
		this.nazivProizvodjaca = nazivProizvodjaca;
	}
	public String getJedinicnaCena() {
		return jedinicnaCena;
	}
	public void setJedinicnaCena(String jedinicnaCena) {
		this.jedinicnaCena = jedinicnaCena;
	}
	public String getKategorijaProizvoda() {
		return kategorijaProizvoda;
	}
	public void setKategorijaProizvoda(String kategorijaProizvoda) {
		this.kategorijaProizvoda = kategorijaProizvoda;
	}
	public String getSlika() {
		return slika;
	}
	public void setSlika(String slika) {
		this.slika = slika;
	}
	public String getVideo() {
		return video;
	}
	public void setVideo(String video) {
		this.video = video;
	}
	public String getOcena() {
		return ocena;
	}
	public void setOcena(String ocena) {
		this.ocena = ocena;
	}
	public Recenzija getRecenzija() {
		return recenzija;
	}
	public void setRecenzija(Recenzija recenzija) {
		this.recenzija = recenzija;
	}
	public String getKolicinaUMagacinu() {
		return kolicinaUMagacinu;
	}
	public void setKolicinaUMagacinu(String kolicinaUMagacinu) {
		this.kolicinaUMagacinu = kolicinaUMagacinu;
	}

	public String getOpis() {
		return opis;
	}

	public void setOpis(String opis) {
		this.opis = opis;
	}

	public String getProdavnica() {
		return prodavnica;
	}

	public void setProdavnica(String prodavnica) {
		this.prodavnica = prodavnica;
	}
	
	
}
