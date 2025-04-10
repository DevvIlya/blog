from rest_framework import viewsets, filters
from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer
from django.shortcuts import render, redirect, get_object_or_404
from .forms import PostForm, CommentForm
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.paginator import Paginator
from django_filters.rest_framework import DjangoFilterBackend

@api_view(['GET'])
def post_list(request):
    posts = Post.objects.all().order_by('-created_at')
    
    # Пагинация
    page_size = int(request.GET.get('page_size', 10))
    page_number = request.GET.get('page', 1)
    paginator = Paginator(posts, page_size)
    page_obj = paginator.get_page(page_number)

    # Сериализация данных
    serializer = PostSerializer(page_obj, many=True)

    return Response({
        'results': serializer.data,
        'count': paginator.count
    })


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['title']
    search_fields = ['title']  # Поиск по части строки

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer

def index(request):
    query = request.GET.get('search', '')
    if query:
        posts = Post.objects.filter(title__icontains=query).order_by('-created_at')
    else:
        posts = Post.objects.all().order_by('-created_at')
    
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

def view_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    comments = post.comments.all().order_by('-created_at')

    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.post = post
            comment.save()
            return redirect('view_post', post_id=post.id)
    else:
        form = CommentForm()

    return render(request, 'blog/view_post.html', {
        'post': post,
        'comments': comments,
        'form': form
    })