from django.contrib import admin
from db.organization import Organization, Membership

class MembershipInline(admin.TabularInline):
    model = Membership
    extra = 1

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'description', 'id', 'created_at', 'updated_at')
    # prepopulated_fields = {'slug': ('name',)}
    inlines = [MembershipInline]

