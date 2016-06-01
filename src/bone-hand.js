var Leap = require('leapjs'),
    HandMesh = require('../lib/leap.hand-mesh'),
    handEntry = require('../lib/leap.hand-entry'),
    handHold = require('../lib/leap.hand-hold'),
    transform = require('../lib/leap.transform.js');

Leap.Controller.plugin('handEntry', handEntry);
Leap.Controller.plugin('handHold', handHold);
Leap.Controller.plugin('transform', transform);

Leap.plugin('boneHands', function(options) {
  options = options || {};

  this.use('handEntry');
  this.use('handHold');
  this.use('transform', {vr: true});

  // this.on('frameEnd', function () { self.frameEnd(this); });
  // this.on('handLost', function () { self.handLost(this); });
  return {hand: function (){}};
});

var controller = Leap.loop()
  .setOptimizeHMD(true)
  .use('boneHands');

module.exports = {
  schema: {
    hand: {default: '', oneOf: ['left', 'right'], required: true}
  },

  init: function () {
    this.controller = controller;
    this.isVisible = false;
    this.hand = HandMesh.get();
    this.mesh = this.hand.getMesh();
    this.el.setObject3D('mesh', this.mesh);
  },

  remove: function () {
    if (this.hand) this.hand.replace();
    if (this.mesh) this.el.removeObject3D('mesh');
  },

  tick: function () {
    var hand,
        data = this.data,
        frame = this.controller.frame();

    if (frame.hands.length) {
      hand = frame.hands[frame.hands[0].type === data.hand ? 0 : 1];
    }

    if (hand) {
      this.hand.scaleTo(hand);
      this.hand.formTo(hand);
    }

    if (hand && !this.isVisible) {
      this.hand.show();
    } else if (!hand && this.isVisible) {
      this.hand.hide();
    }
    this.isVisible = !!hand;
  }

};