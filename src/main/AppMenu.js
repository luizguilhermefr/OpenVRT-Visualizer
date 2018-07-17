import { Menu, MenuItem } from 'electron'

export const FILE_MENU_INDEX = 0
export const HELP_MENU_INDEX = 1

export const OPEN_FILE_SUBMENU_INDEX = 0
export const EXPORT_SUBMENU_INDEX = 1
export const QUIT_SUBMENU_INDEX = 2

export const ABOUT_SUBMENU_INDEX = 0

class AppMenu {
  constructor ({onPressOpenFile, onPressExport, onPressAbout}) {
    this.makeMenu()
    this.onPressOpenFile = onPressOpenFile
    this.onPressExport = onPressExport
    this.onPressAbout = onPressAbout
  }

  getMenu = () => {
    return this.menu
  }

  makeMenu = () => {
    this.menu = new Menu()
    this.menu.append(this.makeFileMenu())
    this.menu.append(this.makeHelpMenu())
  }

  makeFileMenu = () => {
    return new MenuItem({
      label: 'File',
      submenu: [
        new MenuItem({
          label: 'Open...',
          click: () => this.onPressOpenFile(),
          accelerator: 'Control+O',
        }),
        new MenuItem({
          label: 'Export...',
          click: () => this.onPressExport(),
          enabled: false,
          accelerator: 'Control+E',
        }),
        new MenuItem({
          role: 'quit',
        }),
      ],
    })
  }

  makeHelpMenu = () => {
    return new MenuItem({
      label: 'Help',
      submenu: [
        new MenuItem({
          label: 'About...',
          click: () => this.onPressAbout(),
        }),
      ],
    })
  }

  enableExport = () => {
    this.menu.items[FILE_MENU_INDEX].submenu.items[EXPORT_SUBMENU_INDEX].enabled = true
  }
}

export default AppMenu