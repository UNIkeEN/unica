from typing import Union, List, Optional, Type
from django.db.models import QuerySet, Q, Model
from rest_framework.pagination import PageNumberPagination
from rest_framework.serializers import Serializer
from drf_yasg import openapi
from enum import Enum


class QuerySteps(Enum):
    FILTERS = 'filters'
    SEARCH = 'search'
    ORDER_BY = 'order_by'
    PAGINATION = 'pagination'


class QueryOptions:
    def __init__(self, page: Optional[int] = None, page_size: Optional[int] = None, order_by: Optional[str] = None, 
                 search: Optional[str] = None, filters: Optional[dict] = {}):
        self.page = page
        self.page_size = page_size
        self.order_by = order_by
        self.search = search
        self.filters = filters

    @classmethod
    def build_from_request(cls, request, defaults: dict = None) -> 'QueryOptions':
        data = {**(defaults or {}), **request.data}
        return cls(
            page=data.get('page', None),
            page_size=data.get('page_size', None),
            order_by=data.get('order_by', None),
            search=data.get('search', None),
            filters=data.get('filters', {})
        )
    
    @staticmethod
    def to_openapi_schema(supported_steps: List[str]) -> openapi.Schema:
        properties = {}

        if QuerySteps.FILTERS in supported_steps:
            properties['filters'] = openapi.Schema(
                type=openapi.TYPE_OBJECT,
                additional_properties=openapi.Schema(type=openapi.TYPE_STRING),
                description="Filter conditions"
            )
        if QuerySteps.SEARCH in supported_steps:
            properties['search'] = openapi.Schema(
                type=openapi.TYPE_STRING,
                description="Search term"
            )
        if QuerySteps.ORDER_BY in supported_steps:
            properties['order_by'] = openapi.Schema(
                type=openapi.TYPE_STRING,
                description="Field to sort by, e.g. 'created_at' or '-updated_at'"
            )
        if QuerySteps.PAGINATION in supported_steps:
            properties['page'] = openapi.Schema(
                type=openapi.TYPE_INTEGER,
                description="Page number for pagination",
                default=1
            )
            properties['page_size'] = openapi.Schema(
                type=openapi.TYPE_INTEGER,
                description="Number of items per page",
                default=20
            )

        return openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties=properties
        )


class QueryResult:
    def __init__(self, count: int, queryset: QuerySet):
        self.count = count
        self.queryset = queryset

    def __iter__(self):
        yield self.count
        yield self.queryset

    def paginated_serialize(self, serializer_class: Type[Serializer], **kwargs) -> dict:
        serializer = serializer_class(self.queryset, many=True, **kwargs)
        return {
            'count': self.count,
            'results': serializer.data
        }
    

class CustomPagination(PageNumberPagination):
    def paginate_queryset(self, queryset, options):
        page = options.page or 1
        page_size = options.page_size or self.page_size
        self.page = page

        paginator = self.django_paginator_class(queryset, page_size)
        self.page = paginator.page(self.page)
        
        return paginator.count, list(self.page)
    

class QueryExecutor:
    def __init__(self, base_query: Union[QuerySet, Type[Model]], options: QueryOptions, 
                 supported_steps: Optional[List[QuerySteps]] = None):
        """
        :param base_query: 
            Can be a model class or a predefined QuerySet. 
            If a model is passed, a lazy query .objects.all() is used to generate the queryset.
        :param options: QueryOptions object containing parameters for pagination, sorting, searching, etc.
        :param supported_steps: List of supported execution steps.
        """
        if isinstance(base_query, QuerySet):
            self.query: QuerySet = base_query
        else:
            self.query: QuerySet = base_query.objects.all()
        
        self.options: QueryOptions = options
        self.supported_steps: List[QuerySteps] = supported_steps or [
            QuerySteps.FILTERS, 
            QuerySteps.SEARCH, 
            QuerySteps.ORDER_BY, 
            QuerySteps.PAGINATION,
        ]

    def _apply_filters(self):
        if QuerySteps.FILTERS in self.supported_steps and self.options.filters:
            self.query = self.query.filter(**self.options.filters)
        return self

    def _apply_search(self, search_fields: List[str]):
        if QuerySteps.SEARCH in self.supported_steps and self.options.search:
            filters = Q()
            for field in search_fields:
                filters |= Q(**{f"{field}__icontains": self.options.search})
            self.query = self.query.filter(filters)
        return self

    def _apply_order_by(self):
        if QuerySteps.ORDER_BY in self.supported_steps and self.options.order_by:
            self.query = self.query.order_by(self.options.order_by)
        return self

    def _apply_pagination(self) -> QueryResult:
        if QuerySteps.PAGINATION in self.supported_steps and self.options.page and self.options.page_size:
            paginator = CustomPagination()
            count, paginated_queryset = paginator.paginate_queryset(self.query, self.options)
            return QueryResult(count, paginated_queryset)
        return QueryResult(self.query.count(), self.query)

    def execute(self, search_fields: Optional[List[str]] = None) -> QueryResult:
        """
        Executes the query and returns the queryset.
        :param search_fields: List of fields that support searching
        :return: Returns a QuerySet object that has been paginated, filtered, sorted, and searched
        """
        search_fields = search_fields or []
        self._apply_filters()._apply_search(search_fields)._apply_order_by()
        return self._apply_pagination()