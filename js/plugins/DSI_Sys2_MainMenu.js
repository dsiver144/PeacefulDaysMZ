//=======================================================================
// * Plugin Name  : DSI_Sys2_MainMenu.js
// * Last Updated : 7/29/2022
//========================================================================
/*:
 * @author dsiver144
 * @plugindesc (v1.0) Peaceful Days Main Menu
 * @help 
 * Empty Help
 * 
 */
const MainMenuConfig = {
    iconSpacing: 12,
    iconSize: [50, 50],
    iconDisplayY: 8,
    pageDisplayY: 120,
    pages: [
        {
            icon: "bag/BagIcon",
            textKey: "MainMenu_Bag",
            pageClass: "new Window_Bag()"
        }, {
            icon: "mainMenu/SettingsIcon",
            textKey: "MainMenu_Bag",
            pageClass: "new Window_Settings()"
        }
    ]
}

class Scene_MainMenu extends Scene_MenuBase {
    /**
     * Prepare
     */
    prepare(pageIndex = -1) {
        this._defaultPageIndex = pageIndex;
    }
    /**
     * Main Menu Container
     */
    create() {
        this._backgroundEnabled = this.backgroundEnabled();
        super.create();
        this.createAllObjects();
    }
    /**
     * Start
     */
    start() {
        super.start();
        this.initMembers();
        this.selectPage(this._defaultPageIndex || 0);
    }
    /**
     * Init members
     */
    initMembers() {
        this._currentPageIndex = -1;
    }
    /**
     * Create all neccessary objects
     */
    createAllObjects() {
        this.createPageBar();
        this.createAllPages();
    }
    /**
     * Create Page Bar
     */
    createPageBar() {
        this._barBG = new Sprite(ImageManager.loadMenu('IconBarBGHorz', 'mainMenu'));
        this.addChild(this._barBG);
        this._barBG.y -= 100;
        this._barBG.alpha = 0;
        this._barBG.startTween({y: 0, alpha: 1.0}, 15).ease(Easing.easeInOutExpo);
    }
    /**
     * Create all pages
     */
    createAllPages() {
        const { iconSize, iconSpacing } = MainMenuConfig;
        this._maxPages = MainMenuConfig.pages.length;
        this._pages = [];
        MainMenuConfig.pages.forEach((pageData, index) => {
            this.setupPage(pageData, index);
        });
        // Relocate icons
        let iconNextX = Graphics.width - 60 - iconSize[0];
        for (var i = this._pages.length - 1; i >= 0; i--) {
            const {icon} = this._pages[i];
            icon.x = iconNextX;
            icon.y = MainMenuConfig.iconDisplayY;
            iconNextX -= iconSpacing + iconSize[0];
        }
    }
    /**
     * Setup Page
     * @param {any} pageData 
     */
    setupPage(pageData, index) {
        const { iconSize, iconSpacing, pageDisplayY } = MainMenuConfig;
        const { icon, textKey, pageClass } = pageData;

        const iconSprite = new Sprite_Clickable();
        iconSprite.bitmap = ImageManager.loadMenu(icon);
        iconSprite.onClick = () => {
            this.onMenuIconButtonClick(index);
        }
        this.addChild(iconSprite);

        /** @type {Window_Base} */
        const window = eval(pageClass);
        window.opacity = 0;
        window.backOpacity = 0;

        const menuBGPlane = new PIXI.NineSlicePlane(PIXI.Texture.from("img/menus/MenuBG.png"), 8, 8, 8, 8);
        menuBGPlane.width = window.width;
        menuBGPlane.height = window.height;
        window.addChildToBack(menuBGPlane);

        window.x = (Graphics.width - window.width) / 2;
        window.y = pageDisplayY;

        this._pages.push({
            icon: iconSprite,
            window: window
        })

        window.visible = false;
        iconSprite.opacity = 100;

        this.addChild(window);
    }
    /**
     * This will be call when player click icon button
     * @param {number} index 
     */
    onMenuIconButtonClick(index) {
        if (this._currentPageIndex == index) return;
        this.selectPage(index);
    }
    /**
     * Select page
     * @param {number} index 
     */
    selectPage(index) {
        if (index < 0) return;
        if (!this.canSwitchPage()) return;
        this.unselectPage(this._currentPageIndex);
        const { icon, window } = this._pages[index];
        icon.startTween({ opacity: 255 }, 15).ease(Easing.easeOutExpo);
        window.visible = true;
        window.activate();
        window.alpha = 0;
        window.startTween({ offsetY: Graphics.height, alpha: 1.0 }, 15).ease(Easing.easeOutExpo);
        this._currentPageIndex = index;
        this.setPageSwitchDelay(15);
        window.showHints();
    }
    /**
     * Unselect page
     * @param {number} index 
     */
    unselectPage(index) {
        if (index < 0) return;
        const { icon, window } = this._pages[index];
        icon.startTween({ opacity: 100 }, 10);
        window.visible = false;
        window.deactivate();
        ScreenOverlay.clearAllHints();
    }
    /**
     * Get current page
     * @returns {{icon: Sprite_Clickable, window: Window_Base}}
     */
    currentPage() {
        return this._pages[this._currentPageIndex];
    }
    /**
     * Switch Page
     */
    switchPage(direction) {
        let pageIndex = this._currentPageIndex;
        pageIndex += direction;
        if (pageIndex < 0) {
            pageIndex = this._maxPages - 1;
        }
        if (pageIndex > this._maxPages - 1) {
            pageIndex = 0;
        }
        this.selectPage(pageIndex);
    }
    /**
     * Pop Scene
     */
    popScene() {
        this._returningToMap = true;
        // Play close animation for main menu before back to map.
        const {window} = this.currentPage();
        window.deactivate();
        window.startTween({offsetY2: Graphics.height, alpha: 0.0}, 30).ease(Easing.easeOutExpo);
        this._barBG.startTween({y: -200, alpha: 0}, 30).ease(Easing.easeInOutExpo);
        this._pages.forEach((page) => {
            page.icon.startTween({y: 0, alpha: 0}, 30).ease(Easing.easeOutExpo);
        });
        setTimeout(() => {
            super.popScene();
        }, 250);
    }
    /**
     * Check if background scolling is enabled
     * @returns {boolean}
     */
    backgroundEnabled() {
        return false;
    }
    /**
     * Create background
     */
    createBackground() {
        if (!this._backgroundEnabled) {
            return super.createBackground();
        }
        this._backgroundSprite = new TilingSprite();
        this._backgroundSprite.bitmap = ImageManager.loadMenu('BGLoop');
        this._backgroundSprite.move(0, 0, Graphics.width, Graphics.height);
        this.addChild(this._backgroundSprite);
    }
    /**
     * Update control
     */
    updateControl() {
        if (this._returningToMap) return;
        if (Input.isTriggered(FieldKeyAction.Menu) || Input.isTriggered(MenuKeyAction.Cancel)) {
            if (this.canReturnToMap()) {
                this.returnToMap();
            } else {
                AudioController.playBuzzer();
            }
        }
        if (Input.isTriggered(MenuKeyAction.PageLeft)) {
            this.switchPage(-1);
        }   
        if (Input.isTriggered(MenuKeyAction.PageRight)) {
            this.switchPage(1);
        } 
        this.updateSwitchPageDelay();
    }
    /**
     * Update switch page delay
     */
    updateSwitchPageDelay() {
        if (!this._switchPageDelayDuration) return;
        this._switchPageDelayDuration -= 1;
    }
    /**
     * Set page switch delay
     * @param {number} duration 
     */
    setPageSwitchDelay(duration) {
        this._switchPageDelayDuration = duration;
    }
    /**
     * Check if player can switch page
     */
    canSwitchPage() {
        return !this._switchPageDelayDuration;
    }
    /**
     * Check if player can return to map scene
     * @returns {boolean}
     */
    canReturnToMap() {
        return true;
    }
    /**
     * Return to map function
     */
    returnToMap() {
        AudioController.playOk();
        this.popScene();
    }
    /**
     * Update all sprites
     */
    updateSprites() {
        this.updateBackground();
    }
    /**
     * Update background sprite
     */
    updateBackground() {
        if (!this._backgroundEnabled) {
            return;
        }
        this._backgroundSprite.origin.x += 0.5;
        this._backgroundSprite.origin.y += 0.5;
    }
    /**
     * Update per frame
     */
    update() {
        super.update();
        this.updateControl();
        this.updateSprites();
    }
}

//==================================================================================
// IMPLEMENT SYSTEM IN TO RPG MAKER SYSTEM
//==================================================================================

Scene_Map.prototype.callMenu = function () {
    AudioController.playOk();
    SceneManager.push(Scene_MainMenu);
    $gameTemp.clearDestination();
    this._mapNameWindow.hide();
    this._waitCount = 2;
};