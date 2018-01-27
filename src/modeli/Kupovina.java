package modeli;

import java.util.ArrayList;

public class Kupovina 
{
	private String sifra;
	private String kupac;
	private String prodavnica;
	private String proizvod;
	private String kolicinaProizvoda;
	private String nazivDostavljaca;
	private String trajanjePrenosa;
	private String cenaPrenosa;
	private String ukupnaCena;
	private String kategorijaProizvoda;
	
	public Kupovina()
	{
		
	}
	
	

	public Kupovina(String sifra, String kupac, String prodavnica, String proizvod, String kolicinaProizvoda,
			String nazivDostavljaca, String trajanjePrenosa, String cenaPrenosa, String ukupnaCena, String kategorijaProizvoda) {
		super();
		this.sifra = sifra;
		this.kupac = kupac;
		this.prodavnica = prodavnica;
		this.proizvod = proizvod;
		this.kolicinaProizvoda = kolicinaProizvoda;
		this.nazivDostavljaca = nazivDostavljaca;
		this.trajanjePrenosa = trajanjePrenosa;
		this.cenaPrenosa = cenaPrenosa;
		this.ukupnaCena = ukupnaCena;
		this.kategorijaProizvoda = kategorijaProizvoda;
	}

	

	public String getKategorijaProizvoda() {
		return kategorijaProizvoda;
	}



	public void setKategorijaProizvoda(String kategorijaProizvoda) {
		this.kategorijaProizvoda = kategorijaProizvoda;
	}



	public String getSifra() {
		return sifra;
	}

	public void setSifra(String sifra) {
		this.sifra = sifra;
	}

	public String getKupac() {
		return kupac;
	}

	public void setKupac(String kupac) {
		this.kupac = kupac;
	}

	public String getProdavnica() {
		return prodavnica;
	}

	public void setProdavnica(String prodavnica) {
		this.prodavnica = prodavnica;
	}

	public String getProizvod() {
		return proizvod;
	}

	public void setProizvod(String proizvod) {
		this.proizvod = proizvod;
	}

	public String getKolicinaProizvoda() {
		return kolicinaProizvoda;
	}

	public void setKolicinaProizvoda(String kolicinaProizvoda) {
		this.kolicinaProizvoda = kolicinaProizvoda;
	}

	public String getNazivDostavljaca() {
		return nazivDostavljaca;
	}

	public void setNazivDostavljaca(String nazivDostavljaca) {
		this.nazivDostavljaca = nazivDostavljaca;
	}

	public String getTrajanjePrenosa() {
		return trajanjePrenosa;
	}

	public void setTrajanjePrenosa(String trajanjePrenosa) {
		this.trajanjePrenosa = trajanjePrenosa;
	}

	public String getCenaPrenosa() {
		return cenaPrenosa;
	}

	public void setCenaPrenosa(String cenaPrenosa) {
		this.cenaPrenosa = cenaPrenosa;
	}

	public String getUkupnaCena() {
		return ukupnaCena;
	}

	public void setUkupnaCena(String ukupnaCena) {
		this.ukupnaCena = ukupnaCena;
	}
	
	
	
	
}
