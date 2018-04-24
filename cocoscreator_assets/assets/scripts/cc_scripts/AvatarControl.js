// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var KBEngine = require("kbengine");


cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node,
        },

        camera: {
            default: null,
            type: cc.Camera,
        },

        canvas: {
            default: null,
            type: cc.Node,
        },

        item: {
            default: null,
            type: cc.Node,
        },

        enableEvent: false,
    },

    onLoad () {
        //cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyPressed, this);
        //cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyReleased, this);

        this.createEventListener();

        this.camera = cc.find("Camera").getComponent(cc.Camera);
    },

    enableEventListen: function() {
        cc.log("666 enableEventListen");
        this.enableEvent = true;
    },

    disEnableEventListen: function() {
        cc.log("666 disEnableEventListen");
        this.enableEvent = false;
    },


    enableMouseEvent: function() {
        cc.find("Canvas").on(cc.Node.EventType.MOUSE_MOVE, this.adjustThrow, this);
        this.node.on(cc.Node.EventType.MOUSE_MOVE, this.adjustThrow, this);
        this.node.on(cc.Node.EventType.MOUSE_UP , this.starThrowItem, this);

        this.enableItemMouseEvent();
    },

    disEnableMouseEvent: function() {
        cc.find("Canvas").off(cc.Node.EventType.MOUSE_MOVE, this.adjustThrow, this);
        this.node.off(cc.Node.EventType.MOUSE_MOVE, this.adjustThrow, this);
        this.node.off(cc.Node.EventType.MOUSE_UP , this.starThrowItem, this);

        this.disEnableItemMouseEvent();
    },

    enableItemMouseEvent: function() {
        if(this.item) {
            this.item.on(cc.Node.EventType.MOUSE_MOVE, this.adjustThrow, this);
            this.item.on(cc.Node.EventType.MOUSE_MOVE, this.adjustThrow, this);
            this.item.on(cc.Node.EventType.MOUSE_UP , this.starThrowItem, this);
        }
    },

    disEnableItemMouseEvent: function() {
        if(this.item) {
            this.item.off(cc.Node.EventType.MOUSE_MOVE, this.adjustThrow, this);
            this.item.off(cc.Node.EventType.MOUSE_MOVE, this.adjustThrow, this);
            this.item.off(cc.Node.EventType.MOUSE_UP , this.starThrowItem, this);
        }
    },


    createEventListener: function () {
            var self = this;
            var keyBoardListener = cc.EventListener.create({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function(keyCode, event){
                    if(!self.enableEvent) return;
                    cc.log("AvatarControl press key=%d", keyCode);
                    switch(keyCode) {
                        case cc.KEY.a: 
                            self.player.leftWalk();
                            break;
            
                        case cc.KEY.d:
                            self.player.rightWalk();
                            break;
            
                        case cc.KEY.w:
                            self.player.jump();
                            break;
                    };
                },
                onKeyReleased: function(keyCode, event){
                    if(!self.enableEvent) return;
                    cc.log("AvatarControl release key=%d", keyCode);
                    switch(keyCode) {
                        case cc.KEY.a: 
                        case cc.KEY.d:
                            self.player.stopWalk();                          
                            break;
                        };
                },
            }
        );  

        cc.eventManager.addListener(keyBoardListener, 1);
    },

    onKeyPressed: function (keyCode, event) {
        if(!this.enableEvent) return;
        cc.log("789 press key: ", keyCode);
        switch(keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
                if(this.player) {
                    this.player.leftWalk();
                }
                break;
            case cc.KEY.d:
            case cc.KEY.right:
                if(this.player) {
                    this.player.rightWalk();
                }
                break;
            case cc.KEY.w:
            case cc.KEY.up:
                if(this.player) {
                    this.player.jump();
                }
                break;
        }
    },
    
    onKeyReleased: function (keyCode, event) {
        if(!this.enableEvent) return;
        cc.log("789 release key: ", keyCode);
        switch(keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
                if(this.player){
                    this.player.stopWalk();
                }
                
                break;
            case cc.KEY.d:
            case cc.KEY.right:
                if(this.player) {
                    this.player.stopWalk();
                }
                break;
        }
    },

    setPlayer: function(player) {
        if(player) {
            this.player = player.getComponent("AvatarAction");
        }
    },

    adjustThrow: function(event) {
        if(!this.enableEvent) return;

        var pos = this.camera.getCameraToWorldPoint(event.getLocation());
        var v2 = new cc.Vec2();
        v2.x = pos.x;
        v2.y = pos.y;

        this.player.adjustThrow(v2);
    },

    starThrowItem: function(event) {
        if(!this.enableEvent) return;

        cc.log("0000 player start throw item");
        var pos = this.camera.getCameraToWorldPoint(event.getLocation());
        var v2 = new cc.Vec2();
        v2.x = pos.x;
        v2.y = pos.y;

        this.player.throwItem(v2);
        this.disEnableMouseEvent();
    },

    pickUpItem: function(item, pickPos) {
        if(!this.enableEvent) return;

        cc.log("0000 AvatarControl pickUpItem:");
        this.player.pickUpItem(item, pickPos);
        this.item = item;

        this.enableMouseEvent();
    },

    update: function (dt) {
        var player = KBEngine.app.player();
        if(player == undefined || !player.inWorld)
            return;
    
        player.position.x = this.node.x/SCALE;
        player.position.y = 0;
        player.position.z = this.node.y/SCALE;
        player.isOnGround = this.player.isOnGround;
    },
});