# Saavn Desktop

Saavn desktop client, based on the official Saavn web app. Build with [Electron](http://electron.atom.io/).  

This is **NOT** an official product. This project does not attempt to reverse engineer the Saavn API or attempt to reimplement any part of the Saavn client. Any communication between the user and Saavn servers is handled by official Saavn Web itself; this is just a native wrapper for Saavn Web, like a browser.

## Features

* Cross platform. (OSX, Windows, Linux)  
* Native notifications.  
* Media Shortcuts/ Keybindings for music player
  * leftArrow for Next song
  * rightArrow for Previous song
  * Space for pause/play
* A couple of things can be configured:  
  * Proxy settings connect to Saavn web  

  **Not working:**
    * Login

**Planned features:**  

* Auto-launch on OS startup.  

## Installation

Download and run the Saavn file from the [latest release](https://github.com/arkokoley/saavn/releases).  

*Note: Windows and Linux versions are test release.*

## How to use in Linux

In order to execute the program in Linux, first you should give it permission to the App:

`sudo chmod u+x Saavn`  
`./Saavn`  

## Contributions

Contributions are welcome! For feature requests and bug reports please submit an [issue](https://github.com/arkokoley/saavn/issues).

## Build

To build from the source, run the following commands:  

`npm install`  
`npm run build`  

## Building Windows build from non-Windows platforms

Wine needs to be installed. On OS X, it is installable via Homebrew:  
`brew install wine`

--

> Made with :heart: at [IIIT Bangalore](http://iiitb.ac.in)
