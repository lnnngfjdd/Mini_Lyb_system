from rest_framework_mongoengine import serializers
from .models import Book

class BookSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Book
        fields = '__all__'
