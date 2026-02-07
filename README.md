# UGAHacks Wrapped 2025 - Magic Edition

A Spotify Wrapped-inspired interactive experience showcasing UGAHacks 11 projects and statistics with a magical theme.

## Features

✨ **Spotify-Wrapped Aesthetic**: Dark theme with bold gradients and smooth animations
🎨 **Magic Theme**: Purple and magenta gradients with glowing effects
📊 **Dynamic Data**: Pulls stats from JSON file (easily customizable)
🎬 **Smooth Animations**: Uses AOS (Animate On Scroll) for engaging transitions
📱 **Responsive Design**: Works beautifully on all devices

## Getting Started

### Installation

```bash
npm install
```

### Running Locally

```bash
npm start
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

### Customizing Data

Edit `data.json` to update:
- Total hackers, projects, lines of code
- Top projects and their details
- Workshop information
- Special awards and highlights
- Programming languages breakdown

## Project Structure

```
├── index.html          # Main HTML template
├── styles.css          # All styling (7 pages + animations)
├── main.js             # Data binding & AOS initialization
├── data.json           # Hackathon statistics & data
├── package.json        # Dependencies
└── scripts/            # Data parsing utilities
```

## Technologies

- **AOS (Animate On Scroll)**: Smooth scroll animations
- **CSS3**: Gradients, animations, responsive grid layouts
- **Vanilla JavaScript**: Data binding and interactivity
- **Font**: Poppins + Amarite for UGAHacks branding

## Pages

1. **Cover**: Eye-catching intro with magic theme
2. **Stats**: By-the-numbers breakdown (hackers, projects, LOC, hours)
3. **Top Projects**: Showcase of 3 winning projects
4. **Languages**: Breakdown of programming languages used
5. **Workshops**: Most attended workshops
6. **Highlights**: Special awards and fun facts
7. **Closing**: Final thank you message

## Color Palette

- **Dark Background**: `#0a0e27`
- **Primary Magenta**: `#d946ef`
- **Primary Purple**: `#7d5ba6`
- **Accent Gold**: `#ffd700`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Future Enhancements

- [ ] Real GitHub data integration via API
- [ ] Social share functionality
- [ ] PDF export
- [ ] Per-hacker individual wrapped pages
- [ ] Live statistics dashboard

---

Made with ✨ for UGAHacks 2025
