import mongoengine as me
from books.models import Book
from users.models import User

class Borrow(me.Document):
    user = me.ReferenceField("User", required=True)
    book = me.ReferenceField("Book", required=True)
    borrow_date = me.DateTimeField(required=True)
    return_date = me.DateTimeField(null=True)

    def to_dict(self):
        user_doc = User.objects(id=self.user.id).first()
        book_doc = Book.objects(id=self.book.id).first()

        return {
            "id": str(self.id),
            "user": {
                "id": str(user_doc.id),
                "name": user_doc.name if user_doc else None,
            },
            "book": {
                "id": str(book_doc.id),
                "title": book_doc.title if book_doc else None,
            },
            "borrow_date": self.borrow_date.strftime("%Y-%m-%d"),
            "return_date": self.return_date.strftime("%Y-%m-%d") if self.return_date else None,
        }
