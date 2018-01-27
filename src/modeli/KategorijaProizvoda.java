package modeli;

public class KategorijaProizvoda 
{
	private String naziv; //jedinstven
	private String opis;
	private String podkategorija;
	
	public KategorijaProizvoda()
	{
		
	}
	
	public KategorijaProizvoda(String naziv, String opis, String podkategorija) 
	{
		this.naziv = naziv;
		this.opis = opis;
		this.podkategorija = podkategorija;
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
	public String getNadkategorija() {
		return podkategorija;
	}
	public void setNadkategorija(String podkategorija) {
		this.podkategorija = podkategorija;
	}
	
	
}
