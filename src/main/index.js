'use strict'

import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import AppMenu from './AppMenu'

if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\')
}

// Windows

let mainWindow

let aboutWindow

// Menu

let menu

// Runtime variables

const isDEV = process.env.NODE_ENV === 'development'

const winURL = isDEV ? `http://localhost:9080` : `file://${__dirname}/index.html`

const aboutURL = isDEV ? `http://localhost:9080/#/about` : `file://${__dirname}/index.html#about`

// Functions

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
  menu = new AppMenu({
    onPressOpenFile: () => {
      mainWindow.webContents.send('openFile')
    },
    onPressExport: () => {
      mainWindow.webContents.send('exportToJson')
    },
    onPressAbout: createAboutWindow,
  })
  Menu.setApplicationMenu(menu.getMenu())
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

ipcMain.on('fileOpened', () => {
  menu.enableExport()
})