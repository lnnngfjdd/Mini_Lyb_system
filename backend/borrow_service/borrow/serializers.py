from rest_framework import serializers

class BorrowSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    user = serializers.CharField(source="user_id")
    book = serializers.CharField(source="book_id")
    borrow_date = serializers.DateTimeField()
    return_date = serializers.DateTimeField(required=False, allow_null=True)

