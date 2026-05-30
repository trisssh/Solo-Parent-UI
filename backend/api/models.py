from django.db import models
from django.utils.html import MAX_URL_LENGTH
from multiselectfield import MultiSelectField
from django.core.validators import MinLengthValidator
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import choices
from phonenumber_field.modelfields import PhoneNumberField
from .utils.generate_uuid import generate_uuid

# Create your models here.
class UserManager(BaseUserManager):
    def _create_user(self, password, email, **extra_fields):
        if email:
            email = self.normalize_email(email)

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, password, email, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(password, email, **extra_fields)

    def create_staff(
        self, 
        password, 
        email, 
        **extra_fields
    ):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(password, email, **extra_fields)

    def create_superuser(
        self, 
        password, 
        email, 
        **extra_fields
    ):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(password, email, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=180, unique=True)
    password = models.CharField(
        max_length=180,
        validators=[MinLengthValidator(8)]
    )

    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'

    objects = UserManager()

    def __str__(self):
        return self.email or self.username

class Parent(models.Model):
    uuid = models.CharField(
        max_length=10,
        editable=False, 
        unique=True, 
        default=generate_uuid
    )
    first_name = models.CharField(max_length=180)
    middle_name = models.CharField(max_length=180, blank=True, null=True)
    last_name = models.CharField(max_length=180)
    suffix = models.CharField(max_length=180, blank=True, null=True)
    phone = PhoneNumberField(unique=True)
    religion = models.CharField(max_length=32)
    birthday = models.DateField()

    GENDER_CHOICES = (
        ('female', 'Female'),
        ('male', 'Male'),
    )
    gender = models.CharField(
        max_length=32,
        choices=GENDER_CHOICES,
        default='female'
    )

    CIVIL_STATUS_CHOICES = (
        ('Single', 'Single'),
        ('Married', 'Married'),
        ('Widowed', 'Widowed'),
        ('Legally Separated', 'Legally Separated'),
        ('Annulled', 'Annulled'),
    )
    civil_status = models.CharField(
        max_length=32,
        choices=CIVIL_STATUS_CHOICES,
        default='Single'
    )

    house = models.CharField(max_length=180)
    street = models.CharField(max_length=180)

    BARANGAY_CHOICES = (
        ('Greenhills', 'Greenhills'),
        ('Maytunas', 'Maytunas'),
        ('Kabayanan', 'Kabayanan'),
        ('Salapan', 'Salapan'),
        ('West Crame', 'West Crame'),
        ('Onse', 'Onse'),
    )
    barangay = models.CharField(
        max_length=180,
        choices=BARANGAY_CHOICES,
        default='Greenhills'
    )

    subdivision = models.CharField(max_length=180, blank=True, null=True)

    CITY_CHOICES = (
        ('City of Batac', 'City of Batac'),
        ('City of Laoag', 'City of Laoag'),
        ('City of Candon', 'City of Candon'),
        ('City of Vigan', 'City of Vigan'),
        ('City of San Fernando', 'City of San Fernando'),
        ('City of Alaminos', 'City of Alaminos'),
        ('City of Dagupan', 'City of Dagupan'),
        ('City of San Carlos', 'City of San Carlos'),
        ('City of Urdaneta', 'City of Urdaneta'),
        ('Tuguegarao City', 'Tuguegarao City'),
        ('City of Cauayan', 'City of Cauayan'),
        ('City of Ilagan', 'City of Ilagan'),
        ('City of Santiago', 'City of Santiago'),
        ('City of Balanga', 'City of Balanga'),
        ('City of Baliwag', 'City of Baliwag'),
        ('City of Malolos', 'City of Malolos'),
        ('City of Meycauayan', 'City of Meycauayan'),
        ('City of San Jose Del Monte', 'City of San Jose Del Monte'),
        ('City of Cabanatuan', 'City of Cabanatuan'),
        ('City of Gapan', 'City of Gapan'),
        ('Science City of Muñoz', 'Science City of Muñoz'),
        ('City of Palayan', 'City of Palayan'),
        ('San Jose City', 'San Jose City'),
        ('City of Angeles', 'City of Angeles'),
        ('Mabalacat City', 'Mabalacat City'),
        ('City of San Fernando', 'City of San Fernando'),
        ('City of Tarlac', 'City of Tarlac'),
        ('City of Olongapo', 'City of Olongapo'),
        ('Batangas City', 'Batangas City'),
        ('City of Calaca', 'City of Calaca'),
        ('City of Lipa', 'City of Lipa'),
        ('City of Sto. Tomas', 'City of Sto. Tomas'),
        ('City of Tanauan', 'City of Tanauan'),
        ('City of Bacoor', 'City of Bacoor'),
        ('City of Cavite', 'City of Cavite'),
        ('City of Dasmariñas', 'City of Dasmariñas'),
        ('City of General Trias', 'City of General Trias'),
        ('City of Imus', 'City of Imus'),
        ('City of Tagaytay', 'City of Tagaytay'),
        ('City of Trece Martires', 'City of Trece Martires'),
        ('City of Cabuyao', 'City of Cabuyao'),
        ('City of Biñan', 'City of Biñan'),
        ('City of Calamba', 'City of Calamba'),
        ('City of San Pablo', 'City of San Pablo'),
        ('City of San Pedro', 'City of San Pedro'),
        ('City of Santa Rosa', 'City of Santa Rosa'),
        ('City of Lucena', 'City of Lucena'),
        ('City of Tayabas', 'City of Tayabas'),
        ('City of Antipolo', 'City of Antipolo'),
        ('City of Calapan', 'City of Calapan'),
        ('City of Puerto Princesa', 'City of Puerto Princesa'),
        ('City of Legazpi', 'City of Legazpi'),
        ('City of Ligao', 'City of Ligao'),
        ('City of Tabaco', 'City of Tabaco'),
        ('City of Iriga', 'City of Iriga'),
        ('City of Naga', 'City of Naga'),
        ('City of Masbate', 'City of Masbate'),
        ('City of Sorsogon', 'City of Sorsogon'),
        ('City of Roxas', 'City of Roxas'),
        ('City of Iloilo', 'City of Iloilo'),
        ('City of Passi', 'City of Passi'),
        ('City of Bacolod', 'City of Bacolod'),
        ('City of Bago', 'City of Bago'),
        ('City of Cadiz', 'City of Cadiz'),
        ('City of Escalante', 'City of Escalante'),
        ('City of Himamaylan', 'City of Himamaylan'),
        ('City of Kabankalan', 'City of Kabankalan'),
        ('City of La Carlota', 'City of La Carlota'),
        ('City of Sagay', 'City of Sagay'),
        ('City of San Carlos', 'City of San Carlos'),
        ('City of Silay', 'City of Silay'),
        ('City of Sipalay', 'City of Sipalay'),
        ('City of Talisay', 'City of Talisay'),
        ('City of Victorias', 'City of Victorias'),
        ('City of Tagbilaran', 'City of Tagbilaran'),
        ('City of Bogo', 'City of Bogo'),
        ('City of Carcar', 'City of Carcar'),
        ('City of Cebu', 'City of Cebu'),
        ('Danao City', 'Danao City'),
        ('City of Lapu-Lapu', 'City of Lapu-Lapu'),
        ('City of Mandaue', 'City of Mandaue'),
        ('City of Naga', 'City of Naga'),
        ('City of Talisay', 'City of Talisay'),
        ('City of Toledo', 'City of Toledo'),
        ('City of Bais', 'City of Bais'),
        ('City of Bayawan', 'City of Bayawan'),
        ('City of Canlaon', 'City of Canlaon'),
        ('City of Dumaguete', 'City of Dumaguete'),
        ('City of Guihulngan', 'City of Guihulngan'),
        ('City of Tanjay', 'City of Tanjay'),
        ('City of Borongan', 'City of Borongan'),
        ('City of Baybay', 'City of Baybay'),
        ('Ormoc City', 'Ormoc City'),
        ('City of Tacloban', 'City of Tacloban'),
        ('City of Calbayog', 'City of Calbayog'),
        ('City of Catbalogan', 'City of Catbalogan'),
        ('City of Maasin', 'City of Maasin'),
        ('City of Dapitan', 'City of Dapitan'),
        ('City of Dipolog', 'City of Dipolog'),
        ('City of Pagadian', 'City of Pagadian'),
        ('City of Zamboanga', 'City of Zamboanga'),
        ('City of Isabela', 'City of Isabela'),
        ('City of Malaybalay', 'City of Malaybalay'),
        ('City of Valencia', 'City of Valencia'),
        ('City of Iligan', 'City of Iligan'),
        ('City of Oroquieta', 'City of Oroquieta'),
        ('City of Ozamiz', 'City of Ozamiz'),
        ('City of Tangub', 'City of Tangub'),
        ('City of Cagayan De Oro', 'City of Cagayan De Oro'),
        ('City of El Salvador', 'City of El Salvador'),
        ('City of Gingoog', 'City of Gingoog'),
        ('City of Panabo', 'City of Panabo'),
        ('Island Garden City of Samal', 'Island Garden City of Samal'),
        ('City of Tagum', 'City of Tagum'),
        ('City of Davao', 'City of Davao'),
        ('City of Digos', 'City of Digos'),
        ('City of Mati', 'City of Mati'),
        ('City of Kidapawan', 'City of Kidapawan'),
        ('City of General Santos', 'City of General Santos'),
        ('City of Koronadal', 'City of Koronadal'),
        ('City of Tacurong', 'City of Tacurong'),
        ('City of Manila', 'City of Manila'),
        ('City of Mandaluyong', 'City of Mandaluyong'),
        ('City of Marikina', 'City of Marikina'),
        ('City of Pasig', 'City of Pasig'),
        ('Quezon City', 'Quezon City'),
        ('City of San Juan', 'City of San Juan'),
        ('City of Caloocan', 'City of Caloocan'),
        ('City of Malabon', 'City of Malabon'),
        ('City of Navotas', 'City of Navotas'),
        ('City of Valenzuela', 'City of Valenzuela'),
        ('City of Las Piñas', 'City of Las Piñas'),
        ('City of Makati', 'City of Makati'),
        ('City of Muntinlupa', 'City of Muntinlupa'),
        ('City of Parañaque', 'City of Parañaque'),
        ('Pasay City', 'Pasay City'),
        ('City of Taguig', 'City of Taguig'),
        ('City of Baguio', 'City of Baguio'),
        ('City of Tabuk', 'City of Tabuk'),
        ('City of Butuan', 'City of Butuan'),
        ('City of Cabadbaran', 'City of Cabadbaran'),
        ('City of Bayugan', 'City of Bayugan'),
        ('City of Surigao', 'City of Surigao'),
        ('City of Bislig', 'City of Bislig'),
        ('City of Tandag', 'City of Tandag'),
        ('City of Lamitan', 'City of Lamitan'),
        ('City of Marawi', 'City of Marawi'),
        ('City of Cotabato', 'City of Cotabato'),
    )
    city = models.CharField(
        max_length=180,
        choices=CITY_CHOICES,
        default='City of San Juan'
    )

    PROVINCE_CHOICES = (
        ('National Capital Region', 'National Capital Region'),
        ('Ilocos Norte', 'Ilocos Norte'),
        ('Ilocos Sur', 'Ilocos Sur'),
        ('La Union', 'La Union'),
        ('Pangasinan', 'Pangasinan'),
        ('Batanes', 'Batanes'),
        ('Cagayan', 'Cagayan'),
        ('Isabela', 'Isabela'),
        ('Nueva Vizcaya', 'Nueva Vizcaya'),
        ('Quirino', 'Quirino'),
        ('Bataan', 'Bataan'),
        ('Bulacan', 'Bulacan'),
        ('Nueva Ecija', 'Nueva Ecija'),
        ('Pampanga', 'Pampanga'),
        ('Tarlac', 'Tarlac'),
        ('Zambales', 'Zambales'),
        ('Aurora', 'Aurora'),
        ('Batangas', 'Batangas'),
        ('Cavite', 'Cavite'),
        ('Laguna', 'Laguna'),
        ('Quezon', 'Quezon'),
        ('Rizal', 'Rizal'),
        ('Marinduque', 'Marinduque'),
        ('Occidental Mindoro', 'Occidental Mindoro'),
        ('Oriental Mindoro', 'Oriental Mindoro'),
        ('Palawan', 'Palawan'),
        ('Romblon', 'Romblon'),
        ('Albay', 'Albay'),
        ('Camarines Norte', 'Camarines Norte'),
        ('Camarines Sur', 'Camarines Sur'),
        ('Masbate', 'Masbate'),
        ('Masbate', 'Masbate'),
        ('Sorsogon', 'Sorsogon'),
        ('Aklan', 'Aklan'),
        ('Antique', 'Antique'),
        ('Capiz', 'Capiz'),
        ('Iloilo', 'Iloilo'),
        ('Negros Occidental', 'Negros Occidental'),
        ('Guimaras', 'Guimaras'),
        ('Bohol', 'Bohol'),
        ('Cebu', 'Cebu'),
        ('Negros Oriental', 'Negros Oriental'),
        ('Siquijor', 'Siquijor'),
        ('Eastern Samar', 'Eastern Samar'),
        ('Leyte', 'Leyte'),
        ('Northern Samar', 'Northern Samar'),
        ('Samar', 'Samar'),
        ('Southern Leyte', 'Southern Leyte'),
        ('Biliran', 'Biliran'),
        ('Zamboanga del Norte', 'Zamboanga del Norte'),
        ('Zamboanga del Sur', 'Zamboanga del Sur'),
        ('Zamboanga Sibugay', 'Zamboanga Sibugay'),
        ('Bukidnon', 'Bukidnon'),
        ('Camiguin', 'Camiguin'),
        ('Lanao del Norte', 'Lanao del Norte'),
        ('Misamis Occidental', 'Misamis Occidental'),
        ('Misamis Oriental', 'Misamis Oriental'),
        ('Davao del Norte', 'Davao del Norte'),
        ('Davao del Sur', 'Davao del Sur'),
        ('Davao Oriental', 'Davao Oriental'),
        ('Davao de Oro oro', 'Davao de Oro'),
        ('Davao Occidental', 'Davao Occidental'),
        ('Cotabato', 'Cotabato'),
        ('South Cotabato', 'South Cotabato'),
        ('Sultan Kudarat', 'Sultan Kudarat'),
        ('Sarangani', 'Sarangani'),
        ('Abra', 'Abra'),
        ('Benguet', 'Benguet'),
        ('Ifugao', 'Ifugao'),
        ('Kalinga', 'Kalinga'),
        ('Mountain Province', 'Mountain Province'),
        ('Apayao', 'Apayao'),
        ('Agusan del Norte', 'Agusan del Norte'),
        ('Agusan del Sur', 'Agusan del Sur'),
        ('Surigao del Norte', 'Surigao del Norte'),
        ('Surigao del Sur', 'Surigao del Sur'),
        ('Dinagat Islands', 'Dinagat Islands'),
        ('Basilan', 'Basilan'),
        ('Lanao del Sur', 'Lanao del Sur'),
        ('Sulu', 'Sulu'),
        ('Tawi-Tawi', 'Tawi-Tawi'),
        ('Maguindanao del Norte', 'Maguindanao del Norte'),
        ('Maguindanao del Sur', 'Maguindanao del Sur'),
    )
    province = models.CharField(
        max_length=32,
        choices=PROVINCE_CHOICES,
        default='National Capital Region'
    ) 

    EDUCATION_CHOICES = (
        ('No Education', 'No Education'),
        ('Kindergarten Level', 'Kindergarten Level'),
        ('Kindergarten Graduate', 'Kindergarten Graduate'),
        ('Elementary Level', 'Elementary Level'),
        ('Elementary Graduate', 'Elementary Graduate'),
        ('High School Level', 'High School Level'),
        ('High School Graduate', 'High School Graduate'),
        ('Vocational / TVET', 'Vocational / TVET'),
        ('College Level', 'College Level'),
        ('College Graduate', 'College Graduate'),
        ('Post-College', 'Post-College'),
    )
    educational_attainment = models.CharField(
        max_length=32,
        choices=EDUCATION_CHOICES,
        default='Kindergarten'
    )

    occupation = models.CharField(max_length=32)

    EMPLOYMENT_CHOICES = (
        ('Employed', 'Employed'),
        ('Self-employed', 'Self-employed'),
        ('Not Employed', 'Not Employed'),
    )
    employment = models.CharField(
        max_length=32,
        choices=EMPLOYMENT_CHOICES,
        default='Employed' 
    )

    company = models.CharField(max_length=180, blank=True, null=True)

    INCOME_CHOICES = (
        ('Php 20834 and above', 'Php 20834 and above'),
        ('Minimum wage to Php 20833', 'Minimum wage to Php 20833'),
        ('Minimum wage and below', 'Minimum wage and below'),
    )
    monthly_income = models.CharField(
        max_length=64, 
        choices=INCOME_CHOICES
    )
    total_family_income = models.CharField(
        max_length=64, 
        choices=INCOME_CHOICES
    )

    REASON_CHOICES = (
        ('Consequence of rape', 'Birth of a child as a consequence of rape'),
        ('Widow', 'Widow/Widower'),
        ('Spouse of PDL', 'Spouse of Person Deprived of Liberty'),
        ('Spouse of PWD', 'Spouse of Persond with Disability'),
        ('Separated', 'Due to de facto separation'),
        ('Annulled', 'Due to nullity of marriage'),
        ('Abandoned', 'Abandoned'),
        ('Spouse of the OFW', 'Spouse of the OFW'),
        ('Relative of the OFW', 'Relative of the OFW'),
        ('Unmarried Person', 
         'Unmarried mother or father who keeps and rears his/her child or children'),
        ('Legal Guardian/Adoptive/Foster Parent', 
         'Legal guardian, adoptive or foster parent who solely provides parental care and support to a child or children'),
        ('Relative',
         'Any relative within the fourth (4th) civil degree of consanguinity or affinity'),
        ('Pregnant Woman', 
         'A pregnant woman who provides sole parental care and support to her unborn child or children.'),
    )
    reason = models.CharField(
        max_length=48,
        choices=REASON_CHOICES,
        default='Separated'
    )

    pantawid_beneficiary = models.CharField(
        max_length=24, 
        blank=True, 
        null=True
    )

    philhealth = models.CharField(max_length=64)

    SECTOR_CHOICES = (
        ('PWD', 'PWD'),
        ('Senior Citizen', 'Senior Citizen'),
        ('LGBTQIA+', 'LGBTQIA+'),
    )
    sector = MultiSelectField(
        max_length=32, 
        choices=SECTOR_CHOICES, 
        max_choices=2,
        blank=True,
        null=True,
    )

    indigenous_person = models.CharField(max_length=32, blank=True, null=True)

    needs_and_problems = models.TextField()
    family_resources = models.TextField()

    is_verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(blank=True, null=True)

    is_terminated = models.BooleanField(default=False)
    is_transferred = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )

    # def save(self, *args, **kwargs):
    #     if self.pk is not None:
    #         self.is_verified = (
    #             Parent._meta.get_field('is_verified').get_default()
    #         )
    #     return super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.last_name}, {self.first_name} {self.middle_name}"

class Contact(models.Model):
    first_name = models.CharField(max_length=180)
    middle_name = models.CharField(max_length=180, blank=True, null=True)
    last_name = models.CharField(max_length=180)
    suffix = models.CharField(max_length=180, blank=True, null=True)
    phone = PhoneNumberField(unique=True)
    relation = models.CharField(max_length=32)

    house = models.CharField(max_length=180)
    street = models.CharField(max_length=180)

    BARANGAY_CHOICES = (
        ('Greenhills', 'Greenhills'),
        ('Maytunas', 'Maytunas'),
        ('Kabayanan', 'Kabayanan'),
        ('Salapan', 'Salapan'),
        ('West Crame', 'West Crame'),
        ('Onse', 'Onse'),
    )
    barangay = models.CharField(
        max_length=180,
        choices=BARANGAY_CHOICES,
        default='Greenhills'
    )

    subdivision = models.CharField(max_length=180, blank=True, null=True)

    CITY_CHOICES = (
        ('City of Batac', 'City of Batac'),
        ('City of Laoag', 'City of Laoag'),
        ('City of Candon', 'City of Candon'),
        ('City of Vigan', 'City of Vigan'),
        ('City of San Fernando', 'City of San Fernando'),
        ('City of Alaminos', 'City of Alaminos'),
        ('City of Dagupan', 'City of Dagupan'),
        ('City of San Carlos', 'City of San Carlos'),
        ('City of Urdaneta', 'City of Urdaneta'),
        ('Tuguegarao City', 'Tuguegarao City'),
        ('City of Cauayan', 'City of Cauayan'),
        ('City of Ilagan', 'City of Ilagan'),
        ('City of Santiago', 'City of Santiago'),
        ('City of Balanga', 'City of Balanga'),
        ('City of Baliwag', 'City of Baliwag'),
        ('City of Malolos', 'City of Malolos'),
        ('City of Meycauayan', 'City of Meycauayan'),
        ('City of San Jose Del Monte', 'City of San Jose Del Monte'),
        ('City of Cabanatuan', 'City of Cabanatuan'),
        ('City of Gapan', 'City of Gapan'),
        ('Science City of Muñoz', 'Science City of Muñoz'),
        ('City of Palayan', 'City of Palayan'),
        ('San Jose City', 'San Jose City'),
        ('City of Angeles', 'City of Angeles'),
        ('Mabalacat City', 'Mabalacat City'),
        ('City of San Fernando', 'City of San Fernando'),
        ('City of Tarlac', 'City of Tarlac'),
        ('City of Olongapo', 'City of Olongapo'),
        ('Batangas City', 'Batangas City'),
        ('City of Calaca', 'City of Calaca'),
        ('City of Lipa', 'City of Lipa'),
        ('City of Sto. Tomas', 'City of Sto. Tomas'),
        ('City of Tanauan', 'City of Tanauan'),
        ('City of Bacoor', 'City of Bacoor'),
        ('City of Cavite', 'City of Cavite'),
        ('City of Dasmariñas', 'City of Dasmariñas'),
        ('City of General Trias', 'City of General Trias'),
        ('City of Imus', 'City of Imus'),
        ('City of Tagaytay', 'City of Tagaytay'),
        ('City of Trece Martires', 'City of Trece Martires'),
        ('City of Cabuyao', 'City of Cabuyao'),
        ('City of Biñan', 'City of Biñan'),
        ('City of Calamba', 'City of Calamba'),
        ('City of San Pablo', 'City of San Pablo'),
        ('City of San Pedro', 'City of San Pedro'),
        ('City of Santa Rosa', 'City of Santa Rosa'),
        ('City of Lucena', 'City of Lucena'),
        ('City of Tayabas', 'City of Tayabas'),
        ('City of Antipolo', 'City of Antipolo'),
        ('City of Calapan', 'City of Calapan'),
        ('City of Puerto Princesa', 'City of Puerto Princesa'),
        ('City of Legazpi', 'City of Legazpi'),
        ('City of Ligao', 'City of Ligao'),
        ('City of Tabaco', 'City of Tabaco'),
        ('City of Iriga', 'City of Iriga'),
        ('City of Naga', 'City of Naga'),
        ('City of Masbate', 'City of Masbate'),
        ('City of Sorsogon', 'City of Sorsogon'),
        ('City of Roxas', 'City of Roxas'),
        ('City of Iloilo', 'City of Iloilo'),
        ('City of Passi', 'City of Passi'),
        ('City of Bacolod', 'City of Bacolod'),
        ('City of Bago', 'City of Bago'),
        ('City of Cadiz', 'City of Cadiz'),
        ('City of Escalante', 'City of Escalante'),
        ('City of Himamaylan', 'City of Himamaylan'),
        ('City of Kabankalan', 'City of Kabankalan'),
        ('City of La Carlota', 'City of La Carlota'),
        ('City of Sagay', 'City of Sagay'),
        ('City of San Carlos', 'City of San Carlos'),
        ('City of Silay', 'City of Silay'),
        ('City of Sipalay', 'City of Sipalay'),
        ('City of Talisay', 'City of Talisay'),
        ('City of Victorias', 'City of Victorias'),
        ('City of Tagbilaran', 'City of Tagbilaran'),
        ('City of Bogo', 'City of Bogo'),
        ('City of Carcar', 'City of Carcar'),
        ('City of Cebu', 'City of Cebu'),
        ('Danao City', 'Danao City'),
        ('City of Lapu-Lapu', 'City of Lapu-Lapu'),
        ('City of Mandaue', 'City of Mandaue'),
        ('City of Naga', 'City of Naga'),
        ('City of Talisay', 'City of Talisay'),
        ('City of Toledo', 'City of Toledo'),
        ('City of Bais', 'City of Bais'),
        ('City of Bayawan', 'City of Bayawan'),
        ('City of Canlaon', 'City of Canlaon'),
        ('City of Dumaguete', 'City of Dumaguete'),
        ('City of Guihulngan', 'City of Guihulngan'),
        ('City of Tanjay', 'City of Tanjay'),
        ('City of Borongan', 'City of Borongan'),
        ('City of Baybay', 'City of Baybay'),
        ('Ormoc City', 'Ormoc City'),
        ('City of Tacloban', 'City of Tacloban'),
        ('City of Calbayog', 'City of Calbayog'),
        ('City of Catbalogan', 'City of Catbalogan'),
        ('City of Maasin', 'City of Maasin'),
        ('City of Dapitan', 'City of Dapitan'),
        ('City of Dipolog', 'City of Dipolog'),
        ('City of Pagadian', 'City of Pagadian'),
        ('City of Zamboanga', 'City of Zamboanga'),
        ('City of Isabela', 'City of Isabela'),
        ('City of Malaybalay', 'City of Malaybalay'),
        ('City of Valencia', 'City of Valencia'),
        ('City of Iligan', 'City of Iligan'),
        ('City of Oroquieta', 'City of Oroquieta'),
        ('City of Ozamiz', 'City of Ozamiz'),
        ('City of Tangub', 'City of Tangub'),
        ('City of Cagayan De Oro', 'City of Cagayan De Oro'),
        ('City of El Salvador', 'City of El Salvador'),
        ('City of Gingoog', 'City of Gingoog'),
        ('City of Panabo', 'City of Panabo'),
        ('Island Garden City of Samal', 'Island Garden City of Samal'),
        ('City of Tagum', 'City of Tagum'),
        ('City of Davao', 'City of Davao'),
        ('City of Digos', 'City of Digos'),
        ('City of Mati', 'City of Mati'),
        ('City of Kidapawan', 'City of Kidapawan'),
        ('City of General Santos', 'City of General Santos'),
        ('City of Koronadal', 'City of Koronadal'),
        ('City of Tacurong', 'City of Tacurong'),
        ('City of Manila', 'City of Manila'),
        ('City of Mandaluyong', 'City of Mandaluyong'),
        ('City of Marikina', 'City of Marikina'),
        ('City of Pasig', 'City of Pasig'),
        ('Quezon City', 'Quezon City'),
        ('City of San Juan', 'City of San Juan'),
        ('City of Caloocan', 'City of Caloocan'),
        ('City of Malabon', 'City of Malabon'),
        ('City of Navotas', 'City of Navotas'),
        ('City of Valenzuela', 'City of Valenzuela'),
        ('City of Las Piñas', 'City of Las Piñas'),
        ('City of Makati', 'City of Makati'),
        ('City of Muntinlupa', 'City of Muntinlupa'),
        ('City of Parañaque', 'City of Parañaque'),
        ('Pasay City', 'Pasay City'),
        ('City of Taguig', 'City of Taguig'),
        ('City of Baguio', 'City of Baguio'),
        ('City of Tabuk', 'City of Tabuk'),
        ('City of Butuan', 'City of Butuan'),
        ('City of Cabadbaran', 'City of Cabadbaran'),
        ('City of Bayugan', 'City of Bayugan'),
        ('City of Surigao', 'City of Surigao'),
        ('City of Bislig', 'City of Bislig'),
        ('City of Tandag', 'City of Tandag'),
        ('City of Lamitan', 'City of Lamitan'),
        ('City of Marawi', 'City of Marawi'),
        ('City of Cotabato', 'City of Cotabato'),
    )
    city = models.CharField(
        max_length=180,
        choices=CITY_CHOICES,
        default='City of San Juan'
    )

    PROVINCE_CHOICES = (
        ('National Capital Region', 'National Capital Region'),
        ('Ilocos Norte', 'Ilocos Norte'),
        ('Ilocos Sur', 'Ilocos Sur'),
        ('La Union', 'La Union'),
        ('Pangasinan', 'Pangasinan'),
        ('Batanes', 'Batanes'),
        ('Cagayan', 'Cagayan'),
        ('Isabela', 'Isabela'),
        ('Nueva Vizcaya', 'Nueva Vizcaya'),
        ('Quirino', 'Quirino'),
        ('Bataan', 'Bataan'),
        ('Bulacan', 'Bulacan'),
        ('Nueva Ecija', 'Nueva Ecija'),
        ('Pampanga', 'Pampanga'),
        ('Tarlac', 'Tarlac'),
        ('Zambales', 'Zambales'),
        ('Aurora', 'Aurora'),
        ('Batangas', 'Batangas'),
        ('Cavite', 'Cavite'),
        ('Laguna', 'Laguna'),
        ('Quezon', 'Quezon'),
        ('Rizal', 'Rizal'),
        ('Marinduque', 'Marinduque'),
        ('Occidental Mindoro', 'Occidental Mindoro'),
        ('Oriental Mindoro', 'Oriental Mindoro'),
        ('Palawan', 'Palawan'),
        ('Romblon', 'Romblon'),
        ('Albay', 'Albay'),
        ('Camarines Norte', 'Camarines Norte'),
        ('Camarines Sur', 'Camarines Sur'),
        ('Masbate', 'Masbate'),
        ('Masbate', 'Masbate'),
        ('Sorsogon', 'Sorsogon'),
        ('Aklan', 'Aklan'),
        ('Antique', 'Antique'),
        ('Capiz', 'Capiz'),
        ('Iloilo', 'Iloilo'),
        ('Negros Occidental', 'Negros Occidental'),
        ('Guimaras', 'Guimaras'),
        ('Bohol', 'Bohol'),
        ('Cebu', 'Cebu'),
        ('Negros Oriental', 'Negros Oriental'),
        ('Siquijor', 'Siquijor'),
        ('Eastern Samar', 'Eastern Samar'),
        ('Leyte', 'Leyte'),
        ('Northern Samar', 'Northern Samar'),
        ('Samar', 'Samar'),
        ('Southern Leyte', 'Southern Leyte'),
        ('Biliran', 'Biliran'),
        ('Zamboanga del Norte', 'Zamboanga del Norte'),
        ('Zamboanga del Sur', 'Zamboanga del Sur'),
        ('Zamboanga Sibugay', 'Zamboanga Sibugay'),
        ('Bukidnon', 'Bukidnon'),
        ('Camiguin', 'Camiguin'),
        ('Lanao del Norte', 'Lanao del Norte'),
        ('Misamis Occidental', 'Misamis Occidental'),
        ('Misamis Oriental', 'Misamis Oriental'),
        ('Davao del Norte', 'Davao del Norte'),
        ('Davao del Sur', 'Davao del Sur'),
        ('Davao Oriental', 'Davao Oriental'),
        ('Davao de Oro oro', 'Davao de Oro'),
        ('Davao Occidental', 'Davao Occidental'),
        ('Cotabato', 'Cotabato'),
        ('South Cotabato', 'South Cotabato'),
        ('Sultan Kudarat', 'Sultan Kudarat'),
        ('Sarangani', 'Sarangani'),
        ('Abra', 'Abra'),
        ('Benguet', 'Benguet'),
        ('Ifugao', 'Ifugao'),
        ('Kalinga', 'Kalinga'),
        ('Mountain Province', 'Mountain Province'),
        ('Apayao', 'Apayao'),
        ('Agusan del Norte', 'Agusan del Norte'),
        ('Agusan del Sur', 'Agusan del Sur'),
        ('Surigao del Norte', 'Surigao del Norte'),
        ('Surigao del Sur', 'Surigao del Sur'),
        ('Dinagat Islands', 'Dinagat Islands'),
        ('Basilan', 'Basilan'),
        ('Lanao del Sur', 'Lanao del Sur'),
        ('Sulu', 'Sulu'),
        ('Tawi-Tawi', 'Tawi-Tawi'),
        ('Maguindanao del Norte', 'Maguindanao del Norte'),
        ('Maguindanao del Sur', 'Maguindanao del Sur'),
    )
    province = models.CharField(
        max_length=32,
        choices=PROVINCE_CHOICES,
        default='National Capital Region'
    ) 

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    parent = models.OneToOneField(
        Parent,
        on_delete=models.CASCADE,
        related_name='contacts'
    )

    def __str__(self):
        return f"{self.last_name}, {self.first_name} {self.middle_name}"

class Child(models.Model):
    first_name = models.CharField(max_length=180)
    middle_name = models.CharField(max_length=180)
    last_name = models.CharField(max_length=180)
    suffix = models.CharField(max_length=180, blank=True, null=True)
    birthday = models.DateField()
    relation = models.CharField(max_length=32)
    
    GENDER_CHOICES = (
        ('female', 'Female'),
        ('male', 'Male'),
    )
    gender = models.CharField(
        max_length=32,
        choices=GENDER_CHOICES,
        default='female'
    )

    EDUCATION_CHOICES = (
        ('No Education', 'No Education'),
        ('Kindergarten Level', 'Kindergarten Level'),
        ('Kindergarten Graduate', 'Kindergarten Graduate'),
        ('Elementary Level', 'Elementary Level'),
        ('Elementary Graduate', 'Elementary Graduate'),
        ('High School Level', 'High School Level'),
        ('High School Graduate', 'High School Graduate'),
        ('Vocational / TVET', 'Vocational / TVET'),
        ('College Level', 'College Level'),
        ('College Graduate', 'College Graduate'),
        ('Post-College', 'Post-College'),
    )
    educational_attainment = models.CharField(
        max_length=32,
        choices=EDUCATION_CHOICES,
        default='Kindergarten'
    )

    occupation = models.CharField(max_length=32)

    INCOME_CHOICES = (
        ('Php 20834 and above', 'Php 20834 and above'),
        ('Minimum wage to Php 20833', 'Minimum wage to Php 20833'),
        ('Minimum wage and below', 'Minimum wage and below'),
    )
    monthly_income = models.CharField(
        max_length=64, 
        choices=INCOME_CHOICES
    )

    is_incapable = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    parent = models.ForeignKey(
        Parent,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.last_name}, {self.first_name} {self.middle_name}"

class Image(models.Model):
    image = models.ImageField(upload_to='images/')

    IMAGE_TYPE_CHOICES = (
        ('id', 'ID'),
        ('signature', 'Signature'),
        ('document', 'Document'),
    )
    image_type = models.CharField(
        max_length=32,
        choices=IMAGE_TYPE_CHOICES,
        default='id' 
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    parent = models.ForeignKey(
        Parent,
        on_delete=models.CASCADE,
        related_name='images'
    )

    def __str__(self):
        return self.image.name
