# Template Structure Documentation

## Directory Structure

```
templates/
├── informative/              # Public-facing website templates
│   ├── layouts/             # Base layouts
│   │   └── base.html       # Main layout template
│   ├── components/          # Reusable components
│   │   ├── header.html     # Navigation header
│   │   └── footer.html     # Site footer
│   └── pages/              # Individual page templates
│       ├── home.html       # Homepage
│       └── about.html      # About page
└── cms/                     # Content Management System templates
    ├── layouts/             # CMS layouts
    │   └── base.html       # CMS base layout
    ├── components/          # CMS components
    │   ├── sidebar.html    # Admin sidebar navigation
    │   └── header.html     # CMS header with user menu
    └── pages/              # CMS page templates
        ├── dashboard.html  # Admin dashboard
        └── hives.html      # Hive management page
```

## Template Usage

### Informative Website Templates
- **Base Layout**: Provides the main HTML structure with header, content area, and footer
- **Components**: Reusable UI elements that can be included in multiple pages
- **Pages**: Specific page content that extends the base layout

### CMS Templates
- **Base Layout**: Admin panel structure with sidebar navigation and main content area
- **Components**: Admin-specific UI elements like navigation and user controls
- **Pages**: Different admin panel screens for managing content

## Template Functions
The following Go template functions are available:
- `{{.Title}}` - Page title
- `{{.User}}` - Current user data
- `{{.CurrentPage}}` - Current page identifier for navigation
- `{{formatDate .Date}}` - Format date/time
- `{{truncate .Text 100}}` - Truncate text to specified length
- `{{substr .Text 0 2}}` - Get substring

## Adding New Templates

1. Create new template files in the appropriate directory
2. Use `{{define "template-name"}}` for named templates
3. Include templates using `{{template "template-name" .}}`
4. Follow the established naming conventions
5. Update route handlers to render new templates