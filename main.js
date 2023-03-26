const path = require('path')
const {app, BrowserWindow, Menu} = require('electron');

const isDev = process.env.NODE_ENV !== 'production'

const isMac = process.platform === 'darwin'

const reload = require('electron-reload')

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title:'Image Resizer',
        width: isDev? 1000 : 500,
        height:800
    });
    if(isDev){
        mainWindow.webContents.openDevTools();
        require('electron-reload')(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`)
        });
    }
    

    mainWindow.loadFile(path.join(__dirname,'./renderer/index.html'));
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu)

}

function createAboutWindow(){
    const aboutWindow = new BrowserWindow({
        title:'About',
        width: 300,
        height:300
    });

    if(isDev){
        aboutWindow.webContents.openDevTools();
        
    }
    aboutWindow.loadFile(path.join(__dirname,'./renderer/about.html'));


}


app.whenReady().then(()=>{
    createMainWindow();

    app.on('activate',() =>{
        if(BrowserWindow.getAllWindows().length ===0){
            createMainWindow()
        }
    })
})

const menu = [
    ...(isMac? [{
        label:app.name,
        submenu:[
            {
                label:'About',
                click:createAboutWindow,
            },
        ],
    }]:[]),
    {
        role: 'fileMenu'
    },
    ...(!isMac? [{
        label:'Help',
        submenu:[{
            label:'About',
            click:createAboutWindow,
        },],
    }]:[])
]

app.on('window-all-closed', ()=>{
    if(!isMac){
        app.quit()
    }
})