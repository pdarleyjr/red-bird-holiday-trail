# 🎄 Red Bird Holiday Trail

A modern, elegant landing page for the Red Bird Neighborhood Holiday Trail event - a magical self-guided neighborhood tour of festive front-yard stops featuring lights, cocoa, treats, and holiday cheer.

## 📅 Event Details

- **Date:** December 20, 2025
- **Time:** 5:00 PM - 9:00 PM
- **Location:** Red Bird Neighborhood, Miami, FL area

## 🎨 Project Overview

This is a single-page holiday microsite designed with a 3D/neon/metallic holiday aesthetic. The site serves as the primary landing page for neighbors to learn about the event and sign up to host a festive stop at their home.

### Key Features

- **Elegant Holiday Design**: Deep green/midnight blue gradient backgrounds with neon red and metallic gold accents
- **Responsive Layout**: Mobile-first design that works beautifully on all devices
- **Interactive Elements**: 
  - Gentle falling snow effect using HTML5 Canvas
  - Smooth scroll animations
  - Button hover effects with glow
  - Card lift animations on hover
- **Accessibility**: Respects `prefers-reduced-motion` for users who need it
- **Performance Optimized**: Vanilla JavaScript, no heavy frameworks
- **Semantic HTML5**: Clean, accessible markup structure

## 🛠️ Tech Stack

This project uses **vanilla web technologies** - no frameworks or build tools required:

- **HTML5**: Semantic markup with proper accessibility
- **CSS3**: 
  - CSS Custom Properties (variables)
  - CSS Grid & Flexbox for layouts
  - Modern gradients and backdrop filters
  - Responsive design with media queries
- **JavaScript (ES6+)**: 
  - Canvas-based snow animation
  - Intersection Observer API for scroll reveals
  - Vanilla DOM manipulation

### External Dependencies

- **Google Fonts**: 
  - Poppins (body text)
  - Playfair Display (headings)

## 📁 Project Structure

```
red-bird-holiday-trail/
├── index.html              # Main HTML file
├── styles.css              # All styles and responsive design
├── script.js               # Vanilla JavaScript interactions
├── README.md               # This file
└── assets/
    └── images/
        ├── red_bird_holiday_trail.png    # Hero logo/sign
        ├── ornament_red.png              # Decorative ornament
        ├── candy_cane.png                # Decorative candy cane
        ├── holly_cluster.png             # Decorative holly
        └── neon_star.png                 # Decorative star
```

## 🚀 Getting Started

### Running Locally

This is a static website - no server or build process required!

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/pdarleyjr/red-bird-holiday-trail.git
   cd red-bird-holiday-trail
   ```

2. **Open in a browser**
   - Simply open `index.html` in your web browser
   - Or use a local development server:
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Python 2
     python -m SimpleHTTPServer 8000
     
     # Node.js (if you have npx)
     npx serve
     ```

3. **View the site**
   - Direct file: `file:///path/to/red-bird-holiday-trail/index.html`
   - Local server: `http://localhost:8000`

### Making Changes

1. **Edit HTML**: Modify content in `index.html`
2. **Update Styles**: Change colors, spacing, or layout in `styles.css`
3. **Adjust Interactions**: Modify JavaScript behavior in `script.js`
4. **Replace Images**: Add new images to `assets/images/` and update references

## 🎯 Current Features

### Sections

1. **Hero Section**
   - Large hero logo/sign image
   - Event date, time, and location
   - Primary CTA: "Host a Holiday Stop" (links to Jotform)
   - Secondary button: "View Trail Map - Coming Soon"

2. **What/When/Where Cards**
   - Three informational cards with icons
   - Clean, concise event information

3. **How It Works**
   - 3-step process explanation
   - Numbered cards with clear descriptions

4. **Example Holiday Stop Ideas**
   - Grid of 19 creative stop ideas
   - Emoji icons for visual appeal
   - Clearly marked as examples/inspiration

5. **Call to Action**
   - Reinforced sign-up invitation
   - Prominent button to Jotform

6. **FAQ Section**
   - 5 common questions answered
   - Info box for updates

### External Links

Currently, the **ONLY external link** is:
- **Jotform Sign-up**: `https://form.jotform.com/253085245422150`

All other links are either internal anchors or placeholder `href="#"` links for future features.

## 🔮 Future Enhancements

Planned features for future releases:

### Phase 1 - Pre-Event
- [ ] Interactive trail map (embedded Google Map or custom map)
- [ ] List of participating houses with addresses
- [ ] Photo gallery from past neighborhood events
- [ ] Event countdown timer
- [ ] Email newsletter sign-up

### Phase 2 - During Event
- [ ] Live updates or social media feed integration
- [ ] Mobile-optimized "navigator" view for trail walkers
- [ ] Check-in system at each stop (optional)

### Phase 3 - Post-Event
- [ ] Photo gallery from the event
- [ ] Thank you section for participants
- [ ] Feedback form
- [ ] Save-the-date for next year

### Technical Improvements
- [ ] Progressive Web App (PWA) capabilities
- [ ] Offline support with Service Worker
- [ ] Pull house list from CSV/JSON data file
- [ ] Admin panel for easy content updates
- [ ] Analytics integration
- [ ] SEO optimization

## 🎨 Design Philosophy

The design follows modern Christmas microsite patterns:

- **Single, Strong Hero**: Large centered sign with clear event details
- **Limited Color Palette**: 2-3 main colors for elegance
- **3D/Neon/Metallic Aesthetic**: Modern holiday vibe without being overwhelming
- **Plenty of Whitespace**: Clean, breathable layouts
- **Simple Sections**: 3-5 content blocks with clear hierarchy
- **Mobile-First**: Responsive from the ground up

## 🤝 Contributing

This is a neighborhood project! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Content Guidelines

When updating content:

- ✅ **DO**: Keep everything truthful and accurate
- ✅ **DO**: Make clear what's confirmed vs. what's an example
- ✅ **DO**: Use family-friendly language
- ❌ **DON'T**: Promise features that don't exist yet
- ❌ **DON'T**: Add sponsor information without confirmation
- ❌ **DON'T**: Include exact home addresses publicly

## 📄 License

This project is created for the Red Bird Neighborhood community event.

## 🎅 About the Event

The Red Bird Holiday Trail is a community-organized neighborhood event where participating houses host festive stops for families to enjoy while strolling through the neighborhood. Stops might feature cozy lights, hot cocoa, music, candy canes, treats, and even photos with Santa Claus.

It's **free, volunteer-powered, and family-friendly** - bring back the neighborhood magic this holiday season!

## 📞 Contact

For questions about the event or website:
- Sign up to host a stop: [Jotform Registration](https://form.jotform.com/253085245422150)
- More details coming soon!

---

**Made with ❤️ for the Red Bird Neighborhood**

🎄 Happy Holidays! 🎄