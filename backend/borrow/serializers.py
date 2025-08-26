from rest_framework_mongoengine import serializers
from .models import Borrow

class BorrowSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Borrow
        fields = '__all__'
