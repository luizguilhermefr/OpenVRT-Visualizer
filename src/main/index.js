'use strict'

import { app, BrowserWindow, Menu, MenuItem } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

let mainWindow

let aboutWindow

const isDEV = process.env.NODE_ENV === 'development'

const winURL = isDEV ? `http://localhost:9080` : `file://${__dirname}/index.html`

const aboutURL = isDEV ? `http://localhost:9080/#/about` : `file://${__dirname}/index.html#about`

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  })

  createMenu()

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createMenu () {
  const menu = new Menu()
  const fileMenu = new MenuItem({
    label: 'File',
    submenu: [
      new MenuItem({
        label: 'Open...',
      }),
      new MenuItem({
        label: 'Exit',
        role: 'quit'
      }),
    ],
  })
  const helpMenu = new MenuItem({
    label: 'Help',
    submenu: [
      new MenuItem({
        label: 'About...',
        click: createAboutWindow,
      }),
    ],
  })
  menu.append(fileMenu)
  menu.append(helpMenu)
  Menu.setApplicationMenu(menu)
}

function createAboutWindow () {
  aboutWindow = new BrowserWindow({
    parent: mainWindow,
    useContentSize: true,
    width: 400,
    height: 400,
    minimizable: false,
    maximizable: false,
  })

  aboutWindow.loadURL(aboutURL)

  aboutWindow.setMenu(null)

  aboutWindow.on('closed', () => {
    aboutWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
