(function() {

var Processor = {
    crop: function(img, rect, opts) {
        return $(img).pixastic("crop", rect);
    },
    flipHorizontally: function(img) {
        return $(img).pixastic("fliph");
    },
    flipVertically: function(img) {
        return $(img).pixastic("flipv");
    },
    rotate: function(img, amount) {
        return $(img).pixastic("rotate", { angle: amount });
    }
};


window.Processor = Processor;

})();