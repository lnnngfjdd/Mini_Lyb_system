import mongoengine as me
from users.models import User
from books.models import Book

class Borrow(me.Document):
    user = me.ReferenceField(User, required=True, reverse_delete_rule=me.CASCADE)
    book = me.ReferenceField(Book, required=True, reverse_delete_rule=me.CASCADE)
    borrowed_at = me.DateTimeField()
    returned_at = me.DateTimeField()

    def __str__(self):
        return f"{self.user.name} borrowed {self.book.title}"
