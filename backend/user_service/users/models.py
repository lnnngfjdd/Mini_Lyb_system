import mongoengine as me

class User(me.Document):
    name = me.StringField(required=True)
    email = me.StringField(required=True, unique=True)
    role = me.StringField(choices=["librarian", "member"], default="member")

    def __str__(self):
        return self.name
