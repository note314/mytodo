# MyToDo PWA

A minimalist task management Progressive Web Application with an industrial dark theme.

## Features

- ✅ **PWA Support**: Installable with offline functionality
- 📱 **Mobile-First**: Optimized for smartphones (max-width: 448px)
- 🌙 **Dark Theme**: Industrial-style dark interface
- 📝 **Task Management**: Create, edit, complete, and delete tasks
- 📁 **Archive System**: Swipe left to archive completed tasks
- 💾 **Local Storage**: All data stored locally on device
- 🎨 **Custom SVG Icons**: No emoji dependencies

## Setup Instructions

1. **Clone/Download** the project files to your web server directory
2. **Serve** the files through a web server (required for PWA features)
3. **Access** the application via HTTPS (required for Service Worker)

### Local Development

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

### PWA Installation

1. Open the app in a supported browser (Chrome, Firefox, Safari, Edge)
2. Look for the "Install" button in your browser's address bar
3. Click to install the app to your home screen

## Usage

### Basic Operations
- **Add Task**: Click the + button in the header
- **Complete Task**: Click the checkbox on the left
- **Mark for Deletion**: Click the checkbox on the right
- **Edit Task**: Tap the task title
- **Archive Task**: Swipe left on any task

### Navigation
- **Archive**: View archived tasks
- **Delete**: Remove tasks marked for deletion
- **Back to Tasks**: Return to main task list

### Data Management
- All data is stored locally in your browser
- No cloud synchronization
- Data persists between app sessions
- Uninstalling the app will remove all data

## Technical Details

### Technology Stack
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Styling**: TailwindCSS via CDN
- **PWA**: Service Worker + Web App Manifest
- **Storage**: localStorage API
- **Icons**: Custom SVG graphics

### Browser Requirements
- Modern browser with PWA support
- Service Worker support
- localStorage support
- Touch events (for mobile gestures)

### File Structure
```
mytodo/
├── index.html          # Main application page
├── app.js             # Application logic
├── sw.js              # Service Worker
├── manifest.json      # PWA manifest
└── README.md          # This file
```

## Development Notes

The application follows the requirements from `mytodo_requirements.md` and implements the design from `mytodo_design_mock.tsx`.

### Key Features Implemented
- Splash screen with "Done is better than Perfect" message
- Task CRUD operations with localStorage persistence
- Swipe-to-archive with touch gesture recognition
- Archive screen with long-press context menu
- Confirmation modals for destructive actions
- Responsive design optimized for mobile devices
- Custom SVG icons for consistent cross-platform appearance
- PWA capabilities with offline support

### Future Enhancements (Not Implemented)
- Drag & drop reordering (marked as low priority)
- Advanced archive operations
- Data export/import functionality

## Support

This application is designed to work offline and requires no external dependencies beyond the initial TailwindCSS CDN load.