from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/bought/', include('bought_events.urls')),
    path('api/liked/', include('liked_events.urls'))
]
