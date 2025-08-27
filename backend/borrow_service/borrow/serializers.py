from rest_framework import serializers

class BorrowSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    user_id = serializers.CharField()
    book_id = serializers.CharField()
    borrow_date = serializers.DateTimeField()
    return_date = serializers.DateTimeField(required=False, allow_null=True)
