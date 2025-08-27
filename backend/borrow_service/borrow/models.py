import mongoengine as me

class Borrow(me.Document):
    user_id = me.StringField(required=True)   # store user ID only
    book_id = me.StringField(required=True)   # store book ID only
    borrow_date = me.DateTimeField(required=True)
    return_date = me.DateTimeField(null=True)

    def __str__(self):
        return f"Borrow(user={self.user_id}, book={self.book_id})"
