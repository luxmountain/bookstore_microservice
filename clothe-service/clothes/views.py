from rest_framework import viewsets
from .models import Clothe
from .serializers import ClotheSerializer


class ClotheViewSet(viewsets.ModelViewSet):
    queryset = Clothe.objects.all()
    serializer_class = ClotheSerializer
