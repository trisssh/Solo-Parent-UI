import uuid
from django.db import models
from django.core.validators import MinLengthValidator
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Create your models here.
class UserManager(BaseUserManager):
    def _create_user(self, password, email=None, username=None, **extra_fields):
        if email:
            email = self.normalize_email(email)

        if (email and username) or (not email and not username):
            raise ValueError(
                'Exactly one of email or username must be provided.'
            )

        if email and User.objects.filter(email=email).exists():
            raise ValueError('Email is already registered.')
        if username and User.objects.filter(username=username).exists():
            raise ValueError('Username is already registered.') 

        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, password, email=None, username=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(password, email, username, **extra_fields)

    def create_staff(
        self, 
        password, 
        email=None, 
        username=None,  
        **extra_fields
    ):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(password, email, username, **extra_fields)

    def create_superuser(
        self, 
        password, 
        email=None, 
        username=None,  
        **extra_fields
    ):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(password, email, username, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=180, blank=True, null=True)
    username = models.CharField(max_length=180, blank=True, null=True)
    password = models.CharField(
        max_length=180,
        validators=[MinLengthValidator(8)]
    )

    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'id'

    objects = UserManager()

    def __str__(self):
        return self.email or self.username

class Parent(models.Model):
    uuid = models.UUIDField(
        editable=False, 
        unique=True, 
        default=uuid.uuid4
    )
    first_name = models.CharField(max_length=180)
    middle_name = models.CharField(max_length=180)
    last_name = models.CharField(max_length=180)
    suffix = models.CharField(max_length=180, blank=True, null=True)
    birthday = models.DateField()
    age = models.IntegerField()

    GENDER_CHOICES = (
        ('female', 'Female'),
        ('male', 'Male'),
    )
    gender = models.CharField(
        max_length=32,
        choices=GENDER_CHOICES,
        default='female'
    )

    house = models.CharField(max_length=180)
    street = models.CharField(max_length=180)

    BARANGAY_CHOICES = (
        ('greenhills', 'Greenhills'),
        ('maytunas', 'Maytunas'),
        ('kabayanan', 'Kabayanan'),
        ('salapan', 'Salapan'),
        ('west_crame', 'West Crame'),
        ('onse', 'Onse'),
    )
    barangay = models.CharField(
        max_length=180,
        choices=BARANGAY_CHOICES,
        default='greenhills'
    )

    subdivision = models.CharField(max_length=180, blank=True, null=True)

    CITY_CHOICES = (
        ('batac', 'City of Batac'),
        ('laoag', 'City of Laoag'),
        ('candon', 'City of Candon'),
        ('vigan', 'City of Vigan'),
        ('san_fernando', 'City of San Fernando'),
        ('alaminos', 'City of Alaminos'),
        ('dagupan', 'City of Dagupan'),
        ('san_carlos', 'City of San Carlos'),
        ('urdaneta', 'City of Urdaneta'),
        ('tuguegarao', 'Tuguegarao City'),
        ('cauayan', 'City of Cauayan'),
        ('ilagan', 'City of Ilagan'),
        ('santiago', 'City of Santiago'),
        ('balanga', 'City of Balanga'),
        ('baliwag', 'City of Baliwag'),
        ('malolos', 'City of Malolos'),
        ('meycauayan', 'City of Meycauayan'),
        ('san_jose_del_monte', 'City of San Jose Del Monte'),
        ('cabanatuan', 'City of Cabanatuan'),
        ('gapan', 'City of Gapan'),
        ('muñoz', 'Science City of Muñoz'),
        ('palayan', 'City of Palayan'),
        ('san_jose', 'San Jose City'),
        ('angeles', 'City of Angeles'),
        ('mabalacat', 'Mabalacat City'),
        ('san_fernando', 'City of San Fernando'),
        ('tarlac', 'City of Tarlac'),
        ('olongapo', 'City of Olongapo'),
        ('batangas', 'Batangas City'),
        ('calaca', 'City of Calaca'),
        ('lipa', 'City of Lipa'),
        ('sto_tomas', 'City of Sto. Tomas'),
        ('tanauan', 'City of Tanauan'),
        ('bacoor', 'City of Bacoor'),
        ('cavite', 'City of Cavite'),
        ('dasmariñas', 'City of Dasmariñas'),
        ('general_trias', 'City of General Trias'),
        ('imus', 'City of Imus'),
        ('tagaytay', 'City of Tagaytay'),
        ('trece_martires', 'City of Trece Martires'),
        ('cabuyao', 'City of Cabuyao'),
        ('biñan', 'City of Biñan'),
        ('calamba', 'City of Calamba'),
        ('san_pablo', 'City of San Pablo'),
        ('san_pedro', 'City of San Pedro'),
        ('santa_rosa', 'City of Santa Rosa'),
        ('lucena', 'City of Lucena'),
        ('tayabas', 'City of Tayabas'),
        ('antipolo', 'City of Antipolo'),
        ('calapan', 'City of Calapan'),
        ('puerto_princesa', 'City of Puerto Princesa'),
        ('legazpi', 'City of Legazpi'),
        ('ligao', 'City of Ligao'),
        ('tabaco', 'City of Tabaco'),
        ('iriga', 'City of Iriga'),
        ('naga', 'City of Naga'),
        ('masbate', 'City of Masbate'),
        ('sorsogon', 'City of Sorsogon'),
        ('roxas', 'City of Roxas'),
        ('iloilo', 'City of Iloilo'),
        ('passi', 'City of Passi'),
        ('bacolod', 'City of Bacolod'),
        ('bago', 'City of Bago'),
        ('cadiz', 'City of Cadiz'),
        ('escalante', 'City of Escalante'),
        ('himamaylan', 'City of Himamaylan'),
        ('kabankalan', 'City of Kabankalan'),
        ('la_carlota', 'City of La Carlota'),
        ('sagay', 'City of Sagay'),
        ('san_carlos', 'City of San Carlos'),
        ('silay', 'City of Silay'),
        ('sipalay', 'City of Sipalay'),
        ('talisay', 'City of Talisay'),
        ('victorias', 'City of Victorias'),
        ('tagbilaran', 'City of Tagbilaran'),
        ('bogo', 'City of Bogo'),
        ('carcar', 'City of Carcar'),
        ('cebu', 'City of Cebu'),
        ('danao', 'Danao City'),
        ('lapu-lapu', 'City of Lapu-Lapu'),
        ('mandaue', 'City of Mandaue'),
        ('naga', 'City of Naga'),
        ('talisay', 'City of Talisay'),
        ('toledo', 'City of Toledo'),
        ('bais', 'City of Bais'),
        ('bayawan', 'City of Bayawan'),
        ('canlaon', 'City of Canlaon'),
        ('dumaguete', 'City of Dumaguete'),
        ('guihulngan', 'City of Guihulngan'),
        ('tanjay', 'City of Tanjay'),
        ('borongan', 'City of Borongan'),
        ('baybay', 'City of Baybay'),
        ('ormoc', 'Ormoc City'),
        ('tacloban', 'City of Tacloban'),
        ('calbayog', 'City of Calbayog'),
        ('catbalogan', 'City of Catbalogan'),
        ('maasin', 'City of Maasin'),
        ('dapitan', 'City of Dapitan'),
        ('dipolog', 'City of Dipolog'),
        ('pagadian', 'City of Pagadian'),
        ('zamboanga', 'City of Zamboanga'),
        ('isabela', 'City of Isabela'),
        ('malaybalay', 'City of Malaybalay'),
        ('valencia', 'City of Valencia'),
        ('iligan', 'City of Iligan'),
        ('oroquieta', 'City of Oroquieta'),
        ('ozamiz', 'City of Ozamiz'),
        ('tangub', 'City of Tangub'),
        ('cagayan_de_oro', 'City of Cagayan De Oro'),
        ('el_salvador', 'City of El Salvador'),
        ('gingoog', 'City of Gingoog'),
        ('panabo', 'City of Panabo'),
        ('samal', 'Island Garden City of Samal'),
        ('tagum', 'City of Tagum'),
        ('davao', 'City of Davao'),
        ('digos', 'City of Digos'),
        ('mati', 'City of Mati'),
        ('kidapawan', 'City of Kidapawan'),
        ('general_santos', 'City of General Santos'),
        ('koronadal', 'City of Koronadal'),
        ('tacurong', 'City of Tacurong'),
        ('manila', 'City of Manila'),
        ('mandaluyong', 'City of Mandaluyong'),
        ('marikina', 'City of Marikina'),
        ('pasig', 'City of Pasig'),
        ('quezon', 'Quezon City'),
        ('san_juan', 'City of San Juan'),
        ('caloocan', 'City of Caloocan'),
        ('malabon', 'City of Malabon'),
        ('navotas', 'City of Navotas'),
        ('valenzuela', 'City of Valenzuela'),
        ('las_piñas', 'City of Las Piñas'),
        ('makati', 'City of Makati'),
        ('muntinlupa', 'City of Muntinlupa'),
        ('parañaque', 'City of Parañaque'),
        ('pasay', 'Pasay City'),
        ('taguig', 'City of Taguig'),
        ('baguio', 'City of Baguio'),
        ('tabuk', 'City of Tabuk'),
        ('butuan', 'City of Butuan'),
        ('cabadbaran', 'City of Cabadbaran'),
        ('bayugan', 'City of Bayugan'),
        ('surigao', 'City of Surigao'),
        ('bislig', 'City of Bislig'),
        ('tandag', 'City of Tandag'),
        ('lamitan', 'City of Lamitan'),
        ('marawi', 'City of Marawi'),
        ('cotabato', 'City of Cotabato'),
    )
    city = models.CharField(
        max_length=180,
        choices=CITY_CHOICES,
        default='san_juan'
    )

    PROVINCE_CHOICES = (
        ('ncr', 'National Capital Region'),
        ('ilocos_norte', 'Ilocos Norte'),
        ('ilocos_sur', 'Ilocos Sur'),
        ('la_union', 'La Union'),
        ('pangasinan', 'Pangasinan'),
        ('batanes', 'Batanes'),
        ('cagayan', 'Cagayan'),
        ('isabela', 'Isabela'),
        ('nueva_vizcaya', 'Nueva Vizcaya'),
        ('quirino', 'Quirino'),
        ('bataan', 'Bataan'),
        ('bulacan', 'Bulacan'),
        ('nueva_ecija', 'Nueva Ecija'),
        ('pampanga', 'Pampanga'),
        ('tarlac', 'Tarlac'),
        ('zambales', 'Zambales'),
        ('aurora', 'Aurora'),
        ('batangas', 'Batangas'),
        ('cavite', 'Cavite'),
        ('laguna', 'Laguna'),
        ('quezon', 'Quezon'),
        ('rizal', 'Rizal'),
        ('marinduque', 'Marinduque'),
        ('occidental_mindoro', 'Occidental Mindoro'),
        ('oriental_mindoro', 'Oriental Mindoro'),
        ('palawan', 'Palawan'),
        ('romblon', 'Romblon'),
        ('albay', 'Albay'),
        ('camarines_norte', 'Camarines Norte'),
        ('camarines_sur', 'Camarines Sur'),
        ('catanduanes', 'Masbate'),
        ('masbate', 'Masbate'),
        ('sorsogon', 'Sorsogon'),
        ('aklan', 'Aklan'),
        ('antique', 'Antique'),
        ('capiz', 'Capiz'),
        ('iloilo', 'Iloilo'),
        ('negros_occidental', 'Negros Occidental'),
        ('guimaras', 'Guimaras'),
        ('bohol', 'Bohol'),
        ('cebu', 'Cebu'),
        ('negros_oriental', 'Negros Oriental'),
        ('siquijor', 'Siquijor'),
        ('eastern_samar', 'Eastern Samar'),
        ('leyte', 'Leyte'),
        ('northern_samar', 'Northern Samar'),
        ('samar', 'Samar'),
        ('southern_leyte', 'Southern Leyte'),
        ('biliran', 'Biliran'),
        ('zamboanga_del_norte', 'Zamboanga del Norte'),
        ('zamboanga_del_sur', 'Zamboanga del Sur'),
        ('zamboanga_sibugay', 'Zamboanga Sibugay'),
        ('bukidnon', 'Bukidnon'),
        ('camiguin', 'Camiguin'),
        ('lanao_del_norte', 'Lanao del Norte'),
        ('misamis_occidental', 'Misamis Occidental'),
        ('misamis_oriental', 'Misamis Oriental'),
        ('davao_del_norte', 'Davao del Norte'),
        ('davao_del_sur', 'Davao del Sur'),
        ('davao_oriental', 'Davao Oriental'),
        ('davao_de oro', 'Davao de Oro'),
        ('davao_occidental', 'Davao Occidental'),
        ('cotabato', 'Cotabato'),
        ('south_cotabato', 'South Cotabato'),
        ('sultan_kudarat', 'Sultan Kudarat'),
        ('sarangani', 'Sarangani'),
        ('abra', 'Abra'),
        ('benguet', 'Benguet'),
        ('ifugao', 'Ifugao'),
        ('kalinga', 'Kalinga'),
        ('mountain_province', 'Mountain Province'),
        ('apayao', 'Apayao'),
        ('agusan_del_norte', 'Agusan del Norte'),
        ('agusan_del_sur', 'Agusan del Sur'),
        ('surigao_del_norte', 'Surigao del Norte'),
        ('surigao_del_sur', 'Surigao del Sur'),
        ('dinagat_islands', 'Dinagat Islands'),
        ('basilan', 'Basilan'),
        ('lanao_del_sur', 'Lanao del Sur'),
        ('sulu', 'Sulu'),
        ('tawi-tawi', 'Tawi-Tawi'),
        ('maguindanao_del_norte', 'Maguindanao del Norte'),
        ('maguindanao_del_sur', 'Maguindanao del Sur'),
    )
    province = models.CharField(
        max_length=32,
        choices=PROVINCE_CHOICES,
        default='ncr'
    ) 

    REASON_CHOICES = (
        ('crime_against_chastity', 'Crime Against Chastity'),
        ('death_of_spouse', 'Death of Spouse'),
        ('spouse_detained', 'Spouse is Detained'),
        ('physical_mental_incapacity',
         'Physical/Mental Incapacity of Spouse'),
        ('separation', 'Legal/De Facto Separation'),
        ('annuled', 'Annulment of Marriage'),
        ('abandonment', 'Abandonment of Spouse'),
        ('preferred_to_keep',
         'Preferred To Keep Child/Children Instead of Giving Them To Welfare'),
        ('sole_provider', 'Solely Provides Parental Care'),
        ('assumed_responsibility', 'Assumed Responsibility of Head of Family'),
    )
    reason = models.CharField(
        max_length=32,
        choices=REASON_CHOICES,
        default='separation'
    )

    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.last_name}, {self.first_name} {self.middle_name}"

class Child(models.Model):
    first_name = models.CharField(max_length=180)
    middle_name = models.CharField(max_length=180)
    last_name = models.CharField(max_length=180)
    suffix = models.CharField(max_length=180, blank=True, null=True)
    birthday = models.DateField()
    age = models.IntegerField()
    
    GENDER_CHOICES = (
        ('female', 'Female'),
        ('male', 'Male'),
    )
    gender = models.CharField(
        max_length=32,
        choices=GENDER_CHOICES,
        default='female'
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
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.image.name