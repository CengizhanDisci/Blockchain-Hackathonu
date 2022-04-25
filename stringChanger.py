import sys
from cryptography.fernet import Fernet
import hashlib
import re
import rsa
from rsa import key
from rsa.pkcs1 import encrypt

class dilKontrol:
	def __init__(self,text):
		self.text=text

	def kelimeAyirma(self):
		try:
			if(self.text==''):
				raise ValueError
			else:
				kelimeListesi=self.text.split()
				return kelimeListesi
		except ValueError:
			print("Text is not valid")


	def kelimeSayisi(self,kelimeListesi):
		sayac=0
		for i in range(len(kelimeListesi)):
			sayac = sayac+1
		return sayac

	def cumleAyirma(self):
		try:
			if(self.text==''):
				raise ValueError
			else:
				cumleListesi=re.split('[?.:;!]',self.text)
				sayac=0
				for i in range(len(cumleListesi)):
					if(cumleListesi[i]==''):
						sayac=sayac+1
						for b in range(sayac):
							cumleListesi.remove('')
				return cumleListesi
		except ValueError:
			print("Text is not valid")

	
	def cumleSayisi(self,cumleListesi):
		sayac=0
		for i in range(len(cumleListesi)):
			sayac = sayac + 1
		return sayac

	def sesliHarfSayisi(self):
		sesliHarf="aeıioöuüAEIİOÜUÜ"
		sesliSayac=0
		for i in self.text:
			if i in sesliHarf:
				sesliSayac=sesliSayac+1
		return sesliSayac

	def buyukUnluUyumu(self,kelimeListesi):
		kalin_unluler = list("aıouAIOU")
		ince_unluler = list("eiöüEİÖÜ")
		uyan=0
		uymayan=0
		for i in range(len(kelimeListesi)):
			strDeger=str(kelimeListesi[i])
			if(sum(strDeger.count(kalin)for kalin in kalin_unluler))!=0 and (sum(strDeger.count(ince) for ince in ince_unluler)) !=0:
				print(strDeger + " büyük ünlü uyumuna uymaz")
				uymayan=uymayan+1
			else:
				print(strDeger + " büyük ünlü uyumuna uyar")
				uyan=uyan+1
		return uyan,uymayan


class sifrelemeYontemleri:
	def __init__(self,text):
		self.text= text

	def sha256(self):
		try:
			if(self.text==''):
				raise ValueError
			else:
				result = hashlib.sha256(self.text.encode())
				sha256 = result.hexdigest()
				return sha256
		except ValueError:
			print("Text is not valid")

	def sha384(self):
		result = hashlib.sha384(self.text.encode())
		sha384 = result.hexdigest()
		return sha384

	def sha224(self):
		result = hashlib.sha224(self.text.encode())
		sha224 = result.hexdigest()
		return sha224

	def sha512(self):
		result = hashlib.sha512(self.text.encode())
		sha512=result.hexdigest()
		return sha512

	def sha1(self):
		result = hashlib.sha1(self.text.encode())
		sha1=result.hexdigest()
		return sha1

	def md5(self):
		result = hashlib.md5(self.text.encode())
		md5 = result.hexdigest()
		return md5

	def encrypt(self):
		key = Fernet.generate_key()
		fernet=Fernet(key)
		encMessage=fernet.encrypt(self.text.encode())
		return encMessage,key

	def decrypt(self,encMessage,key):
		fernet=Fernet(key)
		decMessage=fernet.decrypt(encMessage).decode()

	def rsaEncrypt(self):
		publicKey, privateKey = rsa.newkeys(512)
		encMessage = rsa.encrypt(self.text.encode(),publicKey)
		return encMessage,privateKey

	def rsaDecrpyt(self,encMessage,privateKey):
		decMessage = rsa.decrypt(encMessage, privateKey).decode()
		return decMessage


class Help:
	def __init__(self):
		cls=dilKontrol("Ayberk. Enes! Cengizhan?")
		cls2=sifrelemeYontemleri("Arş. Gör. Dr. Osman ALTAY.")	
		a=cls.kelimeAyirma()
		b=cls.cumleAyirma()
		c,d= cls2.encrypt()
		e,f=cls2.rsaEncrypt()

		print('''
dilKontrol sınıfı:
		kelimeAyirma() => aldığı text içerisindeki kelimeleri ayırır ve bu kelimelerin listesini döndürür.
		bu sınıf "Ayberk. Enes! Cengizhan?" ile çağrıldığında: (''' + str(cls.kelimeAyirma()) + ''') çıktısını vermektedir."
		kelimeSayisi() => parametre olarak aldığı kelime listesinin içindeki kelimelerin sayısını döner.
		bu sınıf "Ayberk. Enes! Cengizhan?" ile çağrıldığında: (''' + str(cls.kelimeSayisi(a)) + ''') çıktısını vermektedir."
		cumleAyirma()  => aldığı text içerisindeki cümleleri [?.:;!] noktalama işaretlerine göre cümlelerine ayırır ve bu cümlelerin listesini döner.
		bu sınıf "Ayberk. Enes! Cengizhan?" ile çağrıldığında: (''' + str(cls.cumleAyirma()) + ''') çıktısını vermektedir."
		cumleSayisi() => parametre olarak aldığı cümle listesinin içerisindeki cümle sayısını döner.
		bu sınıf "Ayberk. Enes! Cengizhan?" ile çağrıldığında: (''' + str(cls.cumleSayisi(b)) + ''') çıktısını vermektedir."
		sesliHarfSayisi() => aldığı text içerisindeki sesli harflerin sayısını geri döner.
		bu sınıf "Ayberk. Enes! Cengizhan?" ile çağrıldığında: (''' + str(cls.sesliHarfSayisi()) + ''') çıktısını vermektedir."
		buyukUnluUyumu() => aldığı text içerisindeki kelimelerin büyük ünlü uyumuna uyup uymadığını kontrol eder. Uyan ve uymayan kelimelerin sayısını döner.
		bu sınıf "Ayberk. Enes! Cengizhan?" ile çağrıldığında: (''' + str(cls.buyukUnluUyumu(a)) + ''') çıktısını vermektedir."

		sifrelemeYontemleri sınıfı:
		sha256() => aldığı texti 32 bitlik bloklar halinde şifreler.
		bu sınıf "Arş. Gör. Dr. Osman ALTAY." ile çağrıldığında: (''' + str(cls2.sha256()) + ''') çıktısını vermektedir."
		sha384() => aldığı texti 32 bitlik bloklar halinde sha256 gibi şifreler fakat sha256'nın basitleştirilmiş halidir.
		bu sınıf "Arş. Gör. Dr. Osman ALTAY." ile çağrıldığında: (''' + str(cls2.sha384()) + ''') çıktısını vermektedir."
		sha224() => aldığı texti 32 bitlik bloklar halinde sha256 gibi şifreler fakat sha256'nın basitleştirilmiş halidir.
		bu sınıf "Arş. Gör. Dr. Osman ALTAY." ile çağrıldığında: (''' + str(cls2.sha224()) + ''') çıktısını vermektedir."
		sha512() => aldığı texti 64 bitlik bloklar halinde şifreler.
		bu sınıf "Arş. Gör. Dr. Osman ALTAY." ile çağrıldığında: (''' + str(cls2.sha512()) + ''') çıktısını vermektedir."
		sha1()   => md5' e benzeyen 160 bitlik hash fonksiyonudur. Güvenlik açıklıkları nedeniyle kullanımdan kaldırılmıştır.
		bu sınıf "Arş. Gör. Dr. Osman ALTAY." ile çağrıldığında: (''' + str(cls2.sha1()) + ''') çıktısını vermektedir."
		md5()    => aldığı texti 128 bitlik değer olarak döndürür fakat güvenlik açıklıkları vardır.
		bu sınıf "Arş. Gör. Dr. Osman ALTAY." ile çağrıldığında: (''' + str(cls2.md5()) + ''') çıktısını vermektedir."
		encrypt() => fernet ile oluşturulan senkron bir şifreleme algoritmasıdır. İçerisinde oluşan mesajı ve keyi döndürür.
		bu sınıf "Arş. Gör. Dr. Osman ALTAY." ile çağrıldığında: (''' + str(cls2.encrypt()) + ''') çıktısını vermektedir."
		decrypt()  => parametre olarak aldığı encrypt edilmiş mesajı aldığı key ile çözer ve mesajın asıl halini döndürür.
		bu sınıf "Arş. Gör. Dr. Osman ALTAY." ile çağrıldığında: (''' + str(cls2.decrypt(c,d)) + ''') çıktısını vermektedir."
		rsaEncrypt() => rsa ile oluşturulan asenkron bir şifreleme algoritmasıdır. public ve private key oluşturur. aldığı texti
		public key ile şifreler. şifrelenmiş texti ve private keyi döndürür.
		bu sınıf "Arş. Gör. Dr. Osman ALTAY." ile çağrıldığında: (''' + str(cls2.rsaEncrypt()) + ''') çıktısını vermektedir."
		rsaDecrypt()  => parametre olarak aldığı şifrelenmiş mesajı, aldığı private key ile çözerek mesajın asıl halini döndürür.
		bu sınıf "Arş. Gör. Dr. Osman ALTAY." ile çağrıldığında: (''' + str(cls2.rsaDecrpyt(e,f)) + ''') çıktısını vermektedir."
		''')

def main():
	cls=Help()

main()
