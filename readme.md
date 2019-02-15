# JioSaavn Desktop
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Farkokoley%2Fsaavn.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Farkokoley%2Fsaavn?ref=badge_shield)

JioSaavn desktop client, based on the official JioSaavn web app. Built with [Electron](http://electron.atom.io/).  

![Screenshot](https://raw.githubusercontent.com/arkokoley/saavn/master/assets/screenshot.png)

This is **NOT** an official product. This project does not attempt to reverse engineer the JioSaavn API or attempt to reimplement any part of the Saavn client. Any communication between the user and Saavn servers is handled by official JioSaavn Web itself; this is just a native wrapper for Saavn Web, like a browser.

## Features

* Cross platform. (OSX, Windows, Linux)  
* Native notifications.  
* Media Shortcuts/ Keybindings for music player
  * leftArrow for Next song
  * rightArrow for Previous song
  * Space for pause/play
* A couple of things can be configured:  
  * Proxy settings connect to JioSaavn web  

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

> Made with :heart: in :india: at [Zense](//zense.co.in) and [IIIT Bangalore](//www.iiitb.ac.in)


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Farkokoley%2Fsaavn.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Farkokoley%2Fsaavn?ref=badge_large)
