package modeli;

import java.beans.XMLDecoder;
import java.beans.XMLEncoder;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.util.HashMap;

import javax.swing.JButton;

public class RegistrovaniKorisnici 
{
	static private HashMap<String, Korisnik> postojeciKorisnici = new HashMap<String, Korisnik>();

	
	public RegistrovaniKorisnici(String putanja) throws FileNotFoundException
	{
		//postojeciKorisnici = new Map<String, String>();
		Korisnik admin = new Korisnik("animo", "animo", "Dusan", "Jeftic", "administrator", "300003",
				"dukica@gmail.com", "Bulevar Druga Tita", "Srbija");
		
		//DESERIJALIZACIJA
		XMLDecoder d = new XMLDecoder(
                new BufferedInputStream(
                    new FileInputStream(putanja)));
		postojeciKorisnici = (HashMap<String, Korisnik>) d.readObject();

		d.close();

	}

	public HashMap<String, Korisnik> getPostojeciKorisnici() {
		return postojeciKorisnici;
	}

	public void setPostojeciKorisnici(HashMap<String, Korisnik> postojeciKorisnici) {
		this.postojeciKorisnici = postojeciKorisnici;
	}
	
	
}
