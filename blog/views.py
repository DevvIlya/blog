from rest_framework import viewsets
from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer
from django.shortcuts import render, redirect
from .models import Post
from .forms import PostForm

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer

def index(request):
    posts = Post.objects.all().order_by('-created_at')  # Получаем все посты, отсортированные по дате
    return render(request, 'blog/index.html', {'posts': posts})

def add_post(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            form.save()  # Сохраняем новый пост в базе данных
            return redirect('index')  # Перенаправляем на главную страницу
    else:
        form = PostForm()
    return render(request, 'blog/add_post.html', {'form': form})

