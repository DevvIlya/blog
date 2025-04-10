from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'posts', views.PostViewSet)
router.register(r'comments', views.CommentViewSet)

urlpatterns = [
    path('', views.index, name='index'),  # Главная страница
    path('api/', include(router.urls)),   # API пути
    path('add/', views.add_post, name='add_post'),  # Страница добавления поста
    path('post/<int:post_id>/', views.view_post, name='view_post'), # Новый маршрут для страницы поста
]