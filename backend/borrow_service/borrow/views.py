from django.shortcuts import render

# Create your views here.
from rest_framework_mongoengine import viewsets
from .models import Borrow
from .serializers import BorrowSerializer

class BorrowViewSet(viewsets.ModelViewSet):
    queryset = Borrow.objects.all()
    serializer_class = BorrowSerializer
