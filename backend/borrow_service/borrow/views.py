import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Borrow
from .serializers import BorrowSerializer
from rest_framework import viewsets

# internal CRUD

class BorrowViewSet(viewsets.ViewSet):
    """CRUD for Borrow records"""

    def list(self, request):
        borrows = Borrow.objects.all()
        serializer = BorrowSerializer(borrows, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        borrow = Borrow.objects(id=pk).first()
        if not borrow:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = BorrowSerializer(borrow)
        return Response(serializer.data)

    def create(self, request):
        print("Incoming borrow payload:", request.data)  # debug
        serializer = BorrowSerializer(data=request.data)
        if serializer.is_valid():
            borrow = Borrow(**serializer.validated_data).save()
            print("Saved borrow:", borrow.to_json())  # debug
            return Response(BorrowSerializer(borrow).data, status=status.HTTP_201_CREATED)
        print("Validation errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
        borrow = Borrow.objects(id=pk).first()
        if not borrow:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = BorrowSerializer(data=request.data)
        if serializer.is_valid():
            borrow.update(**serializer.validated_data)
            borrow.reload()
            return Response(BorrowSerializer(borrow).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        borrow = Borrow.objects(id=pk).first()
        if not borrow:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        borrow.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# orchestrator
USER_SERVICE_URL = "http://localhost:8003/api/users/"
BOOK_SERVICE_URL = "http://localhost:8001/api/books/"
BORROW_SERVICE_URL = "http://localhost:8002/api/borrows/"  # hits BorrowViewSet, not itself

class BorrowOrchestrator(APIView):
    def get(self, request):
        """Fetch borrow records and enrich with user + book details"""
        resp = requests.get(BORROW_SERVICE_URL)

        if resp.status_code != 200:
            return Response({
                "error": "Borrow service failed",
                "status": resp.status_code,
                "details": resp.text,  # shows what borrow-service actually returned
            }, status=resp.status_code)

        try:
            borrows = resp.json()
        except ValueError:
            return Response({
                "error": "Borrow service did not return JSON",
                "raw": resp.text,
            }, status=500)
        
        users = {u["id"]: u for u in requests.get(USER_SERVICE_URL).json()}
        books = {b["id"]: b for b in requests.get(BOOK_SERVICE_URL).json()}

        enriched = []
        for b in borrows:
            enriched.append({
                "id": b["id"],
                "borrow_date": b["borrow_date"],
                "return_date": b.get("return_date"),
                "user": users.get(b["user"], {"id": b["user"], "name": "Unknown"}),
                "book": books.get(b["book"], {"id": b["book"], "title": "Unknown"}),
            })
        return Response(enriched)

    def post(self, request):
        """Validate, create borrow, enrich response"""
        user_id = request.data.get("user")
        book_id = request.data.get("book")

        # validate
        user = requests.get(f"{USER_SERVICE_URL}{user_id}/").json()
        if not user or "id" not in user:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        book = requests.get(f"{BOOK_SERVICE_URL}{book_id}/").json()
        if not book or "id" not in book:
            return Response({"error": "Book not found"}, status=status.HTTP_404_NOT_FOUND)

        # create borrow in raw service
        borrow = requests.post(BORROW_SERVICE_URL, request.data).json()

        # enrich response
        borrow["user"] = user
        borrow["book"] = book
        return Response(borrow, status=status.HTTP_201_CREATED)
