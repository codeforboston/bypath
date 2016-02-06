from django.conf.urls import url

from . import views


#from django.conf import settings
#from django.conf.urls.static import static

urlpatterns = [
    url(r'^map/$', views.map, name="map")
    # url(r'/$', views.map, name="root" )

] 

#+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)