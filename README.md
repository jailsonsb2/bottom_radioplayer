## HTML5 Single / Multi Radio Player for Website Footers

### Description

This HTML5 radio player offers a complete and customizable solution for integrating a sleek and responsive audio player directly into your web pages. With features like an audio visualizer, song history, synchronized lyrics, and social media integration, you can elevate your website's audio experience.

### Key Features:

- **Audio playback** with intuitive controls for play/pause, volume, and station switching.
- **Dynamic audio visualizer** that reacts to the music in real time.
- **Station list** with thumbnails and information.
- **Song history** displaying recently played tracks.
- **Synchronized lyrics** (automatic search via API).
- **Integrated social sharing** for Facebook, Twitter, and WhatsApp.
- **Links to mobile applications** (Android and iOS).
- **Integration with music information APIs** to display real-time track data.

### Demo Screenshots

![Demo Screenshot](https://i.imgur.com/bZYdeTp.png)

### Installation and Configuration

1. **Download the player files:**
   - Download or clone this repository.

2. **Configure your radio stations:**
   - Open the `config.js` file.
   - Edit the `window.streams.stations` variable and replace the example stations with your own.
   - For each station, fill in the information: name, hash, description, URLs for logo, album art, background cover, audio stream URL, social links, app links, etc.
   - **Important:** Make sure that the paths for images (`logo`, `album`, `cover`) are correct, considering the location of the `config.js` file on your website.

3. **Integrate the player into your page:**
   - Copy the HTML code from the `index.html` file and paste it into the desired location on your page, usually in the footer.

### Advanced Customization

- **Images:** Replace the images in the `assets` folder with your own.
- **Colors:** Customize the player's colors by editing the `css/custom.css` file.
- **Layout:** Modify the player's layout by editing the `player.html` file.
- **Functionality:** Adapt the player's behavior by editing the `js/main.js` file.

### Support and Contributions

- If you have any questions or issues, please open an issue in the GitHub repository.
- Contributions are welcome! Feel free to submit pull requests with improvements, bug fixes, or new features.




