package modeli;

import java.util.ArrayList;
/*
 * za svakog dostavljaca malom tarifom ce se smatrati proizvod tezine manje od 2kg i najvece dimenzije manje od 50 cm
 * srednjom tarifom ce se smatrati proizvodi tezine izmedju  2 i 10kg i najvece dimenzije izmedju 50 i 10 cm
 * velikom tarifom ce se smatrati proizvod tezine preko 10 kg i dimenzije najvece preko 70 cm
 */
public class Dostavljaci 
{
	private String sifra;
	private String naziv;
	private String opis;
	private String drzavePoslovanja;
	private String malaTarifa;
	private String srednjaTarifa;
	private String velikaTarifa;
	
	
	public Dostavljaci()
	{
		
	}
	
	

	public Dostavljaci(String sifra, String naziv, String opis, String drzavePoslovanja, String malaTarifa,
			String srednjaTarifa, String velikaTarifa) {
		super();
		this.sifra = sifra;
		this.naziv = naziv;
		this.opis = opis;
		this.drzavePoslovanja = drzavePoslovanja;
		this.malaTarifa = malaTarifa;
		this.srednjaTarifa = srednjaTarifa;
		this.velikaTarifa = velikaTarifa;
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


	public String getOpis() {
		return opis;
	}


	public void setOpis(String opis) {
		this.opis = opis;
	}


	public String getDrzavePoslovanja() {
		return drzavePoslovanja;
	}


	public void setDrzavePoslovanja(String drzavePoslovanja) {
		this.drzavePoslovanja = drzavePoslovanja;
	}


	public String getMalaTarifa() {
		return malaTarifa;
	}


	public void setMalaTarifa(String malaTarifa) {
		this.malaTarifa = malaTarifa;
	}


	public String getSrednjaTarifa() {
		return srednjaTarifa;
	}


	public void setSrednjaTarifa(String srednjaTarifa) {
		this.srednjaTarifa = srednjaTarifa;
	}


	public String getVelikaTarifa() {
		return velikaTarifa;
	}


	public void setVelikaTarifa(String velikaTarifa) {
		this.velikaTarifa = velikaTarifa;
	}
	
	
	
	
}
