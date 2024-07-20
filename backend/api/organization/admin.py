from django.contrib import admin
from .models import Organization, Membership

class MembershipInline(admin.TabularInline):
    model = Membership
    extra = 1

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'name', 'slug', 'created_at', 'updated_at')
    # prepopulated_fields = {'slug': ('name',)}
    inlines = [MembershipInline]

