from rest_framework_mongoengine import serializers
from .models import Borrow

class BorrowSerializer(serializers.DocumentSerializer):
    class Meta:
        model = Borrow
        fields = ['id', 'user', 'book', 'borrow_date', 'return_date']

    def to_representation(self, obj):
        rep = super().to_representation(obj)
        rep['user_name'] = obj.user.name if obj.user else None
        rep['book_title'] = obj.book.title if obj.book else None
        return rep
