from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from account.models import Space
from account.permission.spaceperm import IsSpaceMember
from account.permission.spaceperm import ASSESSMENT_LIST_IDS_PARAM_NAME

from assessment.models import AssessmentProject
from assessment.serializers import projectserializers 



class AssessmentProjectViewSet(ModelViewSet):
    def get_serializer_class(self):
        if self.action in ('create', 'update'):
            return projectserializers.AssessmentProjecCreateSerilizer   
        else:
            return projectserializers.AssessmentProjectListSerilizer

    def get_queryset(self):
        return AssessmentProject.objects.all().order_by('creation_time')

class AssessmentProjectBySpaceViewSet(ModelViewSet):
    permission_classes=[IsAuthenticated, IsSpaceMember]
    def get_serializer_class(self):
        return projectserializers.AssessmentProjectListSerilizer

    # TODO: Handle requested space to suitable position
    def list(self, request, *args, **kwargs):
        response = super().list(request, *args, **kwargs)
        requested_space = Space.objects.get(id = self.kwargs['space_pk'])
        if requested_space is not None:
            requested_space = Space.objects.get(id = self.kwargs['space_pk'])
            response.data['requested_space'] = requested_space.title
        return response       

    def get_queryset(self):
        return AssessmentProject.objects.filter(space_id=self.kwargs['space_pk'])


class AssessmentProjectByCurrentUserViewSet(ModelViewSet):
    permission_classes=[IsAuthenticated]
    def get_serializer_class(self):
        return projectserializers.AssessmentProjectSimpleSerilizer

    def get_queryset(self):
        current_user = self.request.user
        current_user_space_list = current_user.spaces.all()
        query_set = AssessmentProject.objects.none()
        profile_id = self.request.query_params.get('profile_id')
        for space in current_user_space_list:
            if profile_id is not None:
                query_set |= AssessmentProject.objects.filter(space_id=space.id, assessment_profile_id=profile_id)
            else:
                query_set |= AssessmentProject.objects.filter(space_id=space.id)
        return query_set



class AssessmentProjectSelectForCompareView(APIView):
    permission_classes=[IsAuthenticated, IsSpaceMember]
    def post(self, request):
        assessment_list_ids = request.data.get(ASSESSMENT_LIST_IDS_PARAM_NAME)
        assessment_list = []
        for assessment_id in assessment_list_ids:
            assessment = AssessmentProject.objects.load(assessment_id)
            assessment_list.append(projectserializers.AssessmentProjectCompareSerilizer(assessment).data)
        return Response(assessment_list)
