package modeli;

public class PrijavaKorisnika
{
	private String korisnickoIme;
	private String lozinka;
	
	public PrijavaKorisnika()
	{
		
	}
	public PrijavaKorisnika(String korisnickoIme, String lozinka) 
	{
		this.korisnickoIme = korisnickoIme;
		this.lozinka = lozinka;
	}
	
	public String getKorisnickoIme() 
	{
		return korisnickoIme;
	}
	public void setKorisnickoIme(String korisnickoIme) 
	{
		this.korisnickoIme = korisnickoIme;
	}
	public String getLozinka() 
	{
		return lozinka;
	}
	public void setLozinka(String lozinka) 
	{
		this.lozinka = lozinka;
	}
	
	
}
